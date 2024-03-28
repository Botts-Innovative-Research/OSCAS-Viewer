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

const WapirzSensorReport = (props: ISensorDataProps)=> {

    let datasources: SosGetResult[]=[];

    let [masterTimeController, setMasterTimeController] = useState<DataSynchronizer>({});

    let [wapirzSensorDS, setWapirzSensorDS] = useState<SosGetResult>({});

//     let [motionDS, setMotionDS] = useState<SosGetResult>({});
//     let [temperatureDS, setTemperatureDS] = useState<SosGetResult>({});
//     let [tamperAlarmDS, setTamperAlarmDS] = useState<SosGetResult>({});
//     let [batteryDS, setBatteryDS] = useState<SosGetResult>({});

    let [motionDS, setMotionDS] = useState<ChartJSView>({});
    let [temperatureDS, setTemperatureDS] = useState<ChartJSView>({});
    let [tamperAlarmDS, setTamperAlarmDS] = useState<ChartJSView>({});
    let [batteryDS, setBatteryDS] = useState<ChartJSView>({});

    useEffect(()=>{
//
//         let wapirzMotionDataSource: SosGetResult = new SosGetResult(props.name + "Motion", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wapirzSensor.id,
//             observedProperty: props.datasource.wapirzSensor.motionProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wapirzMotionDataSource);
//
//         let wapirzTemperatureDataSource: SosGetResult = new SosGetResult(props.name + "Temperature", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wapirzSensor.id,
//             observedProperty: props.datasource.wapirzSensor.temperatureProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wapirzTemperatureDataSource);
//
//         let wapirzTamperAlarmDataSource: SosGetResult = new SosGetResult(props.name + "Tamper Alarm", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wapirzSensor.id,
//             observedProperty: props.datasource.wapirzSensor.tamperAlarmProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wapirzTamperAlarmDataSource);
//
//         let wapirzBatteryDataSource: SosGetResult = new SosGetResult(props.name + "Battery", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.wapirzSensor.id,
//             observedProperty: props.datasource.wapirzSensor.batteryProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(wapirzBatteryDataSource);


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
                <h1 style={{fontFamily: 'sans-serif', marginBottom:'0px'}}>WAPIRZ Sensor</h1>
                <SensorStatus
                    name="Motion Sensor"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wapirzSensor.motionProp}
                    sensor={props.datasource.wapirzSensor}/>
                <SensorStatus
                    name="Tamper Alarm Status"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wapirzSensor.tamperAlarmProp}
                    sensor={props.datasource.wapirzSensor}/>
                <SensorStatus
                    name="Temperature"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wapirzSensor.temperatureProp}
                    sensor={props.datasource.wapirzSensor}/>
                <SensorStatus
                    name="Battery Level"
                    datasource={props.datasource}
                    observedProperty={props.datasource.wapirzSensor.batteryProp}
                    sensor={props.datasource.wapirzSensor}/>
            </Card>
            </div>
        </div>
    )
}

export default WapirzSensorReport;