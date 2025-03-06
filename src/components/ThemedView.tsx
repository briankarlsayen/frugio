import {View, type ViewProps} from 'react-native';
import {PRIMARY_COLOR, useThemeColor} from '../../hooks/useThemeColor';

// import {
//   SECONDARY_COLOR,
//   PRIMARY_COLOR,
//   useThemeColor,
// } from "@/hooks/useThemeColor";

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedViewProps) {
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor ?? PRIMARY_COLOR},
    'background',
  );

  return <View style={[{backgroundColor}, style]} {...otherProps} />;
}
