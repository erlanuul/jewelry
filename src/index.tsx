import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {persistStore} from "redux-persist";
import {store} from "./store/store";
import {PersistGate} from "redux-persist/integration/react";
import {ThemeProvider} from "@mui/material";
import {theme} from "./helpers/muiCustomization";
import {Provider} from "react-redux";
import {LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";

let persistor = persistStore(store);
export const {dispatch} = store

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <PersistGate loading={<>loading...</>} persistor={persistor}>
                    <App/>
                </PersistGate>
            </Provider>
        </ThemeProvider>
    </LocalizationProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
