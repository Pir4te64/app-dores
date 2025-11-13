import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { UpdateData } from '~/domain/repositories/iuserRepository';
import { UserService } from '~/domain/services/userService';
import { tryCatch } from '~/infrastructure/config/tryCatch';
import { AsyncStorageService } from '~/infrastructure/storage/asyncStorageService';
import { useUser } from '~/presentation/context/userContext';
import { getThemedStyles } from '~/styles/theme';

type RootStackParamList = {
  ProfileScreen: undefined;
};

export function ProfileDetail() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { fetchUserData, user } = useUser();
  const theme = getThemedStyles();
  const userService = UserService.getInstance();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      numberPhone: '',
    },
  });

  // Cargar datos del usuario en el formulario
  useEffect(() => {
    if (user) {
      console.log('👤 Cargando datos del usuario:', {
        firstName: user.firstName,
        lastName: user.lastName,
        numberPhone: user.numberPhone,
        email: user.email,
      });

      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        numberPhone: user.numberPhone || '',
      });
    } else {
      console.log('⚠️ Usuario no disponible en el contexto');
    }
  }, [user, reset]);

  const onSubmit = async (data: UpdateData) => {
    console.log('📝 Datos a enviar:', data);

    const confirmUpdate = await new Promise<boolean>((resolve) => {
      Alert.alert('¿Está seguro de que desea actualizar su perfil?', '', [
        { text: 'Cancelar', style: 'cancel', onPress: () => resolve(false) },
        {
          text: 'Sí',
          style: 'default',
          onPress: () => resolve(true),
        },
      ]);
    });

    if (!confirmUpdate) return;

    setIsSubmitting(true);
    try {
      console.log('🔄 Enviando datos al servidor...');
      const { data: result, error } = await tryCatch(userService.updateUser(data));

      if (error) {
        console.error('❌ Error al actualizar perfil:', error);
        Alert.alert(
          'Error',
          `No se pudo actualizar el perfil: ${error.message || 'Error desconocido'}`
        );
        return;
      }

      if (result) {
        console.log('✅ Perfil actualizado exitosamente:', result);
        const token = await AsyncStorageService.getItem('accessToken');
        if (token) {
          await fetchUserData();
          Alert.alert('Éxito', 'Perfil actualizado correctamente', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ProfileScreen'),
            },
          ]);
        }
      }
    } catch (error) {
      console.error('❌ Error inesperado:', error);
      Alert.alert('Error', 'Ocurrió un error inesperado. Intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <View className="px-4 py-6">
        <Controller
          control={control}
          rules={{
            required: 'El nombre es requerido',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="my-3 font-medium text-gray-700">Nombre</Text>
              <TextInput
                placeholder="Ingrese su nombre"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="rounded-2xl border border-gray-300 bg-white p-4 placeholder:text-gray-400"
              />
              {errors.firstName && (
                <Text className="mt-1 text-red-500">{errors.firstName.message}</Text>
              )}
            </>
          )}
          name="firstName"
        />

        <Controller
          control={control}
          rules={{
            required: 'El apellido es requerido',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="my-3 font-medium text-gray-700">Apellido</Text>
              <TextInput
                placeholder="Ingrese su apellido"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                className="rounded-2xl border border-gray-300 bg-white p-4 placeholder:text-gray-400"
              />
              {errors.lastName && (
                <Text className="mt-1 text-red-500">{errors.lastName.message}</Text>
              )}
            </>
          )}
          name="lastName"
        />
        <Text className="my-3 font-medium text-gray-700">Email</Text>

        <TouchableOpacity disabled className="rounded-2xl border border-gray-300 bg-white p-4">
          <Text className="text-gray-400">{user?.email}</Text>
        </TouchableOpacity>

        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <>
              <Text className="my-3 font-medium text-gray-700">Teléfono</Text>
              <TextInput
                placeholder="Ingrese su número de teléfono"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="phone-pad"
                className="rounded-2xl border border-gray-300 bg-white p-4 placeholder:text-gray-300"
              />
              {errors.numberPhone && (
                <Text className="mt-1 text-red-500">{errors.numberPhone.message}</Text>
              )}
            </>
          )}
          name="numberPhone"
        />

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          style={{
            backgroundColor: isSubmitting ? '#ccc' : theme.secondaryColor,
            opacity: isSubmitting ? 0.7 : 1,
          }}
          className="mt-8 self-center rounded-full px-8 py-4">
          {isSubmitting ? (
            <View className="flex-row items-center">
              <ActivityIndicator size="small" color="white" className="mr-2" />
              <Text className="font-medium text-white">Guardando...</Text>
            </View>
          ) : (
            <Text className="font-medium text-white">Guardar cambios</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
