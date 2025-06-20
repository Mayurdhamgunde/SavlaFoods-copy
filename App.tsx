import React, { useEffect } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import { migrateAllSecureKeys } from './src/utils/migrationHelper';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import OtpVerificationScreen from './src/screens/OtpVerificationScreen';
import HomeScreen from './src/screens/HomeScreen';
import PlaceOrderScreen from './src/screens/PlaceOrderScreen';
import SubCategory from './src/screens/SubCategory';
import ItemDetailScreen from './src/screens/ItemDetailScreen';
import ItemDetailsExpanded from './src/screens/ItemDetailsExpanded';
import LotReportScreen from './src/screens/LotReportScreen';
import QuantitySelectorModal from './src/components/QuantitySelectorModal';

// Contexts
import {DisplayNameProvider} from './src/contexts/DisplayNameContext';
import {CartProvider} from './src/contexts/CartContext';
import {NotificationProvider} from './src/contexts/NotificationContext';
import {CustomerProvider} from './src/contexts/DisplayNameContext';
import {NetworkProvider} from './src/contexts/NetworkContext';

// Components
import OfflineNotice from './src/components/OfflineNotice.tsx';

// Types
import {RootStackParamList, MainStackParamList} from './src/type/type';

import BottomTabNavigator from './src/components/BottomTabNavigator';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import OrderHistoryScreen from './src/screens/OrderHistoryScreen';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import OrderDetailsScreen from './src/screens/OrderDetailsScreen';
import PendingOrdersScreen from './src/screens/PendingOrdersScreen';
import EditOrderScreen from './src/components/EditOrderScreen.tsx';
import GrnDetailsScreen from './src/screens/GRNDetailsScreen.tsx';
import OutwardDetailsScreen from './src/screens/OutwardDetailsScreen.tsx';
// import ZeroStockReportScreen from './src/screens/stocks/ZeroStockReportScreen.tsx';

const RootStack = createStackNavigator<RootStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

const MainStackNavigator: React.FC = () => {
  return (
    <CustomerProvider>
      <MainStack.Navigator>
        <MainStack.Screen
          name="BottomTabNavigator"
          component={BottomTabNavigator}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="PlaceOrderScreen"
          component={PlaceOrderScreen}
          options={({navigation}) => ({
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{marginLeft: 15}}>
                <MaterialIcons name="arrow-back" size={24} color="#663399" />
              </TouchableOpacity>
            ),
            headerTitle: '',
            animation: 'slide_from_right',
            headerShown: false,
          })}
        />

        <MainStack.Screen
          name="OrderConfirmationScreen"
          component={OrderConfirmationScreen}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="GrnDetailsScreen"
          component={GrnDetailsScreen}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="OutwardDetailsScreen"
          component={OutwardDetailsScreen}
          options={{headerShown: false}}
        />

        {/* <MainStack.Screen
          name="ZeroStockReportScreen"
          component={ZeroStockReportScreen}
          options={{headerShown: false}}
        /> */}

        <MainStack.Screen
          name="SubCategory"
          component={SubCategory}
          options={{headerShown: false}}
          // options={({route}) => ({
          //   title: route.params.category,
          // })}
        />
        <MainStack.Screen
          name="ItemDetailScreen"
          component={ItemDetailScreen}
          options={{headerShown: false}}
          // options={({route}) => ({
          //   title: route.params.subcategoryName,
          // })}
        />
        <MainStack.Screen
          name="OrderDetailsScreen"
          component={OrderDetailsScreen}
          options={{headerShown: false}}
          // options={({route}) => ({
          //   title: route.params.subcategoryName,
          // })}
        />
        <MainStack.Screen
          name="ItemDetailsExpanded"
          component={ItemDetailsExpanded}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="LotReportScreen"
          component={LotReportScreen}
          options={{headerShown: false}}
        />
        {/* <MainStack.Screen
          name="ReportSummaryScreen"
          component={ReportSummaryScreen}
          options={{title: 'Lot Report'}}
        /> */}
        <MainStack.Screen
          name="PendingOrdersScreen"
          component={PendingOrdersScreen}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="EditOrderScreen"
          component={EditOrderScreen}
          options={{headerShown: false}}
        />

        <MainStack.Screen
          name="OrderHistoryScreen"
          component={OrderHistoryScreen}
          options={{headerShown: false}}
        />
        <RootStack.Screen
          name="HomeScreen"
          component={MainStackNavigator}
          options={{headerShown: false}}
        />
        <MainStack.Screen
          name="QuantitySelectorModal"
          component={QuantitySelectorModal}
          options={{
            presentation: 'modal',
            title: 'Select Quantity',
          }}
        />
      </MainStack.Navigator>
    </CustomerProvider>
  );
};

function App(): JSX.Element {
  // Run migration when app starts
  useEffect(() => {
    const migrateData = async () => {
      try {
        const results = await migrateAllSecureKeys();
        console.log('Migration results:', results);
      } catch (error) {
        console.error('Error during migration:', error);
      }
    };
    
    migrateData();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
          <DisplayNameProvider>
            <NotificationProvider>
              <CartProvider>
                <CustomerProvider>
                  <NetworkProvider>
                    <NavigationContainer>
                      <RootStack.Navigator
                        initialRouteName="SplashScreen"
                        screenOptions={{
                          headerShown: false,
                          gestureEnabled: false,
                        }}>
                        <RootStack.Screen
                          name="SplashScreen"
                          component={SplashScreen}
                        />
                        <RootStack.Screen
                          name="OtpVerificationScreen"
                          component={OtpVerificationScreen}
                          options={{headerShown: false, gestureEnabled: false}}
                        />
                        <RootStack.Screen
                          name="Main"
                          component={MainStackNavigator}
                        />
                        {/* <RootStack.Screen
                          name="HomeScreen"
                          component={MainStackNavigator}
                          options={{headerShown: false}}
                        /> */}
                      </RootStack.Navigator>
                    </NavigationContainer>
                    <OfflineNotice />
                  </NetworkProvider>
                </CustomerProvider>
              </CartProvider>
            </NotificationProvider>
          </DisplayNameProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default App;
