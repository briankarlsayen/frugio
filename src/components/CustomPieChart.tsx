import React, {useRef, useState} from 'react';
import PieChart from 'react-native-pie-chart';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {Dimensions, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {TERTIARY_COLOR, useThemeColor} from '@/hooks/useThemeColor';
import {BORDER_RADUIS} from '@/constants';

interface IData {
  value: number;
  color: string;
  name: string;
}

interface IProps {
  data: IData[];
}

const width = Dimensions.get('window').width - 40;

export default function CustomPieChart({data}: IProps) {
  const widthAndHeight = 158;
  if (!data.length) return <></>;

  return (
    <ThemedView
      darkColor={TERTIARY_COLOR}
      lightColor="gray"
      style={styles.container}>
      <ThemedView style={styles.chartContainer}>
        <ThemedView
          darkColor={TERTIARY_COLOR}
          lightColor="gray"
          style={{width: widthAndHeight, backgroundColor: 'transparent'}}>
          <PieChart widthAndHeight={widthAndHeight} series={data} />
        </ThemedView>
      </ThemedView>
      <PieChartLegend list={data} />
    </ThemedView>
  );
}

const PieChartLegend = ({list}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  const iconDefaultColor = useThemeColor({}, 'tabIconDefault');
  const iconSelectColor = useThemeColor({}, 'tabIconSelected');

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
      <ThemedView
        darkColor={TERTIARY_COLOR}
        lightColor="gray"
        style={styles.renderContainer}>
        {item.map(re => (
          <ThemedView
            darkColor={TERTIARY_COLOR}
            lightColor="gray"
            key={re.name}
            style={styles.itemContainer}>
            <ThemedView
              darkColor={TERTIARY_COLOR}
              lightColor="gray"
              style={styles.page}>
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
              <ThemedView darkColor={TERTIARY_COLOR} lightColor="gray">
                <ThemedText type="subtitle2">{re?.percentage}%</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ))}
      </ThemedView>
    );
  };

  return (
    <ThemedView
      darkColor={TERTIARY_COLOR}
      lightColor="gray"
      style={{
        alignItems: 'center',
        height: 100,
        borderRadius: BORDER_RADUIS,
      }}>
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

      <ThemedView
        darkColor={TERTIARY_COLOR}
        lightColor="gray"
        style={styles.pagination}>
        {paginatedData.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToPage(index)}>
            <ThemedView
              darkColor={TERTIARY_COLOR}
              lightColor="gray"
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

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: BORDER_RADUIS,
    paddingTop: 16,
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    paddingBottom: 8,
    backgroundColor: 'transparent',
  },
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
    backgroundColor: 'transparent',
  },

  pagination: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingBottom: 5,
    height: 25,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: 'transparent',
  },
});
