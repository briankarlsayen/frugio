import {
  Pressable,
  StyleProp,
  StyleSheetProperties,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import React from 'react';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import CustomIcon from './CustomIcon';
import {useThemeColor} from '@/hooks/useThemeColor';

interface ICheckbox extends TextProps {
  onPress: () => void;
  label: string;
  size?: number;
  checked?: boolean;
  lightColor?: string;
  darkColor?: string;
}

export default function Checkbox({
  style,
  onPress,
  label,
  size,
  checked,
  lightColor,
  darkColor,
  ...rest
}: ICheckbox) {
  const defaultColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'tabIconSelected',
  );
  return (
    <Pressable onPress={onPress} {...rest}>
      <ThemedView
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: 4,
          alignItems: 'center',
          backgroundColor: 'transparent',
          paddingVertical: 4,
        }}>
        <CustomIcon
          name={checked ? 'check-box' : 'check-box-outline-blank'}
          color={defaultColor}
          size={size ?? 20}
        />
        <ThemedText
          type="subtitle2"
          style={[
            {
              borderWidth: 2,
              borderRadius: 10,
              paddingHorizontal: 6,
              paddingVertical: 3,
            },
            style,
          ]}>
          {label}
        </ThemedText>
      </ThemedView>
    </Pressable>
  );
}
