import { useEffect } from 'react';
import { Platform } from 'react-native';

export const useGlobalFont = () => {
  useEffect(() => {
    // Aplicar la fuente globalmente en React Native
    if (Platform.OS === 'web') {
      // Para web, aplicar estilos CSS globales
      const style = document.createElement('style');
      style.textContent = `
        * {
          font-family: 'LuckiestGuy-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
        }
        body {
          font-family: 'LuckiestGuy-Regular', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);
};
