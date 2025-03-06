import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from '@react-navigation/native';

import React, {useEffect} from 'react';
import {Text, useColorScheme} from 'react-native';
import Dashboard from './src/pages/Dashboard';
import Analytics from './src/pages/Analytics';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GlobalProvider} from './store/globalProvider';
import migration from './api/migration';
import db from './api/db';
import {PaperProvider} from 'react-native-paper';
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    migration(db);
  }, []);

  return (
    <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
      <GlobalProvider>
        <PaperProvider>
          <NavigationContainer>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
        @ts-ignore */}
            <Tab.Navigator
              screenOptions={({route}) => ({
                tabBarIcon: ({color, size}) => {
                  let iconName = 'icon-name' as string;
                  if (route.name === 'Dashboard') {
                    iconName = 'home';
                    return <Icon name="dashboard" size={24} />;
                  } else if (route.name === 'Analytics') {
                    iconName = 'bar-chart';
                    return <Icon name="equalizer" size={24} />;
                  }
                  return <Text>haha</Text>;
                },
                tabBarActiveTintColor: 'black',
                tabBarInactiveTintColor: 'gray',
              })}>
              <Tab.Screen
                name="Dashboard"
                component={Dashboard}
                options={{headerShown: false}}
              />
              <Tab.Screen
                name="Analytics"
                component={Analytics}
                options={{headerShown: false}}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </PaperProvider>
      </GlobalProvider>
    </ThemeProvider>
  );
}

export default App;
