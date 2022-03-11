import type { AuditCiConfig } from "./audit-ci";
import { transformAdvisoryToGitHubAdvisoryId } from "./transforms/advisory-to-github.js";
import { transformAdvisoriesAndWhitelistToAllowlist } from "./transforms/whitelist-to-allowlist.js";

export async function transform(config: AuditCiConfig) {
  let newConfig: AuditCiConfig =
    transformAdvisoriesAndWhitelistToAllowlist(config);
  console.log(
    "Performed migration from advisories, whitelist, and path-whitelist to allowlist"
  );
  newConfig = await transformAdvisoryToGitHubAdvisoryId(newConfig);
  console.log("Performed migration from NPM advisories to GitHub advisories");
  return newConfig;
}
