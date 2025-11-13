import { Text } from 'react-native';
import { getThemedStyles } from '../styles/theme';

// Configurar Text por defecto con Luckiest Guy
const originalText = Text.render;

Text.render = function (props: any, ref: any) {
  const theme = getThemedStyles();
  
  // Aplicar la fuente por defecto si no se especifica una
  const defaultStyle = {
    fontFamily: theme.fontFamily.regular,
    ...props.style,
  };

  return originalText.call(this, { ...props, style: defaultStyle }, ref);
};

export default Text;
