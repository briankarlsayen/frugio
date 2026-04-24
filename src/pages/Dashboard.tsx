import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import React, {useContext, useEffect, useMemo, useRef, useState} from 'react';
import {LOGO_THEME_COLOR, TERTIARY_COLOR} from '../../hooks/useThemeColor';
import {GlobalContext} from '../../store/globalProvider';
import {Expense, GlobalContextType} from '../../store/types';
import {
  archiveExpense,
  createExpense,
  getAllCategories,
  getExpenseById,
  updateExpense,
} from '../../api';
import {
  convertLocalDateToUTC,
  convertUTCtoLocalDate,
  formatedAmount,
} from '../../utils';
import {ThemedView} from '../components/ThemedView';
import {ThemedText} from '../components/ThemedText';
import TransactionList from '../components/TransactionList';
import BottomModal from '../components/BottomModal';
import {Toast} from 'toastify-react-native';
import CustomIconButton from '../components/CustomIconButton';
import ExpenseBarGraph from '../components/ExpenseBarGraph';
import ExpensePieChart from '../components/ExpensePieChart';
import DateFilterModal from '../components/DateFilterModal';

export interface IExpenseFormVal {
  categoryId?: number | null;
  amount?: string;
  payDate?: Date;
  description?: string;
}

export interface IUpdateField {
  name?: keyof IExpenseFormVal;
  value?: string;
}

export interface IUpdateDateFilterField {
  name?: keyof IDateFilterFormVal;
  value?: number;
}

interface IList {
  categoryId: number;
  name: string;
  color: string;
  payCount: number;
  list: any[];
  value: number;
}

export interface IDateFilterFormVal {
  dateVal: number;
}

