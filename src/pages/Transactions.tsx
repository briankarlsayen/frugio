import {ScrollView, StyleSheet, Dimensions} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {ThemedView} from '../components/ThemedView';
import TransactionList from '../components/TransactionList';
import CustomIconButton from '../components/CustomIconButton';
import BottomModal from '../components/BottomModal';
import {ThemedText} from '../components/ThemedText';
import {LOGO_THEME_COLOR} from '@/hooks/useThemeColor';
import {
  archiveExpense,
  createExpense,
  getAllCategories,
  getExpenseById,
  updateExpense,
} from '@/api';
import {Toast} from 'toastify-react-native';
import {convertLocalDateToUTC, convertUTCtoLocalDate} from '@/utils';
import {GlobalContext} from '@/store/globalProvider';
import {Expense, GlobalContextType} from '@/store/types';
import {IDateFilterFormVal, IUpdateDateFilterField} from './Dashboard';
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

export default function Transactions() {
  const windowHeight = Dimensions.get('window').height;
  const context = useContext(GlobalContext);
  const {
    state,
    updateCategories,
    updateSelectedExpenseId,
    updateDateFilter,
    getExpenses,
    updateDashboardDateFilter,
  } = context as GlobalContextType;

  const selectedId = state?.selectedExpenseId;

  const [cb, setCb] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);

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

  const fetchExpenses = async () => {
    const expenses = await getExpenses();
    const activeCategories = state?.categories
      .filter(f => f.is_active && f.is_checked)
      .map(m => m.id);
    const activeExpense = expenses.filter(i =>
      activeCategories.some(cat => cat === i.category_id),
    );
    setFilteredExpenses(activeExpense);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchExpenses();
  }, [cb, state.categories, state.dateFilter]);

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.pageHeaderText}>
        <ThemedText type="defaultSemiBold">Transactions</ThemedText>
        <ThemedView style={{paddingRight: 5}}>
          <CustomIconButton onPress={openDateFilter} name="event" size={20} />
        </ThemedView>
      </ThemedView>
      <ThemedView style={styles.recentContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recentScrollContainer}>
          <TransactionList
            list={filteredExpenses}
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
    paddingTop: 50,
  },
  pageHeaderText: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 15,
    alignItems: 'center',
    paddingTop: 13,
    paddingBottom: 20,
  },
  recentContainer: {
    paddingHorizontal: 12,
  },
  recentScrollContainer: {
    paddingBottom: 70,
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
