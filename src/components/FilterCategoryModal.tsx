import {StyleSheet, FlatList} from 'react-native';
import React, {useContext} from 'react';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import Modal from 'react-native-modal';
import {GlobalContext} from '@/store/globalProvider';
import {Category, GlobalContextType} from '@/store/types';
import ThemedHr from './ThemedHr';
import {getAllCategories, updateCategoryChecked} from '@/api';
import CustomIconButton from './CustomIconButton';

const FilterCategoryModal = ({open, handleClose, handleRefresh, payCount}) => {
  const context = useContext(GlobalContext);
  const {state, updateCategories} = context as GlobalContextType;

  const updateCheckedCategory = async ({id, isChecked}) => {
    await updateCategoryChecked({id, isChecked: !isChecked});

    const fetchCategories = await getAllCategories();
    updateCategories(fetchCategories?.data);
    handleRefresh();
  };

  const renderItem = ({item}: {item: Category}) => {
    const categoryPaycount = payCount?.find(p => p.id === item.id)?.len ?? 0;

    const checked = item?.is_checked;
    return (
      <ThemedView
        style={{
          paddingBottom: 8,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <CustomIconButton
          onPress={() =>
            updateCheckedCategory({id: item.id, isChecked: item.is_checked})
          }
          name={checked ? 'check-box' : 'check-box-outline-blank'}
          size={22}
        />
        <ThemedView
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <ThemedText style={{opacity: checked ? 1 : 0.3}}>
            {item.label}
          </ThemedText>
          <ThemedText style={{opacity: checked ? 1 : 0.3}}>
            {categoryPaycount}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };
  return (
    <Modal isVisible={open} backdropColor="gray" style={{height: 60}}>
      <ThemedView style={{height: 320, padding: 16, borderRadius: 12}}>
        <ThemedView
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 6,
          }}>
          <ThemedText type="title">Filter</ThemedText>
          <CustomIconButton onPress={handleClose} name="close" size={30} />
        </ThemedView>
        <ThemedHr />

        <FlatList
          data={state?.categories}
          renderItem={renderItem}
          style={{paddingTop: 12}}
        />
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    boxShadow: '0 1px 8px rgba(0, 0, 0, 0.4)',
  },
  subContainer: {
    width: 500,
    paddingHorizontal: 12,
  },
});

export default FilterCategoryModal;
