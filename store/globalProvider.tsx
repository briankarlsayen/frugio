import React, {createContext, useReducer, ReactNode} from 'react';
import {GlobalState, GlobalContextType, Category, Expense} from './types.ts';
import {getAllCategories, getAllExpenses} from '@/api/index.ts';
import {filteredExpenses, formatedAmount} from '@/utils/index.ts';

// Initial state
const initialState: GlobalState = {
  expenses: [],
  categories: [],
  selectedExpenseId: null,
  selectedCategoryId: null,
  totalExpenses: 0,
  dateFilter: 3,
  dateRange: null,
  dashboardDateFilter: 1,
  categoryFilter: [],
};

// Reducer function
const globalReducer = (state: GlobalState, action: any): GlobalState => {
  switch (action.type) {
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'SET_EXPENSES':
      return {
        ...state,
        expenses: action.payload,
      };
    case 'SET_SELECTED_EXPENSE_ID':
      return {
        ...state,
        selectedExpenseId: action.payload,
      };
    case 'SET_SELECTED_CATEGORY_ID':
      return {
        ...state,
        selectedCategoryId: action.payload,
      };
    case 'SET_DATE_FILTER':
      return {
        ...state,
        dateFilter: action.payload.dateFilter,
        dateRange: action.payload.dateRange,
      };
    case 'SET_TOTAL_EXPENSES':
      return {
        ...state,
        totalExpenses: action.payload,
      };
    case 'SET_DASHBOARD_DATE_FILTER':
      return {
        ...state,
        dashboardDateFilter: action.payload,
      };
    case 'SET_CATEGORY_FILTER':
      return {
        ...state,
        categoryFilter: action.payload,
      };

    default:
      return state;
  }
};

export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({children}: GlobalProviderProps) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);
  const updateCategories = (category: Category[] | null) => {
    dispatch({type: 'SET_CATEGORIES', payload: category});
    dispatch({
      type: 'SET_CATEGORY_FILTER',
      payload: category
        ? category?.map(i => ({label: i.label, value: true}))
        : [],
    });
  };
  const updateExpenses = (expense: Expense[] | null) => {
    const rawTotal = expense?.reduce((sum, item) => sum + item.amount, 0);
    const total = formatedAmount(rawTotal);
    dispatch({type: 'SET_EXPENSES', payload: expense});
    dispatch({type: 'SET_TOTAL_EXPENSES', payload: total ?? 0});
  };
  const updateSelectedExpenseId = (id: number | null) => {
    dispatch({type: 'SET_SELECTED_EXPENSE_ID', payload: id});
  };

  const getCategories = async () => {
    const categories = await getAllCategories();
    dispatch({type: 'SET_CATEGORIES', payload: categories?.data ?? []});
    dispatch({
      type: 'SET_CATEGORY_FILTER',
      payload: categories?.data
        ? categories?.data.map(i => ({label: i.label, value: false}))
        : [],
    });
  };

  const getExpenses = async (): Promise<Expense[]> => {
    const {from, to} = filteredExpenses({
      dateFilter: state.dateFilter,
      dateRange: state.dateRange,
    });
    const expenses = await getAllExpenses({from, to});
    const rawTotal = expenses?.data?.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const total = formatedAmount(rawTotal);

    dispatch({type: 'SET_EXPENSES', payload: expenses?.data ?? []});
    dispatch({type: 'SET_TOTAL_EXPENSES', payload: total ?? 0});
    return expenses?.data;
  };

  const updateSelectedCategoryId = (id: number | null) => {
    dispatch({type: 'SET_SELECTED_CATEGORY_ID', payload: id});
  };

  const updateDateFilter = (dateFilter: number, dateRange: any) => {
    dispatch({
      type: 'SET_DATE_FILTER',
      payload: {dateFilter, ...(dateRange !== undefined && {dateRange})},
    });
  };

  const updateDashboardDateFilter = (value: number) => {
    dispatch({
      type: 'SET_DASHBOARD_DATE_FILTER',
      payload: value,
    });
  };

  const updateDashboardCategoryFilter = (
    categoryList: {label: string; value: boolean}[],
  ) => {
    dispatch({type: 'SET_CATEGORY_FILTER', payload: categoryList});
  };

  return (
    <GlobalContext.Provider
      value={{
        state,
        updateCategories,
        updateExpenses,
        updateSelectedExpenseId,
        getCategories,
        updateSelectedCategoryId,
        getExpenses,
        updateDateFilter,
        updateDashboardDateFilter,
        updateDashboardCategoryFilter,
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
