import React, { useState, useContext, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  Keyboard,
  Pressable
} from "react-native";

import { DataContext } from "../../contexts/Data";
import { ColorThemeContext } from "../../contexts/ColorTheme";
import { NotificationContext } from "../../contexts/Notification";

import Icons from "../components/popups/Icons";
import Icon from "react-native-vector-icons/AntDesign";
import Emoji from 'react-native-emoji';
import FloatingActionButton from "../components/FloatingActionButton";


const window = Dimensions.get("window");

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "flex-start",
  },

  label: {
    fontSize: 20,
    fontWeight: "bold",
  },

  input: {
    fontSize: 20,
    width: window.width - 32,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderBottomWidth: 0.5,
    
  },

  icon: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },

  buttonIcons: {
    flexDirection: "row",
    alignItems: "center",
    marginEnd: 16,
    alignSelf: "flex-end",
  
  },

  emoji: {
    fontSize: 32,
    marginEnd: 4,
  },

  buttonClose: {
    alignSelf: "flex-end",
    marginVertical: 16,
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
  }


});

export default function NewList({ navigation }) {
  const colors = useContext(ColorThemeContext).colors;

  const db = useContext(DataContext).db;
  const setLists = useContext(DataContext).setLists;

  const [showIconsPopup, setShowIconsPopup] = useState(false);
  const [chosenIcon, setChosenIcon] = useState("memo");
  const [chosenListName, setChosenListName] = useState("");

  const containerStyle = [styles.container, {backgroundColor: colors.background}];
  const inputStyle= [styles.input, {backgroundColor: colors.background, color: colors.text, borderColor: colors.text2}];
  const buttonCloseStyle = [styles.buttonClose, {color: colors.icon}];
  const iconStyle = [styles.icon, {color: colors.icon}];


  async function insertList() {

    if(chosenListName === ""){

      // error
    }else if(chosenIcon === ""){

      // errir
    }else{

        let insertedId;

        try{

          insertedId = await db.insertList(chosenListName, chosenIcon);

        }catch(error){
          console.error(error);
        }


        if(insertedId){
          setLists((oldLists) => [
            ...oldLists,
            { name: chosenListName, icon: chosenIcon, id: insertedId, count: 0 },
          ]);
        }

        navigation.goBack();

    }

  }

  function dismissKeyboard(){
    Keyboard.dismiss();
  }

  return (
    <Pressable style={containerStyle} onPress={dismissKeyboard}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showIconsPopup}
        onRequestClose={() => setShowIconsPopup(false)}>
        <Icons
          dismiss={(icon) => {
            if(icon){
              setChosenIcon(icon);
            }
            setShowIconsPopup(false);
          }}
        />
      </Modal>

      <TouchableOpacity
      style={buttonCloseStyle}
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon style={iconStyle} name="close" size={32}></Icon>
      </TouchableOpacity>
      
      <View>
        <TextInput
          style={inputStyle}
          value = {chosenListName}
          placeholder="Name"
          placeholderTextColor={colors.text}
          selectionColor={colors.text}
          keyboardType="ascii-capable"
          onChangeText={(value) => {
            setChosenListName(value);
          }}
        />

      <TouchableOpacity
      style={styles.buttonIcons}
          onPress={() => {
            setShowIconsPopup(true);
          }}
        >
          <Emoji name={chosenIcon} style={styles.emoji}/>
          <Icon name="down" size={24} color={colors.icon}/>
        </TouchableOpacity>

      </View>

      <FloatingActionButton icon="check" action={insertList} style={styles.fab}/>
    </Pressable>
  );
}
