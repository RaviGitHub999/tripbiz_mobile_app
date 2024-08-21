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
  status,
  type,
}) => {
  const [travDetails, setTravDetails] = useState(false);
  const [newtravellerDetails, setNewTravellerDetails] = useState();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const {
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm();
  const [showIssueDatePicker, setShowIssueDatePicker] = useState(
    Array(parseInt(adults ? adults : 0)).fill(false),
  );
  const [showExpiryDatePicker, setShowExpiryDatePicker] = useState(
    Array(parseInt(adults ? adults : 0)).fill(false),
  );
  const [showBirthDatePicker, setShowBirthDatePicker] = useState(
    Array(parseInt(adults ? adults : 0)).fill(false),
  );
  const [showchildIssueDatePicker, setShowChildIssueDatePicker] = useState(
    Array(parseInt(child ? child : 0)).fill(false),
  );
  const [showchildExpiryDatePicker, setShowChildExpiryDatePicker] = useState(
    Array(parseInt(child ? child : 0)).fill(false),
  );

  const [showinfantIssueDatePicker, setShowInfantIssueDatePicker] = useState(
    Array(parseInt(infant ? infant : 0)).fill(false),
  );
  const [showinfantExpiryDatePicker, setShowInfantExpiryDatePicker] = useState(
    Array(parseInt(infant ? infant : 0)).fill(false),
  );
  const {actions, userAccountDetails, tripData} = useContext(MyContext);
  useEffect(() => {
    if (newtravellerDetails) {
      setIsFormDisabled(true);
      if (newtravellerDetails.children) {
        newtravellerDetails.children.forEach((child, index) => {
          setValue(`children[${index}].gender`, child.gender);
          setValue(`children[${index}].firstName`, child.firstName);
          setValue(`children[${index}].lastName`, child.lastName);

          if (isInternational) {
            setValue(`children[${index}].passportNumber`, child.passportNumber);
            setValue(
              `children[${index}].passportIssueCountry`,
              child.passportIssueCountry,
            );
            setValue(
              `children[${index}].passportIssueDate`,
              child.passportIssueDate,
            );
            setValue(
              `children[${index}].passportExpiryDate`,
              child.passportExpiryDate,
            );
          }
        });
      }
      if (newtravellerDetails.adults) {
        newtravellerDetails.adults.forEach((adult, index) => {
          setValue(`adults[${index}].gender`, adult.gender);
          setValue(`adults[${index}].firstName`, adult.firstName);
          setValue(`adults[${index}].lastName`, adult.lastName);
          setValue(`adults[${index}].birthDate`, adult.birthDate);
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
            setValue(`adults[${index}].birthDate`, adult.birthDate);
          }
        });
      }
      if (newtravellerDetails.infants) {
        newtravellerDetails.infants.forEach((infants, index) => {
          setValue(`infants[${index}].gender`, infants.gender);
          setValue(`infants[${index}].firstName`, infants.firstName);
          setValue(`infants[${index}].lastName`, infants.lastName);
          // Set other values similarly
          if (isInternational) {
            setValue(
              `infants[${index}].passportNumber`,
              infants.passportNumber,
            );
            setValue(
              `infants[${index}].passportIssueCountry`,
              infants.passportIssueCountry,
            );
            setValue(
              `infants[${index}].passportIssueDate`,
              infants.passportIssueDate,
            );
            setValue(
              `infants[${index}].passportExpiryDate`,
              infants.passportExpiryDate,
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
  return (
    <View style={styles.mainContainer}>
      {tripData?.data?.travellerDetails &&
      tripData?.data?.travellerDetails[eachTripData.id] ? (
        <TouchableOpacity
          style={[styles.btn, {backgroundColor: colors.highlight}]}
          onPress={handleViewTravellerDetails}>
          <Text style={[styles.btnText, {color: colors.primary}]}>
            View Travellers
          </Text>
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
                          customStyles={
                            !isFormDisabled
                              ? styles.customStyles
                              : styles.activeCustomStyles
                          }
                          isEditable={isFormDisabled}
                        />
                      </>
                    )}
                  />
                  <Controller
                    name={`adults[${i}].firstName`}
                    control={control}
                    defaultValue={i === 0 ? userAccountDetails.firstName : ''}
                    rules={{required: '* First Name is required'}}
                    render={({field}) => (
                      <>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                          {...field}
                          value={field.value}
                          style={
                            !isFormDisabled ? styles.input : styles.activeInput
                          }
                          placeholder="First Name"
                          onChangeText={field.onChange}
                          editable={!isFormDisabled}
                        />
                        {errors.adults?.[i]?.firstName && (
                          <Text style={styles.errorText}>
                            {errors.adults[i].firstName.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  <Controller
                    name={`adults[${i}].lastName`}
                    control={control}
                    defaultValue={i === 0 ? userAccountDetails.lastName : ''}
                    rules={{required: '* Last Name is required'}}
                    render={({field}) => (
                      <>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                          {...field}
                          value={field.value}
                          style={
                            !isFormDisabled ? styles.input : styles.activeInput
                          }
                          placeholder="Last Name"
                          onChangeText={field.onChange}
                          editable={!isFormDisabled}
                        />
                        {errors.adults?.[i]?.lastName && (
                          <Text style={styles.errorText}>
                            {errors.adults[i].lastName.message}
                          </Text>
                        )}
                      </>
                    )}
                  />
                  {type === 'bus' && (
                    <Controller
                      name={`adults[${i}].birthDate`}
                      control={control}
                      rules={{required: '* Age is required'}}
                      render={({field}) => (
                        <>
                          <Text style={styles.label}>Age</Text>
                          <TextInput
                            {...field}
                            value={field.value}
                            style={
                              !isFormDisabled
                                ? styles.input
                                : styles.activeInput
                            }
                            placeholder="Age"
                            onChangeText={field.onChange}
                            editable={!isFormDisabled}
                          />
                          {errors.adults?.[i]?.birthDate && (
                            <Text style={styles.errorText}>
                              {errors.adults[i].birthDate.message}
                            </Text>
                          )}
                        </>
                      )}
                    />
                  )}
                  {i === 0 && (
                    <>
                      <Controller
                        name={`adults[${i}].email`}
                        control={control}
                        defaultValue={i === 0 ? userAccountDetails.email : ''}
                        rules={{required: '* Email is required'}}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Email"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                            {errors.adults?.[i]?.email && (
                              <Text style={styles.errorText}>
                                {errors.adults[i].email.message}
                              </Text>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        name={`adults[${i}].mobileNumber`}
                        control={control}
                        defaultValue={
                          i === 0 ? userAccountDetails.mobileNumber : ''
                        }
                        rules={{required: '* MobileNumber is required'}}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Mobile Number</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Mobile Number"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                            {errors.adults?.[i]?.mobileNumber && (
                              <Text style={styles.errorText}>
                                {errors.adults[i].mobileNumber.message}
                              </Text>
                            )}
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
                        rules={{required: '* PassportNumber is required'}}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Passport Number</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Passport Number"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                            {errors.adults?.[i]?.passportNumber && (
                              <Text style={styles.errorText}>
                                {errors.adults[i].passportNumber.message}
                              </Text>
                            )}
                          </>
                        )}
                      />

                      <Controller
                        name={`adults[${i}].passportIssueCountry`}
                        control={control}
                        rules={{required: '* PassportIssueCountry is required'}}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>
                              Passport Issue Country
                            </Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Passport Issue Country"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                            {errors.adults?.[i]?.passportIssueCountry && (
                              <Text style={styles.errorText}>
                                {errors.adults[i].passportIssueCountry.message}
                              </Text>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        name={`adults[${i}].passportIssueDate`}
                        control={control}
                        defaultValue={''}
                        rules={{required: '* PassportIssueDate is required'}}
                        render={({field}) => {
                          return (
                            <>
                              <Text style={styles.label}>
                                Passport Issue Date
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newShowIssueDatePicker = [
                                    ...showIssueDatePicker,
                                  ];
                                  newShowIssueDatePicker[i] = true;
                                  setShowIssueDatePicker(
                                    newShowIssueDatePicker,
                                  );
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Passport Issue Date"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showIssueDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="calendar"
                                  onChange={(event, date) => {
                                    const newShowIssueDatePicker = [
                                      ...showIssueDatePicker,
                                    ];
                                    newShowIssueDatePicker[i] = false;
                                    setShowIssueDatePicker(
                                      newShowIssueDatePicker,
                                    );
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      ); // format as YYYY-MM-DD
                                    }
                                  }}
                                  // minimumDate={
                                  //   field.value
                                  //     ? new Date(field.value)
                                  //     : new Date()
                                  // }
                                  minimumDate={new Date(1980, 0, 1)}
                                />
                              )}
                              {errors.adults?.[i]?.passportIssueDate && (
                                <Text style={styles.errorText}>
                                  {errors.adults[i].passportIssueDate.message}
                                </Text>
                              )}
                            </>
                          );
                        }}
                      />

                      <Controller
                        name={`adults[${i}].passportExpiryDate`}
                        control={control}
                        defaultValue={''}
                        rules={{required: '* PassportExpiryDate is required'}}
                        render={({field}) => {
                          return (
                            <>
                              <Text style={styles.label}>
                                Passport Expiry Date
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newShowExpiryDatePicker = [
                                    ...showExpiryDatePicker,
                                  ];
                                  newShowExpiryDatePicker[i] = true;
                                  setShowExpiryDatePicker(
                                    newShowExpiryDatePicker,
                                  );
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Passport Expiry Date"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showExpiryDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="calendar"
                                  onChange={(event, date) => {
                                    const newShowExpiryDatePicker = [
                                      ...showExpiryDatePicker,
                                    ];
                                    newShowExpiryDatePicker[i] = false;
                                    setShowExpiryDatePicker(
                                      newShowExpiryDatePicker,
                                    );
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      );
                                    }
                                  }}
                                  minimumDate={new Date(1980, 0, 1)}
                                />
                              )}
                              {errors.adults?.[i]?.passportExpiryDate && (
                                <Text style={styles.errorText}>
                                  {errors.adults[i].passportExpiryDate.message}
                                </Text>
                              )}
                            </>
                          );
                        }}
                      />

                      <Controller
                        name={`adults[${i}].birthDate`}
                        control={control}
                        defaultValue={''}
                        rules={{required: '* BirthDate is required'}}
                        render={({field}) => {
                          return (
                            <>
                              <Text style={styles.label}>Date of birth</Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newBirthDatePicker = [
                                    ...showBirthDatePicker,
                                  ];
                                  newBirthDatePicker[i] = true;
                                  setShowBirthDatePicker(newBirthDatePicker);
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Date of birth"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showBirthDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="calendar"
                                  onChange={(event, date) => {
                                    const newBirthDatePicker = [
                                      ...showBirthDatePicker,
                                    ];
                                    newBirthDatePicker[i] = false;
                                    setShowBirthDatePicker(newBirthDatePicker);
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      );
                                    }
                                  }}
                                  minimumDate={new Date(1980, 0, 1)}
                                />
                              )}
                              {errors.adults?.[i]?.birthDate && (
                                <Text style={styles.errorText}>
                                  {errors.adults[i].birthDate.message}
                                </Text>
                              )}
                            </>
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
                <View style={styles.eachItems}>
                  <Controller
                    name={`children[${i}].gender`}
                    control={control}
                    defaultValue={''}
                    rules={{required: '* Gender is required'}}
                    render={({field}) => {
                      return (
                        <>
                          <CustomSelection
                            data={gender}
                            placeHolder="Title"
                            value={field.value ? field.value : 'Title'}
                            setValue={field.onChange}
                            customStyles={
                              !isFormDisabled
                                ? styles.customStyles
                                : styles.activeCustomStyles
                            }
                            isEditable={isFormDisabled}
                          />
                          {errors.children[i].gender && (
                            <Text style={styles.errorText}>
                              {errors.children[i].gender.message}
                            </Text>
                          )}
                        </>
                      );
                    }}
                  />
                  <Controller
                    name={`children[${i}].firstName`}
                    control={control}
                    defaultValue={''}
                    rules={{required: '* FirstName is required'}}
                    render={({field}) => {
                      return (
                        <>
                          <TextInput
                            {...field}
                            value={field.value}
                            style={
                              !isFormDisabled
                                ? styles.input
                                : styles.activeInput
                            }
                            placeholder="First Name"
                            onChangeText={field.onChange}
                            editable={!isFormDisabled}
                          />
                          {errors.children[i].firstName && (
                            <Text style={styles.errorText}>
                              {errors.children[i].firstName.message}
                            </Text>
                          )}
                        </>
                      );
                    }}
                  />
                  <Controller
                    name={`children[${i}].lastName`}
                    control={control}
                    defaultValue={''}
                    rules={{required: '* LastName is required'}}
                    render={({field}) => {
                      return (
                        <>
                          <TextInput
                            {...field}
                            value={field.value}
                            style={
                              !isFormDisabled
                                ? styles.input
                                : styles.activeInput
                            }
                            placeholder="Last Name"
                            onChangeText={field.onChange}
                            editable={!isFormDisabled}
                          />
                          {errors.children[i].lastName && (
                            <Text style={styles.errorText}>
                              {errors.children[i].lastName.message}
                            </Text>
                          )}
                        </>
                      );
                    }}
                  />
                  {isInternational && (
                    <>
                      <Controller
                        name={`children[${i}].passportNumber`}
                        control={control}
                        rules={{required: '* PassportNumber is required'}}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Passport Number</Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Passport Number"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                            {errors.children[i].passportNumber && (
                              <Text style={styles.errorText}>
                                {errors.children[i].passportNumber.message}
                              </Text>
                            )}
                          </>
                        )}
                      />

                      <Controller
                        name={`children[${i}].passportIssueCountry`}
                        control={control}
                        rules={{required: '* PassportIssueCountry is required'}}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>
                              Passport Issue Country
                            </Text>
                            <TextInput
                              {...field}
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Passport Issue Country"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                            {errors.children[i].passportIssueCountry && (
                              <Text style={styles.errorText}>
                                {
                                  errors.children[i].passportIssueCountry
                                    .message
                                }
                              </Text>
                            )}
                          </>
                        )}
                      />
                      <Controller
                        name={`children[${i}].passportIssueDate`}
                        control={control}
                        defaultValue={''}
                        rules={{required: '* PassportIssueDate is required'}}
                        render={({field}) => {
                          return (
                            <>
                              <Text style={styles.label}>
                                Passport Issue Date
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newShowIssueDatePicker = [
                                    ...showchildIssueDatePicker,
                                  ];
                                  newShowIssueDatePicker[i] = true;
                                  setShowChildIssueDatePicker(
                                    newShowIssueDatePicker,
                                  );
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Passport Issue Date"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showchildIssueDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="default"
                                  onChange={(event, date) => {
                                    const newShowIssueDatePicker = [
                                      ...showchildIssueDatePicker,
                                    ];
                                    newShowIssueDatePicker[i] = false;
                                    setShowChildIssueDatePicker(
                                      newShowIssueDatePicker,
                                    );
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      ); // format as YYYY-MM-DD
                                    }
                                  }}
                                  // minimumDate={
                                  //   field.value
                                  //     ? new Date(field.value)
                                  //     : new Date()
                                  // }
                                  minimumDate={new Date(1980, 0, 1)}
                                />
                              )}
                              {errors.children[i].passportIssueDate && (
                                <Text style={styles.errorText}>
                                  {errors.children[i].passportIssueDate.message}
                                </Text>
                              )}
                            </>
                          );
                        }}
                      />

                      <Controller
                        name={`children[${i}].passportExpiryDate`}
                        control={control}
                        defaultValue={''}
                        rules={{required: '* PassportExpiryDate is required'}}
                        render={({field}) => {
                          return (
                            <>
                              <Text style={styles.label}>
                                Passport Expiry Date
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newShowExpiryDatePicker = [
                                    ...showchildExpiryDatePicker,
                                  ];
                                  newShowExpiryDatePicker[i] = true;
                                  setShowChildExpiryDatePicker(
                                    newShowExpiryDatePicker,
                                  );
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Passport Expiry Date"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showchildExpiryDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="default"
                                  onChange={(event, date) => {
                                    const newShowExpiryDatePicker = [
                                      ...showchildExpiryDatePicker,
                                    ];
                                    newShowExpiryDatePicker[i] = false;
                                    setShowChildExpiryDatePicker(
                                      newShowExpiryDatePicker,
                                    );
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      );
                                    }
                                  }}
                                  minimumDate={new Date(1980, 0, 1)}
                                />
                              )}
                              {errors.children[i].passportExpiryDate && (
                                <Text style={styles.errorText}>
                                  {
                                    errors.children[i].passportExpiryDate
                                      .message
                                  }
                                </Text>
                              )}
                            </>
                          );
                        }}
                      />
                    </>
                  )}
                </View>
              </View>
            );
          })}

          {Array.from({length: parseInt(infant)}, (_, i) => {
            return (
              <View key={`infant-${i}`} style={styles.container}>
                <Text style={styles.header}>Infant-{i + 1}</Text>
                <View style={styles.eachItems}>
                  <Controller
                    name={`infants[${i}].gender`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <CustomSelection
                        data={gender}
                        placeHolder="Title"
                        value={field.value ? field.value : 'Title'}
                        setValue={field.onChange}
                        customStyles={
                          !isFormDisabled
                            ? styles.customStyles
                            : styles.activeCustomStyles
                        }
                        isEditable={isFormDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`infants[${i}].firstName`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <TextInput
                        value={field.value}
                        style={
                          !isFormDisabled ? styles.input : styles.activeInput
                        }
                        placeholder="First Name"
                        onChangeText={field.onChange}
                        editable={!isFormDisabled}
                      />
                    )}
                  />
                  <Controller
                    name={`infants[${i}].lastName`}
                    control={control}
                    defaultValue={''}
                    render={({field}) => (
                      <TextInput
                        value={field.value}
                        style={
                          !isFormDisabled ? styles.input : styles.activeInput
                        }
                        placeholder="Last Name"
                        onChangeText={field.onChange}
                        editable={!isFormDisabled}
                      />
                    )}
                  />
                  {isInternational && (
                    <>
                      <Controller
                        name={`infants[${i}].passportNumber`}
                        control={control}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>Passport Number</Text>
                            <TextInput
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Passport Number"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                          </>
                        )}
                      />

                      <Controller
                        name={`infants[${i}].passportIssueCountry`}
                        control={control}
                        render={({field}) => (
                          <>
                            <Text style={styles.label}>
                              Passport Issue Country
                            </Text>
                            <TextInput
                              value={field.value}
                              style={
                                !isFormDisabled
                                  ? styles.input
                                  : styles.activeInput
                              }
                              placeholder="Passport Issue Country"
                              onChangeText={field.onChange}
                              editable={!isFormDisabled}
                            />
                          </>
                        )}
                      />
                      <Controller
                        name={`infants[${i}].passportIssueDate`}
                        control={control}
                        defaultValue={''}
                        render={({field}) => {
                          return (
                            <View>
                              <Text style={styles.label}>
                                Passport Issue Date
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newShowIssueDatePicker = [
                                    ...showinfantIssueDatePicker,
                                  ];
                                  newShowIssueDatePicker[i] = true;
                                  setShowInfantIssueDatePicker(
                                    newShowIssueDatePicker,
                                  );
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Passport Issue Date"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showinfantIssueDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="default"
                                  onChange={(event, date) => {
                                    const newShowIssueDatePicker = [
                                      ...showinfantIssueDatePicker,
                                    ];
                                    newShowIssueDatePicker[i] = false;
                                    setShowInfantIssueDatePicker(
                                      newShowIssueDatePicker,
                                    );
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      ); // format as YYYY-MM-DD
                                    }
                                  }}
                                  minimumDate={new Date(1980, 0, 1)}
                                />
                              )}
                            </View>
                          );
                        }}
                      />

                      <Controller
                        name={`infants[${i}].passportExpiryDate`}
                        control={control}
                        defaultValue={''}
                        render={({field}) => {
                          return (
                            <View>
                              <Text style={styles.label}>
                                Passport Expiry Date
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  const newShowExpiryDatePicker = [
                                    ...showchildExpiryDatePicker,
                                  ];
                                  newShowExpiryDatePicker[i] = true;
                                  setShowInfantExpiryDatePicker(
                                    newShowExpiryDatePicker,
                                  );
                                }}
                                disabled={isFormDisabled}>
                                <TextInput
                                  value={
                                    field.value
                                      ? new Date(
                                          field.value,
                                        ).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                        })
                                      : ''
                                  }
                                  style={
                                    !isFormDisabled
                                      ? styles.input
                                      : styles.activeInput
                                  }
                                  placeholder="Passport Expiry Date"
                                  editable={false}
                                />
                              </TouchableOpacity>
                              {showinfantExpiryDatePicker[i] && (
                                <DateTimePicker
                                  value={
                                    field.value
                                      ? new Date(field.value)
                                      : new Date()
                                  }
                                  mode="date"
                                  display="default"
                                  onChange={(event, date) => {
                                    const newShowExpiryDatePicker = [
                                      ...showinfantExpiryDatePicker,
                                    ];
                                    newShowExpiryDatePicker[i] = false;
                                    setShowInfantExpiryDatePicker(
                                      newShowExpiryDatePicker,
                                    );
                                    if (date) {
                                      field.onChange(
                                        date.toISOString().split('T')[0],
                                      );
                                    }
                                  }}
                                  minimumDate={new Date(1980, 0, 1)}
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
        </>

        {status === 'Not Submitted' ? (
          <>
            {tripData?.data?.travellerDetails &&
            tripData?.data?.travellerDetails[eachTripData?.id] ? (
              !isFormDisabled ? (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleSubmit(onSubmit)}>
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleEdit}>
                  <Text style={styles.submitButtonText}>Edit</Text>
                </TouchableOpacity>
              )
            ) : (
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit(onSubmit)}>
                <Text style={styles.submitButtonText}>Save</Text>
              </TouchableOpacity>
            )}
          </>
        ) : null}
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
    fontSize: responsiveHeight(1.4),
    fontFamily: fonts.primary,
    color: colors.white,
  },
  btn: {
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: '#0a9396',
    paddingVertical: responsiveHeight(0.6),
    borderRadius: responsiveHeight(0.5),
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
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: responsiveHeight(1),
    padding: responsiveHeight(1),
    fontSize: responsiveHeight(2),
    color: colors.primary,
  },
  activeInput: {
    // borderWidth: 1,
    // borderColor: colors.gray,
    borderRadius: responsiveHeight(1),
    padding: responsiveHeight(1),
    fontSize: responsiveHeight(2),
    backgroundColor: colors.whiteSmoke,
    color: colors.primary,
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
  customStyles: {
    backgroundColor: colors.white,
    elevation: responsiveHeight(0.5),
    margin: responsiveHeight(0.5),
  },
  activeCustomStyles: {
    backgroundColor: colors.whiteSmoke,
    // elevation: responsiveHeight(0.5),
    margin: responsiveHeight(0.5),
  },
  errorText: {
    color: colors.red,
    fontFamily: fonts.primary,
    fontSize: responsiveHeight(1.3),
  },
});
