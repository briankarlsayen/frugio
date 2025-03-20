import {StyleSheet} from 'react-native';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';

interface IExpenseCard {
  name: string;
  amount: number;
  count: number;
}

export default function ExpenseCategoryCard({
  name,
  amount,
  count,
}: IExpenseCard) {
  const formatedAmount = () => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.descContainer}>
        <ThemedText type="subtitle">{name}</ThemedText>
        <ThemedText type="subtitle2" style={{opacity: 0.6}}>
          {count} payments
        </ThemedText>
      </ThemedView>
      <ThemedView style={{display: 'flex', flexDirection: 'row'}}>
        <ThemedText>{formatedAmount()}</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  descContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  recentContainer: {
    paddingHorizontal: 12,
  },
  amount: {
    color: 'green',
  },
  blackText: {
    color: 'black',
  },
});
