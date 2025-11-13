import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView } from 'react-native';

import { FormInput } from './formInput';

import Logo from '~/assets/logo-dore.svg';
import { RegisterFormData, registerSchema } from '~/data/schemas/authSchema';
import { AuthService } from '~/domain/services/authService';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { useUser } from '~/presentation/context/userContext';
import { getThemedStyles } from '~/presentation/styles/theme';

interface RegisterFormProps {
  onChangeTab: () => void;
}

export const RegisterForm = ({ onChangeTab }: RegisterFormProps) => {
  const { register } = useUser();
  const authService = AuthService.getInstance();
  const theme = getThemedStyles();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [verificationState, setVerificationState] = useState<string>('idle');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      code: '',
      termsAndConditions: false,
    },
  });

  const watchedEmail = watch('email');
  const watchedPassword = watch('password');

  const handleSendCode = useCallback(async () => {
    if (!watchedEmail || !watchedPassword) {
      Alert.alert('Error', 'Por favor ingresa correo y contraseña');
      return;
    }

    setVerificationState('sent');
    setError(null);

    const { error } = await tryCatch(authService.validateEmail(watchedEmail, watchedPassword));

    if (error) {
      setVerificationState('idle');
      setError(error.message);
      Alert.alert('Error', error.message);
      return;
    }

    setVerificationState('sent');
  }, [watchedEmail, watchedPassword, authService]);

  const handleRegister = useCallback(
    async (formData: RegisterFormData) => {
      if (verificationState !== 'sent') {
        Alert.alert('Error', 'Por favor solicita un código de verificación primero');
        return;
      }

      if (!formData.termsAndConditions) {
        Alert.alert('Error', 'Debes aceptar los términos y condiciones');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const { error } = await tryCatch(register(formData));

        if (error) {
          setError(error.message);
          Alert.alert('Error', error.message);
          return;
        }

        Alert.alert('Éxito', 'Cuenta creada correctamente');
      } finally {
        setLoading(false);
      }
    },
    [register, verificationState]
  );

  return (
    <SafeAreaView>
      <View className="flex justify-center gap-y-2 bg-white p-5">
        <View className="items-center justify-center">
          <Logo width={150} height={150} />
        </View>
        <Text className="mb-3 text-center text-2xl font-medium">Crea una cuenta</Text>

        {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}
        {verificationState !== 'sent' && (
          <>
            <FormInput
              control={control}
              name="firstName"
              placeholder="Nombre"
              error={errors.firstName}
            />
            <FormInput
              control={control}
              name="lastName"
              placeholder="Apellido"
              error={errors.lastName}
            />
            <FormInput
              control={control}
              name="email"
              placeholder="Correo electrónico"
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormInput
              control={control}
              name="password"
              placeholder="Contraseña"
              error={errors.password}
              secureTextEntry
            />
          </>
        )}

        {verificationState === 'sent' && (
          <>
            <Text className=" text-balance text-center text-xl">
              Ingresa el código de verificación que recibiste en tu correo electrónico.
            </Text>
            <FormInput
              control={control}
              name="code"
              placeholder="Código de verificación"
              error={errors.code}
              keyboardType="numeric"
            />

            <View className="mb-4 flex-row items-center">
              <Controller
                control={control}
                name="termsAndConditions"
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity
                    onPress={() => onChange(!value)}
                    className="flex-row items-center">
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        borderWidth: 1,
                        borderColor: value ? theme.secondaryColor : '#ccc',
                        backgroundColor: value ? theme.secondaryColor : 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {value && <Text style={{ color: 'white' }}>✓</Text>}
                    </View>
                    <Text className="ml-2">Acepto términos y condiciones</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            {errors.termsAndConditions && (
              <Text className="mb-4 text-red-500">{errors.termsAndConditions.message}</Text>
            )}
          </>
        )}

        <TouchableOpacity
          style={{ backgroundColor: theme.secondaryColor }}
          className="mt-4 w-48 items-center self-center rounded-full py-4"
          onPress={() => {
            if (verificationState === 'sent') {
              handleSubmit(handleRegister)();
            } else {
              handleSendCode();
            }
          }}
          disabled={loading || verificationState === 'intermediate'}>
          {loading || verificationState === 'intermediate' ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-semibold text-white">
              {verificationState === 'sent' ? 'Crear cuenta' : 'Enviar código'}
            </Text>
          )}
        </TouchableOpacity>
        {verificationState !== 'sent' && (
          <View className="mt-4 flex flex-row items-center justify-center gap-2">
            <Text className="text-center">¿Ya tienes una cuenta?</Text>
            <Text className="text-center font-bold text-black" onPress={onChangeTab}>
              Inicia sesión
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};
