import {DARK_INPUT_BG, LIGHT_INPUT_BG} from '@/hooks/useThemeColor';
import React, {useState, useRef} from 'react';
import {TouchableOpacity, Animated, StyleSheet, ScrollView} from 'react-native';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {ThemedTextInput} from './ThemedTextInput';
import {useColorScheme} from '../../hooks/useColorScheme';
import CustomIconButton from './CustomIconButton';

// 353636
const MODAL_BG = '#201F1E';

interface IOption {
  label: string;
  value: string | number;
}

interface IDropdown {
  value?: string | number;
  options: IOption[];
  onSelect: (option: string | number) => void;
}

const Dropdown = ({value, options, onSelect}: IDropdown) => {
  const [selected, setSelected] = useState(value ?? null);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const animatedHeight = useRef(new Animated.Value(0)).current;
  const INPUT_BG = useColorScheme() === 'dark' ? DARK_INPUT_BG : LIGHT_INPUT_BG;

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    Animated.timing(animatedHeight, {
      toValue: isOpen ? 0 : options.length * 40,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSelect = (option: IOption) => {
    setSelected(option?.value);
    onSelect(option?.value);
    toggleDropdown();
  };

  const filteredOptions = options.filter(option =>
    option?.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleClear = () => {
    setSelected(null);
  };

  const selectedText = () => {
    return options.find(item => item.value === selected)?.label ?? null;
  };

  return (
    <ThemedView darkColor={MODAL_BG} style={styles.ddContainer}>
      <ThemedView darkColor={MODAL_BG} style={styles.container}>
        <TouchableOpacity
          style={{...styles.header, backgroundColor: INPUT_BG}}
          onPress={toggleDropdown}>
          <ThemedText style={styles.headerText}>
            {selectedText() || 'Select an option'}
          </ThemedText>
        </TouchableOpacity>
        {isOpen && (
          <ScrollView
            contentContainerStyle={{
              paddingBottom: 600,
            }}>
            <ThemedView
              darkColor={MODAL_BG}
              style={{backgroundColor: INPUT_BG}}>
              <ThemedTextInput
                // darkBgColor={INPUT_BG}
                style={styles.searchInput}
                placeholder="Search..."
                value={search}
                onChangeText={setSearch}
                onFocus={() => setIsOpen(true)}
              />
              <Animated.View
                style={[styles.dropdown, {height: animatedHeight}]}>
                {filteredOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.item}
                    onPress={() => handleSelect(option)}>
                    <ThemedText style={styles.itemText}>
                      {option.label}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            </ThemedView>
          </ScrollView>
        )}
      </ThemedView>
      {!isOpen && selected && (
        <CustomIconButton
          onPress={handleClear}
          name="close"
          size={22}
          style={{paddingRight: 10}}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  ddContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    width: 300,
    overflow: 'hidden',
  },
  header: {
    padding: 10,
    // backgroundColor: INPUT_BG,
  },
  headerText: {
    fontSize: 16,
  },
  dropdownContainer: {
    // backgroundColor: INPUT_BG,
  },
  searchInput: {
    padding: 10,
  },
  dropdown: {
    overflow: 'hidden',
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 14,
  },
});

export default Dropdown;
