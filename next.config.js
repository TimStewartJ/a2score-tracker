import "./src/env.js";
import withPWA from "next-pwa";

const nextConfig = {
  dest: "public",
  pwa: {
    register: true,                   // auto‐register the service worker
    skipWaiting: true,                // activate new SW immediately
    disable: process.env.NODE_ENV === "development"
  }
};

export default withPWA(nextConfig);