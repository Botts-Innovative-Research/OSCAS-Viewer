import React, {ReactElement, useEffect, useState} from "react";
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
import {Card, CardActions, CardHeader, CardContent, Typography, Button} from "@mui/material";
import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleNotifications from '@mui/icons-material/CircleNotifications'
import Circle from '@mui/icons-material/Circle'
//@ts-ignore
import {EventType} from 'osh-js/source/core/event/EventType';
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"


interface IRpmEntryProps {
    name: string;
    datasource: any;
}



const RpmStatus = (props: IRpmEntryProps)=> {

    let datasources: SosGetResult = [];

    let [gammaStatus, setGammaStatus] = useState<ReactElement>(<Circle color="success"/>);
    let [textStatus, settextStatus] = useState<string>("");

    useEffect(() => {

        let rpmGammaDataSource: SosGetResult = new SosGetResult(props.datasource.name + "gamma", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.gammaProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })
        datasources.push(rpmGammaDataSource);

        let rpmNeutronDataSource: SosGetResult = new SosGetResult(props.datasource.name + "neutron", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.neutronProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        datasources.push(rpmNeutronDataSource);



        let gStatus: string = "";
        // @ts-ignore
        rpmGammaDataSource.subscribe((message: any[]) => {
            // @ts-ignore
            let thisStatus:string = message.values[0].data["Alarm State"];
            settextStatus(thisStatus);
            if (thisStatus == "Alarm"){
                setGammaStatus(<CircleNotifications style={{ color: '#ff0000' }}/>)
            }
            else {
                setGammaStatus(<Circle color="success"/>)
            }
        }, [EventType.DATA]);


        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: datasources,
            startTime: props.datasource.start,
        });


        TimeController.connect();


    }, []);


    return (
        <Card sx={{ width: 150, height:150}}>
            <CardHeader title={props.name} subheader={textStatus}></CardHeader>
            <CardActions>
                {gammaStatus}<Button size="small">View RPM</Button>
            </CardActions>
        </Card>
    )

}

export default RpmStatus;