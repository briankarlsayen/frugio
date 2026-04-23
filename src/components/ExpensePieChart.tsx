import {StyleSheet} from 'react-native';
import CustomPieChart from './CustomPieChart';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';

interface IList {
  categoryId: number;
  name: string;
  color: string;
  payCount: number;
  list: any[];
  value: number;
}

export default function ExpensePieChart({list}: {list: IList[]}) {
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={{width: '90%'}}>
        <CustomPieChart data={list} />
        {!list.length && (
          <ThemedView>
            <ThemedText type="title" style={{textAlign: 'center'}}>
              No Data To Show
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative',
    paddingTop: 0,
    alignItems: 'center',
  },
  recentContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
