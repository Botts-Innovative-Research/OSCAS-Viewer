import React, {useEffect, useState} from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import {EventType} from 'osh-js/source/core/event/EventType';
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"


interface IRPMEntryProps{
    name: string;
    datasource: any;
}

const OccupancyTable = (props: IRPMEntryProps)=>{

    const columns: GridColDef[] = [
        { field: 'icon', headerName: '', width: 270 },
        { field: 'name', headerName: 'NAME', width: 270 },
        { field: 'dateTime', headerName: 'DATE TIME', width: 270 },
        { field: 'alert', headerName: 'ALERT', width: 270 },
    ]

    let [rows, setRows] = useState<any[]>([]);
    let datasources: SosGetResult = [];

    let tempRows: any[] = [
        { id: 1,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 2,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 3,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 4,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 5,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },



    ]


    useEffect(()=>{

        let effectRows: any[] = [];
        let rpmOccupancyDataSource: SosGetResult = new SosGetResult(props.datasource.name + "occupancy",{
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: "http://www.opengis.net/def/occupancy",
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        datasources.push(rpmOccupancyDataSource);

        let thisName: string = props.name;
        let thisDateTime: string = "";
        let thisAlert: string = "";
        let thisId: string = "";
        //@ts-ignore
        rpmOccupancyDataSource.subscribe((message: any[]) => {
            //@ts-ignore
            thisDateTime = message.values[0].data.StartTime;
            //@ts-ignore
            let gammaAlarm: boolean = message.values[0].data.GammaAlarm;
            //@ts-ignore
            let neutronAlarm: boolean = message.values[0].data.NeutronAlarm;

            if (gammaAlarm && neutronAlarm){
                thisAlert = "GAMMA + NEUTRON";
            }
            else if (gammaAlarm && !neutronAlarm){
                thisAlert = "GAMMA";
            }
            else if (!gammaAlarm && neutronAlarm){
                thisAlert = "NEUTRON";
            }
            else if (!gammaAlarm && !neutronAlarm){
                thisAlert = "NONE";
            }

            // effectRows.push(  { id: thisDateTime, icon: 1, name: thisName, dateTime: thisDateTime, alert: thisAlert });
            //
            // setRows();
            setRows(rows => [...rows, { id: thisDateTime, icon: 1, name: thisName, dateTime: thisDateTime, alert: thisAlert }]);


        },[EventType.DATA]);

        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: datasources,
            startTime: props.datasource.start,
        });


        TimeController.connect();


    },[])


    return(
        <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
        />
    )
}

export default OccupancyTable;