import React, {useEffect, useState} from "react";
import {Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper} from "@mui/material";

// @ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode";
import {Box, Card, CardHeader, Typography} from "@mui/material";
//@ts-ignore
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer";
//@ts-ignore
import ChartJSView from "osh-js/source/core/ui/view/chart/ChartJSView";
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
import CesiumMap from "../map/CesiumMap";
import SensorStatus from "./SensorStatus";


interface ISensorDataProps {
     name: string;
     datasource: any;
}

const WadwazSensorReport = (props: ISensorDataProps)=> {

    let datasources: SosGetResult[]=[];

    let [masterTimeController, setMasterTimeController] = useState<DataSynchronizer>({});

    let [wadwazSensorDS, setWadwazSensorDS] = useState<SosGetResult>({});

//     let [batteryDS, setBatteryDS] = useState<SosGetResult>({});
//     let [entryDS, setEntryDS] = useState<SosGetResult>({});


    let [batteryDS, setBatteryDS] = useState<ChartJSView>({});
    let [entryDS, setEntryDS] = useState<ChartJSView>({});


    useEffect(()=>{
//
//         let wadwazEntryAlarmDataSource: SosGetResult = new SosGetResult(props.name + "Entry Alarm", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wadwazSensor.id,
//             observedProperty: props.datasource.wadwazSensor.entryAlarmProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wadwazEntryAlarmDataSource);
//
//         let wadwazTamperAlarmDataSource: SosGetResult = new SosGetResult(props.name + "Tamper Alarm", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wadwazSensor.id,
//             observedProperty: props.datasource.wadwazSensor.tamperAlarmProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wadwazTamperAlarmDataSource);
//
//         let wadwazBatteryDataSource: SosGetResult = new SosGetResult(props.name + "Battery", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wadwazSensor.id,
//             observedProperty: props.datasource.wadwazSensor.batteryProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wadwazBatteryDataSource);


//         let TimeController = new DataSynchronizer({
//
//             replaySpeed: 1,
//             intervalRate: 5,
//             dataSources: datasources,
//             startTime: props.datasource.mode,
//         });
//         setMasterTimeController(TimeController);
//
//         TimeController.connect();
    },[])

    return(
        <div className={"rpm-entry"}>
            <h2 className={"title"}>{props.name}</h2>
         <div className={"lane-left"}>
            <Card style={{alignItems: 'center', margin: '10px', width:'300px'}}>
                <h1 style={{fontFamily: 'sans-serif', marginBottom:'0px'}}>WADWAZ Sensor</h1>
                <SensorStatus
                    name="Entry Alarm"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wadwazSensor.entryAlarmProp}
                    sensor={props.datasource.wadwazSensor}/>
                <SensorStatus
                    name="Tamper Alarm Status"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wadwazSensor.tamperAlarmProp}
                    sensor={props.datasource.wadwazSensor}/>
                <SensorStatus
                    name="Battery Level"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wadwazSensor.batteryProp}
                    sensor={props.datasource.wadwazSensor}/>
            </Card>
            </div>
        </div>
    )
}

export default WadwazSensorReport;