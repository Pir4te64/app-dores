import { ActivityIndicator, View } from 'react-native';

import { AppNavigator, AuthNavigator } from './stack';

import { useUser } from '~/presentation/context/userContext';

export function RootNavigation() {
  const { user, loadingUser } = useUser();

  if (loadingUser) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffcfa' }}>
        <ActivityIndicator size="large" color="#DA2919" />
      </View>
    );
  }

  return user ? <AppNavigator /> : <AuthNavigator />;
}
