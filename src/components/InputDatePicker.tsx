import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {ThemedView} from './ThemedView';
import {DARK_INPUT_BG, LIGHT_INPUT_BG} from '@/hooks/useThemeColor';
import {ThemedText} from './ThemedText';
import {useColorScheme} from '@/hooks/useColorScheme';
import ThemedIcon from './ThemedIcon';
import {DateTimePickerAndroid} from '@react-native-community/datetimepicker';

const MODAL_BG = '#201F1E';

export default function InputDatePicker({date, onSelect}) {
  const INPUT_BG = useColorScheme() === 'dark' ? DARK_INPUT_BG : LIGHT_INPUT_BG;

  const onChange = (_event, selectedDate) => {
    const currentDate = selectedDate;
    onSelect(selectedDate);
  };

  const showMode = currentMode => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
      display: 'calendar',
    });
  };

  const showDatepicker = () => {
    showMode('date');
  };

  return (
    <ThemedView darkColor={MODAL_BG} style={styles.container}>
      <ThemedView
        darkColor={MODAL_BG}
        style={{...styles.dateInputContainer, backgroundColor: INPUT_BG}}>
        <ThemedText style={{flex: 1}}>
          {date ? new Date(date)?.toLocaleDateString() : null}
        </ThemedText>
        <TouchableOpacity onPress={showDatepicker} style={{paddingRight: 10}}>
          <ThemedIcon source="calendar" size={22} />
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
