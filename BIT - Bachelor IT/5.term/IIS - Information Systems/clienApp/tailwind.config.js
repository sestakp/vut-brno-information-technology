const colors = require('tailwindcss/colors');

module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: 'media', // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                lightBlue: colors.lightBlue,
                teal: colors.teal,
                primary: colors.cyan,
                neutral: colors.blueGray,
                support: colors.indigo,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [require('@tailwindcss/forms')],
};
