// // import React from 'react';
// // import {
// //   SafeAreaView,
// //   ScrollView,
// //   StyleSheet,
// //   Text,
// //   View,
// //   TouchableOpacity,
// // } from 'react-native';
// // import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// // import {useNavigation} from '@react-navigation/native';

// // const OrderDetailsScreen = ({route}) => {
// //   const navigation = useNavigation();
// //   const {order} = route.params;

// //   // Format date for display
// //   const formatDate = dateString => {
// //     try {
// //       const date = new Date(dateString);
// //       return date.toLocaleDateString('en-US', {
// //         year: 'numeric',
// //         month: 'long',
// //         day: 'numeric',
// //       });
// //     } catch {
// //       return dateString;
// //     }
// //   };

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       <View style={styles.header}>
// //         <TouchableOpacity
// //           style={styles.backButton}
// //           onPress={() => navigation.goBack()}>
// //           <MaterialIcons name="arrow-back" size={24} color="#111827" />
// //         </TouchableOpacity>
// //         <Text style={styles.headerTitle}>Order Details Screen</Text>
// //         <View style={styles.placeholder} />
// //       </View>

// //       <ScrollView style={styles.scrollView}>
// //         <View style={styles.card}>
// //           <View style={styles.orderHeader}>
// //             <Text style={styles.orderNo}>Order No : {order.orderNo}</Text>
// //           </View>

// //           <View style={styles.infoGrid}>
// //             <View style={styles.infoColumn}>
// //               <Text style={styles.infoLabel}>Order Date</Text>
// //               <Text style={styles.infoValue}>
// //                 {formatDate(order.orderDate)}
// //               </Text>
// //             </View>
// //             <View style={styles.infoColumn}>
// //               <Text style={styles.infoLabel}>Delivery Date</Text>
// //               <Text style={styles.infoValue}>
// //                 {formatDate(order.deliveryDate)}
// //               </Text>
// //             </View>
// //           </View>

// //           <View style={styles.singleInfo}>
// //             <Text style={styles.infoLabel}>Transporter</Text>
// //             <Text style={styles.infoValue}>
// //               {order.transporterName || 'Not assigned'}
// //             </Text>
// //           </View>

// //           <View style={styles.deliveryLocation}>
// //             <Text style={styles.infoLabel}>Delivery Location</Text>
// //             <Text style={styles.infoValue}>
// //               {order.deliveryAddress || 'N/A'}
// //             </Text>
// //           </View>
// //         </View>

// //         {order.items &&
// //           order.items.map((item, index) => (
// //             <View
// //               key={`item-${item.detailId || index}`}
// //               style={styles.itemCard}>
// //               <View style={styles.itemHeader}>
// //                 <Text style={styles.itemName}>{item.itemName}</Text>
// //                 <View style={styles.statusBadge}>
// //                   <Text style={styles.statusText}>{item.status}</Text>
// //                 </View>
// //               </View>

// //               <Text style={styles.lotNo}>Lot No: {item.lotNo || 'N/A'}</Text>

// //               <View style={styles.itemDetailsGrid}>
// //                 <View style={styles.itemDetail}>
// //                   <Text style={styles.detailLabel}>Item Marks:</Text>
// //                   <Text style={styles.detailValue}>
// //                     {item.itemMarks || 'N/A'}
// //                   </Text>
// //                 </View>
// //               </View>
// //               <View style={styles.itemDetail}>
// //                 <Text style={styles.detailLabel}>Vakal No:</Text>
// //                 <Text style={styles.detailValue}>{item.vakalNo || 'N/A'}</Text>
// //               </View>

// //               <View style={styles.quantityContainer}>
// //                 <View style={styles.quantityColumn}>
// //                   <Text style={styles.quantityLabel}>Ordered</Text>
// //                   <Text style={styles.quantityValue}>{item.requestedQty}</Text>
// //                 </View>
// //                 <View style={styles.quantityColumn}>
// //                   <Text style={styles.quantityLabel}>Available</Text>
// //                   <Text style={styles.quantityValue}>{item.availableQty}</Text>
// //                 </View>
// //               </View>

