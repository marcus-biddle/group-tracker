/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1E88E5',
        secondary: '#C70039', 
        primaryHover: '#1565C0', 
        disabledButtonBg: '#555555',     
        textPrimaryButton: '#FFFFFF', 

        secondaryMenu: '#2A2A2A',      
        mutedMenuText: '#8C8C8C',
        
        // Text Colors
        primaryText: '#FFFFFF',    
        secondaryText: '#B3B3B3',  
        mutedText: '#8C8C8C',
        errorBg: '#E57373',
        errorHoverBg: '#D32F2F'
      },
      fontSize: {
        h1: ['2.25rem', { lineHeight: '2.5rem' }], // 36px
        h2: ['1.875rem', { lineHeight: '2.25rem' }], // 30px
        h3: ['1.5rem', { lineHeight: '2rem' }], // 24px
        h4: ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        h5: ['1rem', { lineHeight: '1.5rem' }], // 16px
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
    },
  },
  plugins: [],
}