import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { resolveInstalledProviderSource } from "../scripts/provider-artifacts";

const roots: string[] = [];

const fixtureRoot = async (packageName = "@fixture/provider", manifestName = packageName) => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-schemas-installed-"));
  roots.push(rootPath);
  const packageRoot = join(rootPath, "node_modules", packageName);
  await mkdir(packageRoot, { recursive: true });
  await writeFile(
    join(packageRoot, "package.json"),
    JSON.stringify({ name: manifestName, version: "1.2.3", types: "index.d.ts" }),
  );
  await writeFile(join(packageRoot, "index.d.ts"), "export declare const createFixture: (options: {}) => unknown;");
  return { rootPath, packageRoot };
};

afterEach(async () => {
  await Promise.all(roots.splice(0).map((path) => rm(path, { recursive: true, force: true })));
});

describe("installed provider source resolution", () => {
  test("resolves a direct dependency from node_modules", async () => {
    const { rootPath, packageRoot } = await fixtureRoot();

    await expect(
      resolveInstalledProviderSource(rootPath, {
        packageName: "@fixture/provider",
        factoryName: "createFixture",
      }),
    ).resolves.toBe(await realpath(packageRoot));
  });

  test("rejects invalid package names before resolving paths", async () => {
    const { rootPath } = await fixtureRoot();

    await expect(
      resolveInstalledProviderSource(rootPath, {
        packageName: "../../outside",
        factoryName: "createFixture",
      }),
    ).rejects.toThrow("Invalid npm package name");
  });

  test("rejects a package whose manifest identity does not match", async () => {
    const { rootPath } = await fixtureRoot("@fixture/provider", "@fixture/other");

    await expect(
      resolveInstalledProviderSource(rootPath, {
        packageName: "@fixture/provider",
        factoryName: "createFixture",
      }),
    ).rejects.toThrow("Installed provider package identity mismatch");
  });
});
