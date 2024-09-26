import {StyleSheet} from 'react-native';
import { colors, fonts } from '../../../config/theme';
import { responsiveHeight, responsiveWidth } from '../../../utils/responsiveScale';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  headerMainContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: responsiveWidth(5),
    justifyContent: 'center',
    rowGap: responsiveHeight(1),
    height: responsiveHeight(10),
    paddingVertical:responsiveHeight(1),
   
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'centers',
    columnGap: responsiveWidth(4),
  },
  title: {
    textAlignVertical: 'center',
    color: colors.white,
    fontSize: responsiveHeight(2.2),
    fontFamily: fonts.primary,
    flex:1
  },
  editButtonContainer: {
    backgroundColor: colors.highlight,
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
    borderRadius: responsiveHeight(3),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf:'center'
  },
  subTitle: {
    textAlignVertical: 'center',
    color: colors.white,
    fontSize: responsiveHeight(1.7),
    fontFamily: fonts.primary,
  },
  filterClosingIcon:{
    alignSelf:'center',
  },
  progressBarContainer:
  {
    flex:1,
    justifyContent:'center',
    paddingHorizontal:responsiveWidth(5)
  },
  searchInput:{
    borderWidth: responsiveHeight(0.2),
    paddingHorizontal: responsiveWidth(5),
    borderRadius: responsiveHeight(2),
    fontSize: responsiveHeight(2.1),
    color:colors.primary,
    fontFamily:fonts.primary
  },
  filterButtonsContainer:
  {
flex:1,
flexDirection:'row',
paddingVertical:responsiveHeight(1),
alignItems:'center',
gap:responsiveHeight(1)
  },
  Btn:{
    alignSelf:'flex-end',
    paddingHorizontal:responsiveWidth(4),
    paddingVertical:responsiveHeight(1),
    borderRadius:responsiveHeight(1),
    borderWidth:responsiveHeight(0.1)
  
  },
  activeBtn:{
    alignSelf:'flex-end',
    paddingHorizontal:responsiveWidth(4),
    paddingVertical:responsiveHeight(1),
    borderRadius:responsiveHeight(1),
    backgroundColor:colors.black,
  
  },
btnText:{
    fontSize:responsiveHeight(1.7),
    fontFamily:fonts.primary,
    color:colors.primary
  },
  activebtnText:{
    fontSize:responsiveHeight(1.7),
    fontFamily:fonts.primary,
    color:colors.white
  },
  filterImgContainer:{
flexDirection:'row',
alignItems:'center',
gap:responsiveHeight(1)
  },
  filterImg:{
    height:responsiveHeight(3),
    width:responsiveHeight(3)
  },
  filterName:
  {
    fontSize:responsiveHeight(3),
    fontFamily:fonts.primary,
    color:colors.primary
  },
  activeSubHeadings:{
    fontSize:responsiveHeight(1.2),
    fontFamily:fonts.primary,
    color:colors.white
  },
  subHeadings:{
    fontSize:responsiveHeight(1.2),
    fontFamily:fonts.primary,
    color:colors.lightGray
  }
});
