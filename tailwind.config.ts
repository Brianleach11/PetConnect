/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: (theme: any) => ({
        'half-gradient': `linear-gradient(to bottom, ${theme('colors.softGreen')}, transparent)`,
      }),
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      softGreen: '#bee0c9',
      darkGreen: '#7a9988',
      pastelYellow: '#f6f6cb',
      midnight: '#283c49',
      whiteGreen: '#eaf6eb',
      white: '#FFFFFF',
      red: '#E97451',
      lightblue: '#ADD8E6',
      black: '#000000',
      brownLight: '#A52A2A',
      brownChocolate: '#7B3F00',
      brownLiver: '#674C47',
      cream: '#F5F5DC',
      gray: '#808080',
      blue: '#0000FF',
      yellow: '#FFFF00',
      fawn: '#E5AA70',
      orange: '#FFA500',
      golden: '#FFD700',
      tan: '#D2B48C',
      merleBlue: '#777788',
      merleRed: '#AA7766',
      brindle: '#733d1a',
  },
  },
  plugins: [require("tailwindcss-animate")],
}