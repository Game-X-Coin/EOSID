module.exports = api => {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['inline-dotenv'],
    env: {
      development: {
        plugins: []
      },
      production: {
        plugins: ['react-native-paper/babel', 'transform-remove-console']
      }
    }
  };
};
