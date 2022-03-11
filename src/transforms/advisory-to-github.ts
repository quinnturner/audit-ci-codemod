import * as https from "https";
import { AuditCiConfig } from "../audit-ci";

export async function getGitHubAdvisoryIdFromAdvisory(advisory: number) {
  return new Promise<string>((resolve, reject) => {
    return https.get(`https://www.npmjs.com/advisories/${advisory}`, (res) => {
      const { statusCode } = res;
      const contentType = res.headers["content-type"];

      // We expect to get a 301 redirect. Rather than following through, we just
      // need the location header.
      if (res.statusCode >= 300 && res.statusCode < 400) {
        const location = res.headers["location"];
        const githubAdvisoryId = location.split("/").pop();
        return resolve(githubAdvisoryId);
      }

      let error: Error;
      // Any 2xx status code signals a successful response but
      // here we're only checking for 200.
      if (statusCode !== 200) {
        error = new Error("Request Failed.\n" + `Status Code: ${statusCode}`);
      } else if (!contentType || !/^application\/json/.test(contentType)) {
        error = new Error(
          "Invalid content-type.\n" +
            `Expected application/json but received ${contentType}`
        );
      }
      if (error) {
        console.error(error.message);
        // Consume response data to free up memory
        res.resume();
        return reject(error);
      }

      res.setEncoding("utf8");
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        try {
          console.log(rawData);
          return resolve(rawData);
        } catch (e: any) {
          console.error(e.message);
          return reject(e.message);
        }
      });
    });
  });
}

function getAdvisoryFromAllowlistPath(allowlist: string | number) {
  if (typeof allowlist === "number") {
    return allowlist;
  } else if (Number.isInteger(allowlist)) {
    const advisory = Number.parseInt(allowlist);
    return advisory;
  } else if (allowlist.includes("|")) {
    const advisory = allowlist.split("|")[0];
    if (Number.isInteger(advisory)) {
      // NPM advisory
      return advisory;
    } else {
      // GitHub advisory
      return undefined;
    }
  } else {
    return undefined;
  }
}

async function mapAdvisoryToGitHubAdvisoryId(
  allowlist: AuditCiConfig["allowlist"]
) {
  const result = new Map<number, string>();
  const advisoriesToFetch = new Set(
    (allowlist
      ?.map(getAdvisoryFromAllowlistPath)
      .filter(Boolean) as number[]) || []
  );
  const promises = Array.from(advisoriesToFetch).map(async (a) => {
    const githubAdvisory = await getGitHubAdvisoryIdFromAdvisory(a);
    result.set(a, githubAdvisory);
    return githubAdvisory;
  });
  await Promise.allSettled(promises);
  // TODO Error handling and retrying failed promises
  return result;
}

export async function transformAdvisoryToGitHubAdvisoryId(
  config: AuditCiConfig
) {
  const map = await mapAdvisoryToGitHubAdvisoryId(config.allowlist);
  const newConfig = { ...config, allowlist: [...config.allowlist] };
  newConfig.allowlist = config.allowlist.map((allowlist) => {
    if (typeof allowlist === "number") {
      return map.get(allowlist) || allowlist;
    } else if (Number.isInteger(allowlist)) {
      const advisory = Number.parseInt(allowlist);
      return map.get(advisory) || advisory;
    } else if (allowlist.includes("|")) {
      const [advisory, ...rest] = allowlist.split("|");
      const potentiallyAnNpmAdvisory = Number.parseInt(advisory, 10);
      if (
        Number.isInteger(potentiallyAnNpmAdvisory) &&
        !Number.isNaN(potentiallyAnNpmAdvisory)
      ) {
        return (
          (map.get(potentiallyAnNpmAdvisory) || advisory) + "|" + rest.join("")
        );
      } else {
        // GitHub advisory
        return allowlist;
      }
    } else {
      return allowlist;
    }
  });
  return newConfig;
}
