import React from 'react';
import {IconButton, Menu} from 'react-native-paper';
import {filterOpts} from '@/constants/filter';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {TouchableOpacity, View} from 'react-native';
import ThemedIcon from './ThemedIcon';

export default function TransactionMenu({value, handleSelect}) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const transactionOpts = filterOpts;
  const handleSelectOpt = opt => {
    handleSelect(opt?.value);
    closeMenu();
  };

  const displayText = () => {
    return transactionOpts.find(t => t.value === value)?.name;
  };
  return (
    <ThemedView
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
      }}>
      <ThemedText>{displayText()}</ThemedText>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <ThemedIconButton onPress={openMenu} source="calendar" size={20} />
        }
        anchorPosition="bottom">
        <ThemedView style={{backgroundColor: 'transparent'}}>
          {transactionOpts.map((opt, index) => {
            return (
              <Menu.Item
                key={index}
                onPress={() => handleSelectOpt(opt)}
                title={opt.name}
                style={{backgroundColor: 'transparent'}}
              />
            );
          })}
        </ThemedView>
      </Menu>
    </ThemedView>
  );
}

const ThemedIconButton = ({onPress, source, size}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{padding: 4}}>
      <ThemedIcon source="calendar" size={20} />
    </TouchableOpacity>
  );
};
