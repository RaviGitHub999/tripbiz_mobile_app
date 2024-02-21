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

import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';

const YourComponent = () => {
  // Sample data with 100 objects
  const data = Array.from({ length: 100 }, (_, index) => ({
    id: index,
    name: `Item ${index + 1}`,
  }));

  // State to hold the currently rendered items and loading state
  const [renderedData, setRenderedData] = useState(data.slice(0, 10));
  const [loading, setLoading] = useState(false);

  // Function to load more data
  const loadMoreData = () => {
    setLoading(true);
    const remainingData = data.slice(renderedData.length, renderedData.length + 10);
    // Simulate delay for fetching data (you can replace this with your actual data fetching logic)
    setTimeout(() => {
      setRenderedData(prevData => [...prevData, ...remainingData]);
      setLoading(false);
    }, 1000);
  };

  // Render item component
  const renderItem = ({ item }) => (
    <View style={{ padding: 10 }}>
      <Text>{item.name}</Text>
    </View>
  );

  // Render loading indicator
  const renderFooter = () => {
    if (!loading) return null;
    return (
      <View style={{ padding: 10 }}>
        <ActivityIndicator size="small" color="#0000ff" />
      </View>
    );
  };

  return (
    <FlatList
      data={renderedData}
      renderItem={renderItem}
      keyExtractor={item => item.id.toString()}
      onEndReached={loadMoreData} // Function to load more data when reaching the end
      onEndReachedThreshold={0.1} // Trigger when 90% scrolled to the end
      ListFooterComponent={renderFooter} // Render loading indicator
    />
  );
};

export default YourComponent;

