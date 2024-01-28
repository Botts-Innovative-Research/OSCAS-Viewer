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

interface IRpmEntryProps {
     name: string;
     datasource: any;
}

const RpmEntry = (props: IRpmEntryProps)=> {

    let datasources: SosGetResult[]=[];

    let [masterTimeController, setMasterTimeController] = useState<DataSynchronizer>({});

    let [neutronDS, setNeutronDS] = useState<SosGetResult>({});

    let [gammaDS, setGammaDS] = useState<SosGetResult>({});

    let [neutronCV, setNeutronCV] = useState<ChartJSView>({});

    let [gammaCV, setGammaCV] = useState<ChartJSView>({});

    let [nID, setNID] = useState<string>("");
    let [gID, setGID] = useState<string>("");
    let [vID, setVID] = useState<string>("");

    function guidGenerator() {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4());
    }



    let rID = guidGenerator();
    let neutronID = "neutron" + rID;
    let gammaID = "gamma" + rID;


    useEffect(()=>{


        let randomID = guidGenerator();
        let videoID = "video" + randomID;
        setVID(videoID);

        // GAMMA CHART
        let rpmGammaDataSource: SosGetResult = new SosGetResult(props.datasource.name + "gamma", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.gammaProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode

        })

        setGammaDS(rpmGammaDataSource);
        datasources.push(rpmGammaDataSource);

        //@ts-ignore
        let rpmGammaChartLayer: CurveLayer = new CurveLayer({
            dataSourceId: rpmGammaDataSource.id,
            name: 'GAMMA COUNT',
            backgroundColor: 'rgba(87,30,234,0.83)',
            lineColor: 'rgba(87,30,234,0.83)',
            maxValues: 25,
            getValues: (rec: { Gamma1: any; }, timeStamp: any) => {
                return {
                    x: timeStamp,
                    y: rec.Gamma1
                };
            }
        })



        let rpmGammaChartView: ChartJSView = new ChartJSView({
            container: gammaID,
            layers: [rpmGammaChartLayer],
            css: "chart-view",
            type: "line",
        })

        setGammaCV(rpmGammaChartView);

        // NEUTRON CHART
        let rpmNeutronDataSource: SosGetResult = new SosGetResult(props.datasource.name + "neutron", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.rpm.id,
            observedProperty: props.datasource.rpm.neutronProp,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        setNeutronDS(rpmNeutronDataSource);
        datasources.push(rpmNeutronDataSource);

        //@ts-ignore
        let rpmNeutronChartLayer: CurveLayer = new CurveLayer({
            dataSourceId: rpmNeutronDataSource.id,
            name: 'NEUTRON COUNT',
            backgroundColor: 'rgba(220,89,67,0.83)',
            lineColor: 'rgba(220,89,67,0.83)',
            maxValues: 25,
            getValues: (rec: { Neutron1: any; }, timeStamp: any) => {
                return {
                    x: timeStamp,
                    y: rec.Neutron1
                };
            }
        })


        let rpmNeutronChartView: ChartJSView = new ChartJSView({
            container: neutronID,
            layers: [rpmNeutronChartLayer],
            css: "chart-view",
            type: "line",
        })

        setNeutronCV(rpmNeutronChartView);

        // VIDEO

        let rpmVideoDataSource: SosGetResult = new SosGetResult("Video DS", {
            endpointUrl: props.datasource.url,
            offeringID: props.datasource.video.id,
            observedProperty: props.datasource.video.property,
            startTime: props.datasource.start,
            endTime: props.datasource.end,
            mode: props.datasource.mode
        })

        datasources.push(rpmVideoDataSource);


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

        console.log(gammaID);

        let TimeController = new DataSynchronizer({
            replaySpeed: 1,
            intervalRate: 5,
            dataSources: datasources,
            startTime: props.datasource.start,
        });

        setMasterTimeController(TimeController);

        TimeController.connect();
    },[])

    // let rpmNeutronChartView: ChartJSView = new ChartJSView("Neutron", {
    //     container: 'neutron-chart-window',
    //     layers: [neutronCL],
    //     css: "chart-view",
    //     type: "line",
    // })







    return(
        <div className={"rpm-entry"}>
            <h2 className={"title"}>{props.name}</h2>
            <Divider orientation={"horizontal"}/>
            <div className={"rpm-left"}>
                {/*<div className={"title"}>GAMMA COUNT</div>*/}
                <div className={"gamma-chart-window"} id={gammaID}/>
                {/*<Divider orientation={"horizontal"}/>*/}
                {/*<div className={"title"}>NEUTRON COUNT</div>*/}
                <div className={'neutron-chart-window'} id={neutronID}/>
            </div>
            {/*<Divider orientation={"vertical"}/>*/}
            <div className={"rpm-right"}>
                <div className={"video-window"} id={vID}/>
            </div>
        </div>
    )
}

export default RpmEntry;