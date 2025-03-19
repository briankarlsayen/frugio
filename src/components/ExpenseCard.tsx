import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';

interface IExpenseCard {
  id: number;
  name: string;
  amount: number;
  category: string;
  handleLongPress: (id: number) => Promise<void>;
}

export default function ExpenseCard({
  id,
  name,
  amount,
  category,
  handleLongPress,
}: IExpenseCard) {
  const formatedAmount = () => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const onLongPress = () => {
    handleLongPress(id);
  };

  return (
    <TouchableOpacity onLongPress={onLongPress}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.descContainer}>
          <ThemedText type="subtitle">{name}</ThemedText>
          <ThemedText type="subtitle2" style={{opacity: 0.6}}>
            {category}
          </ThemedText>
        </ThemedView>
        <ThemedText>{formatedAmount()}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  descContainer: {
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: 'transparent',
  },
  recentContainer: {
    paddingHorizontal: 12,
  },
});
