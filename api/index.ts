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
  return await executeSqlAsync(db, script, params).then(res => {});
};

const putApi = async (script: string, params: any[]) => {
  return await executeSqlAsync(db, script, params).then(res => {});
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

interface ICreateCategoryProps {
  color: string;
  label: string;
  description: string;
}

interface IUpdateExpenseProps extends ICreateExpsenseProps {
  id: number;
}

interface IUpdateCategoryProps extends ICreateCategoryProps {
  id: number;
}

interface IGetExpensesProps {
  from?: string | null;
  to?: string | null;
}

export const getAllCategories = async (): Promise<IGetAllCategories> => {
  try {
    const res = await getApi(`SELECT * FROM categories where is_active = 1`);
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

export const createCategory = async ({
  label,
  description,
  color,
}: ICreateCategoryProps): Promise<DefaultApiResponse> => {
  try {
    await postApi(
      'INSERT INTO categories (label, description, color) VALUES (?, ?, ?)',
      [label, description, color],
    );
    return {
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
  label,
  description,
  color,
}: IUpdateCategoryProps): Promise<IDefaultResponse> => {
  try {
    await putApi(
      'UPDATE categories SET label = ?, description = ?, color = ? WHERE id = ?',
      [label, description, color, id],
    );
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: true,
      error,
    };
  }
};

export const getCategoryById = async (
  id: number,
): Promise<IDefaultResponse> => {
  try {
    const data = await getApi(`SELECT * FROM categories WHERE id = ?`, [id]);

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

export const archiveCategory = async (
  id: number,
): Promise<IDefaultResponse> => {
  // check expenses if category is being used
  const expenses = await getApi(
    `SELECT * FROM expenses WHERE category_id = ? and is_active = 1`,
    [id],
  );
  if (expenses.length) {
    throw new Error('Category is being used');
  }
  await putApi('UPDATE categories SET is_active = 0 WHERE id = ?', [id]);
  return {
    success: true,
  };
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

export const getAllExpenses = async ({
  from,
  to,
}: IGetExpensesProps | null | undefined): Promise<IDefaultResponse> => {
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

export const updateCategoryChecked = async ({
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
