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
import {Box, Typography} from "@mui/material";



interface ISiteViewProps {
    sites:any;
}

const SiteTable = (props: ISiteViewProps)=>{

    const columns: GridColDef[] = [
        // @ts-ignore
        { field: 'name', headerName: 'LANE', width: 270 },
        { field: 'startTime', headerName: 'START TIME', width: 270 },
        { field: 'endTime', headerName: 'END TIME', width: 270 },
        { field: 'alert', headerName: 'ALERT', width: 270 },
    ]

    let [rows, setRows] = useState<any[]>([]);

    let tempRows: any[] = [
        { id: 1,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 2,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 3,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 4,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },
        { id: 5,icon: 1, name: "thisName", dateTime: "thisDateTime", alert: "thisAlert" },



    ]


    useEffect(()=>{

        // let datasources: SosGetResult[] = [];

        let siteArray: any[] = props.sites;

        siteArray.forEach((site)=>{
            let rpmGammaDataSource: SosGetResult = new SosGetResult(site.datasource.name + "occupancy",{
                endpointUrl: site.datasource.url,
                offeringID: site.datasource.rpm.id,
                observedProperty: "http://www.opengis.net/def/occupancy",
                startTime: site.datasource.start,
                endTime: site.datasource.end,
                mode: Mode.REPLAY
            })

            let timeController = new DataSynchronizer({
                replaySpeed: 1,
                intervalRate: 5,
                dataSources: [rpmGammaDataSource],
                startTime: site.datasource.start,
            });

            // datasources.push(timeController);


            let thisName: string = site.name;
            let thisStartTime: string = "";
            let thisAlert: string = "";
            let thisEndTime: string = "";
            let thisIcon: ReactElement = <></>;
            let thisGammaAlarm: boolean = false;
            let thisNeutronAlarm: boolean = false;

            //@ts-ignore
            rpmGammaDataSource.subscribe((message: any[]) => {
                let msgValues: any[] = message.values;
                msgValues.forEach((value)=>setTableValues(value));
                function setTableValues(value: any[]) {
                    //@ts-ignore
                    thisStartTime = value.data["StartTime"];
                    //@ts-ignore
                    thisEndTime = value.data["EndTime"];
                    //@ts-ignore
                    thisGammaAlarm = value.data.GammaAlarm
                    //@ts-ignore
                    thisNeutronAlarm = value.data.NeutronAlarm;

                    if (thisGammaAlarm && !thisNeutronAlarm){
                        thisAlert= "GAMMA";
                    }
                    else if (!thisGammaAlarm && thisNeutronAlarm){
                        thisAlert= "NEUTRON";
                    }
                    else if (thisGammaAlarm && thisNeutronAlarm){
                        thisAlert="GAMMA-NEUTRON";
                    }
                    else thisAlert="NONE";


                    // effectRows.push(  { id: thisDateTime, icon: 1, name: thisName, dateTime: thisDateTime, alert: thisAlert });
                    //
                    // setRows();
                    setRows(rows => [{
                        name: thisName,
                        startTime: thisStartTime,
                        endTime: thisEndTime,
                        alert: thisAlert
                    },...rows]);
                }

            },[EventType.DATA]);

            timeController.connect();
        })


        // datasources.forEach((ds)=>{
        //     ds.connect();
        // })

    },[])

    function DataGridTitle() {
        return(
            <Box style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <Typography variant="h5">Occupancies</Typography>
            </Box>
        )
    }
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
            getRowClassName={(params)=>params.row.alert}
            slots={{
                toolbar: DataGridTitle
            }}
        />
    )
}

export default SiteTable;