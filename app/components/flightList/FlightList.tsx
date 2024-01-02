import { View, Text, FlatList } from 'react-native'
import React, { useContext} from 'react'
import MyContext from '../../context/Context'
import FlightCard from './FlightCard'
interface IProps{
    index:number
}
const FlightList:React.FC<IProps> = ({index}) => {
    const {flightResList,actions}=useContext<any>(MyContext)
  return (
    <View>
          {flightResList &&
          flightResList[index] &&
          <FlatList data={flightResList[index]} renderItem={({item,index}:{item:any,index:number})=>
    {
        return(
            <FlightCard
            flightGrp={item}
            index={index}
            /> 
        )
    }}/>
}
    </View>
  )
}

export default React.memo(FlightList)