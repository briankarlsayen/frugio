import {useColorScheme as colorScheme} from 'react-native';

const SET_COLORSCHEME = null as 'light' | 'dark' | null;

export const useColorScheme = () => {
  return 'dark';
  return SET_COLORSCHEME ?? colorScheme();
};
