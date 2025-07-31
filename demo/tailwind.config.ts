import type { Config } from "tailwindcss";
import { mergeWebflowConfig } from "./src/lib/webflow-tailwind-config";

const baseConfig: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};

// Merge with Webflow design system configuration
const config = mergeWebflowConfig(baseConfig);

export default config;