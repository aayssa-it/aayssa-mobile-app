module.exports = function (api) {
  api.cache(true);
  return {
    // Includes Expo Router's app-root transform and SDK-compatible worklets setup.
    presets: ['babel-preset-expo'],
  };
};