// //               <View style={styles.itemDetailsGrid}>
// //                 <View style={styles.itemDetail}>
// //                   <Text style={styles.detailLabel}>Unit Name:</Text>
// //                   <Text style={styles.detailValue}>
// //                     {item.unitName || 'N/A'}
// //                   </Text>
// //                 </View>
// //                 <View style={styles.itemDetail}>
// //                   <Text style={styles.detailLabel}>Net Quantity:</Text>
// //                   <Text style={styles.detailValue}>
// //                     {item.netQuantity || 'N/A'}
// //                   </Text>
// //                 </View>
// //               </View>
// //             </View>
// //           ))}
// //       </ScrollView>
// //     </SafeAreaView>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f3f4f6',
// //   },
// //   header: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     justifyContent: 'space-between',
// //     paddingHorizontal: 16,
// //     paddingVertical: 16,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#e5e7eb',
// //   },
// //   backButton: {
// //     padding: 8,
// //   },
// //   headerTitle: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#7c3aed',
// //   },
// //   placeholder: {
// //     width: 40,
// //   },
// //   scrollView: {
// //     flex: 1,
// //   },
// //   card: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 16,
// //     margin: 16,
// //     padding: 16,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: {width: 0, height: 1},
// //     shadowOpacity: 0.1,
// //     shadowRadius: 2,
// //   },
// //   orderHeader: {
// //     marginBottom: 20,
// //     alignItems: 'center',
// //   },
// //   orderNo: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#111827',
// //   },
// //   infoGrid: {
// //     flexDirection: 'row',
// //     marginBottom: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f3f4f6',
// //     paddingBottom: 16,
// //   },
// //   infoColumn: {
// //     flex: 1,
// //   },
// //   infoLabel: {
// //     fontSize: 14,
// //     color: '#6B7280',
// //     marginBottom: 4,
// //   },
// //   infoValue: {
// //     fontSize: 16,
// //     fontWeight: '500',
// //     color: '#111827',
// //   },
// //   singleInfo: {
// //     marginBottom: 16,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#f3f4f6',
// //     paddingBottom: 16,
// //   },
// //   deliveryLocation: {
// //     padding: 12,
// //     backgroundColor: '#f9fafb',
// //     borderRadius: 8,
// //   },
// //   itemCard: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 16,
// //     marginHorizontal: 16,
// //     marginBottom: 16,
// //     padding: 16,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: {width: 0, height: 1},
// //     shadowOpacity: 0.1,
// //     shadowRadius: 2,
// //   },
// //   itemHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginBottom: 8,
// //   },
// //   itemName: {
// //     fontSize: 18,
// //     fontWeight: '600',
// //     color: '#111827',
// //     flex: 1,
// //   },
// //   statusBadge: {
// //     backgroundColor: '#e0f2fe',
// //     paddingHorizontal: 12,
// //     paddingVertical: 4,
// //     borderRadius: 12,
// //   },
// //   statusText: {
// //     fontSize: 13,
// //     fontWeight: '500',
// //     color: '#0284c7',
// //   },
// //   lotNo: {
// //     fontSize: 16,
// //     color: '#f97316',
// //     marginBottom: 16,
// //   },
// //   itemDetailsGrid: {
// //     flexDirection: 'row',
// //     marginVertical: 8,
// //   },
// //   itemDetail: {
// //     flex: 1,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   detailLabel: {
// //     fontSize: 14,
// //     color: '#6B7280',
// //     marginRight: 4,
// //   },
// //   detailValue: {
// //     fontSize: 14,
// //     fontWeight: '500',
// //     color: '#111827',
// //   },
// //   quantityContainer: {
// //     flexDirection: 'row',
// //     backgroundColor: '#f9fafb',
// //     borderRadius: 8,
// //     padding: 12,
// //     marginVertical: 12,
// //   },
// //   quantityColumn: {
// //     flex: 1,
// //     alignItems: 'center',
// //   },
// //   quantityLabel: {
// //     fontSize: 14,
// //     color: '#6B7280',
// //     marginBottom: 4,
// //   },
// //   quantityValue: {
// //     fontSize: 20,
// //     fontWeight: '600',
// //     color: '#0284c7',
// //   },
// // });

// // export default OrderDetailsScreen;

// //Mayur (Cancel Order)
// import React from 'react';
// import {
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   Alert,
//   Modal,
//   Image,
//   Animated,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {useNavigation} from '@react-navigation/native';
// import {RouteProp} from '@react-navigation/native';
// import {
//   API_BASE_URL,
//   API_ENDPOINTS,
//   DEFAULT_HEADERS,
//   getAuthHeaders,
// } from '../config/api.config';
// import axios from 'axios';

// interface OrderItem {
//   detailId?: number;
//   itemId?: number;
//   itemName: string;
//   lotNo: string | number;
//   itemMarks: string;
//   vakalNo: string;
//   requestedQty: number;
//   availableQty: number;
//   status: string;
//   unitName?: string;
//   netQuantity?: number;
// }

// interface Order {
//   orderId: number;
//   orderNo: string;
//   orderDate: string;
//   deliveryDate: string;
//   status: string;
//   transporterName: string;
//   remarks: string;
//   deliveryAddress: string;
//   customerName: string;
//   totalItems: number;
//   totalQuantity: number;
//   items: OrderItem[];
// }

// interface RouteParams {
//   order: Order;
// }