export default function Dashboard({navigation}) {
  const windowHeight = Dimensions.get('window').height;
  const context = useContext(GlobalContext);
  const {
    state,
    updateCategories,
    updateSelectedExpenseId,
    updateDateFilter,
    updateDashboardDateFilter,
    updateExpenses,
  } = context as GlobalContextType;

  const sampleExpenses = state.expenses.slice(0, 5);
  const selectedId = state?.selectedExpenseId;

  const [cb, setCb] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [expenseFormVal, setExpenseFormVal] = useState<IExpenseFormVal>({
    categoryId: 3,
    amount: '',
    payDate: new Date(),
    description: '',
  });

  const [dateFilterFormVal, setDateFilterFormVal] =
    useState<IDateFilterFormVal>({
      dateVal: 1,
    });

  const [selected, setSelected] = useState('blue');

  const handleClose = () => {
    clearForm();
    setOpen(false);
  };

  const checkFormVal = (obj: Record<string, any>) => {
    for (let key in obj) {
      if (!obj[key]) return key;
    }
    return false;
  };

  const handleSubmit = async () => {
    const convertedPayDate = convertUTCtoLocalDate(expenseFormVal?.payDate);
    try {
      const checkFormErr = checkFormVal(expenseFormVal);
      if (checkFormErr) {
        return Toast.error('Please fill up form');
      }
      const formVal = {
        ...expenseFormVal,
        payDate: convertedPayDate,
      };
      if (modalType === 'add') {
        await createExpense({
          ...formVal,
        });
      } else {
        await updateExpense({
          ...formVal,
          id: selectedId,
        });
      }

      const message =
        modalType === 'add' ? 'Successfully added' : 'Successfully updated';
      Toast.success(message);
    } catch (error) {
      Toast.error('Ooops something went wrong');
    }
    setCb(!cb);
    await updateExpenses(null);
    handleClose();
    clearForm();
  };
  const handleDelete = async () => {
    try {
      await archiveExpense(selectedId);
      Toast.success('Successfully deleted');
    } catch (error) {
      Toast.error('Ooops something went wrong');
    }
    setCb(!cb);
    await updateExpenses(null);
    handleClose();
    clearForm();
  };
  const handleOpen = () => {
    setModalType('add');
    setOpen(true);
  };

  const updateField = ({name, value}: IUpdateField) => {
    if (!name) return;
    if (name === 'amount') {
      const checkVal = () => {
        const len = value.split('.');
        const real = len[0]?.length;
        const dec = len[1]?.length;
        if (!!dec && dec > 2) return false;
        if (!!real && real > 6) return false;
        return true;
      };
      if (!checkVal()) return;
    }
    setExpenseFormVal({
      ...expenseFormVal,
      [name]: value,
    });
  };

  const updateFilterField = ({name, value}: IUpdateDateFilterField) => {
    if (!name) return;
    setDateFilterFormVal({
      ...dateFilterFormVal,
      [name]: value,
    });
  };

  const clearForm = () => {
    setExpenseFormVal({
      categoryId: null,
      amount: '',
      payDate: new Date(),
      description: '',
    });
    updateSelectedExpenseId(null);
  };

  const handleShowEdit = async (id: number) => {
    try {
      const expenseDetails = await getExpenseById(id);
      const expenseData = expenseDetails?.data[0];
      if (!expenseData) return;
      const expenseDate = convertLocalDateToUTC(expenseData.pay_date);
      setExpenseFormVal({
        categoryId: expenseData?.category_id,
        amount: expenseData?.amount?.toString(),
        payDate: expenseDate,
        description: expenseData?.description,
      });
      updateSelectedExpenseId(id);
    } catch (error) {
      Toast.error('Something went wrong');
    }

    setModalType('edit');
    setOpen(true);
  };

  const fetchCategories = async () => {
    const res = await getAllCategories();
    updateCategories(res?.data);
  };

  const filterExpenses = (expenses: Expense[]) => {
    const activeCategories = state?.categories
      .filter(f => f.is_active && f.is_checked)
      .map(m => m.id);
    const activeExpense = expenses.filter(i =>
      activeCategories.some(cat => cat === i.category_id),
    );
    const rawTotal = activeExpense?.reduce((sum, item) => sum + item.amount, 0);
    const total = formatedAmount(rawTotal);
    return {activeExpense, total};
  };

  const fetchExpenses = async () => {
    await updateExpenses({dateFilter: 6, dateRange: null});
  };

  const processList = (list: Expense[]) => {
    const transactionLists: IList[] = [];
    list?.map(i => {
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

    return filteredTransList;
  };

  useEffect(() => {
    // * initial fetch of data
    fetchCategories();
    fetchExpenses();
  }, []);

  const openDateFilter = () => {
    setOpenFilter(true);
    setDateFilterFormVal({
      dateVal: state.dashboardDateFilter,
    });
  };

  const closeDateFilter = () => {
    setOpenFilter(false);
  };

  const handleFilter = () => {
    let dateFilterVal = 6;
    switch (dateFilterFormVal.dateVal) {
      case 1:
        dateFilterVal = 6;
        break;
      case 2:
        dateFilterVal = 7;
        break;
      default:
        dateFilterVal = 8;
    }
    updateDashboardDateFilter(dateFilterFormVal.dateVal);
    updateDateFilter(dateFilterVal, null);
    setOpenFilter(false);
    setCb(!cb);
  };

  const animation = useRef(new Animated.Value(0)).current;

  const handleSwitch = value => {
    setSelected(value);

    Animated.timing(animation, {
      toValue: value === 'blue' ? 0 : 1,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const translateX = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 35], // adjust based on width
  });

  const swipeToTransactions = () => {
    navigation.navigate('Transactions');
  };

  const {pieChartData, barChartData, totalExpense} = useMemo(() => {
    const pieExpenses = processList(state.expenses);
    const {activeExpense, total} = filterExpenses(state.expenses);
    return {
      pieChartData: pieExpenses,
      barChartData: activeExpense,
      totalExpense: total,
    };
  }, [state.categories, state.expenses]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        style={{
          height: 100,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          alignContent: 'center',
          paddingTop: 50,
          paddingHorizontal: 20,
        }}>
        <ThemedView>
          <ThemedView style={styles.segment}>
            <Animated.View
              style={[styles.slider, {transform: [{translateX}]}]}
            />
            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSwitch('blue')}>
              <ThemedText
                type="subtitle2"
                style={selected === 'blue' ? styles.activeText : styles.text}>
                Bar
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.option}
              onPress={() => handleSwitch('red')}>
              <ThemedText
                type="subtitle2"
                style={selected === 'red' ? styles.activeText : styles.text}>
                Pie
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
        <ThemedText style={{marginRight: 60}}>Dashboard</ThemedText>
        <ThemedView>
          <CustomIconButton onPress={openDateFilter} name="event" size={20} />
        </ThemedView>
      </ThemedView>
      <ThemedView
        darkColor={TERTIARY_COLOR}
        lightColor="gray"
        style={styles.expenseSummary}>
        <ThemedText style={{fontSize: 42, lineHeight: 42}}>
          {totalExpense}
        </ThemedText>
      </ThemedView>
      <ThemedView>
        {selected === 'blue' ? (
          <ExpenseBarGraph
            expenses={barChartData}
            categories={state.categories}
            type={state.dashboardDateFilter}
          />
        ) : (
          <ExpensePieChart list={pieChartData} />
        )}
      </ThemedView>
      <ThemedView style={styles.transHeadline}>
        <ThemedText type="defaultSemiBold">Recent</ThemedText>
        <ThemedView style={{paddingTop: 4, paddingRight: 4}}>
          <CustomIconButton
            onPress={swipeToTransactions}
            name={'search'}
            size={24}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.recentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 620}}>
          <TransactionList
            list={sampleExpenses}
            handleShowEdit={handleShowEdit}
          />
        </ScrollView>
      </ThemedView>

      <ThemedView style={styles.addButtonView}>
        <CustomIconButton
          onPress={handleOpen}
          name={'add'}
          size={30}
          style={styles.addBtnContainer}
        />
      </ThemedView>
      {open && (
        <BottomModal
          open={open}
          handleClose={handleClose}
          windowHeight={windowHeight}
          modalType={modalType}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          updateForm={updateField}
          form={expenseFormVal}
        />
      )}
      {openFilter && (
        <DateFilterModal
          open={openFilter}
          handleClose={closeDateFilter}
          windowHeight={windowHeight}
          handleSubmit={handleFilter}
          updateForm={updateFilterField}
          form={dateFilterFormVal}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    position: 'relative',
    fontFamily: 'OpenSans',
  },
  transHeadline: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 18,
    alignItems: 'center',
    paddingTop: 10,
  },
  expenseSummary: {
    display: 'flex',
    width: '90%',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    height: 160,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  recentContainer: {
    paddingHorizontal: 12,
  },
  addButtonView: {
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  addBtnContainer: {
    width: 70,
    height: 70,
    backgroundColor: LOGO_THEME_COLOR,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  addButton: {
    width: 70,
    height: 70,
    borderRadius: 100,
  },

  segment: {
    flexDirection: 'row',
    backgroundColor: '#ddd',
    borderRadius: 25,
    width: 80,
    height: 24,
    position: 'relative',
  },
  slider: {
    position: 'absolute',
    width: 45,
    height: 24,
    backgroundColor: 'white',
    borderRadius: 25,
    elevation: 3, // shadow for Android
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#555',
  },
  activeText: {
    color: 'black',
    fontWeight: 'bold',
  },
  box: {
    width: 120,
    height: 120,
    borderRadius: 10,
  },
});
