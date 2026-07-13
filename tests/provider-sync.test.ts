import { describe, expect, test } from "bun:test";
import { mkdir, mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { renderDependabot } from "../scripts/provider-catalog";
import { synchronizeProviderConfiguration } from "../scripts/provider-sync";

const fixture = async ({ stale = true } = {}) => {
  const rootPath = await mkdtemp(join(tmpdir(), "provider-sync-"));
  await mkdir(join(rootPath, ".github"), { recursive: true });
  await Bun.write(
    join(rootPath, "providers.json"),
    JSON.stringify([
      { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
      { packageName: "@ai-sdk/xai", factoryName: "createXai" },
    ]),
  );
  await Bun.write(
    join(rootPath, "package.json"),
    JSON.stringify({
      devDependencies: { "@ai-sdk/openai": "4.0.11", typescript: "6.0.3" },
    }),
  );
  await Bun.write(
    join(rootPath, ".github/dependabot.yml"),
    stale
      ? renderDependabot([
          { packageName: "@ai-sdk/anthropic", factoryName: "createAnthropic" },
          { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
        ])
      : renderDependabot([
          { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
          { packageName: "@ai-sdk/xai", factoryName: "createXai" },
        ]),
  );
  return rootPath;
};

describe("provider configuration synchronization", () => {
  test("adds missing providers, removes stale providers, and renders Dependabot", async () => {
    const rootPath = await fixture();
    const commands: string[][] = [];

    const result = await synchronizeProviderConfiguration({
      rootPath,
      runBun: async (args) => {
        commands.push([...args]);
      },
    });

    expect(commands).toEqual([
      ["remove", "@ai-sdk/anthropic"],
      ["add", "--dev", "--exact", "--only-missing", "--registry=https://registry.npmjs.org", "@ai-sdk/xai@latest"],
    ]);
    expect(result).toEqual({ added: ["@ai-sdk/xai"], removed: ["@ai-sdk/anthropic"], changedDependabot: true });
    expect(await Bun.file(join(rootPath, ".github/dependabot.yml")).text()).toBe(
      renderDependabot([
        { packageName: "@ai-sdk/openai", factoryName: "createOpenAI" },
        { packageName: "@ai-sdk/xai", factoryName: "createXai" },
      ]),
    );
  });

  test("check mode reports drift without invoking Bun or writing", async () => {
    const rootPath = await fixture();
    const before = await Bun.file(join(rootPath, ".github/dependabot.yml")).text();
    let called = false;

    await expect(
      synchronizeProviderConfiguration({
        rootPath,
        check: true,
        runBun: async () => {
          called = true;
        },
      }),
    ).rejects.toThrow("Provider configuration is out of date; run `bun run generate`");

    expect(called).toBe(false);
    expect(await Bun.file(join(rootPath, ".github/dependabot.yml")).text()).toBe(before);
  });

  test("preserves existing exact provider versions", async () => {
    const rootPath = await fixture({ stale: false });
    const packagePath = join(rootPath, "package.json");
    await Bun.write(
      packagePath,
      JSON.stringify({
        devDependencies: { "@ai-sdk/openai": "4.0.11", "@ai-sdk/xai": "4.0.10", typescript: "6.0.3" },
      }),
    );
    const commands: string[][] = [];

    await expect(
      synchronizeProviderConfiguration({
        rootPath,
        runBun: async (args) => {
          commands.push([...args]);
        },
      }),
    ).resolves.toEqual({ added: [], removed: [], changedDependabot: false });
    expect(commands).toEqual([]);
    expect(await Bun.file(packagePath).json()).toEqual({
      devDependencies: { "@ai-sdk/openai": "4.0.11", "@ai-sdk/xai": "4.0.10", typescript: "6.0.3" },
    });
  });

  test("rejects an existing provider version range", async () => {
    const rootPath = await fixture({ stale: false });
    await Bun.write(
      join(rootPath, "package.json"),
      JSON.stringify({
        devDependencies: { "@ai-sdk/openai": "^4.0.11", "@ai-sdk/xai": "4.0.10", typescript: "6.0.3" },
      }),
    );

    await expect(synchronizeProviderConfiguration({ rootPath })).rejects.toThrow(
      "Provider dependencies must use exact versions",
    );
  });
});
