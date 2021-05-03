import React, { useState, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";

import { DataContext } from "../data/DataContext";

import Icons from "./Icons";
import Icon from "react-native-vector-icons/AntDesign";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    backgroundColor: "green",

    justifyContent: "center",
    alignItems: "center",
  },

  inputName: {
    backgroundColor: "yellow",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 20,
    fontSize: 20,
    width: "90%",
  },
  inputIcon: {
    backgroundColor: "yellow",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
    fontSize: 20,
    width: "90%",
  },
  inputIconText: {
    fontSize: 20,
  },
  button: {
    alignSelf: "flex-end",
    margin: 16,
  },
  buttonDismiss: {
    // backgroundColor: "red",
    // position: "absolute",
    // end: 24,
    // top: 32,
    // width: 32,
    // height: 32,
    // borderRadius: 50,
  },
  iconSave: {
    paddingVertical: 18,
    paddingHorizontal: 18,
  },
  iconDismiss: {
    color: "#000",
    transform: [{ rotate: "45 deg" }],

    paddingVertical: 8,
    paddingHorizontal: 8,
  },

  buttonSave: {
    backgroundColor: "red",
    borderRadius: 50,
    marginTop: "auto",
  },
});

export default function NewList({ navigation }) {
  const db = useContext(DataContext).db;
  const setLists = useContext(DataContext).setLists;

   const [showIconsPopup, setShowIconsPopup] = useState(false);
  const [chosenIcon, setChosenIcon] = useState("");
  const [chosenListName, setChosenListName] = useState("");

  async function saveList() {
    let newId = await db.insertList(chosenListName, chosenIcon);

    setLists((oldLists) => [
      ...oldLists,
      { name: chosenListName, icon: chosenIcon, id: newId },
    ]);
  }

  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={showIconsPopup}
        onRequestClose={() => setShowIconsPopup(false)}
      >
        <Icons
          dismiss={() => {
            setShowIconsPopup(false);
          }}
          setChosenIcon={(icon) => {
            setChosenIcon(icon);
          }}
        />
      </Modal>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Icon style={styles.iconDismiss} name="plus" size={32} color="black"></Icon>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputName}
          placeholder="Name"
          keyboardType="ascii-capable"
          onChangeText={(value) => {
            setChosenListName(value);
          }}
        />
        <TouchableOpacity
          style={styles.inputIcon}
          onPress={() => {
            console.log("show icons popup");

            setShowIconsPopup(true);
          }}
        >
          <Text style={styles.inputIconText}>{chosenIcon}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.button, styles.buttonSave]}
        onPress={() => {
          saveList();
          navigation.goBack();
        }}
      >
        <Icon style={styles.iconSave} name="check" size={32} color="black"></Icon>
      
      </TouchableOpacity>
    </View>
  );
}
