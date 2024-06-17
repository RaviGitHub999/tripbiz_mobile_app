import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import React, { useContext } from 'react';
import IconSwitcher from '../common/icons/IconSwitcher';
import { colors } from '../../config/theme';
import MyContext from '../../context/Context';

const Transactions = () => {
  const { userAccountDetails } = useContext(MyContext);
  const sortedTransactions = userAccountDetails?.transactions?.sort(
    (a, b) => new Date(b.Date) - new Date(a.Date)
  );

  const renderHeader = () => {
    return (
      <>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Transactions</Text>
          <TouchableOpacity style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Current Balance</Text>
            <Text style={styles.balanceValue}>&#8377;354247</Text>
          </TouchableOpacity>
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

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.dateCell]}>{new Date(item.Date).toLocaleString('en-In')}</Text>
      <Text style={styles.cell}>{item.application}</Text>
      <Text style={styles.cell}>{item.type}</Text>
      <Text style={styles.cell}>
        {item.type === 'Debit' ? (
          <IconSwitcher componentName='Feather' iconName='minus' color={colors.primary} iconsize={2} />
        ) : (
          <IconSwitcher componentName='Feather' iconName='plus' color={colors.primary} iconsize={2} />
        )}
        {' '}
        &#8377; {Math.round(item.amount).toLocaleString()}
      </Text>
      <Text style={styles.cell}>&#8377;{Math.round(item.balance).toLocaleString()}</Text>
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
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceContainer: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#888',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#eee',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    width: 100,
    paddingHorizontal: 5,  
  },
  dateCell: {
    width: 150,
    paddingHorizontal: 5,  
  },
  headerCell: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    width: 100,
    paddingHorizontal: 5,  // Add gap between columns
  },
});

export default Transactions;
