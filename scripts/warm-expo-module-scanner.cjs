const path = require('node:path');

const { scanModules } = require('expo-modules-macros');

async function main() {
    const coreRoot = path.dirname(require.resolve('expo-modules-core/package.json'));
    const startedAt = Date.now();
    const result = await scanModules([coreRoot], { timeout: 30_000 });

    console.log(
        `Expo module scanner ready (${result.stats.filesScanned} files in ${Date.now() - startedAt} ms).`
    );
}

main().catch(error => {
    console.warn(`Expo module scanner warm-up skipped: ${error.message ?? error}`);
});
