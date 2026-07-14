import { describe, expect, test } from "bun:test";
import { checkExactDependencies, checkLockfileRegistry } from "../scripts/bun-lock-check";

describe("bun lock registry policy", () => {
  test("allows packages resolved from the configured registry", () => {
    expect(() =>
      checkLockfileRegistry(
        {
          fixture: ["fixture@1.0.0", "https://registry.npmjs.org/fixture/-/fixture-1.0.0.tgz", {}, "sha512-fixture"],
        },
        "https://registry.npmjs.org/",
      ),
    ).not.toThrow();
  });

  test("allows the configured default registry marker", () => {
    expect(() =>
      checkLockfileRegistry({ fixture: ["fixture@1.0.0", "", {}, "sha512-fixture"] }, "https://registry.npmjs.org/"),
    ).not.toThrow();
  });

  test("rejects packages resolved from another registry", () => {
    expect(() =>
      checkLockfileRegistry(
        {
          fixture: ["fixture@1.0.0", "https://registry.example.com/fixture/-/fixture-1.0.0.tgz", {}, "sha512-fixture"],
        },
        "https://registry.npmjs.org/",
      ),
    ).toThrow(/registry not configured in bunfig.toml/);
  });
});

describe("package.json exact dependency policy", () => {
  test("allows exact semver versions", () => {
    expect(() =>
      checkExactDependencies({
        dependencies: { fixture: "1.2.3" },
        devDependencies: { "@fixture/tool": "2.0.0-beta.1" },
      }),
    ).not.toThrow();
  });

  test("allows peer dependency ranges without checking them", () => {
    expect(() => checkExactDependencies({ peerDependencies: { zod: "^4.1.5" } })).not.toThrow();
  });

  test("rejects non-exact dependency versions", () => {
    expect(() => checkExactDependencies({ dependencies: { fixture: "^1.2.3" } })).toThrow(/exact version/);
    expect(() => checkExactDependencies({ dependencies: { fixture: "git+https://example.com/repo" } })).toThrow(
      /exact version/,
    );
  });
});
