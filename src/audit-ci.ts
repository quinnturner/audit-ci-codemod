export interface AuditCiConfig {
  low?: boolean;
  moderate?: boolean;
  high?: boolean;
  critical?: boolean;
  allowlist?: (string | number)[];
  "report-type"?: string;
  "package-manager"?: string;
  "output-format"?: string;
  "pass-enoaudit"?: boolean;
  "show-found"?: boolean;
  "show-not-found"?: boolean;
  registry?: string;
  "retry-count"?: number;
  "skip-dev"?: boolean;

  // removed in audit-ci v6
  "path-whitelist"?: string[];
  whitelist?: string[];
  advisories?: number[];
}
