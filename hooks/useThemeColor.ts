/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

// import { useColorScheme } from "react-native";

import {Colors} from '../constants/colors';
import {useColorScheme} from './useColorScheme';

export function useThemeColor(
  props: {light?: string; dark?: string},
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export const PRIMARY_COLOR = '#1e3a3e';
export const SECONDARY_COLOR = '#3a6e6e';
// export const SECONDARY_COLOR = "#323939";
export const TERTIARY_COLOR = '#5cb2af';
export const FOURTIARY_COLOR = '#b7e1e1';
export const FIFTH_COLOR = '#e0f5f5';

export const DEFAULT_WHITE_COLOR = '#F7F0F5';
export const DEFAULT_RED_COLOR = '#FE5F55';
export const DEFAULT_BLACK_COLOR = '#252727';

export const DARK_INPUT_BG = '#323939';
export const LIGHT_INPUT_BG = '#BBBBBB';
