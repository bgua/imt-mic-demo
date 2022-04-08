import React, { useEffect, useRef, useState } from 'react';
import microscopeImg from './images/axiozoom-optical-inspection.jpg';
import measurementImg from './images/spectrum-coordinate-measuring-machine-250x250.jpg';
import ImageWrapper from '../../components/image-wrapper';
import { BASE_URL, MACHINES_URL, WS_BASE_URL, WS_ENDPOINT,HTTP_METHOD, MACHINE_TYPE, MACHINE_STATUS } from '../../utils/constants';
import request from '../../utils/request';
import { dataFilter, dataFilter2Map } from '../../utils/util';
import { Store as Notification } from 'react-notifications-component';
import MachineDataTable from '../../components/machine-data-table';
import { Outlet } from 'react-router-dom';

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
    const [table, setTable] = useState(null);

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

            const {machine_id: machineId, status, timestamp} = data.payload;

            Notification.addNotification({
                title: "New machine status event!",
                message: <div>
                    <div>Machine ID: {machineId}</div>
                    <div>Machine Status: {status}</div>
                    <div>Event Timestamp: {timestamp}</div>
                </div>,
                type: "default",
                insert: "top",
                container: "top-right",
                animationIn: ["animate__animated", "animate__bounceIn"],
                animationOut: ["animate__animated", "animate__fadeOut"],
                dismiss: {
                  duration: 4000,
                  pauseOnHover: true
                }
            });
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
                    <span className="ml-2 underline text-xl font-bold cursor-pointer" onClick={() => setTable(machine.get(item[0]))}>{item[1].size}</span>
                </li>
            )
        }
        return result;
    }

    const closeTable = (e) => {
        console.log("event: ", e);
        if (table) {
            setTable(null)
        }
    }

    return (
        <div className="h-full flex justify-center items-center flex-col" onClick={(e) => closeTable(e)}>
            <div className="flex justify-center items-center ">
                {
                    images.map(img => {
                        const {name} = img;
                        return (
                            <div key={name} className="text-white">
                                <ImageWrapper {...img}  />
                                <ul className="px-12 py-6">
                                    {machineStatusList(machines[name])}
                                </ul>
                            </div>
                        )
                    })
                }
            </div>
            {
                table && <MachineDataTable data={table} />
            }
            <Outlet />
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
