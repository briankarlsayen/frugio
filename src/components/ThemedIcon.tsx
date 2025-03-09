import React from 'react';
import {Icon} from 'react-native-paper';
import {useColorScheme} from '@/hooks/useColorScheme';

type IconProps = {
  /**
   * Size of icon.
   */
  size: number;
  allowFontScaling?: boolean;
};

type Props = {
  source: any;
  /**
   * Color of the icon.
   */
  color?: string;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
};

type ThemedIconProps = Props &
  IconProps & {
    darkColor?: string;
    lightColor?: string;
    // size: number;
    // source: string;
  };

const ThemedIcon: React.FC<ThemedIconProps> = ({
  source,
  size,
  darkColor,
  lightColor,
  ...rest
}) => {
  const defaultLightColor = '#333';
  const defaultDarkColor = '#fff';
  const setDarkColor = darkColor ?? defaultDarkColor;
  const setLightColor = lightColor ?? defaultLightColor;
  const isDarkMode = useColorScheme() === 'dark';
  const iconColor = isDarkMode ? setDarkColor : setLightColor;
  return <Icon source={source} size={size ?? 24} color={iconColor} {...rest} />;
};
export default ThemedIcon;
