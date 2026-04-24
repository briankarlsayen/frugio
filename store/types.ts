// types.ts

export interface Category {
  id: number;
  label: string;
  color: string;
  description?: string;
  is_active: boolean;
  is_checked: boolean;
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
  selectedCategoryId?: number;
  totalExpenses: number;
  dateRange: any;
  dateFilter: any;
  dashboardDateFilter: number;
  categoryFilter: {label: string; value: boolean}[];
}

export interface IGetExpensesProps {
  dateFilter: any;
  dateRange: any;
}

export type GlobalAction =
  | {type: 'SET_CATEGORIES'; payload: Category[] | null}
  | {type: 'SET_EXPENSES'; payload: Expense[] | null}
  | {type: 'SET_SELECTED_EXPENSE_ID'; payload: number};

export interface GlobalContextType {
  state: GlobalState;
  updateCategories: (category: Category[] | null) => void;
  updateExpenses: (props: IGetExpensesProps | null) => Promise<Expense[]>;
  updateSelectedExpenseId: (id: number | null) => void;
  getCategories: () => Promise<void>;
  updateSelectedCategoryId: (id: number | null) => void;
  getExpenses: (props: IGetExpensesProps | null) => Promise<Expense[]>;
  updateDateFilter: (dateFilter: number, dateRange: any) => void;
  updateDashboardDateFilter: (value: number) => void;
  updateDashboardCategoryFilter: (
    category: {label: string; value: boolean}[],
  ) => void;
}
