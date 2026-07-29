function DashboardPage(){

    return (

        <div>


            <h1 className="text-3xl font-bold mb-6">
                Dashboard
            </h1>


            <div className="grid grid-cols-3 gap-6">


                <div className="shadow rounded p-6">

                    <p className="text-gray-500">
                        Customers
                    </p>

                    <h2 className="text-3xl font-bold">
                        1250
                    </h2>

                </div>



                <div className="shadow rounded p-6">

                    <p className="text-gray-500">
                        Active Deals
                    </p>

                    <h2 className="text-3xl font-bold">
                        320
                    </h2>

                </div>



                <div className="shadow rounded p-6">

                    <p className="text-gray-500">
                        Revenue
                    </p>

                    <h2 className="text-3xl font-bold">
                        $250K
                    </h2>

                </div>


            </div>


        </div>

    );

}


export default DashboardPage;