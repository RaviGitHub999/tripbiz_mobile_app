import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { styles } from './profileStyles'

const Profile = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Profile</Text>
      <View>
        <Text>Login Details</Text>
        <View>
            <Text>Email:</Text>
            <Text>pavan@gmail.com</Text>
        </View>
      </View>

      <View>
        <Text>Personal Info</Text>
        <View>
            <Text>First Name :</Text>
            <Text>Pavan</Text>
        </View>
        <View>
            <Text>Last Name :</Text>
            <Text>Tripbizz</Text>
        </View>
        <View>
            <Text>Mobile :</Text>
            <Text>8688112811</Text>
        </View>
        <View>
            <Text>Passport Number :</Text>
            <Text>pavan@gmail.com</Text>
        </View>
        <View>
            <Text>Passport</Text>
            <Text>pavan@gmail.com</Text>
        </View>
        <View>
            <Text>Aadhar Card</Text>
            <Text>pavan@gmail.com</Text>
        </View>
      </View>

      <View>
        <Text>Company Info</Text>
        <View>
            <Text>Company GST No :</Text>
            <Text>pavan@gmail.com</Text>
        </View>

        <View>
            <Text>Company PAN Number :</Text>
            <Text>pavan@gmail.com</Text>
        </View>

        <View>
            <Text>Company Name :</Text>
            <Text>pavan@gmail.com</Text>
        </View>
      </View>

      <View>
        <TouchableOpacity>
            <Text>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity>
            <Text>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Profile