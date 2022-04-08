import React, { useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { NavLink } from 'react-router-dom';

export default function MachineDataTable({data}) {
    const columns = useMemo(
        () => [
            {
                name: 'Id',
                selector: row => row.id,
                cell: (row) => (
                    <NavLink
                    className="underline"
                        to={`/machines/${row.id}`}
                    >
                        {row.id}
                    </NavLink>
                )
            },
            {
                name: 'Machine Type',
                selector: row => row.machine_type,
            },
            {
                name: 'Status',
                selector: row => row.status,
            },
            {
                name: 'Floor',
                selector: row => row.floor,
            },
            {
                name: 'Installation Date',
                selector: row => row.install_date,
            },
        ]
    )
    const tableData = Array.from(data.values());

    return (
        <DataTable
            columns={columns}
            data={tableData}
        />
    )
}