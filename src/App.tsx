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
import BoxOffice from "./pages/boxOffice/BoxOffice";
import IncomeSale from "./pages/boxOffice/income/IncomeSale";
import IncomeDefer from "./pages/boxOffice/income/IncomeDefer";
import IncomePayment from "./pages/boxOffice/income/IncomePayment";
import IncomeInterchange from "./pages/boxOffice/income/IncomeInterchange";
import ExpenseRansom from "./pages/boxOffice/expense/ExpenseRansom";
import ExpensePrepayment from "./pages/boxOffice/expense/ExpensePrepayment";
import ExpenseOther from "./pages/boxOffice/expense/ExpenseOther";
import ExpenseSalary from "./pages/boxOffice/expense/ExpenseSalary";
import SalesReport from "./pages/sales/SalesReport";
import SalesReportView from "./pages/sales/SalesReportView";
import Defers from "./pages/defers/Defers";
import DeferView from "./pages/defers/DeferView";
import Inventory from "./pages/inventory/Inventory";
import Metals from "./pages/metals/Metals";
import InterchangeView from "./pages/boxOffice/income/InterchangeView";

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
                    <Route path="box_office/*">
                        <Route index element={<BoxOffice/>}/>
                        <Route path='income/*'>
                            <Route index element={<IncomeSale/>}/>
                            <Route path='defer' element={<IncomeDefer/>}/>
                            <Route path='payment' element={<IncomePayment/>}/>
                            <Route path='interchange/*'>
                                <Route index element={<IncomeInterchange/>}/>
                                <Route path=':id' element={<InterchangeView/>}/>
                            </Route>
                        </Route>
                        <Route path='expense/*'>
                            <Route index element={<ExpenseRansom/>}/>
                            <Route path='prepayment' element={<ExpensePrepayment/>}/>
                            <Route path='other' element={<ExpenseOther/>}/>
                            <Route path='salary' element={<ExpenseSalary/>}/>
                        </Route>
                    </Route>
                    <Route path='sales_reports/*'>
                        <Route index element={<SalesReport/>}/>
                        <Route path=':id' element={<SalesReportView/>}/>
                    </Route>
                    <Route path="defers/*">
                        <Route index element={<Defers/>}/>
                        <Route path=':id' element={<DeferView/>}/>
                    </Route>
                    <Route path="inventory_check/*">
                        <Route index element={<Inventory/>}/>
                    </Route>
                    <Route path="metals/*">
                        <Route index element={<Metals/>}/>
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
