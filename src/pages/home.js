import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="w-full h-screen bg-neutral-900 text-white">
            <div className="flex justify-between w-full items-center pr-8">
                <h1 className="py-8 mx-8 text-3xl font-bold uppercase">
                    ZEISS MachineStream
                </h1>
                <Link to="/machines">Machines</Link>
            </div>
            <Outlet />
        </div>
    )
}

export default HomePage