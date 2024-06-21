import {View, Text, TouchableOpacity} from 'react-native';
import React, { useContext, useState } from 'react';
import {walletStyles as styles} from './walletStyles';
import IconSwitcher from '../common/icons/IconSwitcher';
import {colors} from '../../config/theme';
import MyContext from '../../context/Context';

const Wallet = ({navigation:{navigate}}) => {
  const [isClicked,setIsClicked]=useState(null)
  const {userAccountDetails } = useContext(MyContext);
  const handleClicked=(click)=>
    {
      if(click===0)
        {
          setIsClicked(click)
          navigate("LoadWallet")
        }
        else{
          setIsClicked(click)
        navigate("Transactions")
        }
    }
  return (
    <View style={styles.mainContainer}>
      <View style={styles.profileContainer}>
        <IconSwitcher
          componentName="Ionicons"
          iconName="person"
          color={colors.primary}
          iconsize={6}
        />
        <View style={styles.profileSubContainer}>
          <Text style={styles.title}>{userAccountDetails.firstName}</Text>
          <Text style={styles.title}>{userAccountDetails.email}</Text>
        </View>
      </View>
      <View style={styles.btnContainer}>
        <TouchableOpacity onPress={()=>handleClicked(0)} style={isClicked===0?styles.active:styles.isActive}>
          <Text style={styles.title}>Load Wallet</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleClicked(1)} style={isClicked===1?styles.active:styles.isActive}>
          <Text style={styles.title}>Transactions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Wallet;
