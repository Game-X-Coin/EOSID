module.exports = api => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    env: {
      development: {
        plugins: []
      },
      production: {
        plugins: ['react-native-paper/babel']
      }
    }
  };
};
