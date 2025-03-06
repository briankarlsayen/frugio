import {TextInput, TextInputProps} from 'react-native';

import {
  DARK_INPUT_BG,
  LIGHT_INPUT_BG,
  SECONDARY_COLOR,
  useThemeColor,
} from '@/hooks/useThemeColor';

export type ThemedViewProps = TextInputProps & {
  lightBgColor?: string;
  darkBgColor?: string;
  lightTextColor?: string;
  darkTextColor?: string;
};

export function ThemedTextInput({
  style,
  lightBgColor,
  darkBgColor,
  lightTextColor,
  darkTextColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {
      light: lightBgColor ?? LIGHT_INPUT_BG,
      dark: darkBgColor ?? DARK_INPUT_BG,
    },
    'background',
  );
  const textColor = useThemeColor(
    {light: lightTextColor, dark: darkTextColor},
    'text',
  );

  return (
    <TextInput
      style={[{backgroundColor, color: textColor}, style]}
      placeholderTextColor={textColor}
      {...otherProps}
    />
  );
}
