import * as React from 'react';
import {DataGrid, GridColDef, GridValueGetterParams} from "@mui/x-data-grid";
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult"
//@ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode"
//@ts-ignore
import RawDataLayer from "../../layers/RawDataLayer"

const columns: GridColDef[] = [
    { field: 'time', headerName: 'Time', width: 200 },
    { field: 'status', headerName: 'status', width: 100 },
    { field: 'gamma1', headerName: 'Gamma 1', width: 100 },
    { field: 'gamma2', headerName: 'Gamma 2', width: 100 },
    { field: 'gamma3', headerName: 'Gamma 3', width: 100 },
    { field: 'gamma4', headerName: 'Gamma 4', width: 100 },
];

interface IOccupancyDataProps {
    datasource: any;
    occupancy: any
}

export default function GammaScanTable(props: IOccupancyDataProps){

    let rpmGammaDataSource: SosGetResult = new SosGetResult(props.datasource.name + "gamma", {
        endpointUrl: props.datasource.url,
        offeringID: props.datasource.rpm.id,
        observedProperty: props.datasource.rpm.gammaProp,
        mode: Mode.BATCH,
        startTime: props.occupancy.start,
        endTime: props.occupancy.end,
    })

    let rows: any[] =[];

    let gammaDataLayer: RawDataLayer = new RawDataLayer("Gamma Data", {
        dataSourceId: rpmGammaDataSource.id,
        name: 'GAMMA SCAN',
        getDataValues: (rec: any) => {

            let newRow = {
                time: rec.timeStamp,
                status: rec.status,
                gamma1: rec.gamma1,
                gamma2: rec.gamma2,
                gamma3: rec.gamma3,
                gamma4: rec.gamma4
            }

            rows.push(newRow);

            return
        },

    })

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    },
                }}
                pageSizeOptions={[5, 10]}
            />
        </div>
    );




}