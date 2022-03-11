import type { AuditCiConfig } from './../audit-ci';

export function transformAdvisoriesAndWhitelistToAllowlist(config: AuditCiConfig): AuditCiConfig {
  const {
    allowlist,
    advisories,
    "path-whitelist": pathWhitelist,
    whitelist,
    ...rest
  } = config;
  const allowlistSet = new Set(allowlist || []);
  const joinedToAllowlist = [
    ...(config.advisories || []),
    ...(config.whitelist || []),
    ...(config["path-whitelist"] || []),
  ];
  joinedToAllowlist.forEach((newAllowlist) => {
    allowlistSet.add(newAllowlist);
  });
  const newConfig = {
    ...rest,
    allowlist: Array.from(allowlistSet),
  };
  return newConfig;
}
