import React, {useEffect, useState} from "react";

//@ts-ignore
import SosGetResult from "osh-js/source/core/datasource/sos/SosGetResult.datasource"
//@ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
//@ts-ignore
import CesiumView from "osh-js/source/core/ui/view/map/CesiumView"
//@ts-ignore
import PointMarkerLayer from "osh-js/source/core/ui/layer/PointMarkerLayer"
import {findInObject} from "../../utils/Utils";
import UGV from "../../assets/models/ugv.glb";
import DRONE from "../../assets/models/drone.glb";
import PointMarkerNoOrientation from "../../assets/models/pointmarker.glb";
import {colorHash} from "../../utils/ColorUtils";
import * as Cesium from "cesium";
import {setMapView, updateContextMenuState} from "../../state/Slice";

interface ISiteViewProps {
    sites:any;
}

let buildingTileset: any = null;
let viewer: any = null;

const SiteMap = (props: ISiteViewProps)=> {

    useEffect(() => {
        let datasources: DataSynchronizer[]= [];
        let pointMarkers: PointMarkerLayer[]=[];

        let siteArray: any[] = props.sites;

        siteArray.forEach((site)=>{
            let datasource: SosGetResult = new SosGetResult(site.name,{
                endpointUrl: site.datasource.url,
                offeringID: site.datasource.rpm.id,
                observedProperty: "http://www.opengis.net/def/location-output",
                startTime: site.datasource.start,
                endTime: site.datasource.end,
                mode: site.datasource.mode
            })

            let ocDatasource: SosGetResult = new SosGetResult(site.name+"-oc",{
                endpointUrl: site.datasource.url,
                offeringID: site.datasource.rpm.id,
                observedProperty: "http://www.opengis.net/def/occupancy",
                startTime: site.datasource.start,
                endTime: site.datasource.end,
                mode: site.datasource.mode
            })

            let TimeController = new DataSynchronizer({
                replaySpeed: 1,
                intervalRate: 5,
                dataSources: [datasource,ocDatasource],
                startTime: site.datasource.start,
            });


            datasources.push(TimeController);

            let pointmarker: PointMarkerLayer = new PointMarkerLayer({
                getLocation: {
                    // @ts-ignore
                    dataSourceIds: [datasource.getId()],
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
                getIconColor:{
                    //@ts-ignore
                    dataSourceIds:[ocDatasource.getId()],
                    handler: function (rec: any) {
                        let gammaStatus: boolean = false;
                        let neutronStatus: boolean = false;

                        gammaStatus = findInObject(rec, 'GammaAlarm')
                        neutronStatus = findInObject(rec, 'NeutronAlarm')

                        if (!gammaStatus && !neutronStatus){
                            return 'rgb(53,197,0)'
                        }
                        else if (gammaStatus && !neutronStatus){
                            return 'rgb(220,20,60)'
                        }
                        else if (!gammaStatus && neutronStatus){
                            return 'rgb(225,0,225)'
                        }
                        else if (gammaStatus && neutronStatus){
                            return 'rgb(134,0,225)'
                        }
                        else return  'rgb(53,197,0)'

                    }
                },
                iconColor: 'rgb(53,197,0)',
                name: site.name,
                label: site.name,
                labelOffset: [0, 20],
                labelColor: 'rgba(255,255,255,1.0)',
                labelOutlineColor: 'rgba(0,0,0,1.0)',
                // labelBackgroundColor: 'rgba(236,236,236,0.5)',
                labelSize: 20,
                defaultToTerrainElevation: false,
                zIndex: 1,
                // iconScale: 1
            });
            pointMarkers.push(pointmarker);
        })

        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIwNDA1YWU0ZS01NjVhLTRlODUtYjZhNy04NzhlMzE4ODFmNDUiLCJpZCI6MTc3NDMyLCJpYXQiOjE2OTk2MjYxOTF9._jxsobRY09V2PjPP53XFBlZsDin4s6Fi_L5_fGQAfbE";

        let siteView = new CesiumView({
            container: 'CesiumMap',
            layers: pointMarkers,
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
            destination: Cesium.Cartesian3.fromDegrees(-77.03512734712851, 38.88943991307860, 800),
        });

        datasources.forEach((datasource)=>{
            datasource.connect();
        })

    }, []);

    if (viewer != null) {

        buildingTileset.show = true;

        viewer.scene.requestRender();
    }

    return (<div id={'CesiumMap'} />);

}

export default SiteMap;

