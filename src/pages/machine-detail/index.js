import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { BASE_URL, HTTP_METHOD, MACHINES_DETAIL_URL } from '../../utils/constants';
import request from '../../utils/request';

export default function MachineDetail({}) {
    const [data, setData] = useState(null)
    let {machineId} = useParams();

    useEffect(() => {
        request(`${BASE_URL}${MACHINES_DETAIL_URL}/${machineId}`, {
            method: HTTP_METHOD.GET
        })
        .then(res => {
            setData(res.data);
        })
    }, [machineId]);

    return (
        <div>
            {data && JSON.stringify(data)}
        </div>
    )
}