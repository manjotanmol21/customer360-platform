import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layout/MainLayout";

import DashboardPage from "../pages/dashboard/DashboardPage";
import CustomersPage from "../pages/customer/CustomersPage";
import SettingsPage from "../pages/settings/SettingsPage";


function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                <Route element={<MainLayout />}>

                    <Route
                        path="/"
                        element={<DashboardPage />}
                    />


                    <Route
                        path="/customers"
                        element={<CustomersPage />}
                    />


                    <Route
                        path="/settings"
                        element={<SettingsPage />}
                    />

                </Route>

            </Routes>

        </BrowserRouter>

    );

}


export default AppRoutes;