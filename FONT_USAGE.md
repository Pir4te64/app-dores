# Guía de Uso de Fuentes - Dores App

## Fuentes Configuradas

### Luckiest Guy (Fuente Principal Global)
- **Archivo**: `assets/fonts/LuckiestGuy-Regular.ttf`
- **Uso**: **TODA LA APLICACIÓN** (títulos, texto normal, contenido, botones, etc.)
- **Aplicación**: Global mediante múltiples estrategias
- **Ventaja**: Consistencia visual en toda la app

## Cómo usar las fuentes

### 1. Usando GlobalText (Recomendado)

```tsx
import { GlobalText } from '~/presentation/components/GlobalText';

// Cualquier texto con Luckiest Guy automáticamente
<GlobalText>Mi Texto</GlobalText>

// Títulos con variantes
<GlobalText variant="bold" style={{ fontSize: 24 }}>
  Mi Título
</GlobalText>
```

### 2. Usando Text normal (Automático)

```tsx
// Text normal ahora usa Luckiest Guy automáticamente
<Text>¡Bienvenido!</Text>
<Text style={{ fontSize: 18 }}>Texto normal</Text>
<Text style={{ fontSize: 28, fontWeight: 'bold' }}>Título Principal</Text>
```

### 3. Usando el tema

```tsx
import { getThemedStyles } from '~/presentation/styles/theme';

const theme = getThemedStyles();

// Para cualquier texto (Luckiest Guy automático)
<Text style={{ fontFamily: theme.fontFamily.regular }}>
  Mi Texto
</Text>
```

### 4. Con estilos de navegación

```tsx
// En la configuración de navegación
fonts: {
  regular: {
    fontFamily: 'LuckiestGuy-Regular',
    fontWeight: 'normal',
  },
  bold: {
    fontFamily: 'LuckiestGuy-Regular',
    fontWeight: 'normal',
  },
}
```

## Estrategias de Aplicación Global

### 1. **GlobalText Component**
- Componente personalizado que aplica Luckiest Guy automáticamente
- Ubicación: `presentation/components/GlobalText.tsx`

### 2. **CSS Global**
- Estilos CSS que aplican la fuente en toda la app web
- Ubicación: `global.css`

### 3. **Hook Global**
- Hook que aplica la fuente dinámicamente
- Ubicación: `presentation/hooks/useGlobalFont.tsx`

### 4. **Configuración de Text**
- Intercepta el componente Text para aplicar la fuente por defecto
- Ubicación: `presentation/config/globalTextConfig.tsx`

## Configuración

Las fuentes están configuradas en:
- `App.tsx` - Carga de fuentes y configuración global
- `presentation/styles/theme.ts` - Definición de familias de fuentes
- `assets/fonts/LuckiestGuy-Regular.ttf` - Archivo de fuente local
- `global.css` - Estilos CSS globales
- `presentation/components/GlobalText.tsx` - Componente personalizado

## Notas

- **Aplicación Global**: Luckiest Guy se aplica en TODA la aplicación
- **Múltiples Estrategias**: 4 métodos diferentes para asegurar cobertura total
- **Fallback Robusto**: Si falla la carga, usa fuentes del sistema
- **Consistencia Visual**: Mismo estilo en toda la app
- **Fácil Uso**: Text normal funciona automáticamente
