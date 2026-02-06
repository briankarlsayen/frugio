import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import React, {useContext, useState} from 'react';
import {ThemedView} from '../components/ThemedView';
import {ThemedText} from '../components/ThemedText';
import CategoryList from '../components/CategoryList';
import CustomIconButton from '../components/CustomIconButton';
import {LOGO_THEME_COLOR} from '@/hooks/useThemeColor';
import BottomModal from '../components/BottomModal';
import {checkFormVal} from '../utils';
import {Toast} from 'toastify-react-native';
import CategoryModal from '../components/CategoryModal';
import {createCategory, updateCategory} from '@/api';
import {GlobalContextType} from '@/store/types';
import {GlobalContext} from '@/store/globalProvider';

export interface ICategoryForm {
  description: string;
  label: string;
  color: string;
}

export interface IUpdateField {
  name?: keyof ICategoryForm;
  value?: string;
}

export default function Categories() {
  const windowHeight = Dimensions.get('window').height;
  const context = useContext(GlobalContext);
  const {state, getCategories} = context as GlobalContextType;
  const selectedId = state?.selectedExpenseId;

  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [open, setOpen] = useState(false);
  const [categoryForm, setCategoryForm] = useState<ICategoryForm>({
    description: '',
    label: '',
    color: '#00ff00',
  });

  const handleOpen = () => {
    setModalType('add');
    setOpen(true);
  };
  const handleClose = () => {
    clearForm();
    setOpen(false);
  };
  const clearForm = () => {
    setCategoryForm({
      description: '',
      label: '',
      color: '',
    });
  };

  const handleSubmit = async () => {
    try {
      const checkFormErr = checkFormVal(categoryForm);
      if (checkFormErr) {
        return Toast.error('Please fill up form');
      }
      const formVal = categoryForm;
      if (modalType === 'add') {
        await createCategory({
          ...formVal,
        });
      } else {
        await updateCategory({
          ...formVal,
          id: selectedId,
        });
      }

      const message =
        modalType === 'add' ? 'Successfully added' : 'Successfully updated';
      await getCategories();
      Toast.success(message);
    } catch (error) {
      Toast.error('Ooops something went wrong');
    }
    // setCb(!cb);
    handleClose();
    clearForm();
  };

  const handleDelete = async () => {
    // try {
    //   await archiveExpense(selectedId);
    //   Toast.success('Successfully deleted');
    // } catch (error) {
    //   Toast.error('Ooops something went wrong');
    // }
    // setCb(!cb);
    await getCategories();
    handleClose();
    clearForm();
  };

  const updateField = ({name, value}: IUpdateField) => {
    if (!name) return;

    setCategoryForm({
      ...categoryForm,
      [name]: value,
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{paddingBottom: 15}}>
        Categories
      </ThemedText>
      <ScrollView contentContainerStyle={{paddingBottom: 15}}>
        <CategoryList />
      </ScrollView>
      <ThemedView style={styles.addButtonView}>
        <CustomIconButton
          onPress={handleOpen}
          name={'add'}
          size={30}
          style={styles.addBtnContainer}
        />
      </ThemedView>

      {open && (
        <CategoryModal
          name="categories"
          open={open}
          handleClose={handleClose}
          windowHeight={windowHeight}
          modalType={modalType}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          updateForm={updateField}
          form={categoryForm}
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
    paddingTop: 40,
    paddingLeft: 15,
    paddingRight: 15,
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
});
