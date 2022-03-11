import { AuditCiConfig } from "../src/audit-ci";
import { transformAdvisoryToGitHubAdvisoryId } from "../src/transforms/advisory-to-github";
import { transformAdvisoriesAndWhitelistToAllowlist } from "../src/transforms/whitelist-to-allowlist";
import {
  deprecatedWhitelistWithInvalidAdvisoryIdsConfig,
  fullAdvisoryToGitHubAdvisoryConfig,
} from "./configs";

describe("transformAdvisoriesAndWhitelistToAllowlist", () => {
  it("merges the deprecated properties into allowlist", () => {
    const result = transformAdvisoriesAndWhitelistToAllowlist(
      deprecatedWhitelistWithInvalidAdvisoryIdsConfig
    );
    expect(result.whitelist).toBeUndefined();
    expect(result["path-whitelist"]).toBeUndefined();
    expect(result.advisories).toBeUndefined();

    const expectedSort = [
      4,
      "jest",
      "6|mocha",
      "axios",
      "audit-ci",
      "1234|axios",
      "2345|audit-ci",
      1,
      2,
      3,
    ].sort((a, b) => `${a}`.localeCompare(`${b}`));
    const resultedSort = [...result.allowlist].sort((a, b) =>
      `${a}`.localeCompare(`${b}`)
    );
    expect(resultedSort).toEqual(expectedSort);
  });
});

describe("mapAdvisoryToGitHubAdvisoryId", () => {
  it("mapAdvisoryToGitHubAdvisoryId", async () => {
    const config = await transformAdvisoryToGitHubAdvisoryId(
      fullAdvisoryToGitHubAdvisoryConfig
    );
    const desired: Readonly<AuditCiConfig> = {
      low: true,
      allowlist: [
        "GHSA-74fj-2j2h-c42q|axios>follow-redirects",
        "GHSA-74fj-2j2h-c42q|github-build>axios>follow-redirects",
        "GHSA-74fj-2j2h-c42q",
        "GHSA-4w2v-q235-vp99",
        "GHSA-4w2v-q235-vp99|axios",
        "GHSA-4w2v-q235-vp99|github-build>axios",
        "GHSA-cph5-m8f7-6c5x",
        "GHSA-cph5-m8f7-6c5x|axios",
        "GHSA-cph5-m8f7-6c5x|github-build>axios",
        "axios",
        "github-build",
        "*|jest"
      ],
    };
    expect(config).toEqual(desired);
  });
});
