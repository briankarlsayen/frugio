import {
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {SECONDARY_COLOR, TERTIARY_COLOR} from '../../hooks/useThemeColor';
import {GlobalContext} from '../../store/globalProvider';
import {GlobalContextType} from '../../store/types';
import {
  createExpense,
  getAllCategories,
  getExpenseById,
  getExpenses,
  updateExpense,
} from '../../api';
import {
  convertLocalDateToUTC,
  convertUTCtoLocalDate,
  filteredExpenses,
  formatedAmount,
} from '../../utils';
import {ThemedView} from '../components/ThemedView';
import {ThemedText} from '../components/ThemedText';
import TransactionMenu from '../components/TransactionMenu';
import TransactionList from '../components/TransactionList';
import BottomModal from '../components/BottomModal';
import {Icon} from 'react-native-paper';

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

export default function Dashboard() {
  const windowHeight = Dimensions.get('window').height;
  const context = useContext(GlobalContext);
  const {state, updateCategories, updateExpenses, updateSelectedExpenseId} =
    context as GlobalContextType;

  const sampleExpenses = state.expenses;
  const selectedId = state?.selectedExpenseId;

  const [cb, setCb] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState(false);
  const [expenseFormVal, setExpenseFormVal] = useState<IExpenseFormVal>({
    categoryId: 3,
    amount: '',
    payDate: new Date(),
    description: '',
  });
  const [dateFilter, setDateFilter] = useState<any | null>(3);
  const [totalExpenses, setTotalExpenses] = useState<string>('');

  const handleClose = () => {
    clearForm();
    setOpen(false);
  };
  const handleSubmit = async () => {
    const convertedPayDate = convertUTCtoLocalDate(expenseFormVal?.payDate);
    try {
      const formVal = {
        ...expenseFormVal,
        payDate: convertedPayDate,
      };
      console.log('formVal', formVal);
      if (modalType === 'add') {
        await createExpense({
          ...expenseFormVal,
          payDate: convertedPayDate,
        });
      } else {
        await updateExpense({
          ...expenseFormVal,
          payDate: convertedPayDate,
          id: selectedId,
        });
      }
    } catch (error) {
      console.log('show toast or something');
    }
    setCb(!cb);
    handleClose();
    clearForm();
  };
  const handleDelete = async () => {
    try {
      // await archiveExpense(selectedId);
    } catch (error) {
      console.log('unable to delete', error);
    }
    setCb(!cb);
    handleClose();
    clearForm();
  };
  const handleOpen = () => {
    setModalType('add');
    setOpen(true);
  };

  const updateField = ({name, value}: IUpdateField) => {
    if (!name) return;
    setExpenseFormVal({
      ...expenseFormVal,
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

  const handleDateFilter = (val: string) => {
    setDateFilter(val);
    setCb(!cb);
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
      console.log('error', error);
    }

    setModalType('edit');
    setOpen(true);
  };

  const fetchCategories = async () => {
    const res = await getAllCategories();
    updateCategories(res?.data);
  };

  const fetchExpenses = async () => {
    const {from, to} = filteredExpenses(dateFilter);
    const res = await getExpenses({from, to});

    // if (!res?.data?.length) return;

    const total = res?.data?.reduce((sum, item) => sum + item.amount, 0);

    setTotalExpenses(formatedAmount(total));

    updateExpenses(res?.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [cb]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        darkColor={SECONDARY_COLOR}
        lightColor="gray"
        style={styles.expenseSummary}>
        <ThemedText style={{fontSize: 42, lineHeight: 42}}>
          {totalExpenses}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.transHeadline}>
        <ThemedText type="defaultSemiBold">Transactions</ThemedText>
        <ThemedView>
          <TransactionMenu value={dateFilter} handleSelect={handleDateFilter} />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.recentContainer}>
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <TransactionList
            list={sampleExpenses}
            handleShowEdit={handleShowEdit}
          />
        </ScrollView>
      </ThemedView>
      <ThemedView style={styles.addButtonView}>
        <TouchableOpacity onPress={handleOpen}>
          <ThemedView style={styles.addBtnContainer}>
            <Icon source="plus" size={30} />
          </ThemedView>
        </TouchableOpacity>
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
    fontFamily: 'OpenSans',
  },
  transHeadline: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 18,
    alignItems: 'center',
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
  },
  expenseSummary: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    height: 160,
  },
  recentContainer: {
    paddingHorizontal: 12,
  },
  addButtonView: {
    position: 'absolute',
    bottom: 60,
    right: 20,
  },
  addBtnContainer: {
    width: 70,
    height: 70,
    backgroundColor: TERTIARY_COLOR,
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
});