// const OrderDetailsScreen = ({
//   route,
// }: {
//   route: RouteProp<{params: RouteParams}, 'params'>;
// }) => {
//   const navigation = useNavigation();
//   const {order} = route.params;
//   const [modalVisible, setModalVisible] = React.useState(false);
//   const [cancelRemark, setCancelRemark] = React.useState('');
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [selectedItem, setSelectedItem] = React.useState<OrderItem | null>(
//     null,
//   );
//   const [toastType, setToastType] = React.useState<'success' | 'error'>(
//     'success',
//   );

//   const [toastMessage, setToastMessage] = React.useState(
//     'Order cancelled successfully!',
//   );
//   const [toastVisible, setToastVisible] = React.useState(false);
//   const toastOpacity = React.useRef(new Animated.Value(0)).current;
//   const toastOffset = React.useRef(new Animated.Value(300)).current;

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     try {
//       if (!dateString) return '';

//       // Extract date parts
//       // from string
//       let year, month, day;

//       // For YYYY-MM-DD format
//       if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
//         [year, month, day] = dateString.split('-');
//       }
//       // For ISO format with time component
//       else if (dateString.includes('T')) {
//         const [datePart] = dateString.split('T');
//         [year, month, day] = datePart.split('-');
//       }
//       // Invalid format
//       else {
//         return dateString;
//       }

//       // Convert month number to month name
//       const monthNames = [
//         'January',
//         'February',
//         'March',
//         'April',
//         'May',
//         'June',
//         'July',
//         'August',
//         'September',
//         'October',
//         'November',
//         'December',
//       ];

//       // Remove leading zeros and convert to numbers
//       const monthIndex = parseInt(month, 10) - 1;
//       const dayNum = parseInt(day, 10);

//       // Format the date manually
//       return `${monthNames[monthIndex]} ${dayNum}, ${year}`;
//     } catch {
//       return dateString;
//     }
//   };

//   const showCancelConfirmation = (item: OrderItem) => {
//     setSelectedItem(item);
//     setModalVisible(true);
//   };

//   const showToast = (
//     message: string,
//     type: 'success' | 'error' = 'success',
//   ) => {
//     setToastMessage(message);
//     setToastType(type);
//     setToastVisible(true);

//     // Animate toast in
//     Animated.parallel([
//       Animated.timing(toastOpacity, {
//         toValue: 1,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//       Animated.timing(toastOffset, {
//         toValue: 0,
//         duration: 400,
//         useNativeDriver: true,
//       }),
//     ]).start();

//     // Hide toast after 2.5 seconds
//     setTimeout(() => {
//       Animated.parallel([
//         Animated.timing(toastOpacity, {
//           toValue: 0,
//           duration: 350,
//           useNativeDriver: true,
//         }),
//         Animated.timing(toastOffset, {
//           toValue: 300,
//           duration: 350,
//           useNativeDriver: true,
//         }),
//       ]).start(() => {
//         setToastVisible(false);
//       });
//     }, 2500);
//   };

//   const handleCancelOrder = async () => {
//     if (!selectedItem || !selectedItem.detailId) {
//       showToast('Cannot cancel order: missing detail ID', 'error');
//       setModalVisible(false);
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Get the current logged in user (you might need to replace this with how you store the user)
//       const cancelledBy = 'currentUser'; // Replace with actual user info

//       // Prepare request payload
//       const payload = {
//         detailId: selectedItem.detailId,
//         cancelRemark: cancelRemark,
//         cancelledBy: cancelledBy,
//       };

//       const headers = await getAuthHeaders();

//       // Make API call to cancel order using axios
//       const response = await axios({
//         method: 'post',
//         url: API_ENDPOINTS.GET_CANCEL_ORDER,
//         data: payload,
//         headers: {...DEFAULT_HEADERS, ...headers},
//       });

//       // Axios automatically throws an error for non-2xx status codes
//       // And automatically parses JSON responses

//       if (response.data.success) {
//         // Update local state to reflect cancellation
//         if (order.items) {
//           const updatedItems = order.items.map(item => {
//             if (item.detailId === selectedItem.detailId) {
//               return {...item, status: 'CANCEL'};
//             }
//             return item;
//           });

//           // Update the order object with cancelled item
//           order.items = updatedItems;
//         }

//         showToast('Order cancelled successfully!', 'success');
//       } else {
//         showToast(response.data.message || 'Failed to cancel order', 'error');
//       }
//     } catch (error) {
//       console.error('Error cancelling order:', error);

//       // Handle axios error specifically
//       if (axios.isAxiosError(error)) {
//         const errorMessage =
//           error.response?.data?.message ||
//           'Network error while cancelling order';
//         showToast(errorMessage, 'error');
//       } else {
//         showToast('Network error while cancelling order', 'error');
//       }
//     } finally {
//       setIsLoading(false);
//       setModalVisible(false);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}>
//           <MaterialIcons name="arrow-back" size={24} color="#111827" />
//         </TouchableOpacity>
//         <Text style={styles.headerTitle}>Order Details</Text>
//         <View style={styles.placeholder} />
//       </View>

//       <ScrollView style={styles.scrollView}>
//         <View style={styles.purpleHeaderCard}>
//           <View style={styles.purpleHeader}>
//             <View style={styles.headerContent}>
//               <MaterialIcons name="shopping-bag" size={24} color="#ffffff" />
//               <Text style={styles.purpleHeaderText}>
//                 Order #{order.orderNo}
//               </Text>
//             </View>
//           </View>

//           <View style={styles.whiteCardContent}>
//             <View style={styles.infoRow}>
//               <View style={styles.infoItem}>
//                 <View style={styles.infoIcon}>
//                   <MaterialIcons name="event" size={16} color="#7c3aed" />
//                 </View>
//                 <View>
//                   <Text style={styles.infoLabelNew}>Order Date</Text>
//                   <Text style={styles.infoValueNew}>
//                     {formatDate(
//                       new Date(
//                         new Date(order.orderDate).setDate(
//                           new Date(order.orderDate).getDate() + 1,
//                         ),
//                       )
//                         .toISOString()
//                         .split('T')[0],
//                     )}
//                   </Text>
//                 </View>
//               </View>

//               <View style={styles.infoItem}>
//                 <View style={styles.infoIcon}>
//                   <MaterialIcons
//                     name="local-shipping"
//                     size={16}
//                     color="#7c3aed"
//                   />
//                 </View>
//                 <View>
//                   <Text style={styles.infoLabelNew}>Delivery Date</Text>
//                   {/* <Text style={styles.infoValueNew}>{formatDate(order.deliveryDate)}</Text> */}
//                   <Text style={styles.infoValueNew}>
//                     {formatDate(
//                       new Date(
//                         new Date(order.deliveryDate).setDate(
//                           new Date(order.deliveryDate).getDate() + 1,
//                         ),
//                       )
//                         .toISOString()
//                         .split('T')[0],
//                     )}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.dividerHorizontal} />

//             <View style={styles.infoRow}>
//               <View style={styles.infoItem}>
//                 <View style={styles.infoIcon}>
//                   <MaterialIcons
//                     name="directions-bus"
//                     size={16}
//                     color="#7c3aed"
//                   />
//                 </View>
//                 <View>
//                   <Text style={styles.infoLabelNew}>Transporter</Text>
//                   <Text style={styles.infoValueNew}>
//                     {order.transporterName || 'Qqq'}
//                   </Text>
//                 </View>
//               </View>
//             </View>

//             <View style={styles.dividerHorizontal} />

//             <View style={styles.infoRow}>
//               <View style={styles.infoItem}>
//                 <View style={styles.infoIcon}>
//                   <MaterialIcons name="location-on" size={16} color="#7c3aed" />
//                 </View>
//                 <View>
//                   <Text style={styles.infoLabelNew}>Delivery Location</Text>
//                   <View style={styles.locationBox}>
//                     <Text style={styles.locationText}>
//                       {order.deliveryAddress || 'N/A'}
//                     </Text>
//                   </View>
//                 </View>
//               </View>
//             </View>

//             {/* <View style={styles.dividerHorizontal} /> */}

//             {/* <View style={styles.orderStatus}>
//               <View style={styles.statusDot}></View>
//               <Text style={styles.orderStatusText}>Order Processing</Text>
//               <TouchableOpacity>
//                 <Text style={styles.trackOrderLink}>Track Order</Text>
//               </TouchableOpacity>
//             </View> */}
//           </View>
//         </View>

//         {order.items &&
//           order.items.map((item: OrderItem, index: number) => (
//             <View
//               key={`item-${item.detailId || index}`}
//               style={styles.itemCard}>
//               <View style={styles.itemHeader}>
//                 <View style={styles.itemNameContainer}>
//                   <MaterialIcons name="inventory" size={18} color="#0369a1" />
//                   <Text style={styles.itemName}>{item.itemName}</Text>
//                 </View>
//                 <View style={styles.statusBadge}>
//                   <MaterialIcons
//                     name="check-circle"
//                     size={14}
//                     color="#0284c7"
//                   />
//                   <Text style={styles.statusText}>{item.status}</Text>
//                 </View>
//               </View>

//               <View style={styles.lotNoContainer}>
//                 <MaterialIcons name="label" size={16} color="#f97316" />
//                 <Text style={styles.lotNo}>Lot No: {item.lotNo || 'N/A'}</Text>
//               </View>

//               <View style={styles.itemDetailsGrid}>
//                 <View style={styles.itemDetail}>
//                   <MaterialIcons name="bookmark" size={14} color="#6B7280" />
//                   <Text style={styles.detailLabel}>Item Marks:</Text>
//                   <Text style={styles.detailValue}>
//                     {item.itemMarks || 'N/A'}
//                   </Text>
//                 </View>
//               </View>
//               <View style={styles.itemDetail}>
//                 <MaterialIcons name="description" size={14} color="#6B7280" />
//                 <Text style={styles.detailLabel}>Vakal No:</Text>
//                 <Text style={styles.detailValue}>{item.vakalNo || 'N/A'}</Text>
//               </View>

//               <View style={styles.quantityContainer}>
//                 <View style={styles.quantityColumn}>
//                   <View style={styles.quantityLabelRow}>
//                     <MaterialIcons
//                       name="shopping-cart"
//                       size={18}
//                       color="#0369a1"
//                     />
//                     <Text style={styles.quantityLabel}>Ordered</Text>
//                   </View>
//                   <Text style={styles.quantityValue}>{item.requestedQty}</Text>
//                 </View>
//                 <View style={styles.quantityDivider} />
//                 <View style={styles.quantityColumn}>
//                   <View style={styles.quantityLabelRow}>
//                     <MaterialIcons name="inventory" size={18} color="#0369a1" />
//                     <Text style={styles.quantityLabel}>Available</Text>
//                   </View>
//                   <Text style={styles.quantityValue}>{item.availableQty}</Text>
//                 </View>
//               </View>

//               <View style={styles.itemDetailsGrid}>
//                 <View style={styles.itemDetail}>
//                   <MaterialIcons name="straighten" size={14} color="#6B7280" />
//                   <Text style={styles.detailLabel}>Unit:</Text>
//                   <Text style={styles.detailValue}>
//                     {item.unitName || 'N/A'}
//                   </Text>
//                 </View>
//                 <View style={styles.itemDetail}>
//                   <MaterialIcons name="scale" size={14} color="#6B7280" />
//                   <Text style={styles.detailLabel}>Net Qty:</Text>
//                   <View
//                     style={[
//                       styles.netQtyContainer,
//                       item.availableQty - item.requestedQty < 0
//                         ? styles.negativeQtyContainer
//                         : item.availableQty - item.requestedQty > 0
//                         ? styles.positiveQtyContainer
//                         : null,
//                     ]}>
//                     <Text
//                       style={[
//                         styles.detailValue,
//                         item.availableQty - item.requestedQty < 0
//                           ? styles.negativeQuantity
//                           : item.availableQty - item.requestedQty > 0
//                           ? styles.positiveQuantity
//                           : null,
//                       ]}>
//                       {item.availableQty - item.requestedQty > 0 ? '+' : ''}
//                       {item.availableQty - item.requestedQty}
//                     </Text>
//                   </View>
//                 </View>
//               </View>

//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={() => showCancelConfirmation(item)}>
//                 <MaterialIcons name="cancel" size={16} color="#fff" />
//                 <Text style={styles.cancelButtonText}>Cancel Order</Text>
//               </TouchableOpacity>
//             </View>
//           ))}
//       </ScrollView>

//       {/* Custom Cancel Alert Modal */}
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => setModalVisible(false)}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <View style={styles.modalHeader}>
//               <MaterialIcons name="error-outline" size={40} color="#ef4444" />
//               <Text style={styles.modalTitle}>Cancel Order</Text>
//             </View>

//             <View style={styles.modalBody}>
//               <Text style={styles.modalMessage}>
//                 Are you sure you want to cancel order for:
//               </Text>

//               {selectedItem && (
//                 <View style={styles.selectedItemContainer}>
//                   <Text style={styles.selectedItemName}>
//                     {selectedItem.itemName}
//                   </Text>
//                   <View style={styles.selectedItemDetails}>
//                     <MaterialIcons name="label" size={16} color="#f97316" />
//                     <Text style={styles.selectedItemLot}>
//                       Lot No: {selectedItem.lotNo || 'N/A'}
//                     </Text>
//                   </View>
//                 </View>
//               )}

//               {/* Add cancellation remarks input */}
//               <View style={styles.remarksContainer}>
//                 <Text style={styles.remarksLabel}>Cancellation Reason:</Text>
//                 <TextInput
//                   style={styles.remarksInput}
//                   placeholder="Enter reason for cancellation"
//                   value={cancelRemark}
//                   onChangeText={setCancelRemark}
//                   multiline
//                 />
//               </View>

//               <Text style={styles.modalWarning}>
//                 This action cannot be undone.
//               </Text>
//             </View>

//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.modalCancelButton}
//                 onPress={() => setModalVisible(false)}
//                 disabled={isLoading}>
//                 <Text style={styles.modalCancelText}>Keep Order</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={[
//                   styles.modalConfirmButton,
//                   isLoading && styles.disabledButton,
//                 ]}
//                 onPress={handleCancelOrder}
//                 disabled={isLoading}>
//                 {isLoading ? (
//                   <ActivityIndicator size="small" color="#fff" />
//                 ) : (
//                   <>
//                     <MaterialIcons name="delete" size={16} color="#fff" />
//                     <Text style={styles.modalConfirmText}>Yes, Cancel</Text>
//                   </>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Updated Toast with dynamic content */}
//       {toastVisible && (
//         <Animated.View
//           style={[
//             styles.toast,
//             {
//               opacity: toastOpacity,
//               transform: [{translateX: toastOffset}],
//             },
//             toastType === 'error' && styles.errorToast,
//           ]}>
//           <View style={styles.toastContent}>
//             <MaterialIcons
//               name={toastType === 'success' ? 'check-circle' : 'error'}
//               size={24}
//               color={toastType === 'success' ? '#22c55e' : '#ef4444'}
//             />
//             <Text style={styles.toastMessage}>{toastMessage}</Text>
//           </View>
//         </Animated.View>
//       )}
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f3f4f6',
//   },
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 16,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e5e7eb',
//     elevation: 2,
//   },
//   backButton: {
//     padding: 8,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: '600',
//     color: '#7c3aed',
//   },
//   placeholder: {
//     width: 40,
//   },
//   scrollView: {
//     flex: 1,
//   },
//   purpleHeaderCard: {
//     backgroundColor: '#7c3aed',
//     borderRadius: 0,
//     marginVertical: 12,
//     marginHorizontal: 0,
//     overflow: 'hidden',
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//   },
//   purpleHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//   },
//   headerContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   purpleHeaderText: {
//     fontSize: 19,
//     fontWeight: '700',
//     color: '#ffffff',
//     marginLeft: 11,
//     letterSpacing: 0.5,
//     textShadowColor: 'rgba(0, 0, 0, 0.2)',
//     textShadowOffset: {width: 0, height: 1},
//     textShadowRadius: 2,
//   },
//   whiteCardContent: {
//     backgroundColor: '#ffffff',
//     borderTopLeftRadius: 1,
//     borderTopRightRadius: 1,
//     padding: 14,
//     paddingHorizontal: 16,
//   },
//   infoRow: {
//     flexDirection: 'row',
//     marginBottom: 0,
//   },
//   infoItem: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     flex: 1,
//   },
//   remarksContainer: {
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   remarksLabel: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#4B5563',
//     marginBottom: 5,
//   },
//   remarksInput: {
//     borderWidth: 1,
//     borderColor: '#d1d5db',
//     borderRadius: 8,
//     padding: 10,
//     fontSize: 14,
//     backgroundColor: '#f9fafb',
//     minHeight: 80,
//     textAlignVertical: 'top',
//   },
//   disabledButton: {
//     backgroundColor: '#f87171',
//     opacity: 0.7,
//   },
//   errorToast: {
//     borderLeftColor: '#ef4444',
//   },

//   infoIcon: {
//     padding: 8,
//     borderRadius: 8,
//     marginRight: 10,
//   },
//   infoLabelNew: {
//     fontSize: 12,
//     color: 'grey',
//     fontWeight: '500',
//     marginBottom: 3,
//   },
//   infoValueNew: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   dividerHorizontal: {
//     height: 1,
//     backgroundColor: '#f0f0f0',
//     marginVertical: 12,
//   },
//   locationBox: {
//     padding: 8,
//     backgroundColor: '#f9fafb',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e5e7eb',
//     marginTop: 4,
//   },
//   locationText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//   },
//   orderStatus: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   statusDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: '#22c55e',
//     marginRight: 6,
//   },
//   orderStatusText: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#111827',
//     flex: 1,
//   },
//   trackOrderLink: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#7c3aed',
//   },
//   itemCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     marginHorizontal: 12,
//     marginBottom: 12,
//     padding: 14,
//     elevation: 3,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     borderWidth: 1,
//     borderColor: '#f0f0f0',
//   },
//   itemHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//     paddingBottom: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f0f0f0',
//   },
//   itemNameContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#111827',
//     marginLeft: 6,
//   },
//   statusBadge: {
//     backgroundColor: '#e0f2fe',
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: '#bae6fd',
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   statusText: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#0284c7',
//     marginLeft: 4,
//   },
//   lotNoContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   lotNo: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#f97316',
//     marginLeft: 6,
//   },
//   itemDetailsGrid: {
//     flexDirection: 'row',
//     marginVertical: 6,
//   },
//   itemDetail: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   detailLabel: {
//     fontSize: 13,
//     color: '#6B7280',
//     marginLeft: 4,
//     marginRight: 4,
//     fontWeight: '500',
//   },
//   detailValue: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#111827',
//   },
//   positiveQuantity: {
//     color: '#059669',
//     fontWeight: '700',
//     fontSize: 14,
//   },
//   negativeQuantity: {
//     color: '#dc2626',
//     fontWeight: '700',
//     fontSize: 14,
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#f0f7ff',
//     borderRadius: 8,
//     padding: 10,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: '#dbeafe',
//     alignItems: 'center',
//   },
//   quantityDivider: {
//     height: '80%',
//     width: 1,
//     backgroundColor: '#bae6fd',
//   },
//   quantityColumn: {
//     flex: 1,
//     alignItems: 'center',
//   },
//   quantityLabelRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   quantityLabel: {
//     fontSize: 12,
//     color: '#6B7280',
//     marginLeft: 4,
//     fontWeight: '500',
//   },
//   quantityValue: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#0369a1',
//     marginTop: 4,
//   },
//   netQtyContainer: {
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 4,
//     marginLeft: 4,
//     borderWidth: 1,
//   },
//   positiveQtyContainer: {
//     backgroundColor: '#d1fae5',
//     borderColor: '#a7f3d0',
//   },
//   negativeQtyContainer: {
//     backgroundColor: '#fee2e2',
//     borderColor: '#fecaca',
//   },
//   cancelButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#ef4444',
//     borderRadius: 8,
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     marginTop: 12,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//   },
//   cancelButtonText: {
//     color: '#ffffff',
//     fontWeight: '600',
//     fontSize: 14,
//     marginLeft: 8,
//   },

//   // Modal styles
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   modalContent: {
//     backgroundColor: 'white',
//     borderRadius: 16,
//     width: '90%',
//     maxWidth: 400,
//     padding: 0,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   modalHeader: {
//     alignItems: 'center',
//     padding: 16,
//     paddingTop: 24,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#111827',
//     marginTop: 8,
//   },
//   modalBody: {
//     padding: 16,
//     paddingTop: 0,
//   },
//   modalMessage: {
//     fontSize: 16,
//     color: '#4B5563',
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   selectedItemContainer: {
//     backgroundColor: '#f8fafc',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   selectedItemName: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#111827',
//     marginBottom: 8,
//   },
//   selectedItemDetails: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   selectedItemLot: {
//     fontSize: 14,
//     fontWeight: '500',
//     color: '#f97316',
//     marginLeft: 6,
//   },
//   modalWarning: {
//     fontSize: 14,
//     color: '#9CA3AF',
//     fontStyle: 'italic',
//     textAlign: 'center',
//   },
//   modalActions: {
//     flexDirection: 'row',
//     marginTop: 8,
//     borderTopWidth: 1,
//     borderTopColor: '#e5e7eb',
//   },
//   modalCancelButton: {
//     flex: 1,
//     padding: 14,
//     alignItems: 'center',
//     borderRightWidth: 0.5,
//     borderRightColor: '#e5e7eb',
//   },
//   modalCancelText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#6B7280',
//   },
//   modalConfirmButton: {
//     flex: 1,
//     padding: 14,
//     backgroundColor: '#ef4444',
//     alignItems: 'center',
//     flexDirection: 'row',
//     justifyContent: 'center',
//   },
//   modalConfirmText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: 'white',
//     marginLeft: 8,
//   },
//   // Toast styles
//   toast: {
//     position: 'absolute',
//     top: 82,
//     right: 5,
//     width: '74%',
//     maxWidth: 310,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     paddingVertical: 10,
//     paddingHorizontal: 14,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: -2,
//       height: 2,
//     },
//     shadowOpacity: 0.18,
//     shadowRadius: 4.65,
//     elevation: 7,
//     zIndex: 1000,
//     borderLeftWidth: 4,
//     borderLeftColor: '#22c55e',
//   },
//   toastContent: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   toastMessage: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#111827',
//     marginLeft: 10,
//   },
// });

// export default OrderDetailsScreen;
// function setIsLoading(arg0: boolean) {
//   throw new Error('Function not implemented.');
// }

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {API_ENDPOINTS, DEFAULT_HEADERS} from '../config/api.config';
import axios from 'axios';

interface OrderItem {
  detailId?: number;
  itemId?: number;
  itemName: string;
  lotNo: string | number;
  itemMarks: string;
  vakalNo: string;
  requestedQty: number;
  availableQty: number;
  status: string;
  unitName?: string;
  netQuantity?: number;
}

interface Order {
  orderId: number;
  orderNo: string;
  orderDate: string;
  deliveryDate: string;
  status: string;
  transporterName: string;
  remarks: string;
  deliveryAddress: string;
  customerName: string;
  totalItems: number;
  totalQuantity: number;
  items: OrderItem[];
}

interface RouteParams {
  order: Order;
}

const OrderDetailsScreen = ({
  route,
}: {
  route: RouteProp<{params: RouteParams}, 'params'>;
}) => {
  const navigation = useNavigation();
  const {order} = route.params;
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>(order.items);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<OrderItem | null>(
    null,
  );
  const [toastVisible, setToastVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState(
    'Order cancelled successfully!',
  );
  const [toastType, setToastType] = React.useState<'success' | 'error'>(
    'success',
  );
  const toastOpacity = React.useRef(new Animated.Value(0)).current;
  const toastOffset = React.useRef(new Animated.Value(300)).current;

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return '';

      // Extract date parts from string
      let year, month, day;

      // For YYYY-MM-DD format
      if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
        [year, month, day] = dateString.split('-');
      }
      // For ISO format with time component
      else if (dateString.includes('T')) {
        const [datePart] = dateString.split('T');
        [year, month, day] = datePart.split('-');
      }
      // Invalid format
      else {
        return dateString;
      }

      // Convert month number to month name
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      // Remove leading zeros and convert to numbers
      const monthIndex = parseInt(month, 10) - 1;
      const dayNum = parseInt(day, 10);

      // Format the date manually
      return `${monthNames[monthIndex]} ${dayNum}, ${year}`;
    } catch {
      return dateString;
    }
  };

  const showCancelConfirmation = (item: OrderItem) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

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

  const handleCancelOrder = async () => {
    if (!selectedItem || !selectedItem.detailId) {
      showToast('Cannot cancel order: Missing detail ID', 'error');
      setModalVisible(false);
      return;
    }

    setIsLoading(true);

    try {
      // Log request details for debugging
      console.log('Making API request to:', API_ENDPOINTS.GET_CANCEL_ORDER);
      console.log('Request payload:', {
        detailId: selectedItem.detailId,
        cancelRemark: 'Cancelled via mobile app',
        cancelledBy: 'MOBILE_USER',
      });

      // Add a timeout to the axios request
      const response = await axios.post(
        API_ENDPOINTS.GET_CANCEL_ORDER,
        {
          detailId: selectedItem.detailId,
          cancelRemark: 'Cancelled via mobile app',
          cancelledBy: 'MOBILE_USER',
        },
        {
          headers: DEFAULT_HEADERS,
          timeout: 10000, // 10 second timeout
        },
      );

      // With axios, we directly get the data from the response
      const result = response.data;

      if (result.success) {
        // Remove the cancelled item from the order items list
        if (selectedItem && selectedItem.detailId) {
          // Filter out the cancelled item
          setOrderItems(
            orderItems.filter(item => item.detailId !== selectedItem.detailId),
          );
        }

        showToast('Order cancelled successfully!', 'success');
      } else {
        showToast(result.message || 'Failed to cancel order', 'error');
      }
    } catch (error: any) {
      console.error('Error cancelling order:', error);

      // Provide more specific error messages based on the error type
      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          showToast('Request timed out. Please try again.', 'error');
        } else if (error.code === 'ERR_NETWORK') {
          showToast(
            'Cannot connect to server. Please check your network connection.',
            'error',
          );
        } else if (error.response) {
          // The request was made and the server responded with a status code outside of 2xx range
          showToast(`Server error: ${error.response.status}`, 'error');
        } else if (error.request) {
          // The request was made but no response was received
          showToast('No response from server. Please try again.', 'error');
        } else {
          showToast(`Error: ${error.message}`, 'error');
        }
      } else {
        showToast(
          `Error: ${error.message || 'Unknown error occurred'}`,
          'error',
        );
      }
    } finally {
      setIsLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.purpleHeaderCard}>
          <View style={styles.purpleHeader}>
            <View style={styles.headerContent}>
              <MaterialIcons name="shopping-bag" size={24} color="#ffffff" />
              <Text style={styles.purpleHeaderText}>
                Order #{order.orderNo}
              </Text>
            </View>
          </View>

          <View style={styles.whiteCardContent}>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <MaterialIcons name="event" size={16} color="#7c3aed" />
                </View>
                <View>
                  <Text style={styles.infoLabelNew}>Order Date</Text>
                  <Text style={styles.infoValueNew}>
                    {formatDate(
                      new Date(
                        new Date(order.orderDate).setDate(
                          new Date(order.orderDate).getDate() + 1,
                        ),
                      )
                        .toISOString()
                        .split('T')[0],
                    )}
                  </Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <MaterialIcons
                    name="local-shipping"
                    size={16}
                    color="#7c3aed"
                  />
                </View>
                <View>
                  <Text style={styles.infoLabelNew}>Delivery Date</Text>
                  {/* <Text style={styles.infoValueNew}>{formatDate(order.deliveryDate)}</Text> */}
                  <Text style={styles.infoValueNew}>
                    {formatDate(
                      new Date(
                        new Date(order.deliveryDate).setDate(
                          new Date(order.deliveryDate).getDate() + 1,
                        ),
                      )
                        .toISOString()
                        .split('T')[0],
                    )}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerHorizontal} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <MaterialIcons
                    name="directions-bus"
                    size={16}
                    color="#7c3aed"
                  />
                </View>
                <View>
                  <Text style={styles.infoLabelNew}>Transporter</Text>
                  <Text style={styles.infoValueNew}>
                    {order.transporterName || 'Qqq'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.dividerHorizontal} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <View style={styles.infoIcon}>
                  <MaterialIcons name="location-on" size={16} color="#7c3aed" />
                </View>
                <View>
                  <Text style={styles.infoLabelNew}>Delivery Location</Text>
                  <View style={styles.locationBox}>
                    <Text style={styles.locationText}>
                      {order.deliveryAddress || 'N/A'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* <View style={styles.dividerHorizontal} /> */}

            {/* <View style={styles.orderStatus}>
              <View style={styles.statusDot}></View>
              <Text style={styles.orderStatusText}>Order Processing</Text>
              <TouchableOpacity>
                <Text style={styles.trackOrderLink}>Track Order</Text>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>

        {orderItems && orderItems.length > 0 ? (
          orderItems.map((item: OrderItem, index: number) => (
            <View
              key={`item-${item.detailId || index}`}
              style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <View style={styles.itemNameContainer}>
                  <MaterialIcons name="inventory" size={18} color="#0369a1" />
                  <Text style={styles.itemName}>{item.itemName}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <MaterialIcons
                    name="check-circle"
                    size={14}
                    color="#0284c7"
                  />
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>

              <View style={styles.lotNoContainer}>
                <MaterialIcons name="label" size={16} color="#f97316" />
                <Text style={styles.lotNo}>Lot No: {item.lotNo || 'N/A'}</Text>
              </View>

              <View style={styles.itemDetailsGrid}>
                <View style={styles.itemDetail}>
                  <MaterialIcons name="bookmark" size={14} color="#6B7280" />
                  <Text style={styles.detailLabel}>Item Marks:</Text>
                  <Text style={styles.detailValue}>
                    {item.itemMarks || 'N/A'}
                  </Text>
                </View>
              </View>
              <View style={styles.itemDetail}>
                <MaterialIcons name="description" size={14} color="#6B7280" />
                <Text style={styles.detailLabel}>Vakal No:</Text>
                <Text style={styles.detailValue}>{item.vakalNo || 'N/A'}</Text>
              </View>

              <View style={styles.quantityContainer}>
                <View style={styles.quantityColumn}>
                  <View style={styles.quantityLabelRow}>
                    <MaterialIcons
                      name="shopping-cart"
                      size={18}
                      color="#0369a1"
                    />
                    <Text style={styles.quantityLabel}>Ordered</Text>
                  </View>
                  <Text style={styles.quantityValue}>{item.requestedQty}</Text>
                </View>
                <View style={styles.quantityDivider} />
                <View style={styles.quantityColumn}>
                  <View style={styles.quantityLabelRow}>
                    <MaterialIcons name="inventory" size={18} color="#0369a1" />
                    <Text style={styles.quantityLabel}>Available</Text>
                  </View>
                  <Text style={styles.quantityValue}>{item.availableQty}</Text>
                </View>
              </View>

              <View style={styles.itemDetailsGrid}>
                <View style={styles.itemDetail}>
                  <MaterialIcons name="straighten" size={14} color="#6B7280" />
                  <Text style={styles.detailLabel}>Unit:</Text>
                  <Text style={styles.detailValue}>
                    {item.unitName || 'N/A'}
                  </Text>
                </View>
                <View style={styles.itemDetail}>
                  <MaterialIcons name="scale" size={14} color="#6B7280" />
                  <Text style={styles.detailLabel}>Net Qty:</Text>
                  <View
                    style={[
                      styles.netQtyContainer,
                      item.availableQty - item.requestedQty < 0
                        ? styles.negativeQtyContainer
                        : item.availableQty - item.requestedQty > 0
                        ? styles.positiveQtyContainer
                        : null,
                    ]}>
                    <Text
                      style={[
                        styles.detailValue,
                        item.availableQty - item.requestedQty < 0
                          ? styles.negativeQuantity
                          : item.availableQty - item.requestedQty > 0
                          ? styles.positiveQuantity
                          : null,
                      ]}>
                      {item.availableQty - item.requestedQty > 0 ? '+' : ''}
                      {item.availableQty - item.requestedQty}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => showCancelConfirmation(item)}
                disabled={isLoading}>
                <MaterialIcons name="cancel" size={16} color="#fff" />
                <Text style={styles.cancelButtonText}>
                  {isLoading ? 'Processing...' : 'Cancel Order'}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.noItemsContainer}>
            <MaterialIcons name="info" size={48} color="#9ca3af" />
            <Text style={styles.noItemsText}>
              All order items have been cancelled
            </Text>
            <TouchableOpacity
              style={styles.backToOrdersButton}
              onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={16} color="#fff" />
              <Text style={styles.backToOrdersText}>Back to Orders</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Custom Cancel Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <MaterialIcons name="error-outline" size={40} color="#ef4444" />
              <Text style={styles.modalTitle}>Cancel Order</Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalMessage}>
                Are you sure you want to cancel order for:
              </Text>

              {selectedItem && (
                <View style={styles.selectedItemContainer}>
                  <Text style={styles.selectedItemName}>
                    {selectedItem.itemName}
                  </Text>
                  <View style={styles.selectedItemDetails}>
                    <MaterialIcons name="label" size={16} color="#f97316" />
                    <Text style={styles.selectedItemLot}>
                      Lot No: {selectedItem.lotNo || 'N/A'}
                    </Text>
                  </View>
                </View>
              )}

              <Text style={styles.modalWarning}>
                This action cannot be undone.
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCancelText}>Keep Order</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleCancelOrder}>
                <MaterialIcons name="delete" size={16} color="#fff" />
                <Text style={styles.modalConfirmText}>Yes, Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Toast Notification */}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    elevation: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#7c3aed',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  purpleHeaderCard: {
    backgroundColor: '#7c3aed',
    borderRadius: 0,
    marginVertical: 12,
    marginHorizontal: 0,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  purpleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  purpleHeaderText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#ffffff',
    marginLeft: 11,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
  whiteCardContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    padding: 14,
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  infoIcon: {
    padding: 8,
    borderRadius: 8,
    marginRight: 10,
  },
  infoLabelNew: {
    fontSize: 12,
    color: 'grey',
    fontWeight: '500',
    marginBottom: 3,
  },
  infoValueNew: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  dividerHorizontal: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  locationBox: {
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginTop: 4,
  },
  locationText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  orderStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  orderStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    flex: 1,
  },
  trackOrderLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c3aed',
  },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginLeft: 6,
  },
  statusBadge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#bae6fd',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284c7',
    marginLeft: 4,
  },
  lotNoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  lotNo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f97316',
    marginLeft: 6,
  },
  itemDetailsGrid: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  itemDetail: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginLeft: 4,
    marginRight: 4,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  positiveQuantity: {
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  negativeQuantity: {
    color: '#dc2626',
    fontWeight: '700',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignItems: 'center',
  },
  quantityDivider: {
    height: '80%',
    width: 1,
    backgroundColor: '#bae6fd',
  },
  quantityColumn: {
    flex: 1,
    alignItems: 'center',
  },
  quantityLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
    fontWeight: '500',
  },
  quantityValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0369a1',
    marginTop: 4,
  },
  netQtyContainer: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 4,
    borderWidth: 1,
  },
  positiveQtyContainer: {
    backgroundColor: '#d1fae5',
    borderColor: '#a7f3d0',
  },
  negativeQtyContainer: {
    backgroundColor: '#fee2e2',
    borderColor: '#fecaca',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  cancelButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '90%',
    maxWidth: 400,
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
  },
  modalBody: {
    padding: 16,
    paddingTop: 0,
  },
  modalMessage: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
    textAlign: 'center',
  },
  selectedItemContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  selectedItemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedItemLot: {
    fontSize: 14,
    fontWeight: '500',
    color: '#f97316',
    marginLeft: 6,
  },
  modalWarning: {
    fontSize: 14,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalCancelButton: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#e5e7eb',
  },
  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  modalConfirmButton: {
    flex: 1,
    padding: 14,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
  // Toast styles
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
  noItemsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 24,
    padding: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  noItemsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backToOrdersButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  backToOrdersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
  },
  cancelledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fee2e2',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 12,
  },
  cancelledText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  errorToast: {
    borderLeftColor: '#ef4444',
  },
  successToast: {
    borderLeftColor: '#22c55e',
  },
});

export default OrderDetailsScreen;
