// types.ts

export interface Category {
  id: number;
  label: string;
  color: string;
  description?: string;
  is_active: boolean;
}

export interface Expense {
  id: number;
  amount: number;
  category_id?: number;
  pay_date?: string;
  description?: string | null;
  is_active: boolean;
  created_at: string;
  category?: string;
  color?: string;
}

export interface GlobalState {
  expenses: Expense[];
  categories: Category[];
  selectedExpenseId?: number;
}

export type GlobalAction =
  | {type: 'SET_CATEGORIES'; payload: Category[] | null}
  | {type: 'SET_EXPENSES'; payload: Expense[] | null}
  | {type: 'SET_SELECTED_EXPENSE_ID'; payload: number};

export interface GlobalContextType {
  state: GlobalState;
  updateCategories: (category: Category[] | null) => void;
  updateExpenses: (expense: Expense[] | null) => void;
  updateSelectedExpenseId: (id: number | null) => void;
}
