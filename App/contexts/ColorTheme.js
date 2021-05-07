import React, { useState, createContext, useEffect } from "react";
import {colorsDarkTheme, colorsLightTheme} from "../constants/colors";

export const ColorThemeContext = createContext();

export const ColorThemeProvider = ({children}) => {

  const [theme, setTheme] = useState("dark");

  const [colors, setColors] = useState(colorsDarkTheme);

  useEffect(()=>{

    if(theme === "dark"){
      setColors(colorsDarkTheme);
    }else{
      setColors(colorsLightTheme);
    }
  },[theme])

  return (
    <ColorThemeContext.Provider value={{setTheme, colors}}>
      {children}
    </ColorThemeContext.Provider>
  );
};
