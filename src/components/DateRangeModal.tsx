import {View, Text, Modal, StyleSheet, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import CustomIconButton from './CustomIconButton';
import {ThemedTextInput} from './ThemedTextInput';
import {DARK_INPUT_BG, LOGO_THEME_COLOR} from '@/hooks/useThemeColor';
import InputDatePicker from './InputDatePicker';
import ThemedHr from './ThemedHr';
import {ThemedButton} from './ThemedButton';
const MODAL_BG = '#201F1E';
const INPUT_BG = DARK_INPUT_BG;

const DateRangeModal = ({open, handleClose}) => {
  const windowHeight = Dimensions.get('window').height;

  const [form, setForm] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [isError, setError] = useState(false);

  const selectStartDate = (val: any) => {
    setError(false);
    setForm({...form, startDate: val});
  };
  const selectEndDate = (val: any) => {
    setError(false);
    setForm({...form, endDate: val});
  };

  const handleConfirm = () => {
    if (form?.startDate > form?.endDate) return setError(true);
    console.log('form', form);
    handleClose(form);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={open}
      onRequestClose={handleClose}>
      <ThemedView style={styles.overlay}>
        <ThemedView
          darkColor={MODAL_BG}
          style={[styles.bottomSheet, {height: windowHeight * 0.36}]}>
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
              Select Dates
            </ThemedText>
            <CustomIconButton onPress={handleClose} name={'close'} size={30} />
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
            <ThemedText type="subtitle2">Start Date</ThemedText>
            <InputDatePicker
              date={form?.startDate}
              onSelect={selectStartDate}
            />
            <ThemedText type="subtitle2">End Date</ThemedText>
            <InputDatePicker date={form?.endDate} onSelect={selectEndDate} />
          </ThemedView>
          {isError && (
            <ThemedText type="subtitle2" style={{color: 'red', paddingTop: 4}}>
              Invalid selected dates
            </ThemedText>
          )}
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
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

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
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // 👈 semi-transparent dark background
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DateRangeModal;
