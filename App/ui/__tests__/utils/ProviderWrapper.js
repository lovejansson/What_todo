import React from "react";

import {ColorThemeProvider} from "../../../contexts/ColorTheme";
import {DataProvider} from "../../../contexts/Data";
import { NotificationProvider} from "../../../contexts/Notification";


export default function ProviderWrapper({component, dbMock}){

    return(
        <DataProvider db={dbMock}>
        <ColorThemeProvider>
        <NotificationProvider >

            {component}

        </NotificationProvider>
        </ColorThemeProvider>
        </DataProvider>
    )
}

