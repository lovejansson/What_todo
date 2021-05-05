import React from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  View,
 
  FlatList,
} from "react-native";
import Emoji from 'react-native-emoji';

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

console.log(icons);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#404040",
    padding: 16,
  
  },

  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,

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

export default function Icons({ dismiss, setChosenIcon }) {
  return (
  

      <FlatList
      style={styles.container}
      data = {icons}
      renderItem  = {({item}) => {
        console.log("render icon list")
        console.log(item)
      
        return(
          <View>
          <Text style={styles.title}>{item.title}</Text>
            <View style={styles.icons}>    
            {item.data.map(icon => <Pressable  onPress={() => {
            dismiss();}}><Emoji style={styles.emoji} name={icon}/></Pressable>)}    
            </View>
          </View>)}}

      keyExtractor={(item, idx)=> item.title}

      />
  );
}
