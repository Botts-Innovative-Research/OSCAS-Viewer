import React, {useEffect, useState} from "react";
import {Box, Card, CardActions, CardHeader, CardContent, Grid} from "@mui/material";
import styled from '@mui/system/styled';

// @ts-ignore
import VideoView from "osh-js/source/core/ui/view/video/VideoView";
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode";
//@ts-ignore
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer";
//@ts-ignore
import ChartJSView from "osh-js/source/core/ui/view/chart/ChartJSView";
//@ts-ignore
import VideoDataLayer from "osh-js/source/core/ui/layer/VideoDataLayer"
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
import {EventType} from 'osh-js/source/core/event/EventType';

import CesiumMap from "../map/CesiumMap";


interface ILaneCameraProps {
     name: string;
     datasource: any;
}

const LaneCamera = (props: ILaneCameraProps)=> {

    let datasources: SosGetResult=[];

    let [masterTimeController, setMasterTimeController] = useState<DataSynchronizer>({});

    let [vID, setVID] = useState<string>("");

    let [gammaStatus, setGammaStatus] = useState<string>("");
    let [textStatus, setTextStatus] = useState<string>("");


    function guidGenerator() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4());
    }

    let rID = guidGenerator();


    useEffect(()=>{

        let randomID = guidGenerator();
        let videoID = "video" + randomID;
        setVID(videoID);

        let rpmGammaDataSource: SosGetResult = new SosGetResult("Gamma DS", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.gammaProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        datasources.push(rpmGammaDataSource);

            let gStatus: string = "";

            rpmGammaDataSource.subscribe((message: any[]) => {

                let thisStatus:string = message.values[0].data["Alarm State"];
                setTextStatus(thisStatus);
                if (thisStatus == "Alarm"){
                    setGammaStatus("MuiPaper-outlined")
                }
            else {
                   setGammaStatus("")
                }
            }, [EventType.DATA]);


        // Lane Video
        let laneCamVideoDataSource: SosGetResult = new SosGetResult("Lane Camera DS", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.video.id,
            observedProperty: props.datasource.video.property,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        datasources.push(laneCamVideoDataSource);


        let laneCamVideoLayer: VideoDataLayer = new VideoDataLayer({
            dataSourceId: laneCamVideoDataSource.id,
            getFrameData: (rec: { img: any; }) => rec.img,
            getTimestamp: (rec: { timestamp: any; }) => rec.timestamp,
        });

        let laneCamVideoView = new VideoView({
            container: videoID,
            css: 'video-h264',
            name: 'Camera',
            showTime: true,
            showStats: true,
            layers: [laneCamVideoLayer]
        });


   let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: datasources,
            startTime: props.datasource.start,
        });

        setMasterTimeController(TimeController);

        TimeController.connect();
    },[])

      return (
                <Card className={gammaStatus} id="lane-camera-card">
                    <CardHeader title={props.name}> </CardHeader>
                    <CardContent>
                        <div className="lane-cam-video-window" id={vID}/>
                    </CardContent>
                </Card>
      )
};

export default LaneCamera;