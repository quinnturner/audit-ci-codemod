import { AuditCiConfig } from "./../src/audit-ci";

export const emptyConfig: Readonly<AuditCiConfig> = {};

export const deprecatedWhitelistWithInvalidAdvisoryIdsConfig: Readonly<AuditCiConfig> =
  {
    allowlist: [4, "jest", "6|mocha"],
    whitelist: ["axios", "audit-ci"],
    "path-whitelist": ["1234|axios", "2345|audit-ci"],
    advisories: [1, 2, 3],
  };

export const fullAdvisoryToGitHubAdvisoryConfig: Readonly<AuditCiConfig> = {
  low: true,
  allowlist: [
    // GHSA-74fj-2j2h-c42q
    "1064664|axios>follow-redirects",
    "1064664|github-build>axios>follow-redirects",
    1064664,
    // GHSA-4w2v-q235-vp99
    1065494,
    "1065494|axios",
    "1065494|github-build>axios",
    // GHSA-cph5-m8f7-6c5x
    1064917,
    "1064917|axios",
    "1064917|github-build>axios",
    // Others to ensure modules and wildcards are supported
    "axios",
    "github-build",
    "*|jest",
  ],
};
