import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import {styles} from './BusResListStyles';
import MyContext from '../../../context/Context';
import {TouchableOpacity} from 'react-native';
import IconSwitcher from '../../common/icons/IconSwitcher';
import {colors} from '../../../config/theme';
import {useNavigation} from '@react-navigation/native';
import FilterHeader from '../../common/filterHeader/FilterHeader';
import ProgressBar from '../../common/progressBar/ProgressBar';
import BusRenderData from './BusRenderData';
import {responsiveHeight, responsiveWidth} from '../../../utils/responsiveScale';
import { TextInput } from 'react-native-gesture-handler';
import {filter} from "../../splash/assets"
const BusResList = () => {
  let inputText=""
  const [fetchedData, setFetchedData] = useState([]);
  const [renderedData, setRenderedData] = useState();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const[selectFilter,setSelectFilter]=useState(0)
  const [allDataLoaded, setAllDataLoaded] = useState(false);
  const {
    actions,
    busResList,
    originDetails,
    destDetails,
    busDate,
    NoofBusPassengers,
    searchingBus,
  } = useContext(MyContext);
  const {goBack} = useNavigation();
  useEffect(() => {
    setFetchedData([...busResList]);
    setRenderedData(busResList.slice(0, 20));
    return () => {
      setFetchedData([]);
      setRenderedData([]);
    };
  }, [busResList]);
  useEffect(() => {
    setRenderedData(fetchedData.slice(0, 20));
  }, [fetchedData]);

  const handleEditButton = () => {
    actions.backToBusSearchPage();
    goBack();
  };

  // const loadMoreData = () => {
  //   if (renderedData.length !== fetchedData.length) {
  //     setLoading(true);
  //   }
  //   setTimeout(() => {
  //     const endIndex = Math.min(renderedData.length + 20, fetchedData.length);
  //     setRenderedData(prevData => [
  //       ...prevData,
  //       ...fetchedData.slice(prevData.length, endIndex),
  //     ]);
  //     setLoading(false);
  //     if (endIndex === fetchedData.length) {
  //       setAllDataLoaded(true);
  //     }
  //   }, 1000);
  // };

  const loadMoreData = useCallback(() => {
    if (renderedData.length !== fetchedData.length) {
      setLoading(true);
      setTimeout(() => {
        const endIndex = Math.min(renderedData.length + 20, fetchedData.length);
        setRenderedData((prevData) => [...prevData, ...fetchedData.slice(prevData.length, endIndex)]);
        setLoading(false);
        if (endIndex === fetchedData.length) {
          setAllDataLoaded(true);
        }
      }, 1000);
    }
  }, [fetchedData, renderedData])

  const handleEndReached = () => {
    if (renderedData.length < fetchedData.length) {
      loadMoreData();
    }
  };

  const handleRender = ({item}) => {
    return <BusRenderData item={item}  />;
  };
  const renderFooter = () => {
    if (loading) {
      return (
        <View style={{ padding: 20 }}>
          <ActivityIndicator size="small" color="#0000ff" />
        </View>
      );
    } else if (allDataLoaded) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text>End of the list</Text>
        </View>
      );
    } else {
      return null;
    }
  };
  const emptyComponent=()=>
    {
        return(
            <View >
                <Text style={[styles.title,{color:colors.primary}]}>No Data Found</Text>
            </View>
        )
    }


    const filterBuses = () => {
      let filteredArr = busResList;
      if (inputText!=="") {
        filteredArr = filteredArr.filter((item) =>
          item.TravelName.toLowerCase().includes(inputText.toLowerCase())
        );
      }
      setFetchedData(filteredArr);
    };
    
    const handleDuration=()=>
      {
           let filteredArr = fetchedData.map((obj) => {
          const departureTime = new Date(obj.DepartureTime);
          const arrivalTime = new Date(obj.ArrivalTime);
          const duration = arrivalTime - departureTime;
    
          return {
            ...obj,
            duration,
          };
        }).sort((a, b) => a.duration - b.duration);
        
      setFetchedData(filteredArr);
      }
    
      const handlePrice = () => {
        const sortedArr = [...fetchedData].sort((a, b) => {
          const priceA = a.BusPrice?.PublishedPriceRoundedOff ?? a.BusPrice?.OfferedPriceRoundedOff;
          const priceB = b.BusPrice?.PublishedPriceRoundedOff ?? b.BusPrice?.OfferedPriceRoundedOff;
          return priceA - priceB;
        });
        setFetchedData(sortedArr);
      };
    const handleSearch = (text) => {
      setSearchTerm(text);
      inputText=text
      filterBuses()
  };
    const renderHeader =
       <>
        <TextInput
            placeholder='Search for your favourite Bus'
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={handleSearch}
        />
        <View style={styles.filterButtonsContainer}>
          <View style={styles.filterImgContainer}>
           <Image source={filter} style={styles.filterImg} resizeMode='contain'/>
           <Text style={styles.filterName}>Filters</Text>
          </View>
          <TouchableOpacity style={selectFilter===0?styles.activeBtn:styles.Btn} onPress={()=>{handlefiltersToggleActions(0),handlePrice()}}>
            <Text style={selectFilter===0?styles.activebtnText:styles.btnText}>Price</Text>
            <Text style={selectFilter===0?styles.activeSubHeadings:styles.subHeadings}>(Low to High)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={selectFilter===1?styles.activeBtn:styles.Btn} onPress={()=>{handlefiltersToggleActions(1),handleDuration()}}>
            <Text style={selectFilter===1?styles.activebtnText:styles.btnText}>Duration</Text>
            <Text style={selectFilter===1?styles.activeSubHeadings:styles.subHeadings}>(short to long)</Text>
          </TouchableOpacity>

        </View>
       </>
       
   const handlefiltersToggleActions=(val)=>
    {
      setSelectFilter(val)
    }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerMainContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {originDetails.cityName} to {destDetails.cityName}
          </Text>
          <TouchableOpacity
            style={styles.editButtonContainer}
            onPress={handleEditButton}>
            <IconSwitcher
              componentName="MaterialIcons"
              iconName="edit"
              color={colors.white}
              iconsize={2.2}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.subTitle}>
          {`${new Date(busDate)
            .toString()
            .slice(4, 10)}  | ${NoofBusPassengers} Adults`}
        </Text>
      </View>
      {/* <FilterHeader
        handlefiltersToggleActions={handleOpenFilters}
        value={openFilters}>
        <TouchableOpacity
          style={styles.filterClosingIcon}
          onPress={handleOpenFilters}>
          <IconSwitcher
            componentName="Ionicons"
            iconName="chevron-up"
            color={colors.black}
            iconsize={3.5}
          />
        </TouchableOpacity>
      </FilterHeader> */}
      {searchingBus ? (
        <View style={styles.progressBarContainer}>
          <ProgressBar />
        </View>
      ) : (
        <View style={{paddingHorizontal: responsiveWidth(5), flex: 1}}>
          <FlatList
            data={renderedData}
            renderItem={handleRender}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={emptyComponent}
            keyExtractor={(item) => item.RouteId.toString()}
            contentContainerStyle={{paddingVertical: 20}}
          />
        </View>
      )}
    </View>
  );
};

export default BusResList;
