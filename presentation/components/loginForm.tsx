import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TextInput,
  View,
  Alert,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Logo from '~/assets/logo-dore.svg';
import { LoginFormData, loginSchema } from '~/data/schemas/authSchema';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { useUser } from '~/presentation/context/userContext';
import { getThemedStyles } from '~/presentation/styles/theme';

interface LoginFormProps {
  onChangeTab: () => void;
}
export const LoginForm = ({ onChangeTab }: LoginFormProps) => {
  const { login } = useUser();
  const navigator = useNavigation();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = getThemedStyles();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (formData: LoginFormData) => {
    setIsLoading(true);
    const { error } = await tryCatch(login(formData));
    if (error) {
      setError(error.message);
      Alert.alert('Error', error.message);
    }
    setIsLoading(false);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View className="flex justify-center gap-y-2 bg-white p-5">
          <View className="items-center justify-center">
            <Logo width={150} height={150} />
          </View>
          <Text className="mb-3 text-balance text-2xl font-bold">Iniciar sesión</Text>
          {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}
          <Text>Correo electrónico</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={{
                    backgroundColor: theme.inputBackground,
                  }}
                  className={`mb-2 h-12 rounded-lg border-b px-2 text-black ${
                    errors.email ? 'border-red-500' : 'border-gray-500'
                  }`}
                  placeholder="Correo electrónico"
                  placeholderTextColor="black"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={value}
                  onChangeText={onChange}
                />
                {errors.email && (
                  <Text className="mb-2 text-sm text-red-500">{errors.email.message}</Text>
                )}
              </>
            )}
          />
          <Text>Contraseña</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  style={{
                    backgroundColor: theme.inputBackground,
                  }}
                  className={`mb-1 h-12 rounded-lg border-b px-2 text-black ${
                    errors.password ? 'border-red-500' : 'border-gray-500'
                  }`}
                  placeholder="Contraseña"
                  placeholderTextColor="black"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                />
                {errors.password && (
                  <Text className="mb-2 text-sm text-red-500">{errors.password.message}</Text>
                )}
              </>
            )}
          />
          <View className="flex-row items-center justify-end gap-2">
            <Text
              className="text-center text-lg"
              onPress={() => navigator.navigate('ResetPassword' as never)}>
              ¿Olvidaste tu contraseña?
            </Text>
          </View>
          <TouchableOpacity
            style={{ backgroundColor: theme.secondaryColor }}
            className={`mt-2 w-48 items-center self-center rounded-full py-4 ${
              isLoading ? 'opacity-50' : ''
            }`}
            onPress={handleSubmit(handleLogin)}
            disabled={isLoading}>
            <Text className="text-lg font-semibold text-white">
              {isLoading ? <ActivityIndicator color="white" /> : 'Ingresar'}
            </Text>
          </TouchableOpacity>
          <View className="flex-row items-center justify-center gap-2">
            <Text className="text-center text-xl">¿No tienes cuenta?</Text>
            <Text
              className="text-center text-xl font-medium"
              style={{ color: theme.primaryColor }}
              onPress={onChangeTab}>
              Registrate aquí
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};
