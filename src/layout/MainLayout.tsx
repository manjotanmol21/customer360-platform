import { Outlet } from "react-router-dom";

import Navbar from "../layout/navbar";
import Sidebar from "../layout/Sidebar";


function MainLayout(){

    return (

        <div className="flex min-h-screen">


            <Sidebar />


            <div className="flex-1">


                <Navbar />


                <main className="p-6">

                    <Outlet />

                </main>


            </div>


        </div>

    );

}


export default MainLayout;