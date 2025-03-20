import {View, Text} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface IIcon {
  name: string;
  color?: string;
  size?: number;
}

const CustomIcon = ({name, color, size}: IIcon) => {
  return (
    <View>
      <Icon name={name} color={color} size={size} />
    </View>
  );
};

export default CustomIcon;
