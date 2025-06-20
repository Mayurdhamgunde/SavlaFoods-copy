//Mayur
import {
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ActivityIndicator,
  PixelRatio,
  KeyboardEvent,
  BackHandler,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {RootStackParamList, MainStackParamList} from '../type/type';
import axios from 'axios';
import {API_ENDPOINTS, DEFAULT_HEADERS} from '../config/api.config';
import {useCustomer} from '../contexts/DisplayNameContext';
import {getSecureItem, setSecureItem} from '../utils/secureStorage';

// Get screen dimensions
const {height: SCREEN_HEIGHT, width: SCREEN_WIDTH} = Dimensions.get('window');

// Base dimension for scaling (iPhone 8/SE size as reference)
const baseWidth = 375;
const baseHeight = 667;

// Scale factor based on screen width
const widthScale = SCREEN_WIDTH / baseWidth;
const heightScale = SCREEN_HEIGHT / baseHeight;

// Responsive scaling functions
const scale = (size: number) => Math.round(size * widthScale);
const verticalScale = (size: number) => Math.round(size * heightScale);

// For padding, margins, etc. - less aggressive scaling
const moderateScale = (size: number, factor = 0.5) =>
  Math.round(size + (scale(size) - size) * factor);

// For fonts with pixel density adjustment
const normalize = (size: number) => {
  const newSize = scale(size);
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    // Android handles fonts differently
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

type OtpVerificationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'HomeScreen'
>;
type OtpVerificationScreenRouteProp = RouteProp<
  RootStackParamList,
  'OtpVerificationScreen'
>;

const OtpVerificationScreen: React.FC<{
  route: OtpVerificationScreenRouteProp;
}> = ({route}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dimensions, setDimensions] = useState({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  });
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const usernameInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const navigation = useNavigation<OtpVerificationScreenNavigationProp>();
  const {setCustomerID} = useCustomer();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert(
          'Exit App',
          'Do you want to exit the app?',
          [
            {text: 'Cancel', style: 'cancel', onPress: () => {}},
            {
              text: 'Exit',
              style: 'destructive',
              onPress: () => BackHandler.exitApp(),
            },
          ],
          {cancelable: true},
        );
        return true; // Prevent default back action
      };

      // Add back button handler
      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      // Cleanup function
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  // Handle screen rotation or dimension changes
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions({
        width: window.width,
        height: window.height,
      });
    });
    return () => subscription.remove();
  }, []);

  // Add keyboard listeners
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
      },
    );
    const keyboardWillHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );

    return () => {
      keyboardWillShowListener.remove();
      keyboardWillHideListener.remove();
    };
  }, []);

  // Scroll to focused input when keyboard shows
  const handleFocus = (inputRef: React.RefObject<TextInput>) => {
    setTimeout(() => {
      if (scrollViewRef.current && inputRef.current) {
        inputRef.current.measureLayout(
          // @ts-ignore - known type issue but works at runtime
          scrollViewRef.current,
          (_left: number, top: number) => {
            // Always scroll a bit for password field to make it more visible
            if (inputRef === passwordInputRef) {
              // Add a fixed small scroll for the password field
              scrollViewRef.current?.scrollTo({
                y: top - 320, // This will move it up slightly
                animated: true,
              });
            } else {
              // For other inputs (username), only scroll if actually hidden
              const availableHeight = SCREEN_HEIGHT - keyboardHeight;
              const scrollAmount = Math.max(0, top + 60 - availableHeight);
              if (scrollAmount > 0) {
                scrollViewRef.current?.scrollTo({
                  y: scrollAmount,
                  animated: true,
                });
              }
            }
          },
          () => {},
        );
      }
    }, 100);
  };

  const loginWithUsernameAndPassword = async () => {
    if (!username || !password) {
      Alert.alert('Please enter both username and password');
      return;
    }

    // Check network connectivity first
    try {
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        Alert.alert(
          'No Internet Connection',
          'Please check your network connection and try again.',
        );
        return;
      }

      setIsLoading(true);

      console.log('🟢 Making login request to:', API_ENDPOINTS.LOGIN);
      console.log('🔹 With data:', {
        sf_userName: username,
        sf_userPwd: password,
      });

      const response = await axios({
        method: 'post',
        url: API_ENDPOINTS.LOGIN,
        data: {
          sf_userName: username,
          sf_userPwd: password,
        },
        headers: DEFAULT_HEADERS,
      });

      console.log('✅ Full response:', response);
      console.log('📩 Response headers:', response.headers);
      console.log('📌 Response status:', response.status);
      console.log('📤 Response received:', response.data);

      if (response.data?.output) {
        const {token, CustomerID, DisplayName, CustomerGroupID} =
          response.data.output;

        // Update context
        setCustomerID(CustomerID.toString()); // Update context

        await setSecureItem('customerID', CustomerID.toString());

        console.log('🟢 Received Token:', token);
        if (!token) {
          console.error('❌ Token is undefined or empty!');
          Alert.alert('Error', 'Authentication failed. No token received.');
          return;
        }

        // Store Token in Keychain
        await Promise.all([
          setSecureItem('userToken', token),
          setSecureItem('customerID', CustomerID.toString()),
          setSecureItem('Disp_name', DisplayName),
          setSecureItem('FK_CUST_GROUP_ID', CustomerGroupID.toString()),
        ]);

        // Also check that Keychain is working properly
        const storedID = await getSecureItem('customerID');
        console.log('Stored customerID in secure storage:', storedID);
        // Verify Token Storage
        const storedToken = await getSecureItem('userToken');
        console.log('📌 Token Stored in secure storage:', storedToken);

        // Set Authorization Header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Navigate to Home
        navigation.navigate('Main', {
          screen: 'HomeScreen',
          params: {
            initialLogin: true,
            customerID: CustomerID.toString(),
          },
        });
      } else {
        console.error('❌ Invalid response format:', response.data);
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error: any) {
      // Network related errors
      if (
        error.message &&
        (error.message.includes('Network Error') ||
          error.message.includes('timeout') ||
          error.message.includes('connection') ||
          error.code === 'ECONNABORTED' ||
          !error.response)
      ) {
        Alert.alert(
          'No Internet Connection',
          'Please check your network connection and try again.',
        );
      } else {
        // Authentication errors
        Alert.alert('Invalid username or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {/* Fixed Background Image */}
      <View style={styles.fixedBackground}>
        <Image
          source={require('../assets/wish/bgimg.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      </View>

      {/* Scrollable Content */}
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollViewContent,
            {
              paddingBottom:
                keyboardHeight > 0 ? keyboardHeight / 2 : moderateScale(50),
            },
          ]}
          bounces={true}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={true}
          keyboardDismissMode="none">
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.contentWrapper}>
              <View style={styles.header}>
                <Image
                  source={require('../assets/SavlaLogo.jpg')}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>LOGIN</Text>
                <Text style={styles.subtitle}>
                  Login in with your credentials
                </Text>
              </View>

              <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="person"
                    size={scale(24)}
                    style={styles.icon}
                  />
                  <TextInput
                    ref={usernameInputRef}
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    editable={!isLoading}
                    onFocus={() => handleFocus(usernameInputRef)}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons
                    name="lock"
                    size={scale(24)}
                    style={styles.icon}
                  />
                  <TextInput
                    ref={passwordInputRef}
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    editable={!isLoading}
                    onFocus={() => handleFocus(passwordInputRef)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeIcon}>
                    <MaterialIcons
                      name={showPassword ? 'visibility-off' : 'visibility'}
                      size={scale(24)}
                      style={{color: '#999'}}
                    />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonLoading]}
                  onPress={() => {
                    Keyboard.dismiss();
                    loginWithUsernameAndPassword();
                  }}
                  disabled={isLoading}>
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.buttonText}>Login</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fixedBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  backgroundImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    position: 'absolute',
  },
  content: {
    flex: 1,
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(50),
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingTop: moderateScale(10),
    marginTop: verticalScale(10),
  },
  header: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: moderateScale(20),
    marginTop: verticalScale(20),
  },
  logo: {
    width: scale(100),
    height: scale(100),
    marginTop: verticalScale(20),
    alignSelf: 'center',
  },
  title: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: '#473c3c',
    marginTop: verticalScale(20),
    textAlign: 'center',
  },
  subtitle: {
    fontSize: normalize(18),
    color: '#6b6464',
    marginTop: verticalScale(8),
    textAlign: 'center',
  },
  formContainer: {
    width: '90%',
    padding: moderateScale(20),
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  inputContainer: {
    width: '100%',
    height: verticalScale(45),
    borderRadius: moderateScale(30),
    backgroundColor: '#fff',
    marginBottom: verticalScale(15),
    paddingHorizontal: moderateScale(20),
    shadowColor: '#fb932c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: normalize(16),
    color: '#333',
    marginLeft: moderateScale(5),
  },
  icon: {
    marginRight: moderateScale(5),
    color: '#999',
  },
  eyeIcon: {
    padding: moderateScale(5),
  },
  button: {
    width: '100%',
    height: verticalScale(45),
    backgroundColor: '#F48221',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(30),
    marginTop: verticalScale(25),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 4,
  },
  buttonLoading: {
    backgroundColor: '#ffa559',
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: '600',
  },
});

export default OtpVerificationScreen;
function showErrorPopup(arg0: string) {
  throw new Error('Function not implemented.');
}
