import React from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Auth from "./pages/Auth";
import MiddleWare from "./http/MiddleWare";
import Staffs from "./pages/staffs/Staffs";
import Clients from "./pages/clients/Clients";
import ClientsView from "./pages/clients/ClientsView";
import Products from "./pages/products/Products";
import ProductsView from "./pages/products/ProductsView";
import Salaries from "./pages/salaries/Salaries";
import SalariesAdd from "./pages/salaries/SalariesAdd";
import SalariesView from "./pages/salaries/SalariesView";

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
                    <Route path="products/*">
                        <Route index element={<Products/>}/>
                        <Route path=':id' element={<ProductsView/>}/>
                    </Route>
                    <Route path="salaries/*">
                        <Route index element={<Salaries/>}/>
                        <Route path=':id' element={<SalariesView/>}/>
                        <Route path='add' element={<SalariesAdd/>}/>
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
