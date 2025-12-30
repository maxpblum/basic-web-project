# Max's basic web project skeleton

Fork this to get a project skeleton with an index HTML file, styles, TypeScript, and Jasmine web tests. Commands:

`pnpm build`
`live-server` (requires `npm install -g live-server`) <-- this does hot reloading
`pnpm test` <-- runs the tests to completion in headless Chrome, emits logs to stdout/stderr
`pnpm serveTests` <-- run a test server to debug the tests in a browser

## Alternative: Just follow these steps again

### Initialize source files

```sh
cat <<'EOF' > index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="src/style.css">
    <title>Vanilla TS</title>
</head>
<body>
    <script type="module" src="dist/main.mjs"></script>
</body>
</html>
EOF
mkdir -p src
cat <<'EOF' > src/lib.mts
export function getGreeting(name: string): string {
  return `Hello, ${name}!`;
}
EOF
cat <<'EOF' > src/main.mts
import {getGreeting} from './lib.mjs';

const greeting = document.createElement('div');
greeting.innerText = getGreeting('Max');
document.body.appendChild(greeting);
EOF
cat <<'EOF' > src/style.css
body {
  font-family: "Comic Sans MS", "Comic Sans", cursive, sans-serif;
}
EOF
```

### Initialize project infra

`pnpm init`
`pnpm add -D typescript` (NOT `tsc` for some reason; that seems to result in having the `tsc` command still point to the global installation instead of the local one)
`pnpm exec tsc init` (this creates a default tsconfig.json)
Set module resolution according to the TS docs (there's a link to the docs in tsconfig.json)
Add */**/*.mts to included files if planning to use that extension
As shown, write imports with .mjs (or .js) at the end of the path for tsc to find the corresponding .mts (or .ts) file.
Add a build script in the package.json. I've gone with `rm -rf build && tsc` to make sure stale filepaths get cleared out after name changes; probably should get rid of the rm -rf part if builds get slow in the future.

`pnpm add -D jasmine-browser-runner`
`pnpm exec jasmine-browser-runner init`
Move the emitted jasmine-browser.mjs file to root dir and delete the spec dir (personal preference)
Add test and serveTests scripts to package.json:
```
    "serveTests": "jasmine-browser-runner serve --config=./jasmine-browser.mjs",
    "test": "jasmine-browser-runner runSpecs --config=./jasmine-browser.mjs"
```

Update jasmine-browser.mjs:

* Add mjs and mts file extensions.
* Convert `[sS]` to `s` if desired
* Empty any unnecessary `helpers`
* Change spec directory to `src` to have test files alongside src files (corresponding to deleting the spec dir above)
* Set default browser to `headlessChrome` to avoid needing to open a window to run tests
