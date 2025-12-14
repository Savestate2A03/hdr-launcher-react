HDR Launcher, written in React with TypeScript with both a Switch and Desktop backend.
- Switch backend runs as a skyline plugin using `skyline-web`
- Desktop application is an electron app for use with Emulators

Releases can be found on the [releases page](https://github.com/techyCoder81/hdr-launcher-react/releases), or bundled with HDR [Beta](https://github.com/HDR-Development/HDR-Releases/releases) and [Beta PreRelease](https://github.com/HDR-Development/HDR-Prereleases/releases) full packages.

![launcher_main](https://user-images.githubusercontent.com/42820193/205082618-e6fbaf05-cced-4625-bbfb-372536f5f2aa.png)
![launcher_verify](https://user-images.githubusercontent.com/42820193/205082615-de3591f8-5054-4d26-98ff-706afe0f1159.png)
![launcher_logs](https://user-images.githubusercontent.com/42820193/205082612-b96e96c0-a93d-4519-a9e6-940d51c95fd7.png)
![pr_menu](https://github.com/techyCoder81/hdr-launcher-react/assets/42820193/976f3af1-c1f3-42d0-a3fc-461efca22244)
![stage_config](https://github.com/techyCoder81/hdr-launcher-react/assets/42820193/9428ac6b-ad0f-4ebe-8348-48ea790a968e)


## Project layout

- `src/main`: Electron main process, preload, and configuration helpers
- `src/renderer`: React UI entrypoint/views/renderer utilities
- `switch`: Sources for the Switch backend
- `.erb`: Electron React Boilerplate build scripts + webpack configs
- `assets`: Assets for packaging
- `release`: Output used by `electron-builder` packaging.

## Requirements

- Node.js 18+.
- Yarn
    - The repository is set up for Yarn 4 via Corepack
    - Do not use `npm` to install or run scripts
- Python 3 to run `build.py` for packaging

## Setup

1. Enable Yarn through Corepack if you haven't already: `corepack enable`.
2. Install dependencies with Yarn:
   ```bash
   yarn install
   ```

## Development

- Start Electron with hot reloading: `yarn start`
- Linting: `yarn lint`
- Tests: `yarn test`

## Packaging

To generate the electron project package based on the OS you're running on, just run:

- Build Electron package: `yarn package`
- Build Electron package with Switch plugin: `python3 build.py package <ip=0.0.0.0> <listen>`.

## License

[MIT](https://choosealicense.com/licenses/mit/)
