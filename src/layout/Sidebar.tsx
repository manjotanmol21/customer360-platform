import { Link } from "react-router-dom";


function Sidebar(){

    return (

        <aside className="w-64 bg-gray-900 text-white min-h-screen p-6">


            <h1 className="text-xl font-bold mb-8">
                Customer360
            </h1>


            <nav>
                <Link
                    to="/"
                    className="block mb-3 hover:text-blue-400"
                >
                    Dashboard
                </Link>

                <Link
                    to="/customers"
                    className="block mb-3 hover:text-blue-400"
                >
                    Customers
                </Link>

                <Link
                    to="/settings"
                    className="block hover:text-blue-400"
                >
                    Settings
                </Link>
            </nav>


        </aside>

    );

}


export default Sidebar;