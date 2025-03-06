import {useThemeColor} from '../../hooks/useThemeColor';
import {Button, ButtonProps} from 'react-native';

export type ThemedTextProps = ButtonProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedButton({
  lightColor,
  darkColor,
  color,
  ...rest
}: ThemedTextProps) {
  const defaultColor = useThemeColor(
    {light: lightColor, dark: darkColor ?? '#BFBA88'},
    'text',
  );

  return <Button color={color ?? defaultColor} {...rest} />;
}
