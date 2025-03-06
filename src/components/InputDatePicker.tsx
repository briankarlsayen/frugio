import React, {useCallback, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Icon} from 'react-native-paper';
import {DatePickerModal} from 'react-native-paper-dates';
import {ThemedView} from './ThemedView';
import {DARK_INPUT_BG, LIGHT_INPUT_BG} from '@/hooks/useThemeColor';
import {ThemedText} from './ThemedText';
import {useColorScheme} from '@/hooks/useColorScheme';

const MODAL_BG = '#201F1E';

export default function InputDatePicker({date, onSelect}) {
  const [open, setOpen] = useState(false);

  const INPUT_BG = useColorScheme() === 'dark' ? DARK_INPUT_BG : LIGHT_INPUT_BG;

  const onDismissSingle = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const handleConfirm = val => {
    const selectedDate: string | null = val?.date ?? null;
    setOpen(false);
    onSelect(selectedDate);
  };

  return (
    <ThemedView darkColor={MODAL_BG} style={styles.container}>
      <ThemedView
        darkColor={MODAL_BG}
        style={{...styles.dateInputContainer, backgroundColor: INPUT_BG}}>
        <ThemedText style={{flex: 1}}>
          {date ? new Date(date)?.toLocaleDateString() : null}
        </ThemedText>
        <DatePickerModal
          locale="en"
          mode="single"
          visible={open}
          onDismiss={onDismissSingle}
          date={date}
          onConfirm={handleConfirm}
          presentationStyle="pageSheet"
          dateMode="start"
          animationType="slide"
        />
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{paddingRight: 10}}>
          <Icon source="calendar" size={22} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    gap: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInputContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    height: 42,
    padding: 8,
  },
});
