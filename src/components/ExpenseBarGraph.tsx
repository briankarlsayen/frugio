import {Dimensions, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {ThemedView} from '../components/ThemedView';
import {Category, Expense} from '@/store/types';
import {StackedBarChart} from 'react-native-chart-kit';
import {
  PRIMARY_COLOR,
  TERTIARY_COLOR,
  useThemeColor,
} from '@/hooks/useThemeColor';
import {BORDER_RADUIS} from '@/constants';

interface IExpenseGraph {
  expenses: Expense[];
  categories: Category[];
  type: number;
}

type BarGraphType = 'month' | 'week';

function mapLabelsToColors(categories: Category[], labels: string[]) {
  return labels.map(label => {
    const match = categories.find(c => c.label === label);
    return match ? match.color : null; // or default color
  });
}

function buildChartData(
  records: Expense[],
  categories: Category[],
  type: BarGraphType,
) {
  const now = new Date();
  const labels = [];
  let graphLabels = [];

  if (type === 'week') {
    for (let i = 3; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i * 7);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      labels.push(`${year}-${month}-${day}`); // start of each week
    }
  } else {
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      labels.push(`${year}-${month}`);
    }
  }

  const legend = [...new Set(records.map(r => r.category))];
  const barColors = mapLabelsToColors(categories, legend);
  const data = labels.map(() => Array(legend.length).fill(0));

  function getWeekKey(dateStr: string) {
    const date = new Date(dateStr);
    const diffDays = Math.floor(
      (Number(now) - Number(date)) / (1000 * 60 * 60 * 24),
    );
    const weekIndex = Math.floor(diffDays / 7);

    if (weekIndex >= 0 && weekIndex < 4) {
      const d = new Date(now);
      d.setDate(now.getDate() - weekIndex * 7);

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    }

    return null;
  }
  records.forEach(item => {
    let key = null;

    if (type === 'week') {
      key = getWeekKey(item.pay_date);
    } else {
      key = item.pay_date.slice(0, 7);
    }

    const rowIndex = labels.indexOf(key);
    const colIndex = legend.indexOf(item.category);

    if (rowIndex !== -1 && colIndex !== -1) {
      data[rowIndex][colIndex] += item.amount;
    }
  });

  if (type === 'week') {
    graphLabels = ['1st', '2nd', '3rd', '4th'];
  } else {
    graphLabels = labels.map(i =>
      new Date(i).toLocaleString('default', {month: 'short'}),
    );
  }

  return {labels: graphLabels, legend, data, barColors};
}

export default function ExpenseBarGraph({
  expenses,
  categories,
  type,
}: IExpenseGraph) {
  const defaultData = {
    labels: ['Test1', 'Test2'],
    legend: ['L1', 'L2', 'L3'],
    data: [
      [160, 60, 60],
      [30, 30, 60],
    ],
    barColors: ['#dfe4ea', '#ced6e0', '#a4b0be'],
  };

  const [chartData, setChartData] = useState(defaultData);
  const processList = () => {
    const groupedData = buildChartData(
      expenses,
      categories,
      type === 1 ? 'week' : 'month',
    );
    setChartData({
      ...groupedData,
    });
  };

  useEffect(() => {
    processList();
  }, [expenses, categories, type]);

  const screenWidth = Dimensions.get('window').width - 86;
  const bg = useThemeColor({light: '', dark: PRIMARY_COLOR}, 'background');
  const chartConfig = {
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    backgroundGradientFrom: bg,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: bg,
    backgroundGradientToOpacity: 0,
    strokeWidth: 2, // optional, default 3
    barPercentage: 1,
    useShadowColorFromDataset: false, // optional
  };

  const barConfig = {
    borderColor: 'black',
    color: 'red',
    borderRadius: BORDER_RADUIS,
    right: 4,
    top: 12,
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView
        darkColor={TERTIARY_COLOR}
        lightColor="gray"
        style={styles.graphContainer}>
        <StackedBarChart
          style={barConfig}
          data={chartData}
          width={screenWidth}
          height={282}
          chartConfig={chartConfig}
          hideLegend={true}
          decimalPlaces={0}
          segments={3}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    position: 'relative',
    color: '#F7F0F5',
    alignItems: 'center',
  },
  graphContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '90%',
    alignItems: 'center',
    borderRadius: BORDER_RADUIS,
  },
  chart: {
    flex: 1,
    color: '#F7F0F5',
  },
});
