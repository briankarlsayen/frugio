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

export const LOGO_THEME_COLOR = '#E8653D'; // logo color

export const PRIMARY_COLOR = '#3d3d3d'; // dark
export const SECONDARY_COLOR = '#4d4d4d'; // lighter dark
export const TERTIARY_COLOR = '#6b6b6b'; // lighter light dark
export const FOURTIARY_COLOR = '#8a8a8a'; // lighter light light dark
export const FIFTH_COLOR = '#b3b3b3'; // lighter light light light dark

export const DEFAULT_WHITE_COLOR = '#F7F0F5';
export const DEFAULT_RED_COLOR = '#FE5F55';
export const DEFAULT_BLACK_COLOR = '#252727';

export const DARK_INPUT_BG = '#4d4d4d';
export const LIGHT_INPUT_BG = '#BBBBBB';
