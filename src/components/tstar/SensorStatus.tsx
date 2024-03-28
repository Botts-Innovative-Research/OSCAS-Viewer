import React, {ReactElement, useEffect, useState} from "react";
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import {EventType} from 'osh-js/source/core/event/EventType';
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
import CircleNotifications from "@mui/icons-material/CircleNotifications";
import Circle from "@mui/icons-material/Circle";
import {Box, Card, CardHeader, Typography} from "@mui/material";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import {findInObject} from "../../utils/Utils";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

interface ISensorStatusProps{
    name:string;
    datasource:any;
    observedProperty:string;
    sensor: any;
}

const SensorStatus = (props: ISensorStatusProps)=>{

    let [statusText, setStatusText] = useState<string>("")


    useEffect(() => {
        let sensorOutputDS: SosGetResult = new SosGetResult(props.name, {
            endpointUrl: props.datasource.url,
            offeringID: props.sensor.id,
            observedProperty: props.observedProperty,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode,

        })


        //@ts-ignore
        sensorOutputDS.subscribe((message: any[])=>{
            //@ts-ignore
            let msgValues: any[] = message.values;
            msgValues.forEach((value)=> setValue(value))

            function setValue(value:any[]){

                let name = props.name;
                let outputValue: any = findInObject(value, name);

                    setStatusText(outputValue.toString())
            }
        }, [EventType.DATA]);

        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: [sensorOutputDS],
            startTime: props.datasource.start,
            endTime: props.datasource.end,

        });

        TimeController.connect();
// sensorOutputDS.connect();
    }, []);

        return(
            <>
                <h4 style={{fontFamily: 'sans-serif'}}>{props.name}: {statusText}</h4>
            </>

        )
}

export default SensorStatus;