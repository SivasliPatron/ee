/**
 * Zentrale Tailwind CSS Konfiguration für Global Tech Lubricants GmbH Website
 * Diese Datei wird nach dem Laden von TailwindCSS CDN eingebunden
 */
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Inter', 'sans-serif'],
                'display': ['Poppins', 'sans-serif']
            },
            colors: {
                'dark': '#1F2937',
                'darker': '#111827',
                'darkest': '#0F172A',
                'accent': {
                    DEFAULT: '#B83232',
                    'light': '#D25050',
                    'dark': '#8A2626'
                }
            }
        }
    },
    corePlugins: {
        preflight: true
    }
};
