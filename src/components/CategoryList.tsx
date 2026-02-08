import {View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {GlobalContext} from '@/store/globalProvider';
import {GlobalContextType} from '@/store/types';

export default function CategoryList({handleShowEdit}) {
  const context = useContext(GlobalContext);
  const {state} = context as GlobalContextType;

  const handleLongPress = (id: number) => {
    handleShowEdit(id);
  };
  return (
    <ThemedView style={{gap: 20}}>
      {state.categories.map(item => {
        return (
          <TouchableOpacity
            key={item.label}
            onLongPress={() => handleLongPress(item.id)}>
            <ThemedView
              style={{
                borderColor: 'white',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
              }}>
              <View
                style={{
                  backgroundColor: item.color,
                  height: 20,
                  width: 20,
                  borderRadius: 100,
                }}
              />
              <ThemedView>
                <ThemedText type="subtitle">{item.label}</ThemedText>
                <ThemedText type="subtitle2" style={{opacity: 0.6}}>
                  {item.description}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </TouchableOpacity>
        );
      })}
    </ThemedView>
  );
}
