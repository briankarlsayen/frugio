import React, {useEffect, useState} from 'react';
import ExpenseCard from './ExpenseCard';
import {ThemedText} from './ThemedText';
import {convertToReadableDate, convertUTCtoLocalDate} from '@/utils';
import {ThemedView} from './ThemedView';

export default function TransactionList({list, handleShowEdit}) {
  const [transList, setTransList] = useState([]);

  const formatDate = (date: string) => {
    const dateNow = new Date();
    const yesterday = new Date();
    yesterday.setDate(dateNow.getDate() - 1);

    const localToday = convertUTCtoLocalDate(dateNow);
    const localYesterday = convertUTCtoLocalDate(yesterday);
    if (date === localToday) {
      return 'Today';
    } else if (date === localYesterday) {
      return 'Yesterday';
    } else {
      return convertToReadableDate(date);
    }
  };

  const processList = () => {
    const transactionLists = [];
    // if (!list?.length) return;
    list?.map(i => {
      const d = transactionLists.findIndex(item => item?.date === i?.pay_date);
      if (d > -1) {
        transactionLists[d]?.list?.push(i);
      } else {
        const itemList = [i];
        const newObj = {
          date: i?.pay_date,
          list: itemList,
        };
        transactionLists.push(newObj);
      }
    });
    setTransList(transactionLists);
  };

  useEffect(() => {
    processList();
  }, [list]);

  return (
    <ThemedView>
      {transList?.map((item, index) => {
        return (
          <ThemedView key={index} style={{gap: 6}}>
            <ThemedText
              style={{paddingTop: index > 0 ? 24 : 0, paddingHorizontal: 8}}>
              {formatDate(item?.date)}
            </ThemedText>
            <TransactionCards
              list={item?.list}
              handleShowEdit={handleShowEdit}
            />
          </ThemedView>
        );
      })}
    </ThemedView>
  );
}

const TransactionCards = ({list, handleShowEdit}) => {
  return list?.map((item, index) => (
    <ThemedView key={index}>
      <ExpenseCard
        id={item.id}
        name={item.description}
        category={item.category}
        amount={item.amount}
        handleLongPress={handleShowEdit}
      />
    </ThemedView>
  ));
};
