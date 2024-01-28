import React, {ReactElement, useEffect, useState} from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import {EventType} from 'osh-js/source/core/event/EventType';
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
import CircleNotifications from "@mui/icons-material/CircleNotifications";
import Circle from "@mui/icons-material/Circle";
//@ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode";


interface IRPMEntryProps{
    name: string;
    datasource: any;
}

const CountTable = (props: IRPMEntryProps)=>{

    const columns: GridColDef[] = [
        // @ts-ignore
        { field: 'type', headerName: '', width: 270 },
        { field: 'dateTime', headerName: 'DATE TIME', width: 270 },
        { field: 'count', headerName: 'COUNT', width: 270 },
        { field: 'alert', headerName: 'STATUS', width: 270 },
    ]

    let [rows, setRows] = useState<any[]>([]);
    let datasources: SosGetResult[] = [];

    let tempRows: any[] = [
        { id: 1,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 2,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 3,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 4,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 5,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },



    ]


    useEffect(()=>{

        let effectRows: any[] = [];
        let rpmGammaDataSource: SosGetResult = new SosGetResult(props.datasource.name + "occupancy",{
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.gammaProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: Mode.BATCH
        })

        datasources.push(rpmGammaDataSource);

        let rpmNeutronDataSource: SosGetResult = new SosGetResult(props.datasource.name + "occupancy",{
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.neutronProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: Mode.BATCH
        })

        datasources.push(rpmNeutronDataSource);

        let thisName: string = props.name;
        let thisDateTime: string = "";
        let thisAlert: string = "";
        let thisId: string = "";
        let thisIcon: ReactElement = <></>;
        let thisCount: string = "";
        let thisType: string="";
        //@ts-ignore
        rpmGammaDataSource.subscribe((message: any[]) => {
            let msgValues: any[] = message.values;
            msgValues.forEach((value)=>setTableValues(value));
            function setTableValues(value: any[]) {
                //@ts-ignore
                thisDateTime = value.data["Sampling Time"];
                //@ts-ignore
                let thisCount = value.data.Gamma1
                //@ts-ignore
                let thisAlert = value.data["Alarm State"];
                let thisType = "GAMMA";


                // effectRows.push(  { id: thisDateTime, icon: 1, name: thisName, dateTime: thisDateTime, alert: thisAlert });
                //
                // setRows();
                setRows(rows => [{
                    type: thisType,
                    dateTime: thisDateTime,
                    count: thisCount,
                    alert: thisAlert
                },...rows]);
            }

        },[EventType.DATA]);

        rpmNeutronDataSource.subscribe((message: any[]) => {
            let msgValues: any[] = message.values;
            msgValues.forEach((value)=>setTableValues(value));
            function setTableValues(value: any[]) {
                //@ts-ignore
                thisDateTime = value.data.SamplingTime;
                //@ts-ignore
                let thisCount = value.data.Neutron1
                //@ts-ignore
                let thisAlert = value.data.AlarmState;
                let thisType = "NEUTRON";


                // effectRows.push(  { id: thisDateTime, icon: 1, name: thisName, dateTime: thisDateTime, alert: thisAlert });
                //
                // setRows();
                setRows(rows => [{
                    type: thisType,
                    dateTime: thisDateTime,
                    count: thisCount,
                    alert: thisAlert
                },...rows]);
            }


        },[EventType.DATA]);

        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: datasources,
            startTime: props.datasource.start,
        });

        TimeController.connect();


    },[])

    function generateRandom() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    return(
        <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row: any) =>  generateRandom()}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 4 },
                },
            }}
            pageSizeOptions={[4, 10]}
            getRowClassName={(params)=>params.row.alert}
        />
    )
}

export default CountTable;