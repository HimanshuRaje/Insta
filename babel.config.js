module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [
        'babel-preset-expo',
        {
          targets: {
            web: true,
            android: true,
            ios: true,
          },
        },
      ],
    ],
  };
};
