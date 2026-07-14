import bunLock from "../bun.lock" with { type: "json5" };
import bunfig from "../bunfig.toml";
import packageJson from "../package.json";

const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u;
const dependencySections = ["dependencies", "devDependencies", "optionalDependencies"] as const;

export const checkLockfileRegistry = (packages: Bun.BunLockFile["packages"], registryUrl: string): void => {
  const registryOrigin = new URL(registryUrl).origin;
  for (const [dependency, registry] of Object.values(packages)) {
    if (typeof registry === "string" && registry !== "") {
      const url = new URL(registry);
      if (url.origin !== registryOrigin || url.username || url.password) {
        throw new Error(`${dependency} uses a registry not configured in bunfig.toml`);
      }
    }
  }
};

export const checkExactDependencies = (manifest: {
  readonly dependencies?: Readonly<Record<string, unknown>>;
  readonly devDependencies?: Readonly<Record<string, unknown>>;
  readonly optionalDependencies?: Readonly<Record<string, unknown>>;
  readonly peerDependencies?: Readonly<Record<string, unknown>>;
}): void => {
  for (const section of dependencySections) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (typeof version !== "string" || !exactVersion.test(version)) {
        throw new Error(`package.json ${section}.${name} must be an exact version, got ${String(version)}`);
      }
    }
  }
};

const { packages } = bunLock;

if (import.meta.main) {
  checkLockfileRegistry(packages, bunfig.install.registry);
  checkExactDependencies(packageJson);
}
