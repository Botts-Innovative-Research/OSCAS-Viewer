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

interface IRPMEntryProps{
    name:string;
    datasource:any;
    observedProperty:string;
}

const StatusAlarm = (props: IRPMEntryProps)=>{

    let [statusIcon, setStatusIcon] = useState<ReactJSXElement>(<Circle color="success" fontSize='inherit' style={{fontSize: "300px"}}/>)
    let [statusText, setStatusText] = useState<string>("")
    let [open, setOpen] = useState<boolean>(false);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        let statusDS: SosGetResult = new SosGetResult(props.name, {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.observedProperty,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })
        //@ts-ignore
        statusDS.subscribe((message: any[])=>{
            //@ts-ignore
            let msgValues: any[] = message.values;

            msgValues.forEach((value)=> setAlarm(value))

            function setAlarm(value:any[]){
                let alarmStatusValue: string = findInObject(value, "Alarm State | AlarmState")

                if (alarmStatusValue == "Alarm") {
                    setStatusIcon(<CircleNotifications fontSize='inherit' style={{color: '#ff0000', fontSize: "300px"}}/>);
                    setStatusText(alarmStatusValue);
                    setOpen(true);
                } else {
                    setStatusIcon(<Circle color="success" fontSize='inherit' style={{fontSize: "300px"}}/>);
                    setStatusText(alarmStatusValue)
                }
            }
        }, [EventType.DATA]);

        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: [statusDS],
            startTime: props.datasource.start,
        });

        TimeController.connect();

    }, []);

        return(
            <React.Fragment>
            <Card style={{alignItems: 'center', margin: '10px', width:'300px'}}>
                <h1 style={{fontFamily: 'sans-serif', marginBottom:'0px'}}>{props.name}</h1>
                {statusIcon}
                <h4 style={{fontFamily: 'sans-serif'}}>{statusText}</h4>
            </Card>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {props.name}{" ALARM!"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                The {props.name} Level has exceeded allowed limit.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Dismiss</Button>
            <Button onClick={handleClose} autoFocus>
                Report
            </Button>
        </DialogActions>
    </Dialog>
            </React.Fragment>

        )
}

export default StatusAlarm;