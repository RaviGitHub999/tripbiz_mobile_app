import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
import { styles } from './RoleStyles';
import IconSwitcher from '../../common/icons/IconSwitcher';
import { colors } from '../../../config/theme';
import ChangePasswordInput from '../changePassword/ChangePasswordInput';
import { responsiveHeight } from '../../../utils/responsiveScale';
import MyContext from '../../../context/Context';
import { ScrollView } from 'react-native-gesture-handler';
import {
  BarIndicator,
} from 'react-native-indicators';
const Role = () => {
  const { actions,userAccountDetails, teamMembers, notifications, approveLoading } = useContext(MyContext)
  const [openManager, setOpenManager] = useState(false);
  const [managerData, setManagerData] = useState({
    name: '',
    email: ''
  })
  const [selectedTab, setSelectedTab] = useState("Pending")
  const [tripsData, setTripsData] = useState();
  const [mounted, setMounted] = useState(true);
  const handleScreenPress = () => {
    Keyboard.dismiss();
  };


  const handleManagerDataChange = (value, name) => {
    setManagerData({ ...managerData, [name]: value });
  };

  const handleManager = () => {
    actions.editManager(managerData);
  }
  var getTripData = async () => {
    var data = await actions.getTripsForApproval(
      userAccountDetails?.approvalRequests
    );
    setTripsData(data);
  };

  useEffect(() => {
    if (mounted) {
      getTripData();
      // getData();
    }
    return () => {
      setMounted(false);
    };
  }, []);
  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={handleScreenPress}>
        <ScrollView>
          <View style={styles.mainContainer}>
            <Text style={styles.maintitle}>Roles and Approval</Text>
            <View style={styles.subContainer}>
              <Text style={styles.subTitle}>Manager</Text>
              {userAccountDetails.manager ?
                <View style={styles.managerDataContainer}>
                  <Text style={styles.managerDataTitle}>{userAccountDetails?.manager?.name}({userAccountDetails?.manager?.email})</Text>
                </View>

                : <TouchableOpacity style={styles.btn} onPress={() => setOpenManager(!openManager)}>
                  <IconSwitcher componentName="Octicons" iconName="plus" iconsize={2} color={colors.white} />
                  <Text style={styles.btnTitle}>Add Manager</Text>
                </TouchableOpacity>}

              {
                openManager ?
                  <View style={styles.managerDetailsContainer}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inPutHeaderTitle}>Enter the name of the manager</Text>
                      <ChangePasswordInput placeholderName={"Enter the name"} customStyles={{ fontSize: responsiveHeight(2) }} stateValue={managerData.name} handleonChange={(e) => handleManagerDataChange(e, "name")} />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.inPutHeaderTitle}>Enter the email of the manager</Text>
                      <ChangePasswordInput placeholderName={"Enter the email"} customStyles={{ fontSize: responsiveHeight(2) }} stateValue={managerData.email} handleonChange={(e) => handleManagerDataChange(e, "email")} />
                    </View>
                    <TouchableOpacity style={styles.btn} onPress={handleManager}>
                      <Text style={styles.btnTitle}>Send Request</Text>
                    </TouchableOpacity>
                  </View>
                  : null
              }
              {/* team Member */}
              {
                teamMembers?.length > 0 || notifications?.length > 0 ?
                  <>
                    <Text style={styles.subTitle}>Team Members</Text>
                    <View>
                      {
                        teamMembers?.length > 0 ?
                          <>
                            {
                              teamMembers.map((teamMember) => {
                                return (
                                  <View style={[styles.managerDataContainer, { marginTop: responsiveHeight(1) }]} key={teamMember.userId}>
                                    <Text style={styles.managerDataTitle}>{teamMember.name}({teamMember.email})</Text>
                                  </View>
                                )
                              })
                            }
                          </> : null
                      }
                    </View>
                  </>
                  : null
              }


            </View>

            {/* Approvel */}
            <View style={{ marginTop: 20, gap: 12 }}>
              <Text style={styles.subTitle}>Approval</Text>
              <View style={styles.approvalNavBar}>

                <TouchableOpacity style={selectedTab === "Pending" ? styles.selectedEachNavBarContainer : styles.eachNavBarContainer} onPress={() => setSelectedTab("Pending")}>
                  <Text style={selectedTab === "Pending" ? styles.selectedEachNavBarTitle : styles.eachNavBarTitle}>Pending</Text>
                </TouchableOpacity>

                <TouchableOpacity style={selectedTab === "Approved" ? styles.selectedEachNavBarContainer : styles.eachNavBarContainer} onPress={() => setSelectedTab("Approved")}>
                  <Text style={selectedTab === "Approved" ? styles.selectedEachNavBarTitle : styles.eachNavBarTitle}>Approved</Text>
                </TouchableOpacity>

              </View>
              {/* ApprovalData */}
              <View>
                {
                  approveLoading ?
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: responsiveHeight(2), gap: responsiveHeight(2), flexWrap: "wrap" }}>
                      <BarIndicator color={colors.highlight} count={6} size={responsiveHeight(4)} style={{ flex: 0 }} />
                      <Text style={styles.managerDataTitle}>Loading Approve Request...</Text>
                    </View> :
                    <>
                    </>
                }
              </View>
            </View>

          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Role;
