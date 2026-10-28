# Validation

Checked October 26, 2026 after upgrading the existing application from Expo SDK 57 to SDK 58.

## Follow-up: Router `./head` resolution

Investigated the reported `Unable to resolve module ./head from expo-router/build/qualified-entry.js` error on October 26, 2026. In Router 58.0.26, that relative import resolves to the directory entry `build/head/index.js`; a file named `build/head.js` is not expected. The directory entry and its iOS implementation were present. Compared all 1,900 installed package files byte-for-byte with the official npm archive, whose SHA-512 integrity matched npm's registry metadata: no files were missing or different. There was no evidence of an incomplete or mixed Router installation.

Both a cold iOS export and the existing server's iOS development bundle succeeded before any follow-up source changes. The prior failure therefore could not be reproduced. Stale Metro resolution state during or after the SDK upgrade is the likely explanation; the precise historical trigger cannot be established from the current installation.

`npx expo install --fix` confirmed that no dependency changes were needed. Restarted this project's verified server on port 8081 with `--go --clear`. Updated only the `start` script in `package.json` to `expo start --go --clear`, plus README and this validation record. The lockfile, entry point, app configuration, Babel/Metro configurations, application screens, and integrations already had the correct configuration and were retained. No files inside `node_modules` were manually modified.

Follow-up checks passed: `npx expo install --check`, all 20 `npx expo-doctor` checks, `npm run typecheck`, and `npm run lint`. A fresh iOS export with `--clear` succeeded at `/private/tmp/aayssa-ios-after-router-repair`. The restarted server's SDK 58 iOS development bundle returned HTTP 200 with all routes eagerly compiled and included `qualified-entry.js`, `head/index.js`, and `head/ExpoHead.ios.js`. Left the Expo Go server running at `exp://192.168.1.237:8081` for physical-device verification. Reload the project in Expo Go or scan the restarted server's QR code.

## Completed

- `npm run typecheck` passed with strict checking enabled.
- `npm run lint` passed using the installed ESLint and Expo flat configuration.
- `npm test` passed all 8 existing tests covering URL policies, portal aliases, encoded paths, external navigation, browser retry, and history after failure.
- `npx expo install --check` reported that dependencies are up to date.
- `npx expo-doctor` passed all 20 checks, including app configuration, dependency compatibility, and duplicate native modules.
- Fresh iOS and Android JavaScript/Hermes bundle exports passed.
- Web bundle export and static rendering passed for all existing screens (11 route URLs including tab aliases and the sitemap).
- The Expo Go iOS development manifest reports SDK `58.0.0` and a launch URL with `transform.routerRoot=src%2Fapp`.
- The iOS development bundle returned HTTP 200 with all routes compiled (`lazy=false`), including the Router context module; the `EXPO_ROUTER_APP_ROOT` / `require.context` error did not recur. The temporary verification server was stopped afterward.
- Dependency declarations match `package-lock.json`; there are no local file dependencies or bootstrap links in the lockfile.

Export command: `CI=1 npx expo export --platform all --clear --output-dir dist`. Generated files are ignored by Git.

## Changes and dependency versions

The application already uses Expo Router: `index.ts` previously imported its entry, `src/app` contains the route tree, and components use Router navigation. The upgrade keeps that architecture and uses `expo-router/entry` directly as `package.json`'s `main`. `App.tsx` remains the root stack/providers exposed by `src/app/_layout.tsx`.

Babel explicitly uses `babel-preset-expo`; Metro explicitly extends `expo/metro-config`. This enables Router's app-root transform and context modules without manually setting `EXPO_ROUTER_APP_ROOT` or adding the legacy `expo-router/babel` plugin. Cold exports discover `src/app` without the previous `require.context` error. Root deep-link anchoring now uses `unstable_settings.anchor`, following SDK 58's migration guidance.

| Package | Installed |
| --- | --- |
| expo | 58.0.19 |
| expo-router | 58.0.26 |
| react / react-dom | 19.3.0 |
| react-native | 0.88.0 |
| react-native-safe-area-context | 5.10.1 |
| react-native-screens | 4.30.0 |
| react-native-webview | 14.0.1 |
| react-native-reanimated | 4.7.1 |
| react-native-worklets | 0.13.0 |

Animation packages are explicit dependencies pinned to SDK 58's compatibility map. The SDK 57 dependency tree was backed up, the lockfile regenerated, and duplicate native modules removed. WebView 14's default generic produced `never` props in strict TypeScript; explicitly supplying its existing `WebViewProps` fixes the declarations without changing runtime behavior. Tab icons retain their original active/inactive colors using `focused`, avoiding the widened Router color type. Existing screens, theme, content, website URLs, and browser logic are preserved. `app.json` was inspected and its existing Router plugin, scheme, static web output, and typed routes remain appropriate.

## Remaining tooling issues

`npm audit` reports 5 high-severity entries in the Expo CLI dependency chain involving `node-forge` and `zod`. The installed SDK 58 CLI (`58.1.15`), code-signing package (`0.0.7`), and `node-forge` (`1.4.0`) are the latest available compatible releases checked during this upgrade. npm proposes downgrading Expo to SDK 54 as a forced fix; that would defeat SDK 58 Expo Go compatibility, so it was not applied. These audit findings remain open.

ESLint 9.39.5 emits an upstream end-of-support notice during installation; it remains compatible with Expo's lint configuration and lint passes. Node's built-in tests emit a harmless module-format detection warning. Neither warning blocked validation.

## Runtime checks still required

These checks establish compilation, SDK compatibility, and regression coverage of URL/state logic. No physical iPhone was connected for interaction testing. They do not establish signed native builds, store acceptance, successful website authentication, or physical-device behavior.

Test tab navigation and browser history, preserved search/scroll state, unknown and invalid deep links, offline failures and retry, Android hardware Back, large text sizes, screen readers, and the website's login/logout and registration flows on physical iOS and Android devices. Verify redirects, new-window links, external-browser fallbacks, document downloads, and session behavior. The browser preview must also be exercised interactively; static rendering does not replace interaction testing.

Stop the previous SDK 57 development server, run `npx expo start --go --clear`, and scan the new QR code using iPhone Camera with Expo Go SDK 58 installed. The computer and phone should be on the same Wi-Fi network.
