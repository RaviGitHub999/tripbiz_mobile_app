import { StyleSheet } from "react-native";
import { responsiveHeight, responsiveWidth } from "../../../utils/responsiveScale";
import { colors, fonts } from "../../../config/theme";

export const styles = StyleSheet.create(
    {
        mainContainer: {
            flex: 1,
            padding: responsiveHeight(3)
        },
        maintitle: {
            fontSize: responsiveHeight(3),
            fontFamily: fonts.textFont,
            color: colors.primary,
            textAlign: "center"
        },
        subTitle:
        {
            fontSize: responsiveHeight(2.5),
            fontFamily: fonts.textFont,
            color: colors.primary,
        },
        btn: {
            borderWidth: 1,
            paddingHorizontal: responsiveHeight(1.5),
            borderRadius: responsiveHeight(1.6),
            backgroundColor: colors.primary,
            flexDirection: 'row',
            alignItems: 'center',
            gap: responsiveHeight(1),
            paddingVertical:responsiveHeight(1),
            alignSelf:'flex-start'
        },
        btnTitle:{
            fontSize:responsiveHeight(1.9),
            fontFamily:fonts.textFont,
            color:colors.white

        },
        subContainer:
        {
            gap: responsiveHeight(1),
            marginTop: responsiveHeight(3),
        },
        managerDetailsContainer:
        {
            gap:responsiveHeight(2)
        },
        inputContainer:
        {
            gap:responsiveHeight(1)
        },
        inPutHeaderTitle:
        {
            fontSize:responsiveHeight(2),
            fontFamily:fonts.textInput,
            color:colors.primary
        },
        managerDataContainer:{
            borderWidth:responsiveHeight(0.2),
            padding:responsiveHeight(1.8),
            borderRadius:responsiveHeight(1.5),
            borderStyle:'dotted',
            backgroundColor:colors.highlightLite
        },
        managerDataTitle:
        {
            fontSize:responsiveHeight(2),
            fontFamily:fonts.textFont,
            color:colors.primary
        },
        approvalNavBar:{
            borderWidth:responsiveHeight(0.13),
            flexDirection:'row',
            borderRadius:responsiveHeight(1.6),
            backgroundColor:colors.highlightLite,
            borderColor:colors.primaryLite,
            overflow:'hidden'
        },
        eachNavBarContainer:
        {
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            padding:responsiveHeight(0.8),
           
        },
        selectedEachNavBarContainer:
        {
            flex:1,
            alignItems:'center',
            justifyContent:'center',
            padding:responsiveHeight(0.8),
            backgroundColor:colors.primaryLite
           
        },
        eachNavBarTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.primary,
        },
        selectedEachNavBarTitle:
        {
            fontSize: responsiveHeight(2),
            fontFamily: fonts.primary,
            color: colors.white,
        }
    }
)