import React, {useRef, useState} from 'react';
import PieChart from 'react-native-pie-chart';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {Dimensions, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {formatedAmount} from '@/utils';
import {useThemeColor} from '@/hooks/useThemeColor';

interface IData {
  value: number;
  color: string;
  name: string;
}

interface IProps {
  data: IData[];
}

const {width} = Dimensions.get('window');

export default function CustomPieChart({data}: IProps) {
  const widthAndHeight = 200;
  if (!data.length) return <></>;

  const totalVal = data?.reduce(function (acc, obj) {
    return acc + obj.value;
  }, 0);

  return (
    <ThemedView>
      {/* Pie chart */}
      <ThemedView
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'row',
          width: '100%',
          gap: 10,
          justifyContent: 'center',
          paddingBottom: 8,
        }}>
        <ThemedView style={{width: widthAndHeight}}>
          <PieChart widthAndHeight={widthAndHeight} series={data} />
        </ThemedView>
        {/* <ThemedView style={{display: 'flex', gap: 8}}>
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
        </ThemedView> */}
      </ThemedView>
      <ThemedText
        style={{textAlign: 'center', paddingVertical: 12}}
        type="subtitle2">
        Total: {formatedAmount(totalVal)}
      </ThemedText>
      <PieChartLegend list={data} />
    </ThemedView>
  );
}

const PieChartLegend = ({list}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const iconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const iconSelectColor = useThemeColor({}, 'tabIconSelected');
  // console.log('color', color);

  const totalVal = list?.reduce(function (acc, obj) {
    return acc + obj.value;
  }, 0);

  const onViewableItemsChanged = useRef(({viewableItems}: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const formatData = list.map(e => {
    const percentage = ((e.value / totalVal) * 100).toFixed(2);
    return {...e, percentage};
  });

  const chunkData = (arr: any[], size: number) => {
    return Array.from({length: Math.ceil(arr.length / size)}, (_, index) =>
      arr.slice(index * size, index * size + size),
    );
  };

  const paginatedData = chunkData(formatData, 3);

  const goToPage = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({index, animated: true});
      setCurrentIndex(index);
    }
  };

  const dotColor = {
    selected: iconSelectColor,
    unselected: iconDefaultColor,
  };

  const renderItem = ({item}: {item: any[]}) => {
    return (
      <ThemedView style={styles.renderContainer}>
        {item.map(re => (
          <ThemedView key={re.name} style={styles.itemContainer}>
            <ThemedView style={styles.page}>
              <ThemedView style={styles.pageRight}>
                <ThemedView
                  style={{
                    backgroundColor: re?.color,
                    width: 16,
                    height: 16,
                    borderRadius: '100%',
                  }}></ThemedView>
                <ThemedText type="subtitle2">{re?.name}</ThemedText>
              </ThemedView>
              <ThemedView>
                <ThemedText type="subtitle2">{re?.percentage}%</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

  return (
    <ThemedView style={{alignItems: 'center'}}>
      <FlatList
        ref={flatListRef}
        data={paginatedData}
        renderItem={renderItem}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{viewAreaCoveragePercentThreshold: 50}}
      />

      {/* Pagination Dots with Click Support */}
      <ThemedView style={styles.pagination}>
        {paginatedData.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToPage(index)}>
            <ThemedView
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentIndex
                      ? dotColor.selected
                      : dotColor.unselected,
                },
              ]}
            />
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ThemedView>
  );
};

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

const styles = StyleSheet.create({
  renderContainer: {
    width,
  },
  itemContainer: {
    alignItems: 'center',
    marginBottom: 8,
  },
  page: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 300,
  },
  pageRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  pagination: {flexDirection: 'row', marginTop: 10},
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
