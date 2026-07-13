import { realpath } from "node:fs/promises";
import { isAbsolute, relative, sep } from "node:path";
import {
  type InterfaceDeclaration,
  ModuleResolutionKind,
  type Node as MorphNode,
  Node,
  Project,
  ScriptTarget,
  SyntaxKind,
  type TypeAliasDeclaration,
  type TypeNode,
} from "ts-morph";
import type { ProviderOptionsSchemaWarning } from "../src/types";

export type ExtractProviderDeclarationOptions = {
  readonly packageRoot: string;
  readonly declarationEntry: string;
  readonly factoryName: string;
};

export type ExtractedProviderDeclaration = {
  readonly sourceText: string;
  readonly rootTypeName: "ProviderOptions";
  readonly warnings: readonly ProviderOptionsSchemaWarning[];
};

type TypeDeclaration = InterfaceDeclaration | TypeAliasDeclaration;
type Failure = ProviderOptionsSchemaWarning["code"];

const builtins = new Set([
  "Array",
  "Exclude",
  "Extract",
  "NonNullable",
  "Omit",
  "Partial",
  "Pick",
  "Readonly",
  "Record",
  "Required",
]);

const isInside = (root: string, candidate: string) => {
  const path = relative(root, candidate);
  return path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path);
};

const localTypeDeclaration = (node: MorphNode, packageRoot: string): TypeDeclaration | undefined => {
  const symbol = node.getSymbol();
  const target = symbol?.getAliasedSymbol() ?? symbol;
  return target
    ?.getDeclarations()
    .find(
      (declaration): declaration is TypeDeclaration =>
        (Node.isInterfaceDeclaration(declaration) || Node.isTypeAliasDeclaration(declaration)) &&
        isInside(packageRoot, declaration.getSourceFile().getFilePath()),
    );
};

