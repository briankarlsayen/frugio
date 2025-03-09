import {useColorScheme as colorScheme} from 'react-native';

const SET_COLORSCHEME = 'dark' as 'light' | 'dark' | null;

export const useColorScheme = () => {
  return SET_COLORSCHEME ?? colorScheme();
};
