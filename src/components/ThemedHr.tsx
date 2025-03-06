import React from 'react';
import {ThemedView} from './ThemedView';
import {useColorScheme} from '@/hooks/useColorScheme';

interface IThemedHR {
  color?: string;
}

export default function ThemedHr({color}: IThemedHR) {
  const borderColor = useColorScheme() === 'dark' ? 'white' : 'black';
  return (
    <ThemedView
      style={{
        borderBottomColor: color ?? borderColor,
        borderBottomWidth: 1,
      }}
    />
  );
}
