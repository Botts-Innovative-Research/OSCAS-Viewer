import React, {useEffect, useState} from "react";

//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import SweApi from "osh-js/source/core/datasource/sweapi/SweApi.datasource"
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
//@ts-ignore
import CesiumView from "osh-js/source/core/ui/view/map/CesiumView"
//@ts-ignore
import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer"
//@ts-ignore
import PolylineLayer from "osh-js/source/core/ui/layer/PolylineLayer"

import {findInObject} from "../../utils/Utils";
import UGV from "../../assets/models/ugv.glb";
import DRONE from "../../assets/models/drone.glb";
import PointMarkerNoOrientation from "../../assets/models/pointmarker.glb";
import {colorHash} from "../../utils/ColorUtils";
import * as Cesium from "cesium";
import {setMapView, updateContextMenuState} from "../../state/Slice";
//@ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode";
import {hslToRgb} from "@mui/material";
// @ts-ignore
import {randomUUID} from "osh-js/source/core/utils/Utils";
import * as d3 from "d3";


let buildingTileset: any = null;
let viewer: any = null;

const Heatmap=()=>{


    // function hslToRgb(h, s, l) {
    //     let r, g, b;
    //
    //     if (s === 0) {
    //         r = g = b = l; // achromatic
    //     } else {
    //         const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    //         const p = 2 * l - q;
    //         r = hueToRgb(p, q, h + 1/3);
    //         g = hueToRgb(p, q, h);
    //         b = hueToRgb(p, q, h - 1/3);
    //     }
    //
    //     function hueToRgb(p, q, t) {
    //         if (t < 0) t += 1;
    //         if (t > 1) t -= 1;
    //         if (t < 1/6) return p + (q - p) * 6 * t;
    //         if (t < 1/2) return q;
    //         if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    //         return p;
    //     }
    //
    //     return [round(r * 255), round(g * 255), round(b * 255)];
    // }

    useEffect(() => {
        let reportDS: SosGetResult = new SosGetResult("report",{
            endpointUrl:'34.67.197.57:8181/sensorhub/sos',
            offeringID:'KROMEK_D5:D5M100103',
            observedProperty: "http://sensorml.com/ont/swe/property/KromekDetectorRadiometricsV1Report",
            startTime: "2024-01-27T15:13:25.845Z",
            endTime: "2024-01-27T15:26:33.994Z",
            mode: Mode.BATCH
        });

        let statusAPI: SweApi = new SweApi(`status-api`, {
            protocol: 'ws',
            endpointUrl: '34.67.197.57:8181/sensorhub/api',
            // collection: `/datastreams/${datasource.datastreamID}/observations`,
            resource: `/datastreams/1o6r3g5jc6pja/observations`,
            startTime: "2024-01-27T15:13:25.845Z",
            endTime: "2024-01-27T15:26:33.994Z",
            tls: false,
            responseFormat: "application/swe+json",
            mode: Mode.REPLAY,
        });

        let reportAPI: SweApi = new SweApi(`status-api`, {
            protocol: 'ws',
            endpointUrl: '34.67.197.57:8181/sensorhub/api',
            // collection: `/datastreams/${datasource.datastreamID}/observations`,
            resource: `/datastreams/rmdm2ukabde6q/observations`,
            startTime: "2024-01-27T15:13:25.845Z",
            endTime: "2024-01-27T15:26:33.994Z",
            tls: false,
            responseFormat: "application/swe+json",
            mode: Mode.REPLAY,
        });


        let statusDS: SosGetResult = new SosGetResult('status',{
            endpointUrl:'34.67.197.57:8181/sensorhub/sos',
            offeringID:'KROMEK_D5:D5M100103',
            observedProperty: "http://sensorml.com/ont/swe/property/KromekSerialRadiometricStatusReport",
            startTime: "2024-01-27T15:13:25.845Z",
            endTime: "2024-01-27T15:26:33.994Z",
            mode: Mode.BATCH
        });

        let pointmarker: PointMarkerLayer = new PointMarkerLayer({
            getLocation: {
                // @ts-ignore
                dataSourceIds: [statusAPI.getId()],
                handler: function (rec: any) {
                    return {
                        x: findInObject(rec, 'lon | x | longitude'),
                        y: findInObject(rec, 'lat | y | latitude'),
                        z: findInObject(rec, 'alt | z | altitude'),
                    }
                }
            },
            icon: "../../icons/circle.svg",
            iconSize: [32, 32],
            iconColor: 'white',
            getIconColor:{
                //@ts-ignore
                dataSourceIds:[reportAPI.getId()],
                handler: function (rec: any) {
                    let dose: number = findInObject(rec,'doseRate');
                    dose = dose*1000;
                    //*** Color Option 1
                    // if (dose >= 250){
                    //     dose = 250;
                    //     return 'rgb(134,0,225)'
                    // }
                    // else if (dose < 250 && dose >200){
                    //     dose = 250;
                    //     return 'rgb(225,0,206)'
                    // }
                    // else if (dose < 200 && dose >150){
                    //     dose = 250;
                    //     return 'rgb(225,0,0)'
                    // }
                    // else if (dose < 150 && dose >100){
                    //     dose = 250;
                    //     return 'rgb(255,169,39)'
                    // }
                    // else if (dose < 100 && dose >50){
                    //     dose = 250;
                    //     return 'rgb(218,225,0)'
                    // }
                    // else if (dose < 50 && dose >0){
                    //     dose = 250;
                    //     return 'rgb(0,225,45)'
                    // }
                    // else{
                    //     return 'rgb(0,225,45)'
                    // }

                    //***** Color Option 2
                    // if (dose>=250){
                    //     dose=250
                    // }
                    //     dose = (dose /250)*240;
                    //
                    // let rgbString: string = hslToRgb('hsl('+dose+',100,50)')
                    // return rgbString

                    // Color Option 3

                    if (dose>=250){
                        dose = 250;
                    }
                    dose = (dose/250);
                    let interpolate = d3.interpolateRgbBasis(["green", "yellow", "red", "purple"])(dose);
                    return interpolate;
                }
            },
            defaultToTerrainElevation: true,
            zIndex: 1,
            getMarkerId:{
                // @ts-ignore
                dataSourceIds: [statusAPI.getId()],
                handler:function (rec:any){
                    return randomUUID();
                }
            }

        })

        let polyline: PolylineLayer = new PolylineLayer({
            getLocation:{
                // @ts-ignore
                dataSourceIds: [statusAPI.getId()],
                handler: function (rec: any) {
                    return {
                        x: findInObject(rec, 'lon | x | longitude'),
                        y: findInObject(rec, 'lat | y | latitude'),
                        z: findInObject(rec, 'alt | z | altitude'),
                    }
                }
            },

        })

        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNDA1YWU0ZS01NjVhLTRlODUtYjZhNy04NzhlMzE4ODFmNDUiLCJpZCI6MTc3NDMyLCJpYXQiOjE2OTk2MjYxOTF9._jxsobRY09V2PjPP53XFBlZsDin4s6Fi_L5_fGQAfbE";

        let siteView = new CesiumView({
            container: 'CesiumMap',
            layers: [pointmarker],
            options: {
                viewerProps: {
                    terrainProvider: Cesium.createWorldTerrain(),
                    // imageryProvider: new Cesium.IonImageryProvider({assetId: 3954}),
                    sceneMode: Cesium.SceneMode.SCENE3D,
                    // infoBox: false,
                    // geocoder: false,
                    timeline: false,
                    animation: false,
                    homeButton: false,
                    scene3DOnly: true,
                    // baseLayerPicker: false,
                    // sceneModePicker: false,
                    fullscreenButton: false,
                    // projectionPicker: false,
                    // selectionIndicator: false,
                    navigationHelpButton: true,
                    navigationInstructionsInitiallyVisible: true
                }
            }
        });




        let baseLayerPicker: any = siteView.viewer.baseLayerPicker;

        let imageryProviders: any = baseLayerPicker.viewModel.imageryProviderViewModels;

        baseLayerPicker.viewModel.selectedImagery =
            imageryProviders.find((imageProviders: any) => imageProviders.name === "Bing Maps Aerial");

        let terrainProviders: any = baseLayerPicker.viewModel.terrainProviderViewModels;

        baseLayerPicker.viewModel.selectedTerrain =
            terrainProviders.find((terrainProviders: any) => terrainProviders.name === "Cesium World Terrain");

        viewer = siteView.viewer;



        // Disable autocomplete - uncomment if geocoder is enabled
        // viewer.geocoder.viewModel.autoComplete = false;

        // Add Cesium OSM Buildings, a global 3D buildings layer.
        buildingTileset = viewer.scene.primitives.add(Cesium.createOsmBuildings());

        // By default, load into a view of Washington Monument from above
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(-85.3094, 35.0458, 200000),
        });

        //
        // statusAPI.connect();
        // reportAPI.connect();

        let timeController = new DataSynchronizer({
            replaySpeed:10,
            dataSources: [statusAPI, reportAPI],
            startTime: "2024-01-27T15:13:25.845Z",
            endTime: "2024-01-27T15:26:33.994Z",

        });

        timeController.connect();

    }, []);

    if (viewer != null) {

        buildingTileset.show = true;

        viewer.scene.requestRender();
    }

    return (<div id={'CesiumMap'} />);
}

export default Heatmap;