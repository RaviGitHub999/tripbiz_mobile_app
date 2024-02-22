// import { View, Text, Image,StatusBar } from 'react-native'
// import React, { useEffect } from 'react'
// import { splashimg } from './assets';

// const Splash = ({navigation:{navigate}}) => {
//     useEffect(()=>
//     {
//        setTimeout(() => {
//         navigate("Login")
//        }, 3000); 
//     },[])
//   return (
//     <View>
//       {/* <StatusBar hidden/> */}
//        <Image source={splashimg}  style={{height:"100%",width:"100%"}}/>
//     </View>
//   )
// }
// export default Splash

// import React, { useState } from 'react';
import { useState } from 'react';
import { FlatList, View, Text, ActivityIndicator } from 'react-native';

const YourComponent = () => {
  const [data, setData] = useState(Array.from({ length: 200 }, (_, index) => `Item ${index + 1}`));
  const [renderedData, setRenderedData] = useState(data.slice(0, 5));
  const [remainingData, setRemainingData] = useState(data.slice(5));
  const [isLoading, setIsLoading] = useState(false);

  const loadMoreItems = () => {
    if (remainingData.length > 0) {
      setIsLoading(true); // Set loading state to true
      const nextBatch = remainingData.slice(0, 5);
      setRenderedData(prevData => [...prevData, ...nextBatch]);
      setRemainingData(prevData => prevData.slice(5));
      setIsLoading(false); // Set loading state to false when data is loaded
    }
  };

  const renderFooter = () => {
    if (!isLoading) return null; // Don't render anything if loading is false
    return (
      <View style={{ paddingVertical: 20 }}>
        <ActivityIndicator animating size="large" color="#007AFF" />
      </View>
    );
  };

  return (
    <View style={{ flex: 1, marginTop: 50 }}>
      <FlatList
        data={renderedData}
        renderItem={({ item,index}) =>{
          console.log(index)
          return (
          <View style={{ padding: 50, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
            <Text>{item}</Text>
          </View>
        )}}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter} 
      />
    </View>
  );
};

export default YourComponent;

