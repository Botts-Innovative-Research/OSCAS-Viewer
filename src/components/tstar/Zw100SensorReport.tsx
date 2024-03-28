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

const Zw100SensorReport = (props: ISensorDataProps)=> {

    let datasources: SosGetResult[]=[];

    let [masterTimeController, setMasterTimeController] = useState<DataSynchronizer>({});

    let [zw100SensorDS, setZW100SensorDS] = useState<SosGetResult>({});


//     let [motionDS, setMotionDS] = useState<SosGetResult>({});
//     let [vibrationDS, setVibrationDS] = useState<SosGetResult>({});
//     let [temperatureDS, setTemperatureDS] = useState<SosGetResult>({});
//     let [humidityDS, setHumidityDS] = useState<SosGetResult>({});
//     let [luminanceDS, setLuminanceDS] = useState<SosGetResult>({});
//     let [uvDS, setUvDS] = useState<SosGetResult>({});
//     let [batteryDS, setBatteryDS] = useState<SosGetResult>({});

//     let [motionDS, setMotionDS] = useState<ChartJSView>({});
//     let [vibrationDS, setVibrationDS] = useState<ChartJSView>({});
//     let [temperatureDS, setTemperatureDS] = useState<ChartJSView>({});
//     let [humidityDS, setHumidityDS] = useState<ChartJSView>({});
//     let [luminanceDS, setLuminanceDS] = useState<ChartJSView>({});
//     let [uvDS, setUvDS] = useState<ChartJSView>({});
//     let [batteryDS, setBatteryDS] = useState<ChartJSView>({});


    useEffect(()=>{

//         let zw100MotionDataSource : SosGetResult = new SosGetResult(props.name + "Motion", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.motionProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100MotionDataSource);
//
//         let zw100VibrationDataSource : SosGetResult = new SosGetResult(props.name + "Vibration", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.vibrationProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100VibrationDataSource);
//
//         let zw100TemperatureDataSource : SosGetResult = new SosGetResult(props.name + "Temperature", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.temperatureProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100TemperatureDataSource);
//
//         let zw100HumidityDataSource : SosGetResult = new SosGetResult(props.name + "Humidity", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.humidityProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100HumidityDataSource);
//
//         let zw100LuminanceDataSource : SosGetResult = new SosGetResult(props.name + "Luminance", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.luminanceProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100LuminanceDataSource);
//
//         let zw100UVDataSource : SosGetResult = new SosGetResult(props.name + "UV", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.UVProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100UVDataSource);
//
//         let zw100BatteryDataSource : SosGetResult = new SosGetResult(props.name + "Battery", {
//             endpointUrl: props.datasource.url,
//             offeringID: props.datasource.zw100Sensor.id,
//             observedProperty: props.datasource.zw100Sensor.batteryProp,
//             mode: props.datasource.mode
//         })
//
//         datasources.push(zw100BatteryDataSource);


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
                    <h1 style={{fontFamily: 'sans-serif', marginBottom:'0px'}}>ZW100 Sensor</h1>
                    <SensorStatus
                        name="Motion Sensor"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.motionProp}
                        sensor={props.datasource.zw100Sensor}/>
                    <SensorStatus
                        name="Vibration Alarm"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.vibrationProp}
                        sensor={props.datasource.zw100Sensor}/>
                    <SensorStatus
                        name="Temperature"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.temperatureProp}
                        sensor={props.datasource.zw100Sensor}/>
                    <SensorStatus
                        name="Relative Humidity"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.humidityProp}
                        sensor={props.datasource.zw100Sensor}/>
                    <SensorStatus
                        name="Luminance"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.luminanceProp}
                        sensor={props.datasource.zw100Sensor}/>
                    <SensorStatus
                        name="Ultraviolet Index"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.UVProp}
                        sensor={props.datasource.zw100Sensor}/>
                    <SensorStatus
                        name="Battery Level"
                        datasource={props.datasource}
                        observedProperty={props.datasource.zw100Sensor.batteryProp}
                        sensor={props.datasource.zw100Sensor}/>
                </Card>
                </div>
            </div>
    )
}

export default Zw100SensorReport;