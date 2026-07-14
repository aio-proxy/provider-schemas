import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { extractProviderDeclaration } from "../scripts/provider-declaration";

const fixture = async (files: Readonly<Record<string, string>>) => {
  const root = await mkdtemp(join(tmpdir(), "provider-declaration-"));
  for (const [path, source] of Object.entries(files)) {
    const target = join(root, path);
    await mkdir(dirname(target), { recursive: true });
    await Bun.write(target, source);
  }
  return root;
};

describe("provider declaration extraction", () => {
  test("resolves a re-exported factory and referenced package declarations", async () => {
    const root = await fixture({
      "index.d.ts": 'export { createFixture } from "./factory";',
      "factory.d.ts": `
        import type { SharedOptions } from "./shared";
        /** Fixture options. */
        export interface FixtureOptions extends SharedOptions { apiKey?: string }
        export declare function createFixture(options?: FixtureOptions): unknown;
      `,
      "shared.d.ts": "export interface SharedOptions { baseURL?: string }",
    });

    const result = await extractProviderDeclaration({
      packageRoot: root,
      declarationEntry: join(root, "index.d.ts"),
      factoryName: "createFixture",
    });

    expect(result).not.toHaveProperty("rootTypeName");
    expect(result.sourceText).toContain("interface FixtureOptions");
    expect(result.sourceText).toContain("interface SharedOptions");
    expect(result.sourceText).toContain("export type ProviderOptions = FixtureOptions");
    expect(result.warnings).toEqual([]);
  });

  test("omits an unsupported optional root property with a warning", async () => {
    const root = await fixture({
      "index.d.ts": `
        import type { FetchFunction } from "external-package";
        export interface FixtureOptions { apiKey?: string; fetch?: FetchFunction }
        export declare function createFixture(options?: FixtureOptions): unknown;
      `,
    });

    const result = await extractProviderDeclaration({
      packageRoot: root,
      declarationEntry: join(root, "index.d.ts"),
      factoryName: "createFixture",
    });

    expect(result.sourceText).toContain("fetch?: unknown");
    expect(result.warnings).toEqual([{ code: "unresolved_optional", path: "fetch" }]);
  });

  test("rejects an unsupported required root property", async () => {
    const root = await fixture({
      "index.d.ts": `
        import type { Credentials } from "external-package";
        export interface FixtureOptions { credentials: Credentials }
        export declare function createFixture(options: FixtureOptions): unknown;
      `,
    });

    await expect(
      extractProviderDeclaration({
        packageRoot: root,
        declarationEntry: join(root, "index.d.ts"),
        factoryName: "createFixture",
      }),
    ).rejects.toThrow("Unsupported required provider option: credentials");
  });
});
