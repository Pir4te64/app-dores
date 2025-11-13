import { AppNavigator, AuthNavigator } from './stack';

import { useUser } from '~/presentation/context/userContext';

export function RootNavigation() {
  const { user } = useUser();

  return user ? <AppNavigator /> : <AuthNavigator />;
}
