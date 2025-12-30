# Max's basic web project skeleton

Fork this to get a project skeleton with an index HTML file, styles, and TypeScript. Commands:

`pnpm build`
`live-server` (requires `npm install -g live-server) <-- this does hot reloading

## Alternative: Just follow these steps again

`pnpm init`
`pnpm add -D typescript` (NOT `tsc` for some reason; that seems to result in having the `tsc` command still point to the global installation instead of the local one)
`pnpm exec tsc init` (this creates a default tsconfig.json)
Set module resolution according to the TS docs (there's a link to the docs in tsconfig.json)
Add */**/*.mts to included files if planning to use that extension
As shown, write imports with .mjs (or .js) at the end of the path for tsc to find the corresponding .mts (or .ts) file.
Add a build script in the package.json. I've gone with `rm -rf build && tsc` to make sure stale filepaths get cleared out after name changes; probably should get rid of the rm -rf part if builds get slow in the future.
