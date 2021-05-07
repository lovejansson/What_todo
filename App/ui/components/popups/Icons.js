import React, {useContext} from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Emoji from 'react-native-emoji';
import Icon from "react-native-vector-icons/AntDesign";
import { ColorThemeContext } from "../../../contexts/ColorTheme";

const window = Dimensions.get("window");

const iconsImportant = ["eyes", "bangbang", "clock4", "fire"];

const iconsBills = ["dollar", "euro", "yen", "pound", "credit_card"];

const iconsWork = ["office", "factory", "convenience_store", "bank", "hospital", "building_construction", "house_with_garden"];
const iconsSchool = ["school","mortar_board", "books"];

const iconsDrinks = ["tropical_drink", "beer", "wine_glass", "sake","cocktail"];

const iconsFoods = ["hamburger", "pizza","curry", "spaghetti", "rice", "stew", "cooking", "taco", "green_salad"];

const iconsTravel = ["beach_with_umbrella", "palm_tree","airplane_departure", "earth_asia", "earth_americas", 
"earth_africa"];

const iconsEntertainment = ["film_frames",  "popcorn", "ferris_wheel", "roller_coaster", "video_game", "vhs"];
const iconsHolidays = ["gift", "birthday", "jack_o_lantern", "christmas_tree", "santa", "balloon", "tada", "tanabata_tree"];

const icons = [

  {

    title: "Important",
    data: iconsImportant,

  },

  {

    title: "Work",
    data: iconsWork
    
  },

  {

    title: "School",
    data: iconsSchool
    
  },

  {

    title: "Bills",
    data: iconsBills
    
  },
  {

    title: "Foods & Drinks",
    data: iconsFoods.concat(iconsDrinks)
    
  },
  {

    title: "Travel",
    data: iconsTravel,
    
  },
  {

    title: "Holidays & Celebration",
    data: iconsHolidays,
  },
  {

    title: "Entertainment",
    data: iconsEntertainment,
    
  }
];


const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  closeIcon: {
    color:"#fff",
    alignSelf: "flex-end",
    marginVertical: 16
  },

  icons: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,

  },

  emoji: {
    fontSize: 32,
    paddingHorizontal: 4,
    paddingVertical: 4
  }
});

export default function Icons({ dismiss }) {

  const colors = useContext(ColorThemeContext).colors;
  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  const titleStyle = [styles.title, {color: colors.heading}];
  const closeIconStyle = [styles.closeIcon, {color: colors.icon}];

  function renderItem({item}){
    return(
      <View>
        <Text style={titleStyle}>{item.title}</Text>
        
        <View style={styles.icons}>    
          
          {item.data.map(icon => {
         return(<Pressable onPress={() => {dismiss(icon);}}>
              <Emoji style={styles.emoji} name={icon}/>
          </Pressable>)})}  

        </View>
      </View>);
  }

  return (
    <View style={containerStyle}>
      <TouchableOpacity onPress={()=>{
        dismiss()
      }}>
        <Icon name="close" size={32} style={closeIconStyle}/>
      </TouchableOpacity>

      <FlatList
      data={icons}
      renderItem={renderItem}
      keyExtractor={(item, idx) => (item.title + idx).toString()}/>

      </View>
  );
}
