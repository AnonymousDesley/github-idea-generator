/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                background: '#000000',
                surface: '#09090B',
                primary: '#3B82F6',
                border: '#1F1F1F',
                zinc: {
                    950: '#09090b',
                    900: '#18181b',
                    800: '#27272a',
                    700: '#3f3f46',
                    600: '#52525b',
                    500: '#71717a',
                    400: '#a1a1aa',
                },
                text: {
                    DEFAULT: '#FFFFFF',
                    muted: '#71717a'
                }
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #1f1f1f 1px, transparent 1px), linear-gradient(to bottom, #1f1f1f 1px, transparent 1px)",
            },
        },
    },
    plugins: [],
}
