import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  PermissionsAndroid,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {API_ENDPOINTS, DEFAULT_HEADERS} from '../config/api.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import apiClient from '../utils/apiClient';
// PDF related imports
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
// @ts-ignore
import { PDFDocument, rgb, PDFFont, PDFPage, RGB, StandardFonts } from 'pdf-lib';
// Buffer polyfill for pdf-lib
import { Buffer } from 'buffer';
// @ts-ignore
import FileViewer from 'react-native-file-viewer';

// Define types for API response
interface CategoryItem {
  CATID: number;
  CATCODE: string;
  CATDESC: string;
  SUBCATID: number;
  SUBCATCODE: string;
  SUBCATDESC: string;
  CATEGORY_IMAGE_NAME: string;
  SUBCATEGORY_IMAGE_NAME: string;
}

interface ApiResponse {
  input: {
    CustomerID: number;
    displayName: string;
  };
  output: CategoryItem[];
}

// Define type for subcategories map
interface SubcategoriesMap {
  [key: string]: string[];
}

const InwardOutwardReportScreen = () => {
  // State variables
  const [isInward, setIsInward] = useState(true);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [itemCategory, setItemCategory] = useState('');
  const [itemSubcategory, setItemSubcategory] = useState('');
  const [unit, setUnit] = useState('');
  const [customerName, setCustomerName] = useState('');

  // State for API data
  const [loading, setLoading] = useState(false);
  const [apiCategories, setApiCategories] = useState<string[]>([]);
  const [apiSubcategories, setApiSubcategories] = useState<SubcategoriesMap>(
    {},
  );
  const [apiData, setApiData] = useState<CategoryItem[]>([]);

  // PDF generation and notifications
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const reportRef = useRef<ViewShot>(null);
  const tableRef = useRef<ScrollView>(null);

  // Modal visibility state for iOS pickers
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const [currentPicker, setCurrentPicker] = useState('');

  // Sample data for units dropdown
  const units = ['D-39', 'D-514'];

  // Add these state variables
  const [reportData, setReportData] = useState<any[]>([]);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showForm, setShowForm] = useState(true);

  // Fetch categories and subcategories from API
  useEffect(() => {
    fetchCategoriesAndSubcategories();
    // Get customer name from AsyncStorage
    const getCustomerName = async () => {
      try {
        const storedCustomerName = await AsyncStorage.getItem('CUSTOMER_NAME');
        if (storedCustomerName) {
          setCustomerName(storedCustomerName);
        } else {
          // Fallback if CUSTOMER_NAME is not in AsyncStorage
          const displayName = await AsyncStorage.getItem('displayName');
          if (displayName) {
            setCustomerName(displayName);
          } else {
            // Default fallback if neither is available
            setCustomerName('UNICORP ENTERPRISES');
          }
        }
      } catch (error) {
        console.error('Error fetching customer name:', error);
        // Default fallback
        setCustomerName('UNICORP ENTERPRISES');
      }
    };

    getCustomerName();
  }, []);

  // Helper function to process API response
  const processApiResponse = (categoryData: CategoryItem[]) => {
    // Save the original data
    setApiData(categoryData);

    // Process categories (unique values only)
    const uniqueCategories = [
      ...new Set(categoryData.map(item => item.CATDESC)),
    ];
    setApiCategories(uniqueCategories);

    // Process subcategories by category
    const subcatMap: SubcategoriesMap = {};
    uniqueCategories.forEach(category => {
      subcatMap[category] = categoryData
        .filter(item => item.CATDESC === category)
        .map(item => item.SUBCATDESC);
    });

    setApiSubcategories(subcatMap);
  };

  // Function to fetch categories and subcategories from API
  const fetchCategoriesAndSubcategories = async () => {
    try {
      setLoading(true);

      // Get customer ID from AsyncStorage
      const customerID = await AsyncStorage.getItem('customerID');
      const displayName = await AsyncStorage.getItem('displayName');

      if (!customerID) {
        Alert.alert('Error', 'Customer ID not found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('Fetching from URL:', API_ENDPOINTS.ITEM_CATEGORIES);
      console.log(
        'Request body:',
        JSON.stringify({
          CustomerID: parseInt(customerID),
          displayName: displayName || '',
        }),
      );

      try {
        // Try using the apiClient utility first
        const response = await apiClient.post<ApiResponse>(
          '/sf/getItemCatSubCat',
          {
            CustomerID: parseInt(customerID),
            displayName: displayName || '',
          },
        );

        console.log(
          'API Response data:',
          JSON.stringify(response).substring(0, 200),
        );

        if (response && response.output && Array.isArray(response.output)) {
          // Process the response data
          processApiResponse(response.output);
        } else {
          // Fallback to direct axios call
          const directResponse = await axios.post<ApiResponse>(
            API_ENDPOINTS.ITEM_CATEGORIES,
            {
              CustomerID: parseInt(customerID),
              displayName: displayName || '',
            },
            {
              headers: DEFAULT_HEADERS,
              timeout: 10000,
            },
          );

          console.log(
            'Direct axios response:',
            JSON.stringify(directResponse.data).substring(0, 200),
          );

          if (
            directResponse.data &&
            directResponse.data.output &&
            Array.isArray(directResponse.data.output)
          ) {
            // Process the response data
            processApiResponse(directResponse.data.output);
          } else {
            console.error('Invalid API response format:', directResponse.data);
            Alert.alert(
              'Error',
              'Failed to load categories. Invalid response format.',
            );
          }
        }
      } catch (error) {
        console.error('Error fetching categories:', error);

        if (axios.isAxiosError(error)) {
          // Handle Axios specific errors
          const errorMessage = error.response
            ? `Server error: ${error.response.status}`
            : error.message;

          console.log('Axios error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          });

          Alert.alert(
            'Connection Error',
            `Failed to connect to server: ${errorMessage}`,
          );
        } else {
          Alert.alert('Error', 'Failed to load categories. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error in overall category handling:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Date picker handlers with platform-specific implementation
  const showDatePicker = (pickerType: 'from' | 'to') => {
    if (pickerType === 'from') {
      setShowFromDatePicker(true);
    } else {
      setShowToDatePicker(true);
    }
  };

  const onFromDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(Platform.OS === 'ios');
    setFromDate(currentDate);
  };

  const onToDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(Platform.OS === 'ios');
    setToDate(currentDate);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  // Format date for filenames (no slashes)
  const formatDateForFilename = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${date.getFullYear()}`;
  };

  // Helper function to show picker modal (for iOS)
  const openPicker = (pickerName: string) => {
    setCurrentPicker(pickerName);
    setIsPickerVisible(true);
  };

  // Validate inputs before actions
  const validateInputs = () => {
    // Item Category and Item Subcategory are now optional
    // Only checking if dates are valid
    if (fromDate > toDate) {
      Alert.alert('Error', 'From Date cannot be after To Date');
      return false;
    }
    return true;
  };

  // Handle search button
  const handleSearch = async () => {
    if (!validateInputs()) return;

    try {
      setIsReportLoading(true);
      setShowReport(true);
      setShowForm(false);

      // Format dates for API (YYYY-MM-DD)
      const formatDateForApi = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
          2,
          '0',
        )}-${String(date.getDate()).padStart(2, '0')}`;
      };

      // Build request data with optional fields as null when not selected
      const requestData = {
        fromDate: formatDateForApi(fromDate),
        toDate: formatDateForApi(toDate),
        customerName: customerName, // Use customer name from state
        itemCategoryName: itemCategory ? itemCategory.trim() : null,
        itemSubCategoryName: itemSubcategory ? itemSubcategory.trim() : null,
        unitName: unit ? unit.trim() : null,
      };

      console.log('==== REQUEST DATA DETAILS ====');
      console.log('URL:', API_ENDPOINTS.GET_INWARD_REPORT);
      console.log('Request data stringified:', JSON.stringify(requestData));
      console.log('fromDate exact value:', requestData.fromDate);
      console.log('toDate exact value:', requestData.toDate);
      console.log('customerName exact value:', requestData.customerName);
      console.log(
        'itemCategoryName exact value:',
        requestData.itemCategoryName,
      );
      console.log(
        'itemSubCategoryName exact value:',
        requestData.itemSubCategoryName,
      );
      console.log('unitName exact value:', requestData.unitName);

      // Make API call
      const response = await axios.post(
        isInward
          ? API_ENDPOINTS.GET_INWARD_REPORT
          : API_ENDPOINTS.GET_OUTWARD_REPORT,
        requestData,
        {
          headers: DEFAULT_HEADERS,
        },
      );

      // Log structured response
      console.log(
        `====== ${
          isInward ? 'GET_INWARD_REPORT' : 'GET_OUTWARD_REPORT'
        } API RESPONSE START ======`,
      );
      console.log('Response status:', response.status);
      console.log(
        'Response headers:',
        JSON.stringify(response.headers, null, 2),
      );
      console.log('Response data:', JSON.stringify(response.data, null, 2));
      console.log('Success:', response.data?.success);
      console.log('Message:', response.data?.message);
      console.log('Data count:', response.data?.data?.length || 0);

      if (response.data?.data?.length > 0) {
        // Check sample record values (first record)
        const sampleRecord = response.data.data[0];
        console.log('Sample record field values:');
        console.log('- UNIT_NAME:', sampleRecord.UNIT_NAME);
        console.log('- GRN_DATE:', sampleRecord.GRN_DATE);
        console.log('- CUSTOMER_NAME:', sampleRecord.CUSTOMER_NAME);
        console.log('- ITEM_CATEG_NAME:', sampleRecord.ITEM_CATEG_NAME);
        console.log('- SUB_CATEGORY_NAME:', sampleRecord.SUB_CATEGORY_NAME);

        // Modify client-side filtering to handle optional fields
        console.log('Filter matching check:');
        if (unit)
          console.log(
            '- Unit match:',
            sampleRecord.UNIT_NAME === requestData.unitName,
          );
        if (itemCategory)
          console.log(
            '- Category match:',
            sampleRecord.ITEM_CATEG_NAME === requestData.itemCategoryName,
          );
        if (itemSubcategory)
          console.log(
            '- Subcategory match:',
            sampleRecord.SUB_CATEGORY_NAME === requestData.itemSubCategoryName,
          );
        console.log(
          '- Customer match:',
          sampleRecord.CUSTOMER_NAME === requestData.customerName,
        );
      }

      console.log('====== GET_INWARD_REPORT API RESPONSE END ======');

      // Update client-side filtering to handle optional fields (null values)
      if (response.data && response.data.success) {
        // Filter the data based on provided filters only
        const filteredData = response.data.data.filter((item: any) => {
          // Always filter by customer name
          const customerMatch = item.CUSTOMER_NAME === requestData.customerName;

          // Only apply filters for fields that were provided (not null)
          const unitMatch =
            requestData.unitName === null ||
            item.UNIT_NAME === requestData.unitName;
          const categoryMatch =
            requestData.itemCategoryName === null ||
            item.ITEM_CATEG_NAME === requestData.itemCategoryName;
          const subcategoryMatch =
            requestData.itemSubCategoryName === null ||
            item.SUB_CATEGORY_NAME === requestData.itemSubCategoryName;

          return (
            customerMatch && unitMatch && categoryMatch && subcategoryMatch
          );
        });

        console.log('Client-side filtered count:', filteredData.length);

        // Use the filtered data instead of all results
        setReportData(filteredData);

        if (filteredData.length === 0) {
          Alert.alert('No Data', 'No records found for the selected criteria.');
        }
      } else {
        Alert.alert(
          'Error',
          response.data?.message || 'Failed to fetch report data.',
        );
      }
    } catch (error) {
      console.error('Error fetching report data:', error);

      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        Alert.alert('Error', `Failed to fetch report: ${errorMessage}`);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    } finally {
      setIsReportLoading(false);
    }
  };

  // Handle clear button
  const handleClear = () => {
    setFromDate(new Date());
    setToDate(new Date());
    setItemCategory('');
    setItemSubcategory('');
    setUnit('');
  };

  // Handle download as PDF
  const handlePdfDownload = async () => {
    try {
      if (!validateInputs()) return;
      
      setPdfGenerating(true);
      setDownloadProgress(0);
      
      // Create notification for download progress
      updateProgressUI(20, 'Preparing your report PDF...');
      
      // Capture the main report content
      const reportTitle = isInward ? 'Inward_Report' : 'Outward_Report';
      
      // Use safer date format for filename - avoid any slashes or special characters
      const safeFromDate = formatDateForFilename(fromDate);
      const safeToDate = formatDateForFilename(toDate);
      const fileName = `${reportTitle}_${safeFromDate}_to_${safeToDate}.pdf`;
      
      // Use app-specific directories that don't require permissions
      let dirPath;
      if (Platform.OS === 'ios') {
        dirPath = RNFS.DocumentDirectoryPath;
      } else {
        // For Android, use the cache directory which doesn't require storage permissions
        dirPath = RNFS.CachesDirectoryPath;
        console.log('Using Android cache directory:', dirPath);
        
        // Create a PDF subfolder to store reports
        const pdfFolderPath = `${dirPath}/PDFReports`;
        console.log('PDF folder path:', pdfFolderPath);

        // Make sure the directory exists
        try {
          const exists = await RNFS.exists(pdfFolderPath);
          if (!exists) {
            console.log(`Directory ${pdfFolderPath} doesn't exist, creating it...`);
            await RNFS.mkdir(pdfFolderPath);
            console.log('PDF folder created successfully');
          } else {
            console.log(`Directory ${pdfFolderPath} exists.`);
          }
          
          // Check if the directory is writable by creating and deleting a test file
          const testFilePath = `${pdfFolderPath}/test.txt`;
          try {
            await RNFS.writeFile(testFilePath, 'test', 'utf8');
            await RNFS.unlink(testFilePath);
            console.log('PDF folder is writable');
            
            // Use the PDF folder for saving
            dirPath = pdfFolderPath;
          } catch (writeError) {
            console.error('PDF folder is not writable:', writeError);
            // Continue using the main cache directory
            console.log('Using main cache directory instead');
          }
        } catch (dirError) {
          console.error('Error with PDF folder:', dirError);
          // Just use the main cache directory
          console.log('Using main cache directory instead');
        }
      }
      
      // Create full file path safely
      const filePath = `${dirPath}/${fileName}`;
      console.log('Saving PDF to:', filePath);
      
      try {
        // Update progress
        setDownloadProgress(25);
        updateProgressUI(25, 'Creating PDF document...');
        
        // Create a PDF document
        const pdfDoc = await PDFDocument.create();
        
        // Since we have a lot of data, let's calculate how many rows we can fit per page
        // depending on the amount of data we have
        const totalRows = reportData.length;
        let rowsPerPage = 0;
        let rowHeight = 0;
        let fontSize = 0;
        let headerSize = 0;
        let lineHeight = 0;
        
        // Dynamically adjust sizes based on total rows
        if (totalRows <= 10) {
          // Very small dataset - can use larger sizes
          rowHeight = 45;  // Increased from 40
          fontSize = 9;
          headerSize = 11;
          lineHeight = 12;
        } else if (totalRows <= 20) {
          // Small dataset
          rowHeight = 35;  // Increased from 30
          fontSize = 8;
          headerSize = 10;
          lineHeight = 10;
        } else if (totalRows <= 40) {
          // Medium dataset
          rowHeight = 28;  // Increased from 24
          fontSize = 7;
          headerSize = 9;
          lineHeight = 9;
        } else if (totalRows <= 60) {
          // Large dataset
          rowHeight = 22;  // Increased from 18
          fontSize = 6;
          headerSize = 8;
          lineHeight = 8;
        } else {
          // Very large dataset
          rowHeight = 20;  // Increased from 16
          fontSize = 6;
          headerSize = 7;
          lineHeight = 7;
        }
        
        // Helper function to draw text that wraps and returns the text height
        const drawWrappedText = (
          page: PDFPage,
          text: string,
          x: number,
          y: number,
          width: number,
          fontSize: number,
          options?: { 
            align?: string,
            lineHeight?: number,
            font?: PDFFont
          }
        ) => {
          const { align = 'left' } = options || {};
          const lineHeight = options?.lineHeight || fontSize * 1.2;
          const font = options?.font || page.doc.embedStandardFont(StandardFonts.Helvetica);
          
          // Handle common product patterns for better wrapping
          let formattedText = text
            .replace(/(\d+)\s*(KG|BOX|BAG)/gi, '$1 $2\n')
            .replace(/(\w+)\s+(\d+)\s*(KG|BOX|BAG)/gi, '$1\n$2 $3');

          // Split text into lines
          const words = formattedText.split(' ');
          const lines: string[] = [];
          let currentLine = '';
          
          // Create lines that fit within width
          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            
            if (testWidth <= width) {
              currentLine = testLine;
            } else {
              if (currentLine) {
                lines.push(currentLine);
                currentLine = word;
              } else {
                lines.push(word);
                currentLine = '';
              }
            }
          }
          
          // Add the last line if it has content
          if (currentLine) {
            lines.push(currentLine);
          }
          
          // Calculate total height
          const totalHeight = lines.length * lineHeight;
          
          lines.forEach((line: string, i: number) => {
            let xPos = x;
            if (align === 'center') {
              const lineWidth = font.widthOfTextAtSize(line, fontSize);
              xPos = x + (width - lineWidth) / 2;
            } else if (align === 'right') {
              const lineWidth = font.widthOfTextAtSize(line, fontSize);
              xPos = x + width - lineWidth - 4;
            }
            // Use the custom lineHeight here too
            page.drawText(line, {
              x: xPos,
              y: y - (i * lineHeight) + totalHeight / 2 - fontSize / 2,
              size: fontSize,
              font,
            });
          });
        };
        
        // Landscape A4 dimensions
        const pageWidth = 842;
        const pageHeight = 595;
        const margin = 20;
        const rightMargin = 20;
        
        // Calculate available space for the table
        const headerHeight = 160; // Space for title, company name, date range, filters, date entry, etc.
        const continuedPageHeaderHeight = 40; // Smaller header for continued pages
        const footerHeight = 30; // Space for footer
        const availableHeight = pageHeight - margin * 2 - headerHeight - footerHeight;
        const availableHeightContinuedPage = pageHeight - margin * 2 - continuedPageHeaderHeight - footerHeight;
        
        // Calculate how many rows we can fit on each page type
        const rowsPerFirstPage = Math.floor(availableHeight / rowHeight);
        const rowsPerContinuedPage = Math.floor(availableHeightContinuedPage / rowHeight);
        
        // Calculate total pages needed (first page has less capacity)
        let remainingRows = reportData.length - rowsPerFirstPage;
        let totalPages = 1; // Start with first page
        
        if (remainingRows > 0) {
          // Add more pages as needed
          totalPages += Math.ceil(remainingRows / rowsPerContinuedPage);
        }
        
        console.log(`PDF generation: ${reportData.length} rows, ${rowsPerFirstPage} rows on first page, ${rowsPerContinuedPage} rows on continued pages, ${totalPages} pages total`);
        
        // Define columns with responsive widths
        const tableColumns = [
          { title: '#', width: 25 },
          { title: 'Unit', width: 40 },
          { title: isInward ? 'Inward Date' : 'Outward Date', width: 70 },
          { title: isInward ? 'Inward No' : 'Outward No', width: 60 },
          { title: 'Customer', width: 80 },
          { title: 'Vehicle', width: 60 },
          { title: 'Lot No', width: 45 },
          { title: 'Item Name', width: 90 },
          { title: 'Remark', width: 50 },
          { title: 'Item', width: 50 },
          { title: 'Vakkal', width: 40 },
          { title: 'Qty', width: 35 },
          { title: 'Delivered', width: 55 }
        ];
        
        // Calculate table width
        const tableWidth = tableColumns.reduce((sum, col) => sum + col.width, 0);
        
        // Calculate which rows go on each page
        let processedRows = 0;
        
        // Generate all pages
        for (let pageNumber = 0; pageNumber < totalPages; pageNumber++) {
          // Create a new page
          const page = pdfDoc.addPage([pageWidth, pageHeight]);
          
          // Initial y-position from top of page
          let yPosition = pageHeight - margin;
          
          // Calculate rows for this page
          const isFirstPage = pageNumber === 0;
          const rowsOnThisPage = isFirstPage ? rowsPerFirstPage : rowsPerContinuedPage;
          const startRow = processedRows;
          const endRow = Math.min(startRow + rowsOnThisPage, reportData.length);
          
          // Draw page header based on page type
          if (isFirstPage) {
            // Draw title
            const boldFont = await pdfDoc.embedFont('Helvetica-Bold');
            page.drawText(isInward ? 'Inward Report' : 'Outward Report', {
              x: margin,
              y: yPosition - 20,
              size: 18,
              font: boldFont,
              color: rgb(0, 0, 0),
            });
            
            // Add company name below title (only on first page)
            page.drawText('Savla Foods & Cold Storage Pvt Ltd', {
              x: margin,
              y: yPosition - 45,
              size: 12,
              color: rgb(0.2, 0.2, 0.2),
            });
            
            yPosition -= 65; // Adjusted to accommodate company name
            
            // Add current date in same format as other header items
            const currentDate = new Date();
            const formattedCurrentDate = `Date: ${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
            
            page.drawText(formattedCurrentDate, {
              x: margin,
              y: yPosition,
              size: 10,
              color: rgb(0.2, 0.2, 0.2),
            });
            
            yPosition -= 20; // Slightly more space after the date
            
            // Draw date range
            page.drawText(`From: ${formatDate(fromDate)} To: ${formatDate(toDate)}`, {
              x: margin,
              y: yPosition,
              size: 10,
              color: rgb(0.2, 0.2, 0.2),
            });
            
            yPosition -= 20; // Extra space after the date line
            
            // Draw filters
            let filtersText = ` Customer: ${customerName}`;
            if (unit) filtersText += `, Unit: ${unit}`;
            if (itemCategory) filtersText += `, Category: ${itemCategory}`;
            if (itemSubcategory) filtersText += `, Subcategory: ${itemSubcategory}`;
            
            page.drawText(filtersText, {
              x: margin,
              y: yPosition,
              size: 8,
              color: rgb(0.3, 0.3, 0.3),
            });
            
            yPosition -= 20;
            
            // Draw record count
            page.drawText(`Records found: ${reportData.length}`, {
              x: margin,
              y: yPosition,
              size: 10,
              color: rgb(0.2, 0.2, 0.2),
            });
            
            yPosition -= 20;
            

          } else {
            // For continued pages, just add a small header
            const boldFont = await pdfDoc.embedFont('Helvetica-Bold');
            page.drawText(`${isInward ? 'Inward' : 'Outward'} Report (Continued)`, {
              x: margin,
              y: yPosition - 20,
              size: 14,
              font: boldFont,
              color: rgb(0, 0, 0),
            });
            
            yPosition -= 40;
          }
          
          // Table start position
          const tableTop = yPosition;
          
          // Draw table outer border
          page.drawRectangle({
            x: margin,
            y: tableTop - (endRow - startRow + 1) * rowHeight, // +1 for header row
            width: tableWidth,
            height: (endRow - startRow + 1) * rowHeight,
            borderColor: rgb(0.7, 0.7, 0.7),
            borderWidth: 1,
            color: rgb(1, 1, 1), // White fill
          });
          
          // Draw table header
          page.drawRectangle({
            x: margin,
            y: tableTop - rowHeight,
            width: tableWidth,
            height: rowHeight,
            color: rgb(0.95, 0.95, 0.95), // Light gray background
            borderWidth: 1,
            borderColor: rgb(0.7, 0.7, 0.7),
          });
          
          // Draw vertical column lines for the entire table height
          let xPosition = margin;
          for (const column of tableColumns) {
            xPosition += column.width;
            
            // Don't draw line after the last column
            if (column !== tableColumns[tableColumns.length - 1]) {
              page.drawLine({
                start: { x: xPosition, y: tableTop },
                end: { x: xPosition, y: tableTop - (endRow - startRow + 1) * rowHeight },
                color: rgb(0.7, 0.7, 0.7),
                thickness: 0.5,
              });
            }
          }
          
          // Draw column headers
          xPosition = margin;
          const boldFont = await pdfDoc.embedFont('Helvetica-Bold');
          for (let colIndex = 0; colIndex < tableColumns.length; colIndex++) {
            const column = tableColumns[colIndex];
            
            // Determine alignment for this column
            let columnAlign: 'left' | 'center' | 'right' = 'left';
            
            // Center align numeric columns and first column (#)
            if (colIndex === 0 || colIndex === 11) { // # column and Qty column
              columnAlign = 'center';
            }
            
            // Apply consistent alignment to column header
            drawWrappedText(
              page,
              column.title,
              xPosition + 4,
              tableTop - rowHeight/2,
              column.width - 8,
              headerSize,
              { font: boldFont, align: columnAlign }
            );
            
            xPosition += column.width;
          }
          
          // Draw horizontal line after the header
          page.drawLine({
            start: { x: margin, y: tableTop - rowHeight },
            end: { x: margin + tableWidth, y: tableTop - rowHeight },
            color: rgb(0.7, 0.7, 0.7),
            thickness: 0.75,
          });
          
          // Draw data rows
          for (let i = startRow; i < endRow; i++) {
            const item = reportData[i];
            const rowY = tableTop - rowHeight - (i - startRow) * rowHeight;
            
            // Draw row background (alternating colors)
            page.drawRectangle({
              x: margin,
              y: rowY - rowHeight,
              width: tableWidth,
              height: rowHeight,
              color: i % 2 === 0 ? 
                rgb(0.98, 0.98, 1) : // Very light blue for even rows
                rgb(1, 1, 1),        // White for odd rows
              borderWidth: 0,
            });
            
            // Draw horizontal line after each data row
            page.drawLine({
              start: { x: margin, y: rowY - rowHeight },
              end: { x: margin + tableWidth, y: rowY - rowHeight },
              color: rgb(0.8, 0.8, 0.8),
              thickness: 0.5,
            });
            
            // Insert data in each cell
            xPosition = margin;
            const boldFont = await pdfDoc.embedFont('Helvetica-Bold');
            
            // Array to store alignments for each column
            const columnAlignments = tableColumns.map((_, index) => {
              // Determine alignment for this column
              if (index === 0 || index === 11) { // # column and Qty column
                return 'center';
              }
              return 'left';
            }) as ('left' | 'center' | 'right')[];
            
            // Column 1: Index number
            drawWrappedText(
              page, 
              String(i + 1), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[0].width - 8,
              fontSize,
              { align: columnAlignments[0] }
            );
            
            xPosition += tableColumns[0].width;
            
            // Column 2: Unit
            drawWrappedText(
              page, 
              String(item.UNIT_NAME || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[1].width - 8,
              fontSize,
              { align: columnAlignments[1] }
            );
            
            xPosition += tableColumns[1].width;
            
            // Column 3: Date
            const dateText = isInward
              ? item.GRN_DATE
                ? new Date(item.GRN_DATE).toLocaleDateString('en-GB') // Use UK format: DD/MM/YYYY
                : '-'
              : item.OUTWARD_DATE
              ? new Date(item.OUTWARD_DATE).toLocaleDateString('en-GB') // Use UK format: DD/MM/YYYY
              : '-';
            
            drawWrappedText(
              page, 
              String(dateText), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[2].width - 8,
              fontSize,
              { align: columnAlignments[2] }
            );
            
            xPosition += tableColumns[2].width;
            
            // Column 4: Inward/Outward No
            drawWrappedText(
              page, 
              String(isInward ? (item.GRN_NO || '-') : (item.OUTWARD_NO || '-')), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[3].width - 8,
              fontSize,
              { align: columnAlignments[3] }
            );
            
            xPosition += tableColumns[3].width;
            
            // Column 5: Customer
            drawWrappedText(
              page, 
              String(item.CUSTOMER_NAME || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[4].width - 8,
              fontSize,
              { align: columnAlignments[4] }
            );
            
            xPosition += tableColumns[4].width;
            
            // Column 6: Vehicle
            drawWrappedText(
              page, 
              String(item.VEHICLE_NO || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[5].width - 8,
              fontSize,
              { align: columnAlignments[5] }
            );
            
            xPosition += tableColumns[5].width;
            
            // Column 7: Lot No
            drawWrappedText(
              page, 
              String(item.LOT_NO || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[6].width - 8,
              fontSize,
              { align: columnAlignments[6] }
            );
            
            xPosition += tableColumns[6].width;
            
            // Column 8: Item Name
            drawWrappedText(
              page, 
              String(item.ITEM_NAME || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[7].width - 8,
              fontSize,
              { 
                align: columnAlignments[7],
                // Add a custom line height for item names to better match screenshot
                lineHeight: lineHeight * 1.2
              }
            );
            
            xPosition += tableColumns[7].width;
            
            // Column 9: Remark
            drawWrappedText(
              page, 
              String(item.REMARK || item.REMARKS || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[8].width - 8,
              fontSize,
              { align: columnAlignments[8] }
            );
            
            xPosition += tableColumns[8].width;
            
            // Column 10: Item Mark
            drawWrappedText(
              page, 
              String(item.ITEM_MARKS || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[9].width - 8,
              fontSize,
              { align: columnAlignments[9] }
            );
            
            xPosition += tableColumns[9].width;
            
            // Column 11: Vakkal No
            drawWrappedText(
              page, 
              String(item.VAKAL_NO || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[10].width - 8,
              fontSize,
              { align: columnAlignments[10] }
            );
            
            xPosition += tableColumns[10].width;
            
            // Column 12: Qty
            drawWrappedText(
              page, 
              String(isInward ? (item.QUANTITY || '-') : (item.DC_QTY || '-')), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[11].width - 8,
              fontSize,
              { align: columnAlignments[11] }
            );
            
            xPosition += tableColumns[11].width;
            
            // Column 13: Delivered To
            drawWrappedText(
              page, 
              String(item.DELIVERED_TO || '-'), 
              xPosition + 4, 
              rowY - rowHeight/2, // Center in the row
              tableColumns[12].width - 8,
              fontSize,
              { align: columnAlignments[12] }
            );
          }
          
          // Add total row on the last page
          if (pageNumber === totalPages - 1) {
            // Calculate position for total row
            const totalRowY = tableTop - rowHeight - (endRow - startRow) * rowHeight;
            
            // Draw total row background
            page.drawRectangle({
              x: margin,
              y: totalRowY - rowHeight,
              width: tableWidth,
              height: rowHeight,
              color: rgb(0.95, 0.95, 0.95), // Light gray background
              borderWidth: 0,
            });
            
            // Calculate total quantity
            const totalQty = reportData.reduce((total, item) => {
              const qty = isInward 
                ? parseFloat(item.QUANTITY || '0') 
                : parseFloat(item.DC_QTY || '0');
              return total + (isNaN(qty) ? 0 : qty);
            }, 0);
            
            // Draw total text
            drawWrappedText(
              page, 
              `Total Quantity: ${totalQty.toFixed(2)}`, 
              margin + 10, 
              totalRowY - rowHeight/2, // Center in the row 
              tableWidth - 20,
              headerSize,
              { font: boldFont }
            );
          }
          
          // Add footer with page number
          page.drawText(`Page ${pageNumber + 1} of ${totalPages}`, {
            x: pageWidth - margin - 100,
            y: margin,
            size: 8,
            color: rgb(0.5, 0.5, 0.5),
          });
          
          // Add generation timestamp on all pages (removed pageNumber === 0 condition)
          page.drawText(`Generated: ${new Date().toLocaleString()}`, {
            x: margin,
            y: margin,
            size: 8,
            color: rgb(0.5, 0.5, 0.5),
          });
          
          // Update progress for each page
          setDownloadProgress(30 + Math.floor((pageNumber + 1) / totalPages * 50));
          updateProgressUI(30 + Math.floor((pageNumber + 1) / totalPages * 50), 
            `Creating page ${pageNumber + 1} of ${totalPages}...`);
          
          // Update processed rows
          processedRows += rowsOnThisPage;
        }
            
            // Save the PDF
        setDownloadProgress(80);
        updateProgressUI(80, 'Finalizing PDF...');
            console.log('Saving PDF document...');
            const pdfBytes = await pdfDoc.save();
            
            // Convert to base64 for React Native FS
            console.log('Converting PDF to base64...');
            const base64Pdf = Buffer.from(pdfBytes).toString('base64');
            
            // Write the PDF file
            console.log('Writing PDF file to disk...');
            await RNFS.writeFile(filePath, base64Pdf, 'base64');
            console.log('PDF file created successfully');
            
            // Update progress
            setDownloadProgress(100);
            updateProgressUI(100, 'Download complete!');
            
            // Show success alert
            Alert.alert(
              'Success',
              'Report downloaded as PDF successfully!',
              [
                {
                  text: 'View PDF',
                  onPress: () => openPdf(filePath),
                },
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ]
            );
        } catch (error) {
          console.error('Error generating PDF:', error);
          Alert.alert('Error', 'Failed to generate PDF report: ' + (error instanceof Error ? error.message : String(error)));
        } finally {
          setPdfGenerating(false);
        }
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setPdfGenerating(false);
      Alert.alert('Error', 'Failed to download report: ' + (err instanceof Error ? err.message : String(err)));
    }
  };
  
  // Update progress UI
  const updateProgressUI = (progress: number, message: string): void => {
    // Update the progress state to reflect in the UI
    setDownloadProgress(progress);
  };
  
  // Open the generated PDF
  const openPdf = async (filePath: string): Promise<void> => {
    try {
      await FileViewer.open(filePath, {
        showOpenWithDialog: true,
        showAppsSuggestions: true,
      });
    } catch (error) {
      console.error('Error opening PDF:', error);
      Alert.alert('Error', 'Could not open the PDF file');
    }
  };

  // Add a function to go back to the form
  const handleBackToForm = () => {
    setShowForm(true);
    setShowReport(false);
  };

  // Render appropriate picker components for iOS
  const renderIOSPicker = () => {
    switch (currentPicker) {
      case 'category':
        return (
          <Picker
            selectedValue={itemCategory}
            onValueChange={value => setItemCategory(value)}
            style={styles.iosPicker}
            itemStyle={styles.iosPickerItem}>
            <Picker.Item label="Select Category" value="" />
            {apiCategories.map((category, index) => (
              <Picker.Item key={index} label={category} value={category} />
            ))}
          </Picker>
        );
      case 'subcategory':
        return (
          <Picker
            selectedValue={itemSubcategory}
            onValueChange={value => setItemSubcategory(value)}
            style={styles.iosPicker}
            itemStyle={styles.iosPickerItem}>
            <Picker.Item label="Select Subcategory" value="" />
            {itemCategory &&
              apiSubcategories[itemCategory] &&
              apiSubcategories[itemCategory].map(
                (subcategory: string, index: number) => (
                  <Picker.Item
                    key={index}
                    label={subcategory}
                    value={subcategory}
                  />
                ),
              )}
          </Picker>
        );
      case 'unit':
        return (
          <Picker
            selectedValue={unit}
            onValueChange={value => setUnit(value)}
            style={styles.iosPicker}
            itemStyle={styles.iosPickerItem}>
            <Picker.Item label="Select Unit" value="" />
            {units.map((unit, index) => (
              <Picker.Item key={index} label={unit} value={unit} />
            ))}
          </Picker>
        );
      default:
        return null;
    }
  };

  // Render picker based on platform
  const renderPicker = (
    pickerType: string,
    value: string,
    label: string,
    items: string[],
    onValueChange: (value: string) => void,
    enabled: boolean = true,
  ) => {
    if (Platform.OS === 'ios') {
      return (
        <TouchableOpacity
          style={[styles.pickerContainer, !enabled && styles.disabledPicker]}
          onPress={() => {
            if (enabled) openPicker(pickerType);
          }}
          disabled={!enabled}>
          <Text
            style={value ? styles.pickerTextSelected : styles.pickerPlaceholder}
            numberOfLines={1}
            ellipsizeMode="tail">
            {value || `Select ${label}`}
          </Text>
          <MaterialIcons name="arrow-drop-down" size={24} color="#555" />
        </TouchableOpacity>
      );
    } else {
      // For Android, create better contrast with a dark background
      return (
        <View
          style={[
            styles.androidPickerContainer,
            !enabled && styles.disabledAndroidPicker,
          ]}>
          {/* The text that shows the selected value */}
          <Text
            style={[
              styles.androidSelectedText,
              !enabled && styles.disabledAndroidText,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {value || `Select ${label}`}
          </Text>

          {/* Dropdown arrow icon */}
          <MaterialIcons
            name="arrow-drop-down"
            size={28}
            color="#2C3E50"
            style={styles.androidDropdownIcon}
          />

          {/* The actual picker is transparent and overlays the text */}
          <Picker
            selectedValue={value}
            onValueChange={onValueChange}
            enabled={enabled}
            mode="dropdown"
            prompt={`Select ${label}`}
            style={styles.androidPicker}>
            <Picker.Item label={`Select ${label}`} value="" color="#FFFFFF" />
            {items.map((item, index) => (
              <Picker.Item
                key={index}
                label={item}
                value={item}
                color="#FFFFFF"
              />
            ))}
          </Picker>
        </View>
      );
    }
  };

  // Request storage permissions (for Android)
  const requestStoragePermission = async () => {
    if (Platform.OS !== 'android') return true;
    
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      ]);
      
      const writeGranted = 
        granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === 
        PermissionsAndroid.RESULTS.GRANTED;
      
      const readGranted = 
        granted[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === 
        PermissionsAndroid.RESULTS.GRANTED;
      
      if (writeGranted && readGranted) {
        console.log('Storage permissions granted');
        return true;
      } else {
        console.log('Storage permissions denied');
        Alert.alert(
          'Permission Required', 
          'Storage permission is required to save PDFs',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Reset subcategory when category changes
  useEffect(() => {
    if (itemCategory) {
      setItemSubcategory('');
    }
  }, [itemCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={isInward ? '#F48221' : '#4682B4'}
        barStyle="light-content"
      />

      {showForm ? (
        // Form Section
        <ScrollView style={styles.container}>
          {/* Toggle Button */}
          <View style={styles.toggleContainer}>
            <Text
              style={[
                styles.toggleText,
                !isInward && styles.toggleTextInactive,
              ]}>
              Inward
            </Text>
            <TouchableOpacity
              style={[
                styles.toggleButton,
                {backgroundColor: isInward ? '#F48221' : '#4682B4'},
              ]}
              onPress={() => setIsInward(!isInward)}>
              <View
                style={[
                  styles.toggleCircle,
                  {
                    left: isInward ? 4 : 36,
                    backgroundColor: '#FFFFFF',
                  },
                ]}
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.toggleText,
                isInward && styles.toggleTextInactive,
              ]}>
              Outward
            </Text>
          </View>

          <View
            style={[
              styles.formContainer,
              isInward ? styles.inwardForm : styles.outwardForm,
            ]}>
            <Text
              style={[
                styles.formTitle,
                {color: isInward ? '#F48221' : '#4682B4'},
              ]}>
              {isInward ? 'Inward Report' : 'Outward Report'}
            </Text>

            {/* Loading Indicator */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator
                  size="large"
                  color={isInward ? '#F48221' : '#4682B4'}
                />
                <Text style={styles.loadingText}>Loading categories...</Text>
              </View>
            )}

            {/* Date Fields with Calendar Pickers */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>From Date</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() => showDatePicker('from')}>
                <View style={styles.dateInputContent}>
                  <MaterialIcons
                    name="event"
                    size={20}
                    color="#718096"
                    style={styles.inputIcon}
                  />
                  <Text style={styles.dateText}>{formatDate(fromDate)}</Text>
                </View>
              </TouchableOpacity>
              {showFromDatePicker && Platform.OS === 'android' && (
                <DateTimePicker
                  testID="fromDatePicker"
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={onFromDateChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>To Date</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() => showDatePicker('to')}>
                <View style={styles.dateInputContent}>
                  <MaterialIcons
                    name="event-available"
                    size={20}
                    color="#718096"
                    style={styles.inputIcon}
                  />
                  <Text style={styles.dateText}>{formatDate(toDate)}</Text>
                </View>
              </TouchableOpacity>
              {showToDatePicker && Platform.OS === 'android' && (
                <DateTimePicker
                  testID="toDatePicker"
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={onToDateChange}
                />
              )}
            </View>

            {/* Dropdown Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Category</Text>
              {renderPicker(
                'category',
                itemCategory,
                'Category',
                apiCategories,
                value => setItemCategory(value),
                !loading,
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Item Subcategory</Text>
              {renderPicker(
                'subcategory',
                itemSubcategory,
                'Subcategory',
                itemCategory && apiSubcategories[itemCategory]
                  ? apiSubcategories[itemCategory]
                  : [],
                value => setItemSubcategory(value),
                !!itemCategory && !loading,
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Unit</Text>
              {renderPicker('unit', unit, 'Unit', units, value =>
                setUnit(value),
              )}
            </View>

            {/* Action Buttons */}
            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {backgroundColor: isInward ? '#F48221' : '#4682B4'},
                ]}
                onPress={handleSearch}>
                <MaterialIcons
                  name="search"
                  size={20}
                  style={{color: '#FFFFFF'}}
                />
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClear}>
                <MaterialIcons
                  name="clear"
                  size={20}
                  style={{color: '#FFFFFF'}}
                />
                <Text style={styles.buttonText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      ) : (
        // Results Section - Enhanced UI
        <View style={styles.reportContainer}>
          {/* PDF Generation Loading Overlay */}
          {pdfGenerating && (
            <View style={styles.pdfLoadingOverlay}>
              <View style={styles.pdfLoadingCard}>
                <ActivityIndicator size="large" color={isInward ? '#F48221' : '#4682B4'} />
                <Text style={styles.pdfLoadingText}>Generating PDF...</Text>
                <View style={styles.progressBarContainer}>
                  <View 
                    style={[
                      styles.progressBar, 
                      { 
                        width: `${downloadProgress}%`,
                        backgroundColor: isInward ? '#F48221' : '#4682B4' 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{downloadProgress}%</Text>
              </View>
            </View>
          )}
        
          {/* Wrap the content in ViewShot for PDF generation */}
          <ViewShot 
            ref={reportRef} 
            options={{ 
              format: 'jpg', 
              quality: 0.9,
              result: 'tmpfile'
            }}
            style={{ flex: 1 }}
          >
            {/* Enhanced Header with back button */}
            <View
              style={[
                styles.reportHeader,
                {
                  backgroundColor: '#f8f8f8',
                  borderColor: isInward ? '#F48221' : '#4682B4',
                },
              ]}>
              <TouchableOpacity
                style={[
                  styles.backButton,
                  {
                    borderColor: isInward ? '#F48221' : '#4682B4',
                    backgroundColor: '#FFFFFF',
                  },
                ]}
                onPress={handleBackToForm}>
                <MaterialIcons
                  name="arrow-circle-left"
                  size={20}
                  color={isInward ? '#F48221' : '#4682B4'}
                />
                <Text
                  style={[
                    styles.backButtonText,
                    {color: isInward ? '#F48221' : '#4682B4'},
                  ]}>
                  Back
                </Text>
              </TouchableOpacity>
              <Text
                style={[
                  styles.reportTitle,
                  {color: isInward ? '#F48221' : '#4682B4'},
                ]}>
                {isInward ? 'Inward Report Results' : 'Outward Report Results'}
              </Text>
              <TouchableOpacity
                style={[
                  styles.pdfButton,
                  {backgroundColor: isInward ? '#F48221' : '#4682B4'},
                  pdfGenerating && styles.disabledButton
                ]}
                onPress={handlePdfDownload}
                disabled={pdfGenerating}>
                <MaterialIcons name="download" size={20} color="#FFFFFF" />
                <Text style={styles.pdfButtonText}>PDF</Text>
              </TouchableOpacity>
            </View>

            {/* Enhanced Loading indicator or results count */}
            <View style={[styles.reportSubHeader, {backgroundColor: '#f8f8f8'}]}>
              {isReportLoading ? (
                <View style={styles.loadingIndicatorContainer}>
                  <ActivityIndicator
                    size="small"
                    color={isInward ? '#F48221' : '#4682B4'}
                  />
                  <Text style={styles.loadingIndicatorText}>
                    Loading results...
                  </Text>
                </View>
              ) : (
                <View style={styles.resultsSummaryContainer}>
                  <MaterialIcons
                    name="receipt-long"
                    size={18}
                    color={isInward ? '#F48221' : '#4682B4'}
                  />
                  <Text
                    style={[
                      styles.reportCountText,
                      {color: isInward ? '#F48221' : '#4682B4'},
                    ]}>
                    {reportData.length}{' '}
                    {reportData.length === 1 ? 'record' : 'records'} found
                  </Text>
                </View>
              )}
            </View>

            {/* Results table with enhanced UI */}
            {reportData.length > 0 ? (
              <>
                <View
                  style={[
                    styles.scrollHintContainer,
                    {backgroundColor: '#f8f8f8'},
                  ]}>
                  <MaterialIcons name="swipe" size={16} color="#64748B" />
                  <Text style={styles.scrollHintText}>
                    Swipe horizontally to see all columns
                  </Text>
                </View>
                <View style={styles.tableContainer}>
                  <ScrollView
                    ref={tableRef}
                    horizontal={true}
                    showsHorizontalScrollIndicator={true}>
                    <ScrollView
                      nestedScrollEnabled={true}
                      showsVerticalScrollIndicator={true}>
                      <View style={styles.tableWrapper}>
                        <View
                          style={[
                            styles.tableHeader,
                            {backgroundColor: '#f8f8f8'},
                          ]}>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 40,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            #
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 70,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Unit
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 100,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            {isInward ? 'Inward Date' : 'Outward Date'}
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 100,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            {isInward ? 'Inward No' : 'Outward No'}
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 150,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Customer
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 120,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Vehicle
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 80,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Lot No
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 150,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Item Name
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 100,
                                color: isInward ? '#F48221' : '#4682B4',
                                textAlign: 'center',
                              },
                            ]}>
                            Remark
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 100,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Item Mark
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 80,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Vakkal No
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 60,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Qty
                          </Text>
                          <Text
                            style={[
                              styles.tableHeaderCell,
                              {
                                width: 120,
                                color: isInward ? '#F48221' : '#4682B4',
                              },
                            ]}>
                            Delivered To
                          </Text>
                        </View>
                        {reportData.map((item, index) => (
                          <View
                            key={`row-${index}`}
                            style={[
                              styles.tableRow,
                              index % 2 === 0
                                ? {
                                    backgroundColor: isInward
                                      ? '#FFF9F2'
                                      : '#F0F7FF',
                                  }
                                : {backgroundColor: '#FFFFFF'},
                            ]}>
                            <Text
                              style={[
                                styles.tableCell,
                                {width: 40, fontWeight: 'bold'},
                              ]}>
                              {index + 1}
                            </Text>
                            <Text style={[styles.tableCell, {width: 70}]}>
                              {item.UNIT_NAME || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 100}]}>
                              {isInward
                                ? item.GRN_DATE
                                  ? new Date(item.GRN_DATE).toLocaleDateString()
                                  : '-'
                                : item.OUTWARD_DATE
                                ? new Date(item.OUTWARD_DATE).toLocaleDateString()
                                : '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 100}]}>
                              {isInward
                                ? item.GRN_NO || '-'
                                : item.OUTWARD_NO || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 150}]}>
                              {item.CUSTOMER_NAME || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 120}]}>
                              {item.VEHICLE_NO || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 80}]}>
                              {item.LOT_NO || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 150}]}>
                              {item.ITEM_NAME || '-'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCell,
                                {width: 100, textAlign: 'center'},
                              ]}>
                              {item.REMARK || item.REMARKS || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 100}]}>
                              {item.ITEM_MARKS || '-'}
                            </Text>
                            <Text style={[styles.tableCell, {width: 80}]}>
                              {item.VAKAL_NO || '-'}
                            </Text>
                            <Text
                              style={[
                                styles.tableCell,
                                {width: 60, fontWeight: 'bold'},
                              ]}>
                              {isInward
                                ? item.QUANTITY || '-'
                                : item.DC_QTY || '-'}
                            </Text>
                            {/* <Text style={[styles.tableCell, {width: 120}]}>
                  {item.DELIVERED_TO || '-'}
                </Text> */}
                            {/* Only show Delivered To for outward reports */}
                            {/* {!isInward && ( */}
                            <Text style={[styles.tableCell, {width: 120}]}>
                              {item.DELIVERED_TO || '-'}
                            </Text>
                            {/* )} */}
                          </View>
                        ))}
                      </View>
                    </ScrollView>
                  </ScrollView>
                </View>
              </>
            ) : (
              !isReportLoading && (
                <View style={styles.emptyStateContainer}>
                  <MaterialIcons name="search-off" size={48} color="#94A3B8" />
                  <Text style={styles.emptyStateTitle}>No Data Found</Text>
                  <Text style={styles.emptyStateText}>
                    No records match your search criteria. Try adjusting your
                    filters.
                  </Text>
                </View>
              )
            )}
          </ViewShot>
        </View>
      )}

      {/* iOS Picker Modal */}
      {Platform.OS === 'ios' && (
        <Modal
          visible={isPickerVisible}
          transparent={true}
          animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.pickerModalContent}>
              <View style={styles.pickerHeader}>
                <TouchableOpacity
                  onPress={() => setIsPickerVisible(false)}
                  style={styles.doneButton}>
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
              {renderIOSPicker()}
            </View>
          </View>
        </Modal>
      )}

      {/* iOS Date Picker Modal */}
      {/* <Modal
 visible={showFromDatePicker && Platform.OS === 'ios'}
 transparent={true}
 animationType="slide">
 <View style={styles.iosDatePickerModal}>
 <View style={styles.iosDatePickerContainer}>
 <View style={styles.iosDatePickerHeader}>
 <Text style={styles.iosDatePickerTitle}>Select From Date</Text>
 <TouchableOpacity onPress={() => setShowFromDatePicker(false)}>
 <Text style={styles.iosDatePickerDoneBtn}>Done</Text>
 </TouchableOpacity>
 </View>
 <DateTimePicker
 testID="fromDatePickerIOS"
 value={fromDate}
 mode="date"
 display="spinner"
 onChange={(event, date) => {
 if (date) setFromDate(date);
 }}
 style={styles.iosDatePicker}
 textColor="#000000"
 />
 <TouchableOpacity
 style={styles.iosDatePickerConfirmBtn}
 onPress={() => {
 onFromDateChange({}, fromDate);
 setShowFromDatePicker(false);
 }}>
 <Text style={styles.iosDatePickerConfirmText}>Confirm Date</Text>
 </TouchableOpacity>
 </View>
 </View>
 </Modal> */}

      <Modal
        visible={showFromDatePicker && Platform.OS === 'ios'}
        transparent={true}
        animationType="slide">
        <View style={styles.iosDatePickerModal}>
          <View
            style={[
              styles.iosDatePickerContainer,
              isInward ? styles.inwardDatePicker : styles.outwardDatePicker,
            ]}>
            <View style={styles.iosDatePickerHeader}>
              <Text style={styles.iosDatePickerTitle}>Select From Date</Text>
              <TouchableOpacity onPress={() => setShowFromDatePicker(false)}>
                <Text
                  style={[
                    styles.iosDatePickerDoneBtn,
                    {color: isInward ? '#F48221' : '#4682B4'},
                  ]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              testID="fromDatePickerIOS"
              value={fromDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) setFromDate(date);
              }}
              style={styles.iosDatePicker}
              textColor={isInward ? '#F48221' : '#4682B4'} // Set text color based on mode
            />
            <TouchableOpacity
              style={[
                styles.iosDatePickerConfirmBtn,
                {backgroundColor: isInward ? '#F48221' : '#4682B4'},
              ]}
              onPress={() => {
                onFromDateChange({}, fromDate);
                setShowFromDatePicker(false);
              }}>
              <Text style={styles.iosDatePickerConfirmText}>Confirm Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* <Modal
 visible={showToDatePicker && Platform.OS === 'ios'}
 transparent={true}
 animationType="slide">
 <View style={styles.iosDatePickerModal}>
 <View style={styles.iosDatePickerContainer}>
 <View style={styles.iosDatePickerHeader}>
 <Text style={styles.iosDatePickerTitle}>Select To Date</Text>
 <TouchableOpacity onPress={() => setShowToDatePicker(false)}>
 <Text style={styles.iosDatePickerDoneBtn}>Done</Text>
 </TouchableOpacity>
 </View>
 <DateTimePicker
 testID="toDatePickerIOS"
 value={toDate}
 mode="date"
 display="spinner"
 onChange={(event, date) => {
 if (date) setToDate(date);
 }}
 style={styles.iosDatePicker}
 textColor="#000000"
 />
 <TouchableOpacity
 style={styles.iosDatePickerConfirmBtn}
 onPress={() => {
 onToDateChange({}, toDate);
 setShowToDatePicker(false);
 }}>
 <Text style={styles.iosDatePickerConfirmText}>Confirm Date</Text>
 </TouchableOpacity>
 </View>
 </View>
 </Modal> */}

      <Modal
        visible={showToDatePicker && Platform.OS === 'ios'}
        transparent={true}
        animationType="slide">
        <View style={styles.iosDatePickerModal}>
          <View
            style={[
              styles.iosDatePickerContainer,
              isInward ? styles.inwardDatePicker : styles.outwardDatePicker,
            ]}>
            <View style={styles.iosDatePickerHeader}>
              <Text style={styles.iosDatePickerTitle}>Select To Date</Text>
              <TouchableOpacity onPress={() => setShowToDatePicker(false)}>
                <Text
                  style={[
                    styles.iosDatePickerDoneBtn,
                    {color: isInward ? '#F48221' : '#4682B4'},
                  ]}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
            <DateTimePicker
              testID="toDatePickerIOS"
              value={toDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => {
                if (date) setToDate(date);
              }}
              style={styles.iosDatePicker}
              textColor={isInward ? '#F48221' : '#4682B4'} // Set text color based on mode
            />
            <TouchableOpacity
              style={[
                styles.iosDatePickerConfirmBtn,
                {backgroundColor: isInward ? '#F48221' : '#4682B4'},
              ]}
              onPress={() => {
                onToDateChange({}, toDate);
                setShowToDatePicker(false);
              }}>
              <Text style={styles.iosDatePickerConfirmText}>Confirm Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    marginHorizontal: 20,
  },
  toggleButton: {
    width: 62,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleTextInactive: {
    opacity: 0.5,
  },
  formContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  inwardForm: {
    // backgroundColor: '#FFF3E5', // Light orange
    backgroundColor: '#FFFBF6',
    borderColor: '#F48221',
    borderWidth: 1,
  },
  outwardForm: {
    // backgroundColor: '#E5F0FF', // Light blue
    backgroundColor: '#F5F9FF',
    borderColor: '#4682B4',
    borderWidth: 1,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  dateInputContainer: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    paddingHorizontal: 12,
  },
  dateInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#2C3E50',
    flex: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
    marginLeft: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  pickerContainer: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    height: 48,
    paddingHorizontal: 12,
    overflow: 'hidden',
  },
  disabledPicker: {
    backgroundColor: '#F5F5F5',
    opacity: 0.7,
  },
  picker: {
    height: 48,
    width: '100%',
  },
  pickerText: {
    fontSize: 14,
    color: '#333',
  },
  pickerPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  pickerTextSelected: {
    fontSize: 15,
    color: '#262626',
    fontWeight: 'bold',
    flex: 1,
  },
  pickerTextContainer: {
    flex: 1,
    paddingVertical: 12,
  },
  iosPicker: {
    width: '100%',
    height: 200,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  clearButton: {
    backgroundColor: '#888888',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  // Loading styles
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  // iOS Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  pickerModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 20,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  doneButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  doneButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // iOS date picker modal styles
  iosPickerItem: {
    color: '#000000', // Black text color for iOS picker items
    fontSize: 16,
  },
  iosDatePickerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  iosDatePickerContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  iosDatePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  iosDatePickerDoneBtn: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F48221',
  },
  iosDatePicker: {
    height: 200,
    marginTop: 10,
  },
  iosDatePickerConfirmBtn: {
    backgroundColor: '#F48221',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 5,
  },
  iosDatePickerConfirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Android picker styles
  androidPickerContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    height: 50,
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  disabledAndroidPicker: {
    opacity: 0.7,
    backgroundColor: '#F0F0F0',
    borderColor: '#E0E0E0',
  },
  androidSelectedText: {
    color: '#2C3E50',
    fontSize: 15,
    maxWidth: '90%',
  },
  androidPicker: {
    width: '100%',
    height: 50,
    position: 'absolute',

    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0, // Make the picker transparent but still functional
  },
  androidDropdownIcon: {
    position: 'absolute',
    right: 12,
  },
  disabledAndroidText: {
    color: '#A0A0A0',
  },
  reportContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: -24, // Increased negative margin to further reduce space above header
  },
  reportHeader: {
    padding: 0,
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    // marginTop: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 4,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  backButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  pdfButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 15,
    borderRadius: 4,
  },
  pdfButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 4,
  },
  reportSubHeader: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  loadingIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIndicatorText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B',
  },
  resultsSummaryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportCountText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  scrollHintContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  scrollHintText: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    margin: 0,
    borderRadius: 0,
  },
  horizontalScrollContainer: {
    flex: 1,
  },
  tableWrapper: {
    flexDirection: 'column',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tableCell: {
    fontSize: 14,
    color: '#334155',
    paddingHorizontal: 6,
    paddingVertical: 2,
    textAlign: 'center',
  },
  emptyTableContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTableText: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    maxWidth: 300,
  },
  pdfLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  pdfLoadingCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  pdfLoadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  // iOS date picker styling
  inwardDatePicker: {
    borderColor: '#F48221',
    borderWidth: 1,
  },
  outwardDatePicker: {
    borderColor: '#4682B4',
    borderWidth: 1,
  },
});

export default InwardOutwardReportScreen;