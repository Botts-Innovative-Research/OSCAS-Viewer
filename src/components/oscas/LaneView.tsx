import React, {useEffect, useState} from "react";
import {Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper} from "@mui/material";

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
import CesiumMap from "../map/CesiumMap";
import OccupancyTable from "./OccupancyTable";
import TimeController from "../time/TimeController";
import CountTable from "./CountTable";
import OccupancyTimeController from "./OccupancyTimeController";
import StatusAlarm from "./StatusAlarm";

interface ILaneProps {
    name: string;
    datasource: any;

}

const LaneView = (props: ILaneProps)=>{


    let gammaProperty = "http://www.opengis.net/def/gamma-scan";
    let neutronProperty = "http://www.opengis.net/def/neutron-scan";

    let [vID, setVID] = useState<string>("");

    function guidGenerator() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4());
    }

    useEffect(() => {
        let randomID = guidGenerator();
        let videoID = "video" + randomID;
        setVID(videoID);
        let rpmVideoDataSource: SosGetResult = new SosGetResult("Video DS", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.video.id,
            observedProperty: props.datasource.video.property,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        let rpmVideoLayer: VideoDataLayer = new VideoDataLayer({
            dataSourceId: rpmVideoDataSource.id,
            getFrameData: (rec: { img: any; }) => rec.img,
            getTimestamp: (rec: { timestamp: any; }) => rec.timestamp,
        });

        let rpmVideoView = new VideoView({
            container: videoID,
            css: 'video-h264',
            name: 'Camera',
            showTime: true,
            showStats: true,
            layers: [rpmVideoLayer]
        });

        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: [rpmVideoDataSource],
            startTime: props.datasource.start,
        });

        TimeController.connect();

    }, []);

    return(
        <div>
            <h2 className={"title"}>{props.name}</h2>
            <Divider orientation={"horizontal"}/>
            <div className={"lane-left"}>
                <StatusAlarm name={"GAMMA"} datasource={props.datasource} observedProperty={gammaProperty}/>
                <StatusAlarm name={"NEUTRON"} datasource={props.datasource} observedProperty={neutronProperty}/>
            </div>
            <div className={"lane-right"}>
                <div className={"video-window-lane"} id={vID} style={{marginTop:'45px'}}/>
            </div>
        </div>
    )

}

export default LaneView;