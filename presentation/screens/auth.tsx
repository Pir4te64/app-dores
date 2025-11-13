import { useState } from 'react';
import { View } from 'react-native';

import { LoginForm } from '~/presentation/components/loginForm';
import { RegisterForm } from '~/presentation/components/registerForm';

export const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<'Login' | 'Register'>('Login');
  const renderForm = () => {
    switch (activeTab) {
      case 'Login':
        return <LoginForm onChangeTab={() => setActiveTab('Register')} />;
      case 'Register':
        return <RegisterForm onChangeTab={() => setActiveTab('Login')} />;
      default:
        return null;
    }
  };

  return <View className="flex-1 bg-white">{renderForm()}</View>;
};
