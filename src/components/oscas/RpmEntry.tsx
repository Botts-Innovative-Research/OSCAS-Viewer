import React from "react";
import {Divider, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Paper} from "@mui/material";

// @ts-ignore
import VideoView from "osh-js/source/core/ui/view/video/VideoView";
//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult"
//@ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode";
//@ts-ignore
import CurveLayer from "osh-js/source/core/ui/layer/CurveLayer";
//@ts-ignore
import ChartView from "osh-js/source/core/ui/view/chart/ChartView";
//@ts-ignore
import VideoDataLayer from "osh-js/source/core/ui/layer/VideoDataLayer"
//@ts-ignore
import VideoView from "osh-js/source/core/ui/view/video/VideoView";

interface IRpmEntryProps {
     name: string;
     datasource: any;
}

const RpmEntry = (props: IRpmEntryProps)=> {

    // GAMMA CHART
    let rpmGammaDataSource: SosGetResult = new SosGetResult(props.datasource.name + "gamma", {
        endpointUrl: props.datasource.url,
        offeringID: props.datasource.rpm.id,
        observedProperty: props.datasource.rpm.gammaProp,
    })

    let rpmGammaChartLayer: CurveLayer = new CurveLayer("Gamma Count", {
        dataSourceId: rpmGammaDataSource.id,
        name: 'GAMMA COUNT',
        backgroundColor: 'rgba(91,67,65,0.66)',
        lineColor: 'rgba(91,67,65,0.66)',
        maxValues: 250,
        getValues: (rec: { Gamma1: any; }, timeStamp: any) => {
            return {
                x: timeStamp,
                y: rec.Gamma1
            };
        }
    })

    let rpmGammaChartView: ChartView = new ChartView("Gamma", {
        container: 'gamma-chart-window',
        layers: [rpmGammaChartLayer],
        css: "chart-view",
        type: "line",
    })

    // NEUTRON CHART
    let rpmNeutronDataSource: SosGetResult = new SosGetResult(props.datasource.name + "neutron", {
        endpointUrl: props.datasource.url,
        offeringID: props.datasource.rpm.id,
        observedProperty: props.datasource.rpm.neutronProp,
    })

    let rpmNeutronChartLayer: CurveLayer = new CurveLayer("Neutron Count", {
        dataSourceId: rpmNeutronDataSource.id,
        name: 'NEUTRON COUNT',
        backgroundColor: 'rgba(91,67,65,0.66)',
        lineColor: 'rgba(91,67,65,0.66)',
        maxValues: 250,
        getValues: (rec: { Neutron1: any; }, timeStamp: any) => {
            return {
                x: timeStamp,
                y: rec.Neutron1
            };
        }
    })

    let rpmNeutronChartView: ChartView = new ChartView("Neutron", {
        container: 'neurton-chart-window',
        layers: [rpmNeutronChartLayer],
        css: "chart-view",
        type: "line",
    })

    // VIDEO

    let rpmVideoDataSource: SosGetResult = new SosGetResult("Video DS", {
        endpointUrl: props.datasource.url,
        offeringID: props.datasource.video.id,
        observedProperty: props.datasource.video.property,
    })

    let rpmVideoLayer: VideoDataLayer = new VideoDataLayer({
        dataSourceId: rpmVideoDataSource.id,
        getFrameData: (rec: { img: any; }) => rec.img,
        getTimestamp: (rec: { timestamp: any; }) => rec.timestamp,
    });

    let rpmVideoView = new VideoView({
        container: 'video-window',
        css: 'video-h264',
        name: 'Camera',
        showTime: true,
        showStats: true,
        layers: [rpmVideoLayer]
    });

    return(
        <div className={"rpm-entry"}>
            <h2 className={"rpm-name"}>{props.name}</h2>
            <div className={"rpm-left"}>
                <div className={"title"}>GAMMA COUNT</div>
                <div className={"gamma-chart-window"} id={"gamma-chart-window"}/>
                <Divider orientation={"horizontal"}/>
                <div className={"title"}>NEUTRON COUNT</div>
                <div className={"neutron-chart-window"} id={"neutron-chart-window"}/>
            </div>
            <Divider orientation={"vertical"}/>
            <div className={"rpm-right"}>
                <div className={"video-window"} id={"video-window"}/>
            </div>
        </div>
    )
}