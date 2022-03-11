# audit-ci-codemod

Ensure that your `audit-ci` config is up to date with a codemod!

```sh
npx @quinnturner/audit-ci-codemod
```

## Examples

```jsonc
{
  // This is a comment, whoa
  "low": true,
  "advisories": [1064917],
  "whitelist": ["axios"],
  "path-whitelist": ["1064664|axios>follow-redirects"],
  "allowlist": [
    // GHSA-74fj-2j2h-c42q
    "1064664|github-build>axios>follow-redirects",
    1064664,
    // GHSA-4w2v-q235-vp99
    1065494,
    "1065494|axios",
    "1065494|github-build>axios",
    // GHSA-cph5-m8f7-6c5x
    "1064917|axios",
    "1064917|github-build>axios",
    // Others to ensure modules and wildcards are supported
    "github-build",
    "*|jest"
  ]
}
```

Turns into

```jsonc
{
  // This is a comment, whoa
  "low": true,
  "allowlist": [
    // GHSA-74fj-2j2h-c42q
    "GHSA-74fj-2j2h-c42q|github-build>axios>follow-redirects",
    "GHSA-74fj-2j2h-c42q",
    // GHSA-4w2v-q235-vp99
    "GHSA-4w2v-q235-vp99",
    "GHSA-4w2v-q235-vp99|axios",
    "GHSA-4w2v-q235-vp99|github-build>axios",
    // GHSA-cph5-m8f7-6c5x
    "GHSA-cph5-m8f7-6c5x|axios",
    "GHSA-cph5-m8f7-6c5x|github-build>axios",
    // Others to ensure modules and wildcards are supported
    "github-build",
    "*|jest",
    "GHSA-cph5-m8f7-6c5x",
    "axios",
    "GHSA-74fj-2j2h-c42q|axios>follow-redirects"
  ]
}
```
