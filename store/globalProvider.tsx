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

    default:
      return state;
  }
};

// Create the context with the correct types
export const GlobalContext = createContext<GlobalContextType | undefined>(
  undefined,
);

// Provider component
interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider = ({children}: GlobalProviderProps) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  // Define functions to dispatch actions
  const updateCategories = (category: Category[] | null) => {
    dispatch({type: 'SET_CATEGORIES', payload: category});
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
  };

  const getExpenses = async () => {
    const {from, to} = filteredExpenses({
      dateFilter: state.dateFilter,
      dateRange: state.dateRange,
    });
    const categories = await getAllExpenses({from, to});
    const rawTotal = categories?.data?.reduce(
      (sum, item) => sum + item.amount,
      0,
    );
    const total = formatedAmount(rawTotal);

    dispatch({type: 'SET_EXPENSES', payload: categories?.data ?? []});
    dispatch({type: 'SET_TOTAL_EXPENSES', payload: total ?? 0});
    return categories?.data;
  };

  const updateSelectedCategoryId = (id: number | null) => {
    dispatch({type: 'SET_SELECTED_CATEGORY_ID', payload: id});
  };

  const updateDateFilter = (dateFilter: string, dateRange: any) => {
    dispatch({
      type: 'SET_DATE_FILTER',
      payload: {dateFilter, ...(dateRange !== undefined && {dateRange})},
    });
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
      }}>
      {children}
    </GlobalContext.Provider>
  );
};
