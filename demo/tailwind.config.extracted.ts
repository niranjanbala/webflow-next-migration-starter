
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "color-fff": "#fff",
        "white": "#ffffff",
        "color-0c0e0f": "#0c0e0f3d",
        "color-446273": "#446273"
},
      fontFamily: {
        
      },
      fontSize: {
        
      },
      spacing: {
        
      },
      screens: {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px"
},
    },
  },
  plugins: [],
};

export default config;
