import {Category} from '../store/types';
import db from './db';
import {executeSqlAsync} from './migration';

const getApi = async (script: string, params?: any[]): Promise<any[]> => {
  return await executeSqlAsync(db, script, params).then(res => {
    const items = [];
    for (let i = 0; i < res.rows.length; i++) {
      items.push(res.rows.item(i));
    }
    return items;
  });
};

const postApi = async (script: string, params: any[]) => {
  return await executeSqlAsync(db, script, params).then(res => {
    // console.log('res', res);
  });
};

const putApi = async (script: string, params: any[]) => {
  return await executeSqlAsync(db, script, params).then(res => {
    // console.log('res', res);
  });
};

interface DefaultApiResponse {
  success: boolean;
  error?: any;
}

interface IGetAllCategories extends DefaultApiResponse {
  data?: Category[];
}

interface IDefaultResponse extends DefaultApiResponse {
  data?: any;
}

interface ICreateExpsenseProps {
  categoryId?: number | null;
  amount?: string;
  payDate?: string;
  description?: string;
}

interface IUpdateExpenseProps extends ICreateExpsenseProps {
  id: number;
}

interface IGetExpensesProps {
  from?: string | null;
  to?: string | null;
}

export const getAllCategories = async (): Promise<IGetAllCategories> => {
  try {
    const res = await getApi(`SELECT * FROM categories`);
    return {
      success: true,
      data: res,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};

export const createExpense = async ({
  amount,
  categoryId,
  description,
  payDate,
}: ICreateExpsenseProps): Promise<IDefaultResponse> => {
  try {
    const res = await postApi(
      'INSERT INTO expenses (amount, category_id, description, pay_date) VALUES (?, ?, ?, ?)',
      [amount, categoryId, description, payDate],
    );
    // console.log('res', res);
    return {
      // data,
      success: true,
    };
  } catch (error) {
    return {
      success: true,
      error,
    };
  }
};

export const getExpenses = async ({
  from,
  to,
}: IGetExpensesProps | undefined): Promise<IDefaultResponse> => {
  try {
    let data = [];
    if (from && to) {
      data = await getApi(
        `SELECT expenses.*, categories.label as category, categories.color  FROM expenses JOIN categories ON expenses.category_id=categories.id WHERE expenses.pay_date >= ? AND expenses.pay_date <= ? AND expenses.is_active = 1 AND expenses.amount > 1 ORDER BY expenses.pay_date desc`,
        [from, to],
      );
    } else {
      data = await getApi(
        `SELECT expenses.*, categories.label as category, categories.color  FROM expenses JOIN categories ON expenses.category_id=categories.id WHERE expenses.is_active = 1 ORDER BY expenses.pay_date desc`,
      );
    }

    return {
      // data: data.filter(i => i?.amount < 0),
      data,
      success: true,
    };
  } catch (error) {
    return {
      success: true,
      error,
    };
  }
};

export const getExpenseById = async (id: number): Promise<IDefaultResponse> => {
  try {
    // const data = await db.getFirstAsync(
    //   `SELECT expenses.*, categories.label as category FROM expenses JOIN categories ON expenses.category_id=categories.id WHERE expenses.id = ?`,
    //   id
    // );

    const data = await getApi(
      `SELECT expenses.*, categories.label as category FROM expenses JOIN categories ON expenses.category_id=categories.id WHERE expenses.id = ?`,
      [id],
    );
    console.log('press moto', data);

    return {
      data,
      success: true,
    };
  } catch (error) {
    return {
      success: true,
      error,
    };
  }
};

export const updateExpense = async ({
  id,
  amount,
  categoryId,
  description,
  payDate,
}: IUpdateExpenseProps): Promise<IDefaultResponse> => {
  try {
    const res = await putApi(
      'UPDATE expenses SET amount = ?, category_id = ?, description = ?, pay_date = ? WHERE id = ?',
      [amount, categoryId, description, payDate, id],
    );
    // console.log('res', res);
    return {
      // data,
      success: true,
    };
  } catch (error) {
    return {
      success: true,
      error,
    };
  }
};

export const archiveExpense = async (id: number): Promise<IDefaultResponse> => {
  try {
    const res = await putApi('UPDATE expenses SET is_active = 0 WHERE id = ?', [
      id,
    ]);
    // console.log('res', res);
    return {
      // data,
      success: true,
    };
  } catch (error) {
    return {
      success: true,
      error,
    };
  }
};

export const updateCategory = async ({
  id,
  isChecked,
}): Promise<IDefaultResponse> => {
  try {
    const res = await putApi(
      'UPDATE categories SET is_checked = ? WHERE id = ?',
      [isChecked, id],
    );

    return {
      // data: res,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
