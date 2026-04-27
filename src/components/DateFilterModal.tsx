import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';
import {ThemedButton} from './ThemedButton';
import {LOGO_THEME_COLOR, useThemeColor} from '@/hooks/useThemeColor';
import {Category} from '@/store/types';
import {IDateFilterFormVal, IUpdateDateFilterField} from '../pages/Dashboard';
import ThemedHr from './ThemedHr';
import CustomIconButton from './CustomIconButton';
import CustomIcon from './CustomIcon';
import Checkbox from './Checkbox';
import {MODAL_BG} from '@/constants/colors';

interface IDateFilterModal {
  open: boolean;
  handleClose: () => void;
  windowHeight: number;
  form: IDateFilterFormVal;
  categoryList: Category[];
  updateForm: (val: IUpdateDateFilterField) => void;
  updateCheck: (id: number) => void;
  handleConfirm: () => void;
}

export default function DateFilterModal({
  open,
  handleClose,
  windowHeight,
  form,
  categoryList,
  updateForm,
  updateCheck: updateCheckCategory,
  handleConfirm,
}: IDateFilterModal) {
  const dateFilterOptions = [
    {
      value: 1,
      label: 'Last 4 weeks',
    },
    {
      value: 2,
      label: 'Last 6 months',
    },
    {
      value: 3,
      label: 'All',
    },
  ];

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.keyboardContainer}>
        <ThemedView style={styles.overlay}>
          <ThemedView
            darkColor={MODAL_BG}
            style={[styles.bottomSheet, {height: windowHeight * 0.45}]}>
            <ThemedView darkColor={MODAL_BG} style={styles.headerContainer}>
              <ThemedText type="title" style={{textTransform: 'capitalize'}}>
                Filter
              </ThemedText>
              <CustomIconButton
                onPress={handleClose}
                name={'close'}
                size={30}
              />
            </ThemedView>
            <ThemedView style={styles.hrContainer}>
              <ThemedHr />
            </ThemedView>
            <ThemedView darkColor={MODAL_BG} style={styles.fieldContainer}>
              <ThemedText type="subtitle2">Date</ThemedText>
              <ThemedView>
                {dateFilterOptions.map(item => (
                  <RadioButton
                    key={item.value}
                    label={item.label}
                    selected={form.dateVal === item.value}
                    onPress={() =>
                      updateForm({name: 'dateVal', value: item.value})
                    }
                  />
                ))}
              </ThemedView>
              <ThemedText type="subtitle2">Categories</ThemedText>
              <ThemedView style={styles.categoryContainer} darkColor={MODAL_BG}>
                <ScrollView showsVerticalScrollIndicator={false}>
                  {categoryList?.map(category => (
                    <Checkbox
                      key={category.label}
                      label={category.label}
                      checked={category.is_checked}
                      style={{borderColor: category.color}}
                      onPress={() =>
                        updateCheckCategory(category.id)
                      }></Checkbox>
                  ))}
                </ScrollView>
              </ThemedView>
            </ThemedView>
            <ThemedView style={styles.confirmButtonContainer}>
              <ThemedButton
                darkColor={LOGO_THEME_COLOR}
                title="confirm"
                onPress={handleConfirm}
              />
            </ThemedView>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function RadioButton({label, selected, onPress}) {
  const defaultColor = useThemeColor({}, 'tabIconSelected');
  return (
    <Pressable onPress={onPress}>
      <ThemedView
        darkColor={MODAL_BG}
        style={{
          display: 'flex',
          alignItems: 'center',
          alignContent: 'center',
          flexDirection: 'row',
          gap: 4,
        }}>
        {selected ? (
          <CustomIcon
            name="radio-button-checked"
            color={defaultColor}
            size={12}
          />
        ) : (
          <CustomIcon
            name="radio-button-unchecked"
            color={defaultColor}
            size={12}
          />
        )}
        <ThemedText>{label}</ThemedText>
      </ThemedView>
    </Pressable>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldContainer: {
    display: 'flex',
    width: '100%',
    gap: 7,
  },
  categoryContainer: {
    height: 110,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  hrContainer: {
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  headerContainer: {
    flex: 0,
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmButtonContainer: {
    width: '100%',
    paddingTop: 25,
    gap: 14,
    backgroundColor: 'transparent',
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 0,
  },
});
