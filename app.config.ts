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
    extra: {
      API_URL: process.env.API_URL,
      AUTH_TOKEN_KEY: process.env.AUTH_TOKEN_KEY,
    },
  },
};
