import React, {useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {ThemedText} from './ThemedText';
import {ThemedView} from './ThemedView';
import {ThemedTextInput} from './ThemedTextInput';
import {ThemedButton} from './ThemedButton';
import {DARK_INPUT_BG, LOGO_THEME_COLOR} from '@/hooks/useThemeColor';
import ThemedHr from './ThemedHr';
import CustomIconButton from './CustomIconButton';
import {ICategoryForm, IUpdateField} from '../pages/Categories';
import ColorPicker from 'react-native-wheel-color-picker';
const MODAL_BG = '#201F1E';
const INPUT_BG = DARK_INPUT_BG;

interface IBottomModal {
  name: string;
  open: boolean;
  handleClose: () => void;
  windowHeight: number;
  modalType: 'add' | 'edit';
  form: ICategoryForm;
  updateForm: (val: IUpdateField) => void;
  handleSubmit: () => void;
  handleDelete: () => void;
}

export default function CategoryModal({
  open,
  handleClose,
  windowHeight,
  modalType,
  form,
  updateForm,
  handleSubmit,
  handleDelete,
}: IBottomModal) {
  const handleConfirm = () => {
    handleSubmit();
  };
  const [showModal, setShowModal] = useState(false);

  const changeColor = (e: string) => {
    updateForm({name: 'color', value: e});
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
          <Modal visible={showModal} animationType="slide">
            <ThemedView style={{flex: 1, padding: 20, gap: 20}}>
              <ThemedView
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <ThemedText>Selected: {form.color}</ThemedText>
                <CustomIconButton
                  onPress={handleClose}
                  name={'close'}
                  size={30}
                />
              </ThemedView>

              <ColorPicker
                color={form.color}
                onColorChangeComplete={changeColor}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={false}
              />

              <ThemedButton
                darkColor={LOGO_THEME_COLOR}
                title="confirm"
                onPress={() => setShowModal(false)}
              />
            </ThemedView>
          </Modal>

          <ThemedView
            darkColor={MODAL_BG}
            style={[styles.bottomSheet, {height: windowHeight * 0.465}]}>
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
              <ThemedText type="subtitle2">Label</ThemedText>
              <ThemedTextInput
                darkBgColor={INPUT_BG}
                editable
                maxLength={255}
                onChangeText={val => updateForm({name: 'label', value: val})}
                value={form?.label}
                style={styles.inputField}
                textAlignVertical="top"
              />
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
              <ThemedText type="subtitle2">Color</ThemedText>
              <ThemedView
                style={{
                  backgroundColor: 'transparent',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}>
                <ThemedView
                  style={{
                    backgroundColor: form.color,
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                  }}
                />
                <TouchableOpacity
                  style={{
                    width: '50%',
                  }}
                  onPress={() => setShowModal(true)}>
                  <ThemedView
                    style={{
                      ...styles.inputField,
                      backgroundColor: INPUT_BG,
                      height: 40,
                      borderRadius: 5,
                    }}>
                    <ThemedText>{form.color}</ThemedText>
                  </ThemedView>
                </TouchableOpacity>
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
  swatchesContainer: {
    alignItems: 'center',
    flexWrap: 'nowrap',
    gap: 10,
  },
  swatchStyle: {
    borderRadius: 20,
    height: 30,
    width: 30,
    margin: 0,
    marginBottom: 0,
    marginHorizontal: 0,
    marginVertical: 0,
  },
  previewStyle: {
    height: 40,
    borderRadius: 14,
  },
  previewTxt: {
    color: '#707070',
    fontFamily: 'Quicksand',
  },
});
