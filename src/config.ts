import { AuditCiConfig } from "./audit-ci";
import * as jju from "jju";
import * as fs from "fs";

export function readConfig(configPath: string): {
  originalFile: string;
  parsed: AuditCiConfig;
} {
  if (!fs.statSync(configPath).isFile()) {
    throw new Error(`${configPath} is not a file`);
  }
  const file = fs.readFileSync(configPath, "utf-8");
  return { originalFile: file, parsed: jju.parse(file, { mode: "json5" }) };
}

export function writeConfig(
  originalInput: string,
  config: AuditCiConfig,
  configPath: string
) {
  const output = jju.update(originalInput, config, { mode: "json5" });
  fs.writeFileSync(configPath, output, "utf-8");
}
