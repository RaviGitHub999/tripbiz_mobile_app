import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from '../../../../utils/responsiveScale';
import {colors, fonts} from '../../../../config/theme';
import PopUp from '../../popup/PopUp';
import {Controller, useForm} from 'react-hook-form';
import MyContext from '../../../../context/Context';
import CustomSelection from '../customSelect/CustomSelection';
import DateTimePicker from '@react-native-community/datetimepicker';

const gender = ['Mr', 'Ms', 'Mrs'];

const TravellerDetailsBtn = ({
  eachTripData,
  adults,
  child,
  tripId,
  infant,
  isInternational,
}) => {
  const [travDetails, setTravDetails] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const {control, handleSubmit, setValue} = useForm();
  const [selectedDates, setSelectedDates] = useState(
    Array(parseInt(adults)).fill(''),
  );
  const [showDatePicker, setShowDatePicker] = useState(
    Array(parseInt(adults)).fill(false),
  );
  const {actions, userAccountDetails, tripData} = useContext(MyContext);
  // console.log(tripData?.data?.travellerDetails[eachTripData.id].adults[0].passportExpiryDate)
  useEffect(() => {
    if (newtravellerDetails) {
      setIsFormDisabled(true);
      if (newtravellerDetails.children) {
        newtravellerDetails.children.forEach((child, index) => {
          setValue(`children[${index}].gender`, child.gender);
          setValue(`children[${index}].firstName`, child.firstName);
          setValue(`children[${index}].lastName`, child.lastName);
          // Set other values similarly
        });
      }
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adult, index) => {
          setValue(`adults[${index}].gender`, adult.gender);
          setValue(`adults[${index}].firstName`, adult.firstName);
          setValue(`adults[${index}].lastName`, adult.lastName);
          if (index === 0) {
            setValue(`adults[${index}].email`, adult.email);
            setValue(`adults[${index}].mobileNumber`, adult.mobileNumber);
          }
          if (isInternational) {
            setValue(`adults[${index}].passportNumber`, adult.passportNumber);
            setValue(
              `adults[${index}].passportIssueCountry`,
              adult.passportIssueCountry,
            );
            setValue(
              `adults[${index}].passportIssueDate`,
              adult.passportIssueDate,
            );
            setValue(
              `adults[${index}].passportExpiryDate`,
              adult.passportExpiryDate,
            );
          }
        });
      }
    }
  }, [newtravellerDetails, setValue]);

  const onSubmit = data => {
    console.log('save');
    const newData = {[eachTripData.id]: data};
    actions.updateTravDetails(newData, tripId);
    setTravDetails(false);
  };
  const handleViewTravellerDetails = () => {
    setNewTravellerDetails(
      () => tripData?.data?.travellerDetails[eachTripData.id],
    );
    setTravDetails(true);
  };
  const handleEdit = () => {
    console.log('edit');
    setIsFormDisabled(false);
  };
  const handleClose = () => {
    setTravDetails(false);
  };

  const handleTravDetails = () => {
    setTravDetails(true);
  };
  const handleDateChange = (event, date, index) => {
    if (date) {
      const newDates = [...selectedDates];
      newDates[index] = date.toISOString().split('T')[0]; // format as YYYY-MM-DD
      setSelectedDates(newDates);
    }
    const newShowDatePicker = [...showDatePicker];
    newShowDatePicker[index] = false;
    setShowDatePicker(newShowDatePicker);
  };

  return (
    <View style={styles.mainContainer}>
      {tripData?.data?.travellerDetails &&
      tripData?.data?.travellerDetails[eachTripData.id] ? (
        <TouchableOpacity
          style={styles.btn}
          onPress={handleViewTravellerDetails}>
          <Text style={styles.btnText}>View Travellers</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.btn} onPress={handleTravDetails}>
          <Text style={styles.btnText}>Add Travellers</Text>
        </TouchableOpacity>
      )}
      <PopUp value={travDetails} handlePopUpClose={handleClose}>
        <>
          {Array.from({length: parseInt(adults)}, (_, i) => {
            return (
              <View key={`adult-${i}`} style={styles.container}>
                <Text style={styles.header}>Adult-{i + 1}</Text>
                <View style={styles.eachItems}>
                  <Controller
                    name={`adults[${i}].gender`}
                    control={control}
                    defaultValue={i === 0 ? userAccountDetails.gender : ''}
                    render={({field}) => (
                      <>
                        <Text style={styles.label}>Title</Text>
                        <CustomSelection
                          data={gender}
                          placeHolder="Title"
                          value={field.value ? field.value : 'Title'}
                          setValue={field.onChange}
                          customStyles={{
                            backgroundColor: colors.white,
                            elevation: responsiveHeight(0.5),
                            margin: responsiveHeight(0.5),
                          }}
                          isEditable={isFormDisabled}
                        />
                      </>
                    )}
                  />
                  <Controller
                    name={`adults[${i}].firstName`}
                    control={control}
                    defaultValue={i === 0 ? userAccountDetails.firstName : ''}
                    render={({field}) => (
                      <>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                          {...field}
                          value={field.value}
                          style={styles.input}
                          placeholder="First Name"
                          onChangeText={field.onChange}
                          editable={!isFormDisabled}
                        />
                      </>
                    )}
                  />
                  <Controller
                    name={`adults[${i}].lastName`}
                    control={control}
                    defaultValue={i === 0 ? userAccountDetails.lastName : ''}
                    render={({field}) => (
                      <>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                          {...field}
                          value={field.value}
                          style={styles.input}
                          placeholder="Last Name"
                          onChangeText={field.onChange}
                          editable={!isFormDisabled}
                        />
                      </>
                    )}
                  />
                  {i === 0 && (
                    <>
                      <Controller
                        name={`adults[${i}].email`}
                        control={control}
                        defaultValue={i === 0 ? userAccountDetails.email : ''}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={styles.input}
                              placeholder="Email"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                          </>
                        )}
                      />
                      <Controller
                        name={`adults[${i}].mobileNumber`}
                        control={control}
                        defaultValue={
                          i === 0 ? userAccountDetails.mobileNumber : ''
                        }
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={styles.input}
                              placeholder="Mobile Number"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                          </>
                        )}
                      />
                    </>
                  )}
                  {isInternational && (
                    <>
                      <Controller
                        name={`adults[${i}].passportNumber`}
                        control={control}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Passport Number</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={styles.input}
                              placeholder="Passport Number"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                          </>
                        )}
                      />

                      <Controller
                        name={`adults[${i}].passportIssueCountry`}
                        control={control}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>
                              Passport Issue Country
                            </Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={styles.input}
                              placeholder="Passport Issue Country"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                          </>
                        )}
                      />
                      <Controller
                        name={`adults[${i}].passportIssueDate`}
                        control={control}
                        defaultValue={''}
                        render={({field}) => {
                          return (
                            <View>
                              <TouchableOpacity
                                // style={styles.dateButton}
                                onPress={() => {
                                  const newShowDatePicker = [...showDatePicker];
                                  newShowDatePicker[i] = true;
                                  setShowDatePicker(newShowDatePicker);
                                }}>
                                <Text style={styles.dateButtonText}>
                                  {field.value ? field.value : 'Select Date'}
                                </Text>
                              </TouchableOpacity>
                              {showDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="default"
                                  onChange={(event, date) => {
                                    setShowDatePicker(prev => {
                                      const newState = [...prev];
                                      newState[i] = false;
                                      return newState;
                                    });
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      ); // format as YYYY-MM-DD
                                    }
                                  }}
                                  minimumDate={
                                    field.value ? field.value : new Date()
                                  }
                                  is24Hour={true}
                                />
                              )}
                            </View>
                          );
                        }}
                      />
                       <Controller
                        name={`adults[${i}].passportExpiryDate`}
                        control={control}
                        defaultValue={''}
                        render={({field}) => {
                          return (
                            <View>
                              <TouchableOpacity
                                // style={styles.dateButton}
                                onPress={() => {
                                  const newShowDatePicker = [...showDatePicker];
                                  newShowDatePicker[i] = true;
                                  setShowDatePicker(newShowDatePicker);
                                }}>
                                <Text style={styles.dateButtonText}>
                                  {field.value ? field.value : 'Select Date'}
                                </Text>
                              </TouchableOpacity>
                              {showDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="default"
                                  onChange={(event, date) => {
                                    setShowDatePicker(prev => {
                                      const newState = [...prev];
                                      newState[i] = false;
                                      return newState;
                                    });
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      ); // format as YYYY-MM-DD
                                    }
                                  }}
                                  minimumDate={
                                    field.value ? field.value : new Date()
                                  }
                                  is24Hour={true}
                                />
                              )}
                            </View>
                          );
                        }}
                      />
                    </>
                  )}
                </View>
              </View>
            );
          })}
          {Array.from({length: parseInt(child)}, (_, i) => {
            return (
              <View key={`child-${i}`} style={styles.container}>
                <Text style={styles.header}>Child-{i + 1}</Text>
                <View>
                  <Controller
                    name={`children[${i}].gender`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <CustomSelection
                        data={gender}
                        placeHolder="Title"
                        value={field.value ? field.value : 'Title'}
                        setValue={field.onChange}
                        customStyles={{
                          backgroundColor: colors.white,
                          elevation: responsiveHeight(0.5),
                          margin: responsiveHeight(0.5),
                        }}
                        isEditable={isFormDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`children[${i}].firstName`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <TextInput
                        {...field}
                        value={field.value}
                        style={styles.input}
                        placeholder="First Name"
                        onChangeText={field.onChange}
                        editable={!isFormDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`children[${i}].lastName`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <TextInput
                        {...field}
                        value={field.value}
                        style={styles.input}
                        placeholder="Last Name"
                        onChangeText={field.onChange}
                        editable={!isFormDisabled}
                      />
                    )}
                  />
                </View>
              </View>
            );
          })}

          {Array.from({length: parseInt(infant)}, (_, i) => {
            return (
              <View key={`infant-${i}`} style={styles.container}>
                <Text style={styles.header}>Infant-{i + 1}</Text>
                <View>
                  <Controller
                    name={`infant[${i}].gender`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <CustomSelection
                        data={gender}
                        placeHolder="Title"
                        value={field.value ? field.value : 'Title'}
                        setValue={field.onChange}
                        customStyles={{
                          backgroundColor: colors.white,
                          elevation: responsiveHeight(0.5),
                          margin: responsiveHeight(0.5),
                        }}
                        isEditable={isFormDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`infant[${i}].firstName`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <TextInput
                        {...field}
                        value={field.value}
                        style={styles.input}
                        placeholder="First Name"
                        onChangeText={field.onChange}
                        editable={!isFormDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`infant[${i}].lastName`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <TextInput
                        {...field}
                        value={field.value}
                        style={styles.input}
                        placeholder="Last Name"
                        onChangeText={field.onChange}
                        editable={!isFormDisabled}
                      />
                    )}
                  />
                </View>
              </View>
            );
          })}
        </>
        {!isFormDisabled ? (
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}>
            <Text style={styles.submitButtonText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.submitButton} onPress={handleEdit}>
            <Text style={styles.submitButtonText}>Edit</Text>
          </TouchableOpacity>
        )}
      </PopUp>
    </View>
  );
};

export default TravellerDetailsBtn;

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    marginTop: responsiveHeight(1),
  },
  btnText: {
    fontSize: responsiveHeight(1.8),
    fontFamily: fonts.primary,
    color: colors.facebook,
  },
  btn: {
    borderBottomWidth: 1,
    borderColor: colors.facebook,
  },
  container: {
    gap: responsiveHeight(1),
  },
  header: {
    textAlign: 'center',
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(2),
    color: colors.primary,
  },
  flexContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  input: {
    backgroundColor: colors.white,
    elevation: responsiveHeight(0.5),
    margin: responsiveHeight(0.5),
    borderRadius: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2.5),
  },
  submitButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colors.white,
    fontFamily: fonts.secondry,
    fontSize: responsiveHeight(1.6),
  },
  eachItems: {
    gap: responsiveHeight(0.5),
  },
  label: {
    color: colors.primary,
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(1.6),
  },
});
