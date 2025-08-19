import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from '@react-navigation/native';

import React, {useEffect, useState} from 'react';
import {StatusBar, Text} from 'react-native';
import Dashboard from './src/pages/Dashboard';
import Analytics from './src/pages/Analytics';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {GlobalProvider} from './store/globalProvider';
import migration from './api/migration';
import db from './api/db';
import {PaperProvider} from 'react-native-paper';
import {useColorScheme} from '@/hooks/useColorScheme';
import {ThemedView} from './src/components/ThemedView';
import LoadingScreen from './src/components/LoadingScreen';
import ToastManager from 'toastify-react-native';
const Tab = createBottomTabNavigator();

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [loading, setLoading] = useState(true);
  const [longLoad, setLongLoad] = useState(false);

  useEffect(() => {
    let timeoutId;
    let isCompleted = false;

    const initialize = async () => {
      timeoutId = setTimeout(() => {
        if (!isCompleted) setLongLoad(true);
      }, 100);

      try {
        await migration(db);
        isCompleted = true; // Mark the request as completed

        clearTimeout(timeoutId);
        setLoading(false);
        setLongLoad(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        setLongLoad(false);
      }
    };

    initialize();

    return () => clearTimeout(timeoutId);
  }, []);

  const display = () => {
    switch (true) {
      // case true:
      case longLoad && loading:
        return <LoadingScreen />;
      case loading:
        return <LoadingScreen />;
      // return <ShortLoadingScreen />;
      default:
        return (
          <ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
            <GlobalProvider>
              <ToastManager
                animationStyle="upInUpOut"
                textStyle={{fontSize: 14}}
                height={50}
                position="top"
                positionValue={24}
                showCloseIcon={false}
                showProgressBar={false}
                duration={2500}
                style={{zIndex: 100}}
              />
              <PaperProvider>
                <NavigationContainer>
                  {/* <StatusBar translucent hidden={true} /> */}
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment
        @ts-ignore */}

                  <Tab.Navigator
                    screenOptions={({route}) => ({
                      tabBarIcon: ({color, size}) => {
                        let iconName = 'icon-name' as string;
                        if (route.name === 'Dashboard') {
                          iconName = 'home';
                          return (
                            <Icon name="dashboard" color={color} size={24} />
                          );
                        } else if (route.name === 'Analytics') {
                          iconName = 'bar-chart';
                          return (
                            <Icon name="equalizer" color={color} size={24} />
                          );
                        }
                        return <Text>haha</Text>;
                      },
                      tabBarActiveTintColor: isDarkMode ? 'white' : 'black',
                      tabBarInactiveTintColor: 'gray',
                      tabBarStyle: {
                        backgroundColor: isDarkMode ? '#333' : '#fff',
                        borderColor: 'transparent',
                      },
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
  };
  return display();
}

const ShortLoadingScreen = () => {
  return (
    <ThemedView
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}></ThemedView>
  );
};

export default App;
