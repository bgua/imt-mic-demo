import React, { useEffect, useRef, useState } from 'react';
import microscopeImg from './images/axiozoom-optical-inspection.jpg';
import measurementImg from './images/spectrum-coordinate-measuring-machine-250x250.jpg';
import ImageWrapper from '../../components/image-wrapper';
import { BASE_URL, MACHINES_URL, WS_BASE_URL, WS_ENDPOINT,HTTP_METHOD, MACHINE_TYPE, MACHINE_STATUS } from '../../utils/constants';
import request from '../../utils/request';
import { dataFilter, dataFilter2Map } from '../../utils/util';

const images = [
    {
        imgSrc: measurementImg,
        name: "measurement"
    },
    {
        imgSrc: microscopeImg,
        name: "microscope"
    }
];
const ws_url =  `${WS_BASE_URL}${WS_ENDPOINT}`;

export default function Machines() {
    const [machines, setMachines] = useState({});

    const ws = useRef(null);

    useEffect(() => {
        request(`${BASE_URL}${MACHINES_URL}`, {
            method: HTTP_METHOD.GET
        })
        .then(res => {
            if (!res.data) console.log("empty data returned: ", res);

            const measurement = machineDataFormatter(res.data, MACHINE_TYPE.MEASUREMENT);
            const microscope = machineDataFormatter(res.data, MACHINE_TYPE.MICROSCOPE);

            console.log("measurement", measurement);
            console.log("microscope", microscope);

            setMachines({
                measurement,
                microscope
            });
        })
    }, []);

    useEffect(() => {
        ws.current = new WebSocket(ws_url);
        ws.current.onopen = () => console.log("ws opened");
        ws.current.onclose = () => console.log("ws closed");
        ws.current.onmessage = (res) => {
            const data = JSON.parse(res.data);
            console.log("res.data: ", data);
        }

        const wsInstance = ws.current;
        return () => {
            wsInstance.close();
        };
    }, []);

    const machineStatusList = (machine) => {
        let result = [];
        if (!machine) return null;

        for (let item of machine.entries()) {
            result.push(
                <li key={item[0]} className="mt-4 font-bold">
                    <span className="capitalize">{`${item[0]} : `}</span>
                    <span className="ml-2">{item[1].size}</span>
                </li>
            )
        }
        return result;
    }

    return (
        <div className="h-full flex justify-center items-center">
            <div className="flex justify-center items-center ">
                {
                    images.map(img => {
                        const {name} = img;
                        return (
                            <div key={name} class="text-white">
                                <ImageWrapper {...img}  />
                                <ul className="px-12 py-6">
                                    {machineStatusList(machines[name])}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
        </div>

    )
}

function machineDataFormatter(data, typeValue) {
    const typeData = dataFilter(data, 'machine_type', typeValue);
    const runningMahcineMap = dataFilter2Map(typeData, 'status', MACHINE_STATUS.RUNNING);
    const idleMahcineMap = dataFilter2Map(typeData, 'status', MACHINE_STATUS.IDLE);
    const erroredMahcineMap = dataFilter2Map(typeData, 'status', MACHINE_STATUS.ERRORED);
    const finishedMahcineMap = dataFilter2Map(typeData, 'status', MACHINE_STATUS.FINISHED);

    const machinesDataMap = new Map();
    machinesDataMap.set(MACHINE_STATUS.RUNNING, runningMahcineMap);
    machinesDataMap.set(MACHINE_STATUS.IDLE, idleMahcineMap);
    machinesDataMap.set(MACHINE_STATUS.ERRORED, erroredMahcineMap);
    machinesDataMap.set(MACHINE_STATUS.FINISHED, finishedMahcineMap);

    return machinesDataMap;
    // return {
    //     [MACHINE_STATUS.RUNNING]: runningMahcineMap,
    //     [MACHINE_STATUS.ERRORED]: erroredMahcineMap,
    //     [MACHINE_STATUS.FINISHED]: finishedMahcineMap,
    //     [MACHINE_STATUS.IDLE]: idleMahcineMap
    // }
}
