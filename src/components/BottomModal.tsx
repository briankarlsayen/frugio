import React, {useContext, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';
import {ThemedTextInput} from './ThemedTextInput';
import {ThemedButton} from './ThemedButton';
import {DARK_INPUT_BG, LOGO_THEME_COLOR} from '@/hooks/useThemeColor';
import {GlobalContext} from '@/store/globalProvider';
import {GlobalContextType} from '@/store/types';
import {IExpenseFormVal, IUpdateField} from '../pages/Dashboard';
import ThemedHr from './ThemedHr';
import Dropdown from './DropdownModal';
import InputDatePicker from './InputDatePicker';
import CustomIconButton from './CustomIconButton';
// 353636
const MODAL_BG = '#201F1E';
const INPUT_BG = DARK_INPUT_BG;

interface IBottomModal {
  name: string;
  open: boolean;
  handleClose: () => void;
  windowHeight: number;
  modalType: 'add' | 'edit';
  form: IExpenseFormVal;
  updateForm: (val: IUpdateField) => void;
  handleSubmit: () => void;
  handleDelete: () => void;
}

export default function BottomModal({
  name,
  open,
  handleClose,
  windowHeight,
  modalType,
  form,
  updateForm,
  handleSubmit,
  handleDelete,
}: IBottomModal) {
  const context = useContext(GlobalContext);
  const {state} = context as GlobalContextType;

  const handleConfirm = () => {
    handleSubmit();
  };

  const handleSelect = (item: any) => {
    updateForm({name: 'categoryId', value: item});
  };

  const dropDownOpt = state.categories?.length
    ? state.categories.map(category => {
        return {
          label: category?.label,
          value: category?.id,
        };
      })
    : [];

  const handleSelectData = (val: any) => {
    updateForm({name: 'payDate', value: val});
  };

  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () =>
      setKeyboardOpen(true),
    );
    const hide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardOpen(false),
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          marginBottom: keyboardOpen ? 330 : 0,
        }}>
        <ThemedView style={styles.overlay}>
          <ThemedView
            darkColor={MODAL_BG}
            style={[styles.bottomSheet, {height: windowHeight * 0.55}]}>
            <ThemedView
              darkColor={MODAL_BG}
              style={{
                flex: 0,
                width: '100%',
                justifyContent: 'space-between',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <ThemedText type="title" style={{textTransform: 'capitalize'}}>
                {modalType}
              </ThemedText>
              <CustomIconButton
                onPress={handleClose}
                name={'close'}
                size={30}
              />
            </ThemedView>
            <ThemedView
              style={{
                width: '100%',
                paddingVertical: 10,
                backgroundColor: 'transparent',
              }}>
              <ThemedHr />
            </ThemedView>
            <ThemedView
              darkColor={MODAL_BG}
              style={{display: 'flex', width: '100%', gap: 7}}>
              <ThemedText type="subtitle2">Description</ThemedText>
              <ThemedTextInput
                darkBgColor={INPUT_BG}
                editable
                maxLength={255}
                onChangeText={val =>
                  updateForm({name: 'description', value: val})
                }
                value={form?.description}
                style={styles.inputField}
                textAlignVertical="top"
              />
              <ThemedText type="subtitle2">Amount</ThemedText>
              <ThemedTextInput
                onChangeText={val => updateForm({name: 'amount', value: val})}
                style={styles.inputField}
                value={form?.amount}
                keyboardType="numeric"
              />
              <ThemedView
                style={{
                  display: 'flex',
                  width: '100%',
                  gap: 10,
                  backgroundColor: 'transparent',
                }}>
                <ThemedText type="subtitle2">Category</ThemedText>

                <Dropdown
                  value={form?.categoryId}
                  options={dropDownOpt}
                  onSelect={handleSelect}
                />
              </ThemedView>
              <ThemedView
                style={{
                  display: 'flex',
                  width: '100%',
                  gap: 10,
                  backgroundColor: 'transparent',
                }}>
                <ThemedText type="subtitle2">Pay Date</ThemedText>
                <InputDatePicker
                  date={form?.payDate}
                  onSelect={handleSelectData}
                />
              </ThemedView>
            </ThemedView>

            <ThemedView
              style={{
                width: '100%',
                paddingTop: 25,
                gap: 14,
                backgroundColor: 'transparent',
              }}>
              <ThemedButton
                darkColor={LOGO_THEME_COLOR}
                title="confirm"
                onPress={handleConfirm}
              />
              {modalType === 'edit' && (
                <ThemedButton
                  color={'#5a5c63'}
                  title="delete"
                  onPress={handleDelete}
                />
              )}
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingVertical: 23,
    paddingHorizontal: 25,
    bottom: 0,
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
  },
  inputField: {
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // 👈 semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
});
