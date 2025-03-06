import {ScrollView, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import CustomPieChart from '../components/CustomPieChart';
import ExpenseCategoryCard from '../components/ExpenseCategoryCard';
import TransactionMenu from '../components/TransactionMenu';
import {useEffect, useState} from 'react';
import {filteredExpenses} from '@/utils';
import {getExpenses} from '@/api';
import {ThemedView} from '../components/ThemedView';
import {ThemedText} from '../components/ThemedText';

interface IList {
  categoryId: number;
  name: string;
  color: string;
  payCount: number;
  list: any[];
  value: number;
}

export default function Analytics() {
  const [cb, setCb] = useState(false);

  const [transList, setTransList] = useState([]);

  const processList = (list: any) => {
    const transactionLists: IList[] = [];
    // if (!list?.length) return;
    list?.map((i, index) => {
      const d = transactionLists.findIndex(
        item => item?.categoryId === i?.category_id,
      );
      if (d > -1) {
        transactionLists[d].payCount = transactionLists[d].payCount + 1;
        transactionLists[d].value = transactionLists[d].value + i?.amount;
        transactionLists[d]?.list?.push(i);
      } else {
        const itemList = [i];
        const newObj = {
          categoryId: i?.category_id,
          name: i?.category,
          color: i?.color,
          payCount: 1,
          value: i?.amount,
          list: itemList,
        };
        transactionLists.push(newObj);
      }
    });
    transactionLists.sort((a, b) => b?.value - a?.value);
    setTransList(transactionLists);
  };

  const fetchExpenses = async () => {
    const {from, to} = filteredExpenses(dateFilter);
    const res = await getExpenses({from, to});

    // if (!res?.data?.length) return;

    processList(res?.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, [cb]);

  const [dateFilter, setDateFilter] = useState<any | null>(3);
  const handleDateFilter = (val: string) => {
    setDateFilter(val);
    setCb(!cb);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={{padding: 12, gap: 12}}>
        <ThemedView
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,

            width: 100,
          }}>
          <TransactionMenu value={dateFilter} handleSelect={handleDateFilter} />
        </ThemedView>

        <ThemedView>
          <CustomPieChart data={transList} />
        </ThemedView>
      </ThemedView>
      {!transList.length && (
        <ThemedView>
          <ThemedText type="title" style={{textAlign: 'center'}}>
            No Data To Show
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView style={styles.recentContainer}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
          }}>
          {transList.map((item, index) => {
            return (
              <ThemedView key={index}>
                <ExpenseCategoryCard
                  name={item.name}
                  count={item.payCount}
                  amount={item.value}
                />
                {transList.length !== index + 1 && <Divider />}
              </ThemedView>
            );
          })}
        </ScrollView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    marginTop: 32,
    paddingBottom: 250,
    position: 'relative',
  },
  recentContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
