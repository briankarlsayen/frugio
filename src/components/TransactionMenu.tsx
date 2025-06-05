import React, {useState} from 'react';
import {Menu} from 'react-native-paper';
import {filterOpts} from '@/constants/filter';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import CustomIconButton from './CustomIconButton';
import DateRangeModal from './DateRangeModal';
import {convertUTCtoLocalDateShort} from '@/utils';

export default function TransactionMenu({value, handleSelect}) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const [dprOpen, setDprOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{startDate?: any; endDate?: any}>(
    {},
  );

  const transactionOpts = filterOpts;
  const handleSelectOpt = opt => {
    if (opt?.value === 5) {
      setDprOpen(true);
    } else {
      handleSelect(opt?.value);
    }
    closeMenu();
  };

  const displayText = () => {
    if (value !== 5) return transactionOpts.find(t => t.value === value)?.name;

    return `${convertUTCtoLocalDateShort(
      dateRange?.startDate,
    )} - ${convertUTCtoLocalDateShort(dateRange?.endDate)}`;
  };

  const closeDateRangeModal = ({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }) => {
    if (!startDate || !endDate) return setDprOpen(false);
    setDateRange({startDate, endDate});
    handleSelect(5, {startDate, endDate});
    setDprOpen(false);
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
      <ThemedText type="subtitle2">{displayText()}</ThemedText>
      <DateRangeModal open={dprOpen} handleClose={closeDateRangeModal} />
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
