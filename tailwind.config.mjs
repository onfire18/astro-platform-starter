/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');
const fs = require('fs');

const noiseBitmap = fs.readFileSync('./src/assets/noise.png', { encoding: 'base64' });
const noiseDataUri = 'data:image/png;base64,' + noiseBitmap;

export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
    theme: {
        extend: {
            backgroundImage: {
                'grid-pattern': `linear-gradient(to bottom, theme('colors.neutral.950 / 0%'), theme('colors.neutral.950 / 100%')), url('${noiseDataUri}')`,
                'hero-gradient': 'linear-gradient(135deg, #0F0B1E 0%, #1a0533 50%, #0F0B1E 100%)',
                'brand-gradient': 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
            },
            colors: {
                neutral: colors.neutral,
                brand: {
                    50: '#F5F3FF',
                    100: '#EDE9FE',
                    200: '#DDD6FE',
                    300: '#C4B5FD',
                    400: '#A78BFA',
                    500: '#8B5CF6',
                    600: '#7C3AED',
                    700: '#6D28D9',
                    800: '#5B21B6',
                    900: '#4C1D95',
                    950: '#2E1065',
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
                heading: ['"DM Serif Display"', 'Georgia', ...defaultTheme.fontFamily.serif],
                body: ['Jost', 'system-ui', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                ...colors,
                md: {
                    bg: '#F8FAFC',
                    surface: '#FFFFFF',
                    primary: '#0F172A',
                    secondary: '#334155',
                    cta: '#0369A1',
                    'cta-dark': '#0284C7',
                    muted: '#475569',
                    border: '#E2E8F0',
                    text: '#020617',
                    subtle: '#64748B',
                    accent: '#DBEAFE',
                },
            },
        },
    },
    daisyui: {
        themes: [
            {
                autoflow: {
                    'color-scheme': 'dark',
                    primary: '#8B5CF6',
                    'primary-content': '#ffffff',
                    secondary: '#6D28D9',
                    'secondary-content': '#ffffff',
                    accent: '#10B981',
                    'accent-content': '#ffffff',
                    neutral: '#1f2937',
                    'neutral-content': '#9ca3af',
                    'base-100': '#0F0B1E',
                    'base-200': '#1a1130',
                    'base-300': '#251842',
                    'base-content': '#ffffff',
                    info: '#3b82f6',
                    'info-content': '#ffffff',
                    success: '#10B981',
                    'success-content': '#ffffff',
                    warning: '#f59e0b',
                    'warning-content': '#1f1f1f',
                    error: '#ef4444',
                    'error-content': '#ffffff',
                },
            },
        ],
    },
    plugins: [require('daisyui')],
};
