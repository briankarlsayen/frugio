import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import React from 'react';
import CustomIcon from './CustomIcon';
import {useThemeColor} from '@/hooks/useThemeColor';

interface IIconButton extends TouchableOpacityProps {
  onPress: () => void;
  name: string;
  size?: number;
  lightColor?: string;
  darkColor?: string;
}

const CustomIconButton = ({
  onPress,
  name,
  size,
  lightColor,
  darkColor,
  ...rest
}: IIconButton) => {
  const defaultColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'tabIconSelected',
  );

  return (
    <TouchableOpacity onPress={onPress} {...rest}>
      <CustomIcon name={name} color={defaultColor} size={size} />
    </TouchableOpacity>
  );
};

export default CustomIconButton;
