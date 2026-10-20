// tailwind.config.js - This file should be in your project's root directory

/** @type {import('tailwindcss').Config} */
module.exports = {
  // These paths tell Tailwind CSS where to look for HTML/JSX files
  // so it can scan them for Tailwind classes and generate the necessary CSS.
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Scans all .js, .jsx, .ts, .tsx files in the src folder
    "./public/index.html",         // Include if you have Tailwind classes directly in your public/index.html
  ],
  theme: {
    // Extend Tailwind's default theme with custom settings
    extend: {
      // Define custom font families
      fontFamily: {
        inter: ['Inter', 'sans-serif'], // 'Inter' is a common modern sans-serif font
      },
      // Define custom animations (keyframes and their durations/iterations)
      animation: {
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'pulse-slow': 'pulse-slow 4s infinite ease-in-out',
        'pulse-slow-reverse': 'pulse-slow-reverse 4s infinite ease-in-out',
        'subtle-move': 'subtle-move 30s linear infinite alternate',
        'shape-move-1': 'shape-move-1 25s ease-in-out infinite alternate',
        'shape-move-2': 'shape-move-2 30s ease-in-out infinite alternate',
        'shape-move-3': 'shape-move-3 28s ease-in-out infinite alternate',
        'fluid-float': 'fluid-float var(--animation-duration) linear infinite', // Uses a CSS variable for flexible duration
      },
      // Define the actual keyframe rules for the animations
      keyframes: {
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-slow': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.1)', opacity: '0.7' },
        },
        'pulse-slow-reverse': {
          '0%, 100%': { transform: 'scale(1.1)', opacity: '0.7' },
          '50%': { transform: 'scale(1)', opacity: '0.5' },
        },
        'subtle-move': {
          '0%': { 'background-position': '0% 0%' },
          '100%': { 'background-position': '100% 100%' },
        },
        'shape-move-1': {
          '0%': { transform: 'translate(-20%, -20%) scale(1)' },
          '50%': { transform: 'translate(-10%, -10%) scale(1.1)' },
          '100%': { transform: 'translate(-20%, -20%) scale(1)' },
        },
        'shape-move-2': {
          '0%': { transform: 'translate(20%, 20%) scale(1.1)' },
          '50%': { transform: 'translate(10%, 10%) scale(1)' },
          '100%': { transform: 'translate(20%, 20%) scale(1.1)' },
        },
        'shape-move-3': {
          '0%': { transform: 'translate(-10%, 30%) scale(0.9)' },
          '50%': { transform: 'translate(-20%, 20%) scale(1)' },
          '100%': { transform: 'translate(-10%, 30%) scale(0.9)' },
        },
        'fluid-float': {
          '0%': { transform: 'translate(0vw, 0vh) rotate(0deg) scale(0.8)', opacity: '0.1' },
          '20%': { transform: 'translate(15vw, 20vh) rotate(72deg) scale(0.9)', opacity: '0.2' },
          '40%': { transform: 'translate(30vw, 5vh) rotate(144deg) scale(1.0)', opacity: '0.3' },
          '60%': { transform: 'translate(45vw, 25vh) rotate(216deg) scale(0.9)', opacity: '0.2' },
          '80%': { transform: 'translate(60vw, 10vh) rotate(288deg) scale(0.8)', opacity: '0.1' },
          '100%': { transform: 'translate(75vw, 0vh) rotate(360deg) scale(0.7)', opacity: '0.05' },
        },
      },
    },
  },
  plugins: [], // Any Tailwind CSS plugins would be listed here
}
