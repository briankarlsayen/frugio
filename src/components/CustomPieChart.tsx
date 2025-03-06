import React from 'react';
import PieChart from 'react-native-pie-chart';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';

interface IData {
  value: number;
  color: string;
  name: string;
}

interface IProps {
  data: IData[];
}
export default function CustomPieChart({data}: IProps) {
  const widthAndHeight = 200;
  if (!data.length) return <></>;
  const totalVal = data.reduce(function (acc, obj) {
    return acc + obj.value;
  }, 0);

  return (
    <ThemedView
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        gap: 10,
      }}>
      <ThemedView>
        <PieChart widthAndHeight={widthAndHeight} series={data} />
      </ThemedView>
      <ThemedView style={{display: 'flex', gap: 8}}>
        {data.map((item, index) => {
          return (
            <Legend
              key={index}
              color={item.color}
              label={item?.name}
              percentage={((item.value / totalVal) * 100).toFixed(2)}
            />
          );
        })}
      </ThemedView>
    </ThemedView>
  );
}

const Legend = ({color, label, percentage}) => {
  return (
    <ThemedView
      style={{
        display: 'flex',
        flexDirection: 'row',
        gap: 24,
        justifyContent: 'space-between',
      }}>
      <ThemedView style={{display: 'flex', flexDirection: 'row', gap: 4}}>
        <ThemedView
          style={{
            backgroundColor: color,
            width: 16,
            height: 16,
            borderRadius: '100%',
          }}></ThemedView>
        <ThemedText type="subtitle2">{label}</ThemedText>
      </ThemedView>
      <ThemedText type="subtitle2">{percentage} %</ThemedText>
    </ThemedView>
  );
};
