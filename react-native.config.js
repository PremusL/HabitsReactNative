module.exports = {
    dependencies: {
        'react-native-config': {
            platforms: {
                ios: null, // disable autolinking on iOS
                android: null, // disable autolinking on Android
            },
            envFile: './.env', // specify the custom .env file path
        },
    },
};