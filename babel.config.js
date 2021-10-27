module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        // targets: {
        //   ie: '11'
        // },
        // useBuiltIns: 'usage',
        // corejs: {
        //   'version': 3,
        //   'proposals': true
        // }
      }
    ]
  ];

  const plugins = [
    // Sample
    "@babel/plugin-proposal-object-rest-spread",
    // '@babel/plugin-transform-arrow-functions',
  ];

  return {
    presets,
    plugins
  };
};
