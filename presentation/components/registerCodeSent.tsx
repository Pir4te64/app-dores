import React, { useEffect } from 'react';
import { Modal, SafeAreaView, View, ActivityIndicator, Image, Text } from 'react-native';

import Logo from '~/assets/logo-dore.svg';
import { getThemedStyles } from '~/presentation/styles/theme';

interface IntermediateCodeScreenProps {
  onComplete: () => void;
}

export const IntermediateCodeScreen = ({ onComplete }: IntermediateCodeScreenProps) => {
  const theme = getThemedStyles();

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <Modal visible transparent={false}>
      <SafeAreaView>
        <View className="flex items-center justify-center gap-y-2 bg-white">
          <View className="items-center justify-center">
            <Logo width={150} height={150} />
          </View>
          <Text
            className="mb-4 w-3/4 text-center text-2xl font-bold"
            style={{ color: theme.secondaryColor }}>
            Tu cuenta está en proceso de activación
          </Text>
          <Text className="mb-8 text-balance text-center text-xl">
            Estamos revisando tus datos. En tu correo electrónico recibirás un código de activación.
            Revisa tu casilla y vuelve a Dores para ingresarlo.
          </Text>
          <ActivityIndicator size="large" color={theme.secondaryColor} />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
