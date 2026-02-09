import {StyleSheet, Dimensions, ScrollView} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {LOGO_THEME_COLOR, TERTIARY_COLOR} from '../../hooks/useThemeColor';
import {GlobalContext} from '../../store/globalProvider';
import {GlobalContextType} from '../../store/types';
import {
  archiveExpense,
  createExpense,
  getAllCategories,
  getExpenseById,
  updateExpense,
} from '../../api';
import {convertLocalDateToUTC, convertUTCtoLocalDate} from '../../utils';
import {ThemedView} from '../components/ThemedView';
import {ThemedText} from '../components/ThemedText';
import TransactionMenu from '../components/TransactionMenu';
import TransactionList from '../components/TransactionList';
import BottomModal from '../components/BottomModal';
import {Toast} from 'toastify-react-native';
import CustomIconButton from '../components/CustomIconButton';

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
  const {
    state,
    updateCategories,
    updateSelectedExpenseId,
    updateDateFilter,
    getExpenses,
  } = context as GlobalContextType;

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
  const clearForm = () => {
    setExpenseFormVal({
      categoryId: null,
      amount: '',
      payDate: new Date(),
      description: '',
    });
    updateSelectedExpenseId(null);
  };

  const handleDateFilter = (val: string, dates: any) => {
    updateDateFilter(val, dates);
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
      Toast.error('Something went wrong');
    }

    setModalType('edit');
    setOpen(true);
  };

  const fetchCategories = async () => {
    const res = await getAllCategories();
    updateCategories(res?.data);
  };

  const fetchExpenses = async () => {
    getExpenses();
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
        darkColor={TERTIARY_COLOR}
        lightColor="gray"
        style={styles.expenseSummary}>
        <ThemedText style={{fontSize: 42, lineHeight: 42}}>
          {state.totalExpenses}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.transHeadline}>
        <ThemedText type="defaultSemiBold">Transactions</ThemedText>
        <ThemedView>
          <TransactionMenu
            value={state.dateFilter}
            handleSelect={handleDateFilter}
          />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.recentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 100}}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    height: '100%',
    paddingBottom: 120,
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
});
