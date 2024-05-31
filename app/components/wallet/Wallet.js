import React, { useState, useEffect } from 'react';
import { View, Button, Text, Platform, Linking } from 'react-native';
import RNFS from 'react-native-fs';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

const DownloadScreen = () => {
  const [progress, setProgress] = useState(0);
  const [filePath, setFilePath] = useState('');

  useEffect(() => {
    const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS && detail.pressAction.id === 'open-file') {
        openFile(filePath);
      }
    });

    return () => unsubscribe();
  }, [filePath]);

  const openFile = async (path) => {
    const url = Platform.select({
      ios: path,
      android: `file://${path}`
    });

    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('Error opening file:', err);
      notifee.displayNotification({
        title: 'Error',
        body: 'Could not open the file.',
        android: {
          channelId: 'download',
          smallIcon: 'ic_launcher',
        },
      });
    }
  };

  const downloadFile = async () => {
    const url = 'https://www.clickdimensions.com/links/TestPDFfile.pdf';
    const path = `${RNFS.DownloadDirectoryPath}/sample.pdf`;
    setFilePath(path);

    // Create a channel (Android only)
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'download',
        name: 'Download Channel',
        importance: AndroidImportance.HIGH,
      });
    }

    // Display a notification
    const notificationId = await notifee.displayNotification({
      title: 'Downloading PDF',
      body: 'Download in progress...',
      android: {
        channelId: 'download',
        smallIcon: 'ic_launcher', // replace with your app icon
        progress: {
          max: 100,
          current: 0,
          indeterminate: false,
        },
      },
    });

    RNFS.downloadFile({
      fromUrl: url,
      toFile: path,
      progress: res => {
        const progressPercent = Math.round((res.bytesWritten / res.contentLength) * 100);
        setProgress(progressPercent);

        // Ensure progress is always a valid positive number
        const validProgress = Math.max(0, Math.min(progressPercent, 100));

        // Update the notification with progress
        notifee.displayNotification({
          id: notificationId,
          title: 'Downloading PDF',
          body: `Download in progress... ${validProgress}%`,
          android: {
            channelId: 'download',
            smallIcon: 'ic_launcher',
            progress: {
              max: 100,
              current: validProgress,
              indeterminate: false,
            },
          },
        });
      },
      progressDivider: 1,
    }).promise.then(response => {
      notifee.displayNotification({
        id: notificationId,
        title: 'Download Complete',
        body: 'PDF file downloaded successfully. Tap to open.',
        android: {
          channelId: 'download',
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'open-file',
          },
        },
      });
    }).catch(err => {
      console.error(err);
      notifee.displayNotification({
        id: notificationId,
        title: 'Download Failed',
        body: 'An error occurred while downloading the file.',
        android: {
          channelId: 'download',
          smallIcon: 'ic_launcher',
        },
      });
    });
  };

  return (
    <View>
      <Button title="Download PDF" onPress={downloadFile} />
      <Text>Download Progress: {progress}%</Text>
    </View>
  );
};

export default DownloadScreen;



// import React, { useState, useEffect } from 'react';
// import { Button, PermissionsAndroid, Platform, Linking, Alert, View, Text, ActivityIndicator } from 'react-native';
// import RNFS from 'react-native-fs';
// import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// const requestExternalStoragePermission = async () => {
//   try {
//     if (Platform.OS === 'android') {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
//         {
//           title: 'Storage Permission',
//           message: 'This app needs access to your storage so you can download files.',
//           buttonNeutral: 'Ask Me Later',
//           buttonNegative: 'Cancel',
//           buttonPositive: 'OK',
//         },
//       );
//       return granted === PermissionsAndroid.RESULTS.GRANTED;
//     }
//     return true;
//   } catch (err) {
//     console.warn(err);
//     return false;
//   }
// };

// const App = () => {
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const [filePath, setFilePath] = useState('');

