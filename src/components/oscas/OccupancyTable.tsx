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
import {Box} from "@mui/material";



interface IRPMEntryProps{
    name: string;
    datasource: any;
}

const OccupancyTable = (props: IRPMEntryProps)=>{

    const columns: GridColDef[] = [
        // @ts-ignore
        { field: 'icon', headerName: '', width: 270 },
        { field: 'name', headerName: 'NAME', width: 270 },
        { field: 'dateTime', headerName: 'DATE TIME', width: 270 },
        { field: 'alert', headerName: 'ALERT', width: 270 },
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
        let rpmOccupancyDataSource: SosGetResult = new SosGetResult(props.name + "occupancy",{
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
        let thisIcon: ReactElement = <></>;
        //@ts-ignore
        rpmOccupancyDataSource.subscribe((message: any[]) => {
            let msgValues: any[] = message.values;
            msgValues.forEach((value)=>setTableValues(value));
            function setTableValues(value: any[]) {
                //@ts-ignore
                thisDateTime = value.data.StartTime;
                //@ts-ignore
                let gammaAlarm: boolean = value.data.GammaAlarm;
                //@ts-ignore
                let neutronAlarm: boolean = value.data.NeutronAlarm;

                if (gammaAlarm && neutronAlarm) {
                    thisAlert = "GAMMA + NEUTRON";
                    thisIcon = <CircleNotifications style={{color: '#ff0000'}}/>;
                } else if (gammaAlarm && !neutronAlarm) {
                    thisAlert = "GAMMA";
                    thisIcon = <CircleNotifications style={{color: '#ff0000'}}/>;

                } else if (!gammaAlarm && neutronAlarm) {
                    thisAlert = "NEUTRON";
                    thisIcon = <CircleNotifications style={{color: '#ff0000'}}/>;
                } else if (!gammaAlarm && !neutronAlarm) {
                    thisAlert = "NONE";
                    thisIcon = <Circle color="success"/>;

                }

                // effectRows.push(  { id: thisDateTime, icon: 1, name: thisName, dateTime: thisDateTime, alert: thisAlert });
                //
                // setRows();
                setRows(rows => [{icon: thisIcon, name: thisName, dateTime: thisDateTime, alert: thisAlert}, ...rows]);
            }


        },[EventType.DATA]);

        if (props.datasource.mode !== "batch") {
            let TimeController = new DataSynchronizer({
                replaySpeed: 1,
                intervalRate: 5,
                dataSources: datasources,
                startTime: props.datasource.start,
            });


            TimeController.connect();
        }
        else rpmOccupancyDataSource.connect();


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
            sx={{ height: 400, width: '100%' }}
            rows={rows}
            columns={columns}
            getRowId={(row: any) =>  generateRandom()}
            initialState={{
                pagination: {
                    paginationModel: { page: 0, pageSize: 5 },
                },
            }}
            pageSizeOptions={[5, 10]}
        />
    )
}

export default OccupancyTable;