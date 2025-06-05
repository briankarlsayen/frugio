import {ScrollView, StyleSheet} from 'react-native';
import {Divider} from 'react-native-paper';
import CustomPieChart from '../components/CustomPieChart';
import ExpenseCategoryCard from '../components/ExpenseCategoryCard';
import TransactionMenu from '../components/TransactionMenu';
import {useContext, useEffect, useState} from 'react';
import {filteredExpenses} from '@/utils';
import {getExpenses} from '@/api';
import {ThemedView} from '../components/ThemedView';
import {ThemedText} from '../components/ThemedText';
import {GlobalContext} from '@/store/globalProvider';
import {GlobalContextType} from '@/store/types';
import FilterCategoryModal from '../components/FilterCategoryModal';
import CustomIconButton from '../components/CustomIconButton';

interface IList {
  categoryId: number;
  name: string;
  color: string;
  payCount: number;
  list: any[];
  value: number;
}

export default function Analytics() {
  const context = useContext(GlobalContext);
  const {state} = context as GlobalContextType;
  const [cb, setCb] = useState(false);

  const [transList, setTransList] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [payCount, setPayCount] = useState([]);
  const [dateRange, setDateRange] = useState(null);

  const processList = (list: any) => {
    const transactionLists: IList[] = [];
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

    const activeCategories = state?.categories
      .filter(f => f.is_active && f.is_checked)
      .map(m => m.id);

    const filteredTransList = transactionLists.filter(i =>
      activeCategories.some(cat => cat === i.categoryId),
    );

    setPayCount(
      transactionLists.map(e => {
        return {
          id: e.categoryId,
          len: e.list?.length,
        };
      }),
    );

    setTransList(filteredTransList);
  };

  const fetchExpenses = async () => {
    const {from, to} = filteredExpenses({dateFilter, dateRange});
    const res = await getExpenses({from, to});

    processList(res?.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, [cb, state?.expenses]);

  const handleRefresh = () => {
    setCb(!cb);
  };

  const [dateFilter, setDateFilter] = useState<any | null>(3);
  const handleDateFilter = (val: string, dates: any) => {
    setDateRange(dates);
    setDateFilter(val);
    setCb(!cb);
  };

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  return (
    <ThemedView style={styles.container}>
      <CustomPieChart data={transList} />
      {!transList.length && (
        <ThemedView>
          <ThemedText type="title" style={{textAlign: 'center'}}>
            No Data To Show
          </ThemedText>
        </ThemedView>
      )}

      <ThemedView
        style={{boxShadow: '0 1px 4px rgba(0, 0, 0, 0.4)', marginTop: 12}}>
        <FilterCategoryModal
          open={openFilter}
          handleClose={handleCloseFilter}
          handleRefresh={handleRefresh}
          payCount={payCount}
        />
        <ThemedView style={{paddingHorizontal: 12, paddingTop: 8, gap: 12}}>
          <ThemedView
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,

              width: '100%',
              justifyContent: 'space-between',
            }}>
            <ThemedView style={{display: 'flex', flexDirection: 'row', gap: 8}}>
              <ThemedText>Chart</ThemedText>
              <CustomIconButton
                onPress={handleOpenFilter}
                name="tune"
                // name="more-vert"
                size={24}
              />
            </ThemedView>
            <TransactionMenu
              value={dateFilter}
              handleSelect={handleDateFilter}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>

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
    paddingBottom: 250,
    position: 'relative',
    paddingTop: 12,
  },
  recentContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
