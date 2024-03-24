import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import {useSelector} from "react-redux";
import MiddleWare from "./http/MiddleWare";
import Staffs from "./pages/staffs/Staffs";

function App() {
    const user = useSelector((state: any) => state.userData.user)
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
