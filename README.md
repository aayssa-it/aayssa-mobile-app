# AAYSSA mobile app

An Expo SDK 58 and React Native 0.88 app for Atlanta Ayyappa Seva Sangam. The same project supports iOS, Android, and a browser preview.

## Development

Use a supported Node.js version (22.13+, 24.3+, 26.x, or 27+) and npm, matching `package.json` engines. Install dependencies with `npm ci`, then run:

```sh
npm start
npm run ios
npm run android
npm run web
```

For guided native setup and clearer prerequisite errors, use:

```sh
npm run native:check
npm run ios:dev
npm run android:dev
```

Pass `--clean` after `--` to regenerate a platform before building:

```sh
npm run ios:dev -- --clean
npm run android:dev -- --clean
```

The iOS command requires Xcode, an installed Simulator runtime, and CocoaPods.
The Android command requires Android Studio and a running emulator. Xcode does
not provide the Android emulator. The iOS helper also warms Expo SDK 58's native
module scanner and retries once if the first native build fails.

Use the terminal QR code to open the app in an SDK-compatible Expo Go installation. Simulator shortcuts require the corresponding local simulator tools. If you use a custom development build, rebuild it after native dependencies or native configuration change.

`npm start` explicitly opens the Expo Go workflow and clears Metro's cache. This avoids carrying stale module-resolution state across SDK upgrades. Stop an older server before starting a new one, and reload Expo Go using the new server's QR code.

After this SDK upgrade, stop any existing Expo development server and start a fresh one:

```sh
npx expo start --go --clear
```

On your iPhone, open Expo Go for SDK 58 and scan the new QR code with Camera. Keep the phone and computer on the same Wi-Fi network. `npm run ios` is a simulator shortcut; it is not required for a physical iPhone.

```sh
npm run typecheck
npm test
npm run lint
npx expo install --check
npx expo-doctor
npx expo export --platform all --output-dir dist
```

`npm test` uses Node's built-in test runner and TypeScript stripping, without additional test dependencies. ESLint is installed and configured with Expo's flat config. See `VALIDATION.md` for the upgrade checks and remaining device testing.

## Structure

```text
package.json main                expo-router/entry (application entry point)
index.ts                         Compatibility entry importing expo-router/entry
App.tsx                          Root stack and providers
src/app/_layout.tsx              Exposes the root app layout
src/app/(tabs)/_layout.tsx       Shared header and bottom tabs
src/app/(tabs)/index.tsx         Home
src/app/(tabs)/calendar.tsx      Live in-app calendar
src/app/(tabs)/gallery.tsx       Live in-app gallery
src/app/(tabs)/contact-us.tsx    Contact and organizer assistance
src/app/events.tsx        Events and seva (reachable from Home)
src/app/(tabs)/resources.tsx     Searchable resources
src/app/community.tsx     Membership and community links (Home/member icon)
src/app/about.tsx               Native organization introduction
src/app/seva.tsx                Native seva descriptions
src/app/website.tsx             Validated website route
src/app/+not-found.tsx          Unknown-route fallback
src/components/                 Shared UI and platform-specific website views
src/data/content.ts             Resource, service, and shortcut definitions
src/lib/urls.ts                 URL resolution and navigation policy
src/lib/browserState.ts         Website loading, history, and retry state
src/providers/LinkProvider.tsx  Link opening and visible failure messages
src/theme.ts                    Shared styles
tests/                          URL and website-state regression tests
```

`App.tsx` contains the root stack and providers, exposed by `src/app/_layout.tsx`. Tab navigation uses Expo Router, with distinct URLs and preserved tab state. The root layout anchors website deep links to the tabs using SDK 58's `unstable_settings.anchor`. The app scheme is `aayssa`; scheme changes require a native rebuild. Typed route generation is enabled and Expo generates route types when starting the development server.

This navigation feature preserves the existing SDK 58 dependencies and native configuration. Babel uses `babel-preset-expo`, and Metro extends `expo/metro-config` so Router's app-root transform and context modules are enabled. Do not manually set `EXPO_ROUTER_APP_ROOT`, add the legacy `expo-router/babel` plugin, or replace Router with `registerRootComponent(App)`: `App.tsx` is a Router layout, not a standalone navigation container. Configuration follows the [Router installation guide](https://docs.expo.dev/router/installation/) and [SDK 58 migration guide](https://docs.expo.dev/router/migrate/sdk-57-to-58/).

## Website integration

The native screens use bundled content and can be browsed offline. Membership, registration, calendars, galleries, and devotional documents load live from the official website and require internet access.

- On iOS and Android, official organization HTTPS pages open in an in-app WebView. Back follows website history; Done returns to the native app. Failed pages offer retry and an external-browser fallback.
- On web, official pages have an explicit button to open a new browser tab. They are not embedded in an iframe, so website framing restrictions and cross-origin history do not interfere.
- Other HTTP(S), email, and phone links open outside the embedded view. URL classification also applies to top-level WebView navigation and new windows. Unsupported schemes and credential-bearing URLs are blocked.

Member credentials are entered into the organization's website, not a native app login form. Existing WebView cookie sharing is retained; login, logout, redirects to identity providers, and session persistence still require physical-device testing. There is no native authentication, push notifications, live event feed, payments, or admin backend. The map opens a search result rather than a verified entrance pin.

## Administrator handoff

Ask the website administrators which systems power membership and registration and whether supported APIs or feeds are available. Reuse those systems before introducing a backend. Native login requires an agreed authentication flow, session handling, and member permissions. Keep administrator secrets out of the app.

Before release, confirm content and the venue, approve branding, provide a privacy policy and support URL, select organization-owned platform identifiers and store accounts, configure EAS builds, and test on physical iOS and Android devices. Generated `ios/` and `android/` projects should be configured through Expo app configuration and config plugins.

## Navigation and iPhone testing

The tabs are Home, Calendar, Resources (book icon), Gallery, and Contact Us. Phones narrower than 400 points, or users with larger text, use four tabs with a prominent Contact Us button immediately after the Home hero. Events, seva, and membership remain accessible on Home; the header member icon also opens membership.

For this feature, work from the separate Git clone at `../aayssa-mobile-app`, on branch `feature/navigation-static-content`. The original ZIP folder is unchanged. See [the device checklist](docs/iphone-testing.md) and [verified content sources](docs/content-sources.md).

## Content sources

The initial project recorded these public content sources on October 22, 2026:

- https://atlantaayyappasevasangam.org/
- https://atlantaayyappasevasangam.org/about-us
- https://atlantaayyappasevasangam.org/contact-us

The logo and navigation paths came from the public website. Confirm website paths, current registration availability, and the venue with the organizers before release. Registration headings deliberately omit a fixed year; the official page supplies current details.
