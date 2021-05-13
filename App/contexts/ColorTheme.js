import React, { useState, createContext, useEffect } from "react";
import {colorsBlackTheme, colorsWhiteTheme, colorsGreyTheme,} from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ColorThemeContext = createContext();

export const ColorThemeProvider = ({children}) => {

  const [theme, setTheme] = useState("dark");

  const [colors, setColors] = useState(colorsBlackTheme);

  const getTheme = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      if(theme !== null) {
        return theme;
      }else{
        return "dark";
      }
    } catch(e) {
     
      return "dark";
    }
  }

  function updateColors(theme){
    switch(theme){
      case "black":
        setColors(colorsBlackTheme);
        break;
      case "white":
        setColors(colorsWhiteTheme);
        break;
      case "grey":
        setColors(colorsGreyTheme);
        break;
    }
  }

  useEffect(()=>{
    getTheme().then(theme => {
      setTheme(theme)
    }).catch(error=> {
      console.error(error);
    });
  },[]);

  useEffect(() => {
    updateColors(theme);
  }, [theme])

  return (
    <ColorThemeContext.Provider value={{theme, setTheme, colors}}>
      {children}
    </ColorThemeContext.Provider>
  );
};
