import React from 'react';
import { Controller } from 'react-hook-form';
import { TextInput, Text } from 'react-native';

import { getThemedStyles } from '~/presentation/styles/theme';

export const FormInput = ({
  control,
  name,
  placeholder,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: {
  control: any;
  name: any;
  placeholder: string;
  error: any;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}) => {
  const theme = getThemedStyles();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <>
          <TextInput
            style={{ backgroundColor: theme.inputBackground }}
            className={`mb-2 h-12 rounded-lg border-b px-2 text-black ${
              error ? 'border-red-500' : 'border-gray-500'
            }`}
            placeholder={placeholder}
            placeholderTextColor="black"
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            value={value}
            onChangeText={onChange}
          />
          {error && <Text className="mb-2 text-sm text-red-500">{error.message}</Text>}
        </>
      )}
    />
  );
};
