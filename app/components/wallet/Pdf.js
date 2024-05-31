import React from 'react';
import { View, Button, Linking } from 'react-native';

const OpenPDFScreen = () => {
  const openPDF = () => {
    // Replace 'path_to_your_pdf_file.pdf' with the actual path or URL to your PDF file
    const pdfURL = 'https://firebasestorage.googleapis.com/v0/b/trav-biz.appspot.com/o/bookings%2FsXgDRG00NyNADX2kSlZAn7tzFOr2%2FY2wFVnVGem8r9W4yg3Rm%2Fhotels%2FQr7OJOMJRQVVnA5X65QB%2Fdubai%20-%20hyd%2010.6.24.pdf?alt=media&token=f85990d9-15d8-4301-8d27-e2164606e925  ';
    
    Linking.openURL(pdfURL)
      .catch(err => console.error('An error occurred', err));
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open PDF" onPress={openPDF} />
    </View>
  );
};

export default OpenPDFScreen;
