import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import {FormattedMessage} from 'react-intl';

const HomePage = () => {
    return (
        <div className="w-full h-screen bg-neutral-900 text-white">
            <div className="flex justify-between w-full items-center pr-8">
                <h1 className="py-8 mx-8 text-3xl font-bold uppercase">
                    <FormattedMessage id="title"/>
                </h1>
                <Link to="/machines" className="capitalize">
                    <FormattedMessage id="machines"/>
                </Link>
            </div>
            <Outlet />
        </div>
    )
}

export default HomePage