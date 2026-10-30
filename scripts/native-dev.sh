#!/usr/bin/env bash

set -Eeuo pipefail

project_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

usage() {
    cat <<'EOF'
Usage:
  npm run native:check
  npm run ios:dev [-- --clean]
  npm run android:dev [-- --clean]

Options:
  --clean    Regenerate the selected native project before building.
EOF
}

fail() {
    printf 'Error: %s\n' "$1" >&2
    exit 1
}

has_flag() {
    local expected="$1"
    shift
    for argument in "$@"; do
        if [[ "$argument" == "$expected" ]]; then
            return 0
        fi
    done
    return 1
}

ensure_javascript_dependencies() {
    command -v node >/dev/null || fail "Node.js is required."
    command -v npm >/dev/null || fail "npm is required."

    if [[ ! -x node_modules/.bin/expo ]]; then
        printf 'Installing locked npm dependencies...\n'
        npm ci
    fi
}

check_ios_tools() {
    [[ "$(uname -s)" == "Darwin" ]] || fail "iOS builds require macOS."
    command -v xcodebuild >/dev/null || fail "Install Xcode from the App Store."
    command -v xcrun >/dev/null || fail "Xcode command-line tools are unavailable."
    command -v pod >/dev/null || fail "CocoaPods is missing. Run: brew install cocoapods"

    local developer_dir
    developer_dir="$(xcode-select -p 2>/dev/null || true)"
    [[ "$developer_dir" == */Xcode.app/Contents/Developer ]] ||
        fail "Select Xcode with: sudo xcode-select -s /Applications/Xcode.app"

    xcrun simctl list devices available >/dev/null 2>&1 ||
        fail "The iOS Simulator service is unavailable. Open Xcode > Settings > Components and install an iOS Simulator runtime."
}

check_android_tools() {
    command -v adb >/dev/null ||
        fail "Android platform tools are missing. Install Android Studio and add platform-tools to PATH."

    if ! adb devices | awk 'NR > 1 && $2 == "device" { found = 1 } END { exit !found }'; then
        fail "No Android emulator is running. Start one from Android Studio > Tools > Device Manager."
    fi
}

prebuild_if_needed() {
    local platform="$1"
    shift

    if has_flag "--clean" "$@"; then
        printf 'Regenerating the %s native project...\n' "$platform"
        npx expo prebuild --clean --platform "$platform"
    elif [[ ! -d "$platform" ]]; then
        printf 'Generating the %s native project...\n' "$platform"
        npx expo prebuild --platform "$platform"
    fi
}

run_checks() {
    ensure_javascript_dependencies
    printf 'Running project checks...\n'
    npm run typecheck
    npm test
    npx eslint . --no-cache
    npx expo install --check
    npx expo-doctor
}

command_name="${1:-}"
if [[ -z "$command_name" ]]; then
    usage
    exit 1
fi
shift

case "$command_name" in
    check)
        run_checks
        ;;
    ios)
        ensure_javascript_dependencies
        check_ios_tools
        prebuild_if_needed ios "$@"
        node scripts/warm-expo-module-scanner.cjs
        printf 'Building and launching AAYSSA on iOS...\n'
        if ! npx expo run:ios; then
            printf '\nThe first iOS build failed. Warming the Expo module scanner and retrying once...\n' >&2
            node scripts/warm-expo-module-scanner.cjs
            if ! npx expo run:ios; then
                printf '\nExpo could not complete the simulator launch after retrying.\n' >&2
                printf 'Opening ios/AAYSSA.xcworkspace so you can select an iPhone simulator and press Run.\n' >&2
                open ios/AAYSSA.xcworkspace || true
                exit 1
            fi
        fi
        ;;
    android)
        ensure_javascript_dependencies
        check_android_tools
        prebuild_if_needed android "$@"
        printf 'Building and launching AAYSSA on Android...\n'
        npx expo run:android
        ;;
    help|-h|--help)
        usage
        ;;
    *)
        usage
        fail "Unknown command: $command_name"
        ;;
esac
