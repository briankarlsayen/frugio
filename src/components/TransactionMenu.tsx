import React from 'react';
import {Menu} from 'react-native-paper';
import {filterOpts} from '@/constants/filter';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import CustomIconButton from './CustomIconButton';

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
        gap: 6,
      }}>
      <ThemedText>{displayText()}</ThemedText>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={<CustomIconButton onPress={openMenu} name="event" size={20} />}
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
