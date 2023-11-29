import React, {useEffect, useState} from "react";
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
import {Card, CardActions, CardContent, Typography, Button} from "@mui/material";
import CheckCircle from '@mui/icons-material/CheckCircle';
import CircleNotifications from '@mui/icons-material/CircleNotifications'
import Circle from '@mui/icons-material/Circle'

interface IRpmEntryProps {
    name: string;
    datasource: any;
}



const RpmStatus = (props: IRpmEntryProps)=> {

    let datasources: SosGetResult = [];

    let [gammaStatus, setGammaStatus] = useState<string>("");
    let [neutronStatus, setNeutronStatus] = useState<string>("");

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


    }, []);


    return (
        <Card sx={{ width: 275 }}>
            <CardContent>
                <Typography variant="h5" component="div">
                    {props.name}
                </Typography>
                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap',}}>
                <CircleNotifications color="success"/><Typography sx={{ fontSize: 16 }}>GAMMA</Typography>
                </div>
                <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap',}}>
                <Circle color="success"/><Typography sx={{ fontSize: 16}}>NEUTRON</Typography>
                </div>
            </CardContent>
            <CardActions>
                <Button size="small">View RPM</Button>
            </CardActions>
        </Card>
    )

}

export default RpmStatus;