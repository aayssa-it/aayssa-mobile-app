const { getDefaultConfig } = require('expo/metro-config');

// Expo's defaults enable the require.context support used by Expo Router.
module.exports = getDefaultConfig(__dirname);
