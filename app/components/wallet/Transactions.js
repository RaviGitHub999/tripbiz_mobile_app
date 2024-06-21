import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {cloneElement, useContext} from 'react';
import IconSwitcher from '../common/icons/IconSwitcher';
import {colors, fonts} from '../../config/theme';
import MyContext from '../../context/Context';
import {responsiveHeight, responsiveWidth} from '../../utils/responsiveScale';

const Transactions = () => {
  const {userAccountDetails} = useContext(MyContext);
  const sortedTransactions = userAccountDetails?.transactions?.sort(
    (a, b) => new Date(b.Date) - new Date(a.Date),
  );

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Transactions</Text>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance :</Text>
            <Text style={styles.balanceValue}>
              &#8377; {Math.ceil(userAccountDetails?.balance).toLocaleString()}
            </Text>
          </View>
        </View>

        <View style={styles.header}>
          <Text style={[styles.headerCell, styles.dateCell]}>Date/Time</Text>
          <Text style={styles.headerCell}>Application</Text>
          <Text style={styles.headerCell}>Type</Text>
          <Text style={styles.headerCell}>Amount</Text>
          <Text style={styles.headerCell}>Balance</Text>
        </View>
      </>
    );
  };

  const renderItem = ({item, index}) => (
    <View style={index % 2 == 0 ? styles.rowEven : styles.rowOdd}>
      <Text style={[styles.cell, styles.dateCell]}>
        {new Date(item.Date).toLocaleString('en-In')}
      </Text>
      <Text style={styles.cell}>{item.application}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>
        {item.type === 'Debit' ? (
          <IconSwitcher
            componentName="Feather"
            iconName="minus"
            color={colors.primary}
            iconsize={2}
          />
        ) : (
          <IconSwitcher
            componentName="Feather"
            iconName="plus"
            color={colors.primary}
            iconsize={2}
          />
        )}{' '}
        &#8377; {Math.round(item.amount).toLocaleString()}
      </Text>
      <Text style={styles.cell}>
        &#8377;{Math.round(item.balance).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScrollView horizontal>
      <View>
        {renderHeader()}
        <FlatList
          data={sortedTransactions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-between',
    gap: responsiveWidth(5),
    padding: responsiveHeight(2),
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: responsiveHeight(2.5),
    fontFamily: fonts.secondry,
    color: colors.primary,
  },
  balanceContainer: {
    borderWidth: responsiveHeight(0.2),
    paddingHorizontal: responsiveHeight(2),
    paddingVertical: responsiveHeight(0.5),
    borderStyle: 'dashed',
    borderColor: colors.highlight,
    borderRadius: responsiveHeight(1),
  },
  balanceLabel: {
    fontSize: responsiveHeight(1.8),
    color: colors.lightGray,
  },
  balanceValue: {
    fontSize: responsiveHeight(2),
    fontFamily: fonts.primary,
    color: colors.primary,
  },
  header: {
    flexDirection: 'row',
    // borderBottomWidth: responsiveHeight(0.3),
    // borderColor: colors.primary,
    backgroundColor: colors.highlight,
    padding: responsiveHeight(2),
  },
  rowEven: {
    flexDirection: 'row',
    padding: responsiveHeight(2),
    backgroundColor: '#e1e2e6',
  },
  rowOdd: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: responsiveHeight(2),
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    width: responsiveWidth(28),
    paddingHorizontal: responsiveWidth(1),
    fontSize:responsiveHeight(1.5),
    fontFamily:fonts.textFont,
    color:colors.primary
  },
  dateCell: {
    width: responsiveWidth(28),
    paddingHorizontal: responsiveWidth(1),
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    width: responsiveWidth(28),
    paddingHorizontal: responsiveWidth(1),
    color: colors.primary,
  },
});

export default Transactions;
