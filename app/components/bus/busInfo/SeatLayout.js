import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import IconSwitcher from "../../common/icons/IconSwitcher";
import { colors, fonts } from "../../../config/theme";
import { busSeating, selectedSeat, sitterSelected, sleeperBedSelected, sleeperbed, sleeperselected } from "./assets";
import { responsiveHeight } from "../../../utils/responsiveScale";
import MyContext from "../../../context/Context";


const SeatLayout = ({seatData,boardingPoint,droppingPoint}) => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const{actions,NoofBusPassengers}=useContext(MyContext)
  useEffect(()=>
  {
    actions.setBusBookDetails(selectedSeats,"seat")
  },[selectedSeats])
  const toggleSeatSelection = (seat) => {
    const isSelected = selectedSeats.some(
      (s) =>
        s.RowNo === seat.RowNo &&
        s.ColumnNo === seat.ColumnNo &&
        s.IsUpper === seat.IsUpper
    );

    if (seat.SeatStatus) {
      if (isSelected) {
        setSelectedSeats(
          selectedSeats.filter(
            (s) =>
              !(
                s.RowNo === seat.RowNo &&
                s.ColumnNo === seat.ColumnNo &&
                s.IsUpper === seat.IsUpper
              )
          )
          
        );
      }  else {
        if (selectedSeats.length >= NoofBusPassengers) {
          setSelectedSeats((prevSelectedSeats) => [
            ...prevSelectedSeats.slice(1),
            seat,
          ]);
        } else {
          setSelectedSeats([...selectedSeats, seat]);
        }
      }
      
    }
  };

  const lowerDeckData = seatData?.filter(
    (row) => !row.some((seat) => seat.IsUpper)
  );
  const upperDeckData = seatData?.filter((row) =>
    row.some((seat) => seat.IsUpper)
  );

  const shouldAddMarginAfterLowerDeckRow2 = lowerDeckData[2]?.some((seat) =>
    seat.ColumnNo === "009" ? false:true
  );
  return (
    <ScrollView style={styles.appContainer}>
            <Deck
        data={upperDeckData}
        title="Upper Deck"
        addMarginAfterRow={1}
        toggleSeatSelection={toggleSeatSelection}
        selectedSeats={selectedSeats}
        isUpperDeck
      />
      <Deck
        data={lowerDeckData}
        title="Lower Deck"
        addMarginAfterRow={shouldAddMarginAfterLowerDeckRow2 ? 1: null}
        toggleSeatSelection={toggleSeatSelection}
        selectedSeats={selectedSeats}
        isUpperDeck={false}
      />
  
    </ScrollView>
  );
};

const Deck = ({
  data,
  title,
  addMarginAfterRow,
  toggleSeatSelection,
  selectedSeats,
  isUpperDeck,
}) => {
  return (
  <>
  <Text style={styles.deckTitle}>{title}</Text> 
    <View style={[styles.deck, addMarginAfterRow && styles.deckWithMargin]}>
      {/* <Text style={styles.deckTitle}>{title}</Text> */}
      {data.map((row, rowIndex) => (
        <ScrollView key={rowIndex}>
          <SeatRow
            row={row}
            rowIndex={rowIndex}
            toggleSeatSelection={toggleSeatSelection}
            selectedSeats={selectedSeats}
            isUpperDeck={isUpperDeck}
          />
          {addMarginAfterRow === rowIndex && (
            <View style={styles.rowSeparator} />
          )}
        </ScrollView>
      ))}
    </View>
  </>
  );
};

const SeatRow = ({
  row,
  rowIndex,
  toggleSeatSelection,
  selectedSeats,
  isUpperDeck,
}) => {
  return (
    <View style={styles.row}>
      {row.map((seat, columnIndex) => (
        <Seat
          key={`${seat.RowNo}-${seat.ColumnNo}`}
          seat={seat}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          toggleSeatSelection={toggleSeatSelection}
          isSelected={selectedSeats.some(
            (s) =>
              s.RowNo === seat.RowNo &&
              s.ColumnNo === seat.ColumnNo &&
              s.IsUpper === seat.IsUpper
          )}
          isUpperDeck={isUpperDeck}
        />
      ))}
    </View>
  );
};

const Seat = ({
  seat,
  rowIndex,
  columnIndex,
  toggleSeatSelection,
  isSelected,
  isUpperDeck,
}) => {
  let seatContainerStyle = [styles.seatContainer];

  return (
    <TouchableOpacity
      style={[...seatContainerStyle]}
      onPress={() => toggleSeatSelection(seat)}
    disabled={!seat.SeatStatus}>
      {getIconDetails(seat, isSelected)}
    </TouchableOpacity>
  );
};

const getIconDetails = (seat, isSelected) => {
  if (!seat.SeatStatus) {
    return (
        seat.SeatType === 1? <Image
        source={sitterSelected}
        style={{ height: responsiveHeight(3.5), width: responsiveHeight(3.5) }}
      />:
      <Image
        source={sleeperselected}
        style={{ height: responsiveHeight(3), width: responsiveHeight(6.5) }}
        resizeMode="contain"
      />
    );
  } 
//   else if (seat.IsLadiesSeat && seat.SeatType === 2) {
//     return { iconName: "female", componentName: "FontAwesome", color: "purple" };
//   }
//    else if (seat.IsLadiesSeat) {
//     return { iconName: "female", componentName: "FontAwesome", color: "pink" };
//   } 
//   else if (seat.IsMalesSeat) {
//     return { iconName: "male", componentName: "FontAwesome", color: "blue" };
//   } 
  else if (seat.SeatType === 2||seat.IsUpper) {
    return (
      <Image
        source={isSelected ? sleeperBedSelected : sleeperbed}
        style={{ height: responsiveHeight(3), width: responsiveHeight(6.5)  }}
        resizeMode="contain"
      />
    );
  } else {
    return (
      <Image
        source={isSelected ? selectedSeat : busSeating}
        style={{ height: responsiveHeight(3.5), width: responsiveHeight(3.5) }}
      />
    );
  }
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
  },
  deck: {
    paddingHorizontal: responsiveHeight(1),
    backgroundColor:colors.whiteSmoke,
    borderRadius:responsiveHeight(2),
    paddingVertical:responsiveHeight(2)
  },
  deckWithMargin: {
    marginBottom: responsiveHeight(2),
  },
  deckTitle: {
    fontSize: responsiveHeight(1.8),
    marginVertical: responsiveHeight(2),
    textAlign: "center",
    fontFamily:fonts.primary,
    color:colors.primary
  },
  row: {
    flexDirection: "row",
    marginBottom: responsiveHeight(.5),
    justifyContent: "flex-end",
  },
  rowSeparator: {
    height: responsiveHeight(2),
  },
  seatContainer: {
    margin: responsiveHeight(0.3),
    justifyContent: "center",
    alignItems: "center",
  },
  doubleHeightSeat: {
    height: 100,
  },
  seatText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ladiesSeat: {
    backgroundColor: "#f4cccc",
  },
  malesSeat: {
    backgroundColor: "#c9daf8",
  },
  upperSeat: {
    width: 100,
    height: 70,
  },
  selectedSeat: {
    backgroundColor: "#6ab04c",
  },
});
export default SeatLayout;