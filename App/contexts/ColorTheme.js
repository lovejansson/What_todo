import React, { useState, createContext, useEffect } from "react";
import {colorsBlackTheme, colorsWhiteTheme, colorsGreyTheme,} from "../constants/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import RootViewBackgroundColor from 'react-native-root-view-background-color';

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
       
        RootViewBackgroundColor.setBackground(colorsBlackTheme.rootView.r,
          colorsBlackTheme.rootView.g, colorsBlackTheme.rootView.b, colorsBlackTheme.rootView.a);

        setColors(colorsBlackTheme);
        break;
      case "white":
       
        RootViewBackgroundColor.setBackground(colorsWhiteTheme.rootView.r, colorsWhiteTheme.rootView.g
          , colorsWhiteTheme.rootView.b, colorsWhiteTheme.rootView.a);
        setColors(colorsWhiteTheme);
        break;
      case "grey":
        RootViewBackgroundColor.setBackground(colorsGreyTheme.rootView.r, colorsGreyTheme.rootView.g
          , colorsGreyTheme.rootView.b, colorsGreyTheme.rootView.a);
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
