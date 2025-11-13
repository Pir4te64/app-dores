import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Button,
  SafeAreaView,
  TextInput,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import Logo from '~/assets/logo-dore.svg';
import {
  resetPassword,
  verifyResetCode,
  ResetPasswordFormData,
  VerifyResetCodeFormData,
} from '~/data/schemas/authSchema';
import { AuthService } from '~/domain/services/authService';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { useUser } from '~/presentation/context/userContext';
import { getThemedStyles } from '~/presentation/styles/theme';

export const ResetPassword = () => {
  const theme = getThemedStyles();
  const authService = AuthService.getInstance();
  const [step, setStep] = useState<'requestReset' | 'verifyCode'>('requestReset');
  const { login } = useUser();

  const {
    control: emailControl,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
    getValues: getEmailValues,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPassword),
    defaultValues: {
      email: '',
    },
  });

  const {
    control: verifyControl,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors, isSubmitting: isVerifySubmitting },
  } = useForm<VerifyResetCodeFormData>({
    resolver: zodResolver(verifyResetCode),
    defaultValues: {
      code: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleRequest = async (email: string) => {
    const { error, data: response } = await tryCatch(authService.resetPassword(email));
    if (error) {
      Alert.alert('Error', error.message);
      return;
    }
    if (response.httpStatusCode === 202) {
      setStep('verifyCode');
      Alert.alert('Éxito', 'Código enviado a tu correo electrónico');
    }
  };

  const handleVerify = async (form: VerifyResetCodeFormData) => {
    const email = getEmailValues().email;

    const { error } = await tryCatch(
      authService.verifyResetCode({ email, newPassword: form.newPassword, code: form.code })
    );
    if (error) return Alert.alert('Error', error.message);

    const loginData = {
      email,
      password: form.newPassword,
    };
    Alert.alert('Éxito', 'Contraseña actualizada correctamente', [
      {
        text: 'OK',
        onPress: async () => {
          await login(loginData);
        },
      },
    ]);
  };

  const onSubmitEmail = async (data: ResetPasswordFormData) => {
    await handleRequest(data.email);
  };

  const onSubmitVerify = async (data: VerifyResetCodeFormData) => {
    await handleVerify(data);
  };

  return (
    <SafeAreaView>
      <View className="flex justify-center gap-y-2 p-5">
        <View className="items-center justify-center">
          <Logo width={150} height={150} />
        </View>

        {step === 'requestReset' ? (
          <>
            <Controller
              control={emailControl}
              name="email"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={{
                      backgroundColor: theme.inputBackground,
                    }}
                    className={`mb-2 h-12 rounded-lg border-b px-2 text-black ${
                      emailErrors.email ? 'border-red-500' : 'border-gray-500'
                    }`}
                    placeholder="Correo electrónico"
                    placeholderTextColor="black"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                  {emailErrors.email && (
                    <Text className="mb-2 text-red-500">{emailErrors.email.message}</Text>
                  )}
                </>
              )}
            />
            <Button
              title={isEmailSubmitting ? 'Enviando...' : 'Recuperar contraseña'}
              onPress={handleEmailSubmit(onSubmitEmail)}
              disabled={isEmailSubmitting}
            />
          </>
        ) : (
          <>
            <Text className="mb-4 text-center text-lg font-bold">
              Ingresa el código de verificación
            </Text>
            <Text className="mb-4 text-center text-sm text-gray-500">
              Hemos enviado un código de 4 dígitos a tu correo electrónico
            </Text>

            <Controller
              control={verifyControl}
              name="code"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={{
                      backgroundColor: theme.inputBackground,
                    }}
                    className={`mb-2 h-12 rounded-lg border-b px-2 text-black ${
                      verifyErrors.newPassword ? 'border-red-500' : 'border-gray-500'
                    }`}
                    placeholder="Código de verificación"
                    placeholderTextColor="black"
                    value={value}
                    onChangeText={onChange}
                  />
                  {verifyErrors.code && (
                    <Text className="mb-2 text-center text-red-500">Código inválido</Text>
                  )}
                </>
              )}
            />

            <Controller
              control={verifyControl}
              name="newPassword"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={{
                      backgroundColor: theme.inputBackground,
                    }}
                    className={`mb-2 h-12 rounded-lg border-b px-2 text-black ${
                      verifyErrors.newPassword ? 'border-red-500' : 'border-gray-500'
                    }`}
                    placeholder="Nueva contraseña"
                    placeholderTextColor="black"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  {verifyErrors.newPassword && (
                    <Text className="mb-2 text-red-500">{verifyErrors.newPassword.message}</Text>
                  )}
                </>
              )}
            />

            <Controller
              control={verifyControl}
              name="confirmPassword"
              render={({ field: { onChange, value } }) => (
                <>
                  <TextInput
                    style={{
                      backgroundColor: theme.inputBackground,
                    }}
                    className={`mb-4 h-12 rounded-lg border-b px-2 text-black ${
                      verifyErrors.confirmPassword ? 'border-red-500' : 'border-gray-500'
                    }`}
                    placeholder="Confirmar contraseña"
                    placeholderTextColor="black"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                  {verifyErrors.confirmPassword && (
                    <Text className="mb-2 text-red-500">
                      {verifyErrors.confirmPassword.message}
                    </Text>
                  )}
                </>
              )}
            />

            <Button
              title={isVerifySubmitting ? 'Verificando...' : 'Actualizar contraseña'}
              onPress={handleVerifySubmit(onSubmitVerify)}
              disabled={isVerifySubmitting}
            />

            <TouchableOpacity className="mt-4" onPress={() => setStep('requestReset')}>
              <Text className="text-center text-blue-500">Volver a solicitar código</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};
