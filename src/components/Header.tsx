import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  BackHandler,
} from 'react-native';
// Import Icons from react-native-vector-icons instead of Expo
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileMenu from '../screens/ProfileMenu';
import {useNavigation, useRoute} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

const {width} = Dimensions.get('window');

type HeaderProps = {
  displayName: string | null;
  cartItemCount: number;
  onAccountSwitch?: () => void;
  onCartPress?: () => void;
  appVersion?: string;
};

const Header: React.FC<HeaderProps> = ({
  displayName,
  cartItemCount,

  onAccountSwitch,
  onCartPress,
  appVersion = 'v1.1',
}) => {
  const navigation = useNavigation<any>();
  const route = useRoute();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleLogoPress = () => {
    // OrdersHome is the actual screen name in OrdersStackNavigator
    // Orders is the tab name
    if (route.name === 'Orders' || route.name === 'OrdersHome') {
      // Navigate to HomeScreen when on Orders screens
      navigation.navigate('Home');
    }
  };

  // Determine if we should show back button
  // Don't show back button on Home screens or Orders screens
  const showBackButton =
    route.name !== 'HomeScreen' &&
    route.name !== 'Home' &&
    route.name !== 'Orders' &&
    route.name !== 'OrdersHome';

  // Only show clickable logo on Orders screens
  const isOnOrdersScreen =
    route.name === 'Orders' || route.name === 'OrdersHome';

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {showBackButton ? (
          <>
            <TouchableOpacity
              onPress={handleBackPress}
              style={styles.backButton}>
              <Icon name="keyboard-arrow-left" size={25} color="#007BFA" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              {isOnOrdersScreen ? (
                <TouchableOpacity onPress={handleLogoPress}>
                  <Image
                    source={require('../assets/SavlaLogo.jpg')}
                    style={styles.logo}
                  />
                </TouchableOpacity>
              ) : (
                <Image
                  source={require('../assets/SavlaLogo.jpg')}
                  style={styles.logo}
                />
              )}
              <Text style={styles.versionText}>{appVersion}</Text>
            </View>
          </>
        ) : (
          <View style={styles.logoContainer}>
            {isOnOrdersScreen ? (
              <TouchableOpacity onPress={handleLogoPress}>
                <Image
                  source={require('../assets/SavlaLogo.jpg')}
                  style={styles.logo}
                />
              </TouchableOpacity>
            ) : (
              <Image
                source={require('../assets/SavlaLogo.jpg')}
                style={styles.logo}
              />
            )}
            <Text style={styles.versionText}>{appVersion}</Text>
          </View>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.headerTitle}>{displayName || 'Loading...'}</Text>
      </View>

      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onCartPress} style={styles.iconButton}>
          <View style={styles.iconContainer}>
            <Icon
              name="shopping-cart"
              size={25}
              color="#63A1D8"
              style={{fontFamily: 'MaterialIcons'}}
            />
            {cartItemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItemCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={onAccountSwitch}
          style={styles.iconButton}
        >
          <Icon name="person" size={25} color="#007BFA" />
        </TouchableOpacity> */}

        <ProfileMenu
          displayName={displayName}
          onAccountSwitch={onAccountSwitch}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    height: 65,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: 95,
    marginLeft: 0,
  },
  backButton: {
    position: 'relative',
    left: 0,
    marginRight: 4,
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerSection: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 90,
    gap: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 0,
  },
  logo: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  versionText: {
    fontSize: 10,
    color: '#007BFA',
    fontWeight: 'bold',
    marginLeft: 6,
    marginBottom: 0,
  },
  headerTitle: {
    fontSize: 16,
    // color: '#007BFA',
    color: '#63A1D8',
    // fontWeight: 'bold'
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: width - 200,
  },
  iconButton: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 25,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    right: -4,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 25,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default Header;
