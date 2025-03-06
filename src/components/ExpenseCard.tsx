import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Card} from 'react-native-paper';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {PRIMARY_COLOR, SECONDARY_COLOR} from '@/hooks/useThemeColor';
import {GlobalContext} from '@/store/globalProvider';
import {GlobalContextType} from '@/store/types';

interface IExpenseCard {
  id: number;
  name: string;
  amount: number;
  category: string;
  handleLongPress: (id: number) => Promise<void>;
}

export default function ExpenseCard({
  id,
  name,
  amount,
  category,
  handleLongPress,
}: IExpenseCard) {
  const context = useContext(GlobalContext);
  const {state} = context as GlobalContextType;

  const formatedAmount = () => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const onLongPress = () => {
    console.log('pressed id: ', id);
    handleLongPress(id);
  };

  // const [bgColor] = useState(new Animated.Value(0));

  // const handlePress = () => {
  //   Animated.sequence([
  //     Animated.timing(bgColor, {
  //       toValue: 1,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }),
  //     Animated.timing(bgColor, {
  //       toValue: 0,
  //       duration: 200,
  //       useNativeDriver: false,
  //     }),
  //   ]).start();
  // };

  // const colorScheme = useColorScheme();

  // const interpolatedColor = bgColor.interpolate({
  //   inputRange: [0, 1],
  //   outputRange: [PRIMARY_COLOR, SECONDARY_COLOR], // White to Light Purple
  // });

  const handlePress = () => {
    console.log('press');
  };

  return (
    // <Animated.View
    //   style={{
    //     marginBottom: 10,
    //     backgroundColor: colorScheme === 'dark' ? interpolatedColor : undefined,
    //     borderRadius: 10,
    //   }}>
    // <Card
    //   mode="contained"
    //   style={{
    //     backgroundColor:
    //       state.selectedExpenseId === id ? SECONDARY_COLOR : undefined,
    //   }}
    //   // onLongPress={onLongPress}
    //   // onPress={handlePress}
    // >
    <TouchableOpacity onLongPress={onLongPress}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.descContainer}>
          <ThemedText type="subtitle">{name}</ThemedText>
          <ThemedText type="subtitle2" style={{opacity: 0.6}}>
            {category}
          </ThemedText>
        </ThemedView>
        <ThemedText>{formatedAmount()}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
    // </Card>
    // </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    // backgroundColor: "gray",
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  descContainer: {
    display: 'flex',
    flexDirection: 'column',

    backgroundColor: 'transparent',
  },
  recentContainer: {
    paddingHorizontal: 12,
  },
});
