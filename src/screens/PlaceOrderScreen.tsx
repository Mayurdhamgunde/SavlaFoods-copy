import Ionicons from 'react-native-vector-icons/Ionicons';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import axios from 'axios';
import React, {useEffect, useState, useCallback, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {MainStackParamList} from '../../src/type/type';
import {useCart} from '../contexts/CartContext';
import {API_ENDPOINTS} from '../config/api.config';
import Icon from 'react-native-vector-icons/Ionicons';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

interface DetailRowProps {
  label: string;
  value: string | number; // Adjust this type if value can be something else.
  highlighted?: boolean; // Optional
}

interface OrderItem {
  ITEM_ID: number;
  ITEM_NAME: string;
  LOT_NO: string;
  VAKAL_NO: string;
  ITEM_MARKS: string;
  UNIT_NAME: string;
  AVAILABLE_QTY: number;
  NET_QUANTITY: number;
  ORDERED_QUANTITY: number;
  BatchNo?: string | null;
}

interface GroupedItems {
  [key: string]: OrderItem[];
}

type PlaceOrderScreenRouteProp = RouteProp<
  MainStackParamList,
  'PlaceOrderScreen'
>;
type PlaceOrderScreenNavigationProp = StackNavigationProp<
  MainStackParamList,
  'PlaceOrderScreen'
>;

interface PlaceOrderScreenProps {
  route: PlaceOrderScreenRouteProp;
  navigation: PlaceOrderScreenNavigationProp;
}

const PlaceOrderScreen: React.FC<PlaceOrderScreenProps> = ({
  route,
  navigation,
}) => {
  const {selectedItems, customerID, shouldRefresh} = route.params || {
    selectedItems: [],
  };
  const {cartItems, clearCart, removeCartItem} = useCart();
  const [groupedOrderItems, setGroupedOrderItems] = useState<GroupedItems>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<OrderItem | null>(null);

  // New state for custom error alert
  const [errorAlertVisible, setErrorAlertVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorAnimation] = useState(new Animated.Value(0));

  // Toast state similar to OrderDetailsScreen
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastOffset = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (!isInitialized && (selectedItems.length > 0 || cartItems.length > 0)) {
      const combinedItems = [
        ...(Array.isArray(selectedItems) ? selectedItems : []),
        ...cartItems.map(cartItem => ({
          LOT_NO: cartItem.lot_no || '',
          ITEM_ID: cartItem.item_id,
          ITEM_NAME: cartItem.item_name,
          VAKAL_NO: cartItem.vakal_no || '',
          ITEM_MARKS: cartItem.item_marks || '',
          UNIT_NAME: cartItem.unit_name || '',
          AVAILABLE_QTY: cartItem.available_qty,
          NET_QUANTITY: Math.max(0, cartItem.available_qty - cartItem.quantity),
          UPDATED_QTY: [cartItem.quantity],
          ORDERED_QUANTITY: cartItem.quantity,
        })),
      ] as OrderItem[];

      const grouped = combinedItems.reduce((acc, item) => {
        if (!acc[item.ITEM_NAME]) {
          acc[item.ITEM_NAME] = [];
        }
        acc[item.ITEM_NAME].push(item);
        return acc;
      }, {} as GroupedItems);

      setGroupedOrderItems(grouped);
      setIsInitialized(true);
    }
  }, [selectedItems, cartItems, isInitialized]);

  const handleQuantityChange = useCallback(
    (
      itemName: string,
      lotNo: string,
      change: 'increment' | 'decrement' | string,
    ) => {
      setGroupedOrderItems(prevGroups => {
        const newGroups = {...prevGroups};
        const group = [...(newGroups[itemName] || [])];
        const itemIndex = group.findIndex(item => item.LOT_NO === lotNo);

        if (itemIndex !== -1) {
          const item = group[itemIndex];
          let newQuantity: number;

          if (change === 'increment') {
            newQuantity = item.ORDERED_QUANTITY + 1;
          } else if (change === 'decrement') {
            newQuantity = Math.max(0, item.ORDERED_QUANTITY - 1);
          } else {
            newQuantity = parseFloat(change) || 0;
          }

          newQuantity = Math.min(newQuantity, item.AVAILABLE_QTY);

          group[itemIndex] = {
            ...item,
            ORDERED_QUANTITY: newQuantity,
            NET_QUANTITY: Math.max(0, item.AVAILABLE_QTY - newQuantity),
          };
          newGroups[itemName] = group;
        }

        return newGroups;
      });
    },
    [],
  );

  const handleRemoveItem = useCallback(
    (itemToRemove: OrderItem) => {
      setGroupedOrderItems(prevGroups => {
        const newGroups = {...prevGroups};
        const group = newGroups[itemToRemove.ITEM_NAME];
        if (group) {
          const filteredGroup = group.filter(
            item => item.LOT_NO !== itemToRemove.LOT_NO,
          );
          if (filteredGroup.length === 0) {
            delete newGroups[itemToRemove.ITEM_NAME];
          } else {
            newGroups[itemToRemove.ITEM_NAME] = filteredGroup;
          }
        }
        return newGroups;
      });

      const cartItemToRemove = cartItems.find(
        cartItem => cartItem.lot_no === itemToRemove.LOT_NO,
      );

      if (cartItemToRemove) {
        removeCartItem(cartItemToRemove);
      }
    },
    [cartItems, removeCartItem],
  );

  const showCustomErrorAlert = (message: string) => {
    setErrorMessage(message);
    setErrorAlertVisible(true);

    // Start animation
    Animated.sequence([
      Animated.timing(errorAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(2500),
      Animated.timing(errorAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setErrorAlertVisible(false);
    });
  };

  // New toast method similar to OrderDetailsScreen
  const showToast = (
    message: string,
    type: 'success' | 'error' = 'success',
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    // Animate toast in
    Animated.parallel([
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(toastOffset, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Hide toast after 2.5 seconds
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(toastOffset, {
          toValue: 300,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setToastVisible(false);
      });
    }, 2500);
  };

  const handleConfirmOrder = async () => {
    setIsLoading(true);
    try {
      const allItems = Object.values(groupedOrderItems).flat();

      if (allItems.length === 0) {
        // Replace Alert.alert with custom error alert
        showCustomErrorAlert('Please add items to your order');
        setIsLoading(false);
        return;
      }

      const invalidItems = allItems.filter(
        item => !item.ORDERED_QUANTITY || item.ORDERED_QUANTITY <= 0,
      );
      if (invalidItems.length > 0) {
        showCustomErrorAlert('Please specify valid quantities for all items');
        setIsLoading(false);
        return;
      }

      if (clearCart) {
        clearCart();
      }

      // Navigate to confirmation screen with order items
      navigation.navigate('OrderConfirmationScreen', {
        orderItems: allItems,
        customerID: route.params.customerID,
        userSupervisorId: route.params.userSupervisorId,
        userMukadamId: route.params.userMukadamId,
        stockLotLocationId: route.params.stockLotLocationId,
        unitId: route.params.unitId || 3,
        finYearId: route.params.finYearId || 15,
        unitName: '',
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || 'Unknown error';
      showCustomErrorAlert(`Failed to process order: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const renderOrderItem = (item: OrderItem, groupName: string) => (
    <View key={item.LOT_NO} style={styles.orderItemContainer}>
      <View style={styles.statusIndicator} />
      <View style={styles.orderItemHeader}>
        <View style={styles.headerContent}>
          <Text style={styles.lotNumber}>
            Lot No: <Text style={styles.highlightedLotNo}>{item.LOT_NO}</Text>
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => {
            setItemToRemove(item);
            setModalVisible(true);
          }}>
          <Ionicons name="trash-outline" size={20} style={{color: '#FF6B6B'}} />
        </TouchableOpacity>
      </View>
      <View style={styles.orderItemDetails}>
        <View style={styles.detailColumn}>
          <DetailRow label="Vakal No" value={item.VAKAL_NO} />
          <DetailRow label="Item Marks" value={item.ITEM_MARKS} />
          <DetailRow
            label="Available Quantity"
            value={`${item.AVAILABLE_QTY}`}
          />
        </View>
        <View style={styles.detailColumn}>
          <DetailRow label="Unit Name" value={item.UNIT_NAME} />
          <DetailRow
            label="Net Quantity"
            value={`${item.NET_QUANTITY}`}
            highlighted
          />
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ordered Quantity</Text>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  handleQuantityChange(groupName, item.LOT_NO, 'decrement')
                }>
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.detailValue,
                  styles.orderhighlightedValue,
                  styles.input,
                  styles.quantityInput,
                ]}
                value={String(item.ORDERED_QUANTITY)}
                onChangeText={value =>
                  handleQuantityChange(groupName, item.LOT_NO, value)
                }
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  item.ORDERED_QUANTITY >= item.AVAILABLE_QTY &&
                    styles.disabledQuantityButton,
                ]}
                onPress={() =>
                  handleQuantityChange(groupName, item.LOT_NO, 'increment')
                }
                disabled={item.ORDERED_QUANTITY >= item.AVAILABLE_QTY}>
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const DetailRow: React.FC<DetailRowProps> = ({
    label,
    value,
    highlighted = false,
  }) => (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[styles.detailValue, highlighted && styles.highlightedValue]}>
        {value}
      </Text>
    </View>
  );

  const renderGroupedItems = () => {
    return Object.entries(groupedOrderItems).map(([itemName, items]) => (
      <View key={itemName} style={styles.groupContainer}>
        <View style={styles.groupHeaderContainer}>
          <Text style={styles.groupHeader}>{itemName}</Text>
        </View>
        {items.map(item => renderOrderItem(item, itemName))}
      </View>
    ));
  };

  // Render custom error alert
  const renderErrorAlert = () => {
    const translateY = errorAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
    });

    return (
      <Animated.View
        style={[styles.errorAlertContainer, {transform: [{translateY}]}]}
        pointerEvents="none">
        <View style={styles.errorAlertContent}>
          <View style={styles.errorIconContainer}>
            <FontAwesome name="exclamation-circle" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.errorAlertText}>{errorMessage}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Custom Error Alert */}
      {errorAlertVisible && renderErrorAlert()}

      {/* Toast Notification */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.toast,
            {
              opacity: toastOpacity,
              transform: [{translateX: toastOffset}],
            },
            toastType === 'error' ? styles.errorToast : styles.successToast,
          ]}>
          <View style={styles.toastContent}>
            <MaterialIcons
              name={toastType === 'success' ? 'check-circle' : 'error'}
              size={24}
              color={toastType === 'success' ? '#22c55e' : '#ef4444'}
            />
            <Text style={styles.toastMessage}>{toastMessage}</Text>
          </View>
        </Animated.View>
      )}

      {/* Custom Modal for Item Removal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={32} color="#0284c7" />
              <Text style={styles.modalTitle}>Remove Item</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Are you sure you want to remove this item?
              </Text>
              {itemToRemove && (
                <View style={styles.itemPreview}>
                  <Text style={styles.itemPreviewText}>
                    {itemToRemove.ITEM_NAME} - Lot: {itemToRemove.LOT_NO}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={() => {
                  if (itemToRemove) {
                    handleRemoveItem(itemToRemove);
                    showToast('Item removed successfully !', 'error');
                  }
                  setModalVisible(false);
                }}>
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" />
                <Text style={styles.modalConfirmButtonText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <MaterialIcons
              name="arrow-back"
              size={24}
              style={{color: '#0284c7'}}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Place Your Order</Text>
          <View style={styles.headerSpacer}></View>
        </View>

        {/* Render empty cart view if there are no items */}
        {Object.keys(groupedOrderItems).length === 0 ? (
          <View style={styles.emptyCartContainer}>
            <Text style={styles.emptyCartEmoji}>🛒</Text>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.homeButton}
              onPress={() => navigation.navigate('HomeScreen' as never)}>
              <Text style={styles.homeButtonText}>Fill Cart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <ScrollView style={styles.scrollContainer}>
              {renderGroupedItems()}
              <View style={styles.scrollPadding} />
            </ScrollView>
            <View style={styles.footerContainer}>
              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isLoading && styles.disabledButton,
                ]}
                onPress={handleConfirmOrder}
                disabled={isLoading}>
                {isLoading ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <>
                    <Text style={styles.confirmButtonText}>Place Order</Text>
                    <Ionicons
                      name="arrow-forward"
                      size={20}
                      style={{color: '#FFFFFF', alignItems: 'center'}}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFAFA',
    elevation: 2,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  scrollPadding: {
    height: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F7',
    width: '100%',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F7FF',
  },
  headerSpacer: {
    width: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0284c7',
  },
  groupContainer: {
    marginBottom: 20,
  },
  groupHeaderContainer: {
    backgroundColor: '#e0f2fe',
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    marginBottom: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  groupHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    padding: 12,
  },
  orderItemContainer: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  statusIndicator: {
    height: 2,
    borderRadius: 2,
    backgroundColor: '#0284c7',
    marginBottom: 12,
  },
  orderItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  lotNumber: {
    fontSize: 14,
    color: '#666',
  },
  highlightedLotNo: {
    color: '#F48221',
    fontWeight: '700',
  },
  deleteButton: {
    marginLeft: 12,
  },
  orderItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailColumn: {
    flex: 1,
  },
  detailRow: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#777',
  },
  footer: {
    marginTop: 16,
    marginBottom: 32,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 50,
    marginBottom: -20,
  },
  disabledButton: {
    backgroundColor: '#BDBDBD',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    marginBottom: 3,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '50%',
  },
  quantityButton: {
    width: 30,
    height: 30,
    backgroundColor: '#0284c7',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  quantityButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityInput: {
    width: 50,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 4,
    paddingHorizontal: 8,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    paddingVertical: 5,
  },
  highlightedValue: {
    color: '#ff5733',
  },
  orderhighlightedValue: {
    color: '#0284c7',
  },
  footerContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: '#eaeaea',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    backgroundColor: '#F8F7FF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EDE9FE',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0284c7',
    marginLeft: 10,
  },
  modalBody: {
    padding: 20,
  },
  modalMessage: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
  },
  itemPreview: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0284c7',
  },
  itemPreviewText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  modalCancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 12,
  },
  modalCancelButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '500',
  },
  modalConfirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#dc3545',
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
  // Custom error alert styles
  errorAlertContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    right: 20,
    zIndex: 9999,
    color: 'black',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  errorAlertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF5252',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    minHeight: 60,
    marginTop: 10,
  },
  errorIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  errorAlertText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
  },
  emptyCartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: -25,
  },
  emptyCartText: {
    fontSize: 20,
    marginBottom: 20,
    color: '#333',
  },
  homeButton: {
    // backgroundColor: '#663399',
    backgroundColor: '#0284c7',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyCartEmoji: {
    fontSize: 40,
    marginBottom: 10,
  },
  disabledQuantityButton: {
    backgroundColor: '#C8C8C8',
    opacity: 0.7,
  },
  // Toast styles - similar to OrderDetailsScreen
  toast: {
    position: 'absolute',
    top: 82,
    right: 5,
    width: '74%',
    maxWidth: 310,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4.65,
    elevation: 7,
    zIndex: 1000,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toastMessage: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 10,
  },
  errorToast: {
    borderLeftColor: '#ef4444',
  },
  successToast: {
    borderLeftColor: '#22c55e',
  },
});

export default PlaceOrderScreen;
