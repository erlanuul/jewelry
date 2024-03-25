import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import MiddleWare from "./http/MiddleWare";
import Staffs from "./pages/staffs/Staffs";
import Clients from "./pages/clients/Clients";
import ClientsView from "./pages/clients/ClientsView";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/*' element={
                    <MiddleWare>
                        <Layout/>
                    </MiddleWare>
                }>
                    <Route index path="home" element={<Home/>}/>
                    <Route path="staffs/*">
                        <Route index element={<Staffs/>}/>
                    </Route>
                    <Route path="clients/*">
                        <Route index element={<Clients/>}/>
                        <Route path=':id' element={<ClientsView/>}/>
                    </Route>
                </Route>

                <Route path='login' element={
                    <MiddleWare>
                        <Auth/>
                    </MiddleWare>
                }/>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
