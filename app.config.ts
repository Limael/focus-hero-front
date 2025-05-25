import "dotenv/config";

export default {
  expo: {
    name: "focus-hero",
    slug: "focus-hero",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "focushero",
    userInterfaceStyle: "automatic",
    owner: "limael",
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      "expo-font",
    ],
    experiments: {
      typedRoutes: true,
    },
    android: {
      package: "com.limael.focushero",
      googleServicesFile: "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    ios: {
      supportsTablet: true,
    },
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    extra: {
      API_URL: process.env.API_URL,
      AUTH_TOKEN_KEY: process.env.AUTH_TOKEN_KEY,
      eas: {
        projectId: "02837c1d-0582-4c64-addd-a9b05819fad0",
      },
      router: {
        origin: false,
      },
    },
  },
};