const unsupportedType = (typeNode: TypeNode, packageRoot: string, seen = new Set<string>()): Failure | undefined => {
  if (
    [typeNode, ...typeNode.getDescendants()].some(
      (node) =>
        Node.isFunctionTypeNode(node) ||
        Node.isTypeQuery(node) ||
        node.getKind() === SyntaxKind.BigIntKeyword ||
        node.getKind() === SyntaxKind.SymbolKeyword,
    )
  ) {
    return "unsupported_optional";
  }

  for (const reference of [
    ...(Node.isTypeReference(typeNode) ? [typeNode] : []),
    ...typeNode.getDescendantsOfKind(SyntaxKind.TypeReference),
  ]) {
    const name = reference.getTypeName().getText();
    if (builtins.has(name)) continue;
    const declaration = localTypeDeclaration(reference.getTypeName(), packageRoot);
    if (!declaration) return "unresolved_optional";
    const key = `${declaration.getSourceFile().getFilePath()}:${declaration.getStart()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (Node.isTypeAliasDeclaration(declaration)) {
      const failure = unsupportedType(declaration.getTypeNodeOrThrow(), packageRoot, seen);
      if (failure) return failure;
    }
  }
  return undefined;
};

const factoryParameterType = (declarations: readonly MorphNode[], factoryName: string) => {
  for (const declaration of declarations) {
    if (Node.isFunctionDeclaration(declaration)) {
      const parameter = declaration.getParameters()[0];
      if (parameter?.getTypeNode()) return parameter.getTypeNodeOrThrow();
    }
    if (Node.isVariableDeclaration(declaration)) {
      const type = declaration.getTypeNode();
      if (type && Node.isFunctionTypeNode(type)) {
        const parameter = type.getParameters()[0];
        if (parameter?.getTypeNode()) return parameter.getTypeNodeOrThrow();
      }
    }
  }
  throw new Error(`Provider factory has no typed parameter: ${factoryName}`);
};

export const extractProviderDeclaration = async ({
  packageRoot,
  declarationEntry,
  factoryName,
}: ExtractProviderDeclarationOptions): Promise<ExtractedProviderDeclaration> => {
  const root = await realpath(packageRoot);
  const entryPath = await realpath(declarationEntry);
  if (!isInside(root, entryPath)) throw new Error("Declaration entry is outside package root");

  const project = new Project({
    skipAddingFilesFromTsConfig: true,
    compilerOptions: { moduleResolution: ModuleResolutionKind.Bundler, target: ScriptTarget.ESNext },
  });
  const entry = project.addSourceFileAtPath(entryPath);
  project.resolveSourceFileDependencies();
  const exported = entry.getExportedDeclarations().get(factoryName) ?? [];
  if (exported.length === 0) throw new Error(`Exported provider factory not found: ${factoryName}`);
  const parameterType = factoryParameterType(exported, factoryName);
  const rootDeclaration = Node.isTypeReference(parameterType)
    ? localTypeDeclaration(parameterType.getTypeName(), root)
    : undefined;
  const warnings: ProviderOptionsSchemaWarning[] = [];

  const sanitized = new Set<string>();
  const sanitize = (declaration: InterfaceDeclaration) => {
    const key = `${declaration.getSourceFile().getFilePath()}:${declaration.getStart()}`;
    if (sanitized.has(key)) return;
    sanitized.add(key);
    for (const property of declaration.getProperties()) {
      const type = property.getTypeNode();
      if (!type) continue;
      const failure = unsupportedType(type, root);
      if (!failure) continue;
      const path = property.getName();
      if (!property.hasQuestionToken()) throw new Error(`Unsupported required provider option: ${path}`);
      warnings.push({ code: failure, path });
      property.setType("unknown");
    }
    for (const heritage of declaration.getExtends()) {
      const base = localTypeDeclaration(heritage.getExpression(), root);
      if (base && Node.isInterfaceDeclaration(base)) sanitize(base);
    }
  };
  if (rootDeclaration && Node.isInterfaceDeclaration(rootDeclaration)) sanitize(rootDeclaration);

  const collected = new Map<string, TypeDeclaration>();
  const aliases = new Set<string>();
  const collectDeclaration = (declaration: TypeDeclaration) => {
    const key = `${declaration.getSourceFile().getFilePath()}:${declaration.getStart()}`;
    if (collected.has(key)) return;
    collected.set(key, declaration);
    if (Node.isTypeAliasDeclaration(declaration)) {
      collect(declaration.getTypeNodeOrThrow());
      return;
    }
    for (const property of declaration.getProperties()) {
      const propertyType = property.getTypeNode();
      if (propertyType) collect(propertyType);
    }
    for (const heritage of declaration.getExtends()) {
      const base = localTypeDeclaration(heritage.getExpression(), root);
      if (base) collectDeclaration(base);
    }
  };
  const collect = (type: TypeNode) => {
    for (const reference of [
      ...(Node.isTypeReference(type) ? [type] : []),
      ...type.getDescendantsOfKind(SyntaxKind.TypeReference),
    ]) {
      const declaration = localTypeDeclaration(reference.getTypeName(), root);
      if (!declaration) continue;
      const localName = reference.getTypeName().getText();
      const declaredName = declaration.getName();
      if (localName !== declaredName) aliases.add(`type ${localName} = ${declaredName};`);
      collectDeclaration(declaration);
    }
  };
  collect(parameterType);

  const declarations = [...collected.values()]
    .sort((left, right) => left.getName().localeCompare(right.getName()))
    .map((declaration) => declaration.getFullText().trim());
  const rootDocumentation = rootDeclaration?.getJsDocs().at(-1)?.getFullText().trim();
  return {
    rootTypeName: "ProviderOptions",
    sourceText: [
      ...declarations,
      ...aliases,
      [rootDocumentation, `export type ProviderOptions = ${parameterType.getText()};`].filter(Boolean).join("\n"),
      "",
    ].join("\n\n"),
    warnings: warnings.sort((left, right) => left.path.localeCompare(right.path)),
  };
};