//   useEffect(() => {
//     const unsubscribe = notifee.onForegroundEvent(({ type, detail }) => {
//       if (type === EventType.PRESS && detail.pressAction.id === 'open-file') {
//         openFile(filePath);
//       }
//     });

//     return () => unsubscribe();
//   }, [filePath]);

//   const openFile = async (path) => {
//     const url = Platform.select({
//       ios: path,
//       android: `file://${path}`
//     });

//     try {
//       await Linking.openURL(url);
//     } catch (err) {
//       console.error('Error opening file:', err);
//       notifee.displayNotification({
//         title: 'Error',
//         body: 'Could not open the file.',
//         android: {
//           channelId: 'download',
//           smallIcon: 'ic_launcher',
//         },
//       });
//     }
//   };

//   const downloadPdf = async () => {
//     const hasPermission = await requestExternalStoragePermission();
//     if (!hasPermission) {
//       // Permission denied, prompt user to enable from app settings
//       Alert.alert(
//         'Permission Required',
//         'Please enable storage permission from app settings to download files.',
//         [
//           {
//             text: 'Cancel',
//             style: 'cancel',
//           },
//           {
//             text: 'Open Settings',
//             onPress: () => {
//               Linking.openSettings();
//             },
//           },
//         ],
//       );
//       return;
//     }

//     const pdfUrl = 'https://www.clickdimensions.com/links/TestPDFfile.pdf';
//     const downloadLocation = `${RNFS.DownloadDirectoryPath}/sample.pdf`;
//     setFilePath(downloadLocation);

//     // Create a channel (Android only)
//     if (Platform.OS === 'android') {
//       await notifee.createChannel({
//         id: 'download',
//         name: 'Download Channel',
//         importance: AndroidImportance.HIGH,
//       });
//     }

//     // Display a notification
//     const notificationId = await notifee.displayNotification({
//       title: 'Downloading PDF',
//       body: 'Download in progress...',
//       android: {
//         channelId: 'download',
//         smallIcon: 'ic_launcher', // replace with your app icon
//         progress: {
//           max: 100,
//           current: 0,
//           indeterminate: false,
//         },
//       },
//     });

//     RNFS.downloadFile({
//       fromUrl: pdfUrl,
//       toFile: downloadLocation,
//       progress: res => {
//         const progressPercent = Math.round((res.bytesWritten / res.contentLength) * 100);
//         setDownloadProgress(progressPercent);

//         // Ensure progress is always a valid positive number
//         const validProgress = Math.max(0, Math.min(progressPercent, 100));

//         // Update the notification with progress
//         notifee.displayNotification({
//           id: notificationId,
//           title: 'Downloading PDF',
//           body: `Download in progress... ${validProgress}%`,
//           android: {
//             channelId: 'download',
//             smallIcon: 'ic_launcher',
//             progress: {
//               max: 100,
//               current: validProgress,
//               indeterminate: false,
//             },
//           },
//         });
//       },
//       progressDivider: 1,
//     }).promise.then(response => {
//       notifee.displayNotification({
//         id: notificationId,
//         title: 'Download Complete',
//         body: 'PDF file downloaded successfully. Tap to open.',
//         android: {
//           channelId: 'download',
//           smallIcon: 'ic_launcher',
//           pressAction: {
//             id: 'open-file',
//           },
//         },
//       });
//     }).catch(err => {
//       console.error(err);
//       notifee.displayNotification({
//         id: notificationId,
//         title: 'Download Failed',
//         body: 'An error occurred while downloading the file.',
//         android: {
//           channelId: 'download',
//           smallIcon: 'ic_launcher',
//         },
//       });
//     });
//   };

//   return (
//     <View>
//       <Button title="Download PDF" onPress={downloadPdf} />
//       {downloadProgress > 0 && downloadProgress < 100 && (
//         <View style={{ marginTop: 20 }}>
//           <Text>Download Progress: {downloadProgress}%</Text>
//           <ActivityIndicator size="large" color="#0000ff" />
//         </View>
//       )}
//     </View>
//   );
// };

// export default App;



