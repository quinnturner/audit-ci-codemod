#!/usr/bin/env node
import * as inquirer from "inquirer";
import { readConfig, writeConfig } from "./config";
import { transform } from "./transform";

inquirer
  .prompt([
    {
      type: "input",
      name: "configPath",
      message: "What's the path for the audit-ci config?",
      default() {
        return "./audit-ci.jsonc";
      },
    },
  ])
  .then(async ({ configPath }) => {
    const { originalFile, parsed } = readConfig(configPath);
    const newConfig = await transform(parsed);
    writeConfig(originalFile, newConfig, configPath);
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.error("Prompt couldn't be rendered in the current environment");
    } else {
      // Something else went wrong
      console.error(error);
    }
  });
