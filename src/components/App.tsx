/*
 * Copyright (c) 2022.  Botts Innovative Research, Inc.
 * All Rights Reserved
 *
 * opensensorhub/osh-viewer is licensed under the
 *
 * Mozilla Public License 2.0
 * Permissions of this weak copyleft license are conditioned on making available source code of licensed
 * files and modifications of those files under the same license (or in certain cases, one of the GNU licenses).
 * Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.
 * However, a larger work using the licensed work may be distributed under different terms and without
 * source code for files added in the larger work.
 *
 */

import React, {ReactElement, useEffect, useState} from "react";

// @ts-ignore
import {appStore} from "../state/Store";

import CesiumMap from "./map/CesiumMap";
import Settings from "./settings/Settings";
import ContextMenu from "./menus/ContextMenu";
import {
    addObservable,
    addPhysicalSystem,
    addSensorHubServer,
    selectAddServerDialogOpen,
    selectAppInitialized,
    selectConnectedObservables,
    selectObservables,
    selectObservablesDialogOpen,
    selectServerManagementDialogOpen,
    selectSettingsDialogOpen,
    selectSystemsDialogOpen,
    setAppInitialized
} from "../state/Slice";
import {useAppDispatch, useAppSelector} from "../state/Hooks";
import {Tab, TabsList, TabPanel, Tabs} from "@mui/base";
import ServerManagement from "./servers/ServerManagement";
import AddServer from "./servers/AddServer";
import Observables from "./observables/Observables";
import {initDb, readSensorHubServers} from "../database/database";
import {IObservable, ISensorHubServer} from "../data/Models";
import {fetchControls, fetchPhysicalSystems, fetchSubsystems} from "../net/SystemRequest";
import {getObservables} from "../observables/ObservableUtils";
import CenteredPopover from "./decorators/CenteredPopover";
import Systems from "./systems/Systems";
import SplashScreen from "./splash/SplashScreen";
import TimeController from "./time/TimeController";
import StreamingDialog from "./dialogs/StreamingDialog";
import {ObservableType} from "../data/Constants";
//@ts-ignore

import {Mode} from "osh-js/source/core/datasource/Mode";
import Zw100SensorReport from "./tstar/Zw100SensorReport";
import WadwazSensorReport from "./tstar/WadwazSensorReport";
import WapirzSensorReport from "./tstar/WapirzSensorReport";
import SensorStatus from "./tstar/SensorStatus";

import OccupancyTable from "./oscas/OccupancyTable";
import OccupancyView from "./oscas/OccupancyView";
import SiteMap from "./oscas/SiteMap";
import SiteTable from "./oscas/SiteTable";
import SiteView from "./oscas/SiteView"
import StatusAlarm from "./oscas/StatusAlarm";
import LaneView from "./oscas/LaneView";

const App = () => {
    const dispatch = useAppDispatch();

    let appInitialized = useAppSelector(selectAppInitialized);

    let [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);

    let showSettingsDialog = useAppSelector(selectSettingsDialogOpen);
    let showServerManagementDialog = useAppSelector(selectServerManagementDialogOpen);
    let showObservablesDialog = useAppSelector(selectObservablesDialogOpen);
    let showAddServerDialog = useAppSelector(selectAddServerDialogOpen);
    let showSystemsDialog = useAppSelector(selectSystemsDialogOpen);

    let connectedObservables = useAppSelector(selectConnectedObservables);
    let observables = useAppSelector(selectObservables);

    let [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    let [showError, setShowError] = useState<boolean>(false);
    let [errorMsg, setErrorMsg] = useState<string>(null);

    useEffect(() => {

        const loader = async () => {

            await initDb();

            let sensorHubServers: ISensorHubServer[] = await readSensorHubServers();

            for (let sensorHubServer of sensorHubServers) {

                dispatch(addSensorHubServer(sensorHubServer));

                await fetchPhysicalSystems(sensorHubServer, true).then(async physicalSystems => {

                    for (let system of physicalSystems) {

                        await fetchControls(sensorHubServer, true, system).then();

                        await fetchSubsystems(sensorHubServer, true, system).then(async physicalSystems => {

                            for (let system of physicalSystems) {

                                dispatch(addPhysicalSystem(system))
                            }
                        });

                        dispatch(addPhysicalSystem(system))
                    }

                    await getObservables(sensorHubServer, true).then(visualizations => {

                        for (let visualization of visualizations) {

                            dispatch(addObservable(visualization))
                        }

                    }).catch(() => popupError(sensorHubServer.name));

                }).catch(() => popupError(sensorHubServer.name));
            }
        }

        if (!appInitialized) {

            loader().then(() => {
                    if (!showError) {
                        dispatch(setAppInitialized(true));
                        setShowConfirmation(true);
                        setTimeout(() => {
                            setShowConfirmation(false);
                        }, 5000)
                    }
                }
            );
        }
    }, [])

    let videoDialogs: any[] = [];

    let connectedObservablesArr: IObservable[] = [];
    connectedObservables.forEach((connected: boolean, id: string) => {

        if (connected) {

            let observable: IObservable = observables.get(id);

            if (observable.type === ObservableType.DRAPING || observable.type === ObservableType.VIDEO) {

                connectedObservablesArr.push(observable);
            }
        }
    })

    connectedObservablesArr.forEach((observable: IObservable) => {

        videoDialogs.push(<StreamingDialog key={observable.uuid} observable={observable}/>);
    })

    const popupError = (msg: string) => {

        setErrorMsg(msg);
        setShowError(true);
        setTimeout(() => {
            setErrorMsg(null);
            setShowError(false);
        }, 5000)
    }

    let server = "localhost:8282/sensorhub/sos";

// Sensors
    let zw100Sensor = "[urn:osh:sensor:zw100]sensor001";
    let wadwazSensor = "[urn:osh:sensor:wadwaz1]sensor001";
    let wapirzSensor = "[urn:osh:sensor:wapirz1]sensor001";

    let motionAlarmProperty = "http://sensorml.com/ont/swe/property/Motion";
    let vibrationAlarmProperty = "http://sensorml.com/ont/swe/property/Alarm";
    let temperatureProperty = "http://sensorml.com/ont/swe/property/Temperature";
    let humidityProperty = "http://sensorml.com/ont/swe/property/RelHum";
    let luminanceProperty = "http://sensorml.com/ont/swe/property/Luminance";
    let UVProperty = "http://sensorml.com/ont/swe/property/UVI";
    let batteryProperty = "http://sensorml.com/ont/swe/property/Battery";
    let entryAlarmProperty = "http://sensorml.com/ont/swe/property/Entry"
    let tamperAlarmProperty = "http://sensorml.com/ont/swe/property/Alarm";

    let mode = Mode.REAL_TIME;

    let start = (new Date(Date.now() - 60 * 1000 * 60 * 1).toISOString());
    let end = (new Date(Date.now()).toISOString());

//     let start = "2024-03-27T21:44:35Z";
//     let end = "2024-03-28T01:36:39.754Z";

    document.body.style.overflow = "scroll";

    let zWaveSensorProps:any = [];

    let sensorProps:any = {
        datasource: {
            url: server,
            mode: mode,
            start: start,
            end: end,
            zw100Sensor: {
                name: "ZW100",
                id: zw100Sensor,
                motionProp: motionAlarmProperty,
                vibrationProp: vibrationAlarmProperty,
                temperatureProp: temperatureProperty,
                humidityProp: humidityProperty,
                luminanceProp: luminanceProperty,
                UVProp: UVProperty,
                batteryProp: batteryProperty
            },
            wadwazSensor: {
                name: "WADWAZ",
                id: wadwazSensor,
                entryAlarmProp: entryAlarmProperty,
                tamperAlarmProp: tamperAlarmProperty,
                batteryProp: batteryProperty
            },
            wapirzSensor: {
                name: "WAPIRZ",
                id: wapirzSensor,
                motionProp: motionAlarmProperty,
                tamperAlarmProp: tamperAlarmProperty,
                temperatureProp: temperatureProperty,
                batteryProp: batteryProperty
            },
        },
        name: "OSH zWave"
        }

    zWaveSensorProps.push(sensorProps);

    return (


        <div id={"container"}>
           <Zw100SensorReport name={sensorProps.name} datasource={sensorProps.datasource}/>
           <WadwazSensorReport name={sensorProps.name} datasource={sensorProps.datasource}/>
           <WapirzSensorReport name={sensorProps.name} datasource={sensorProps.datasource}/>

            {/*<ContextMenu/>*/}

            {/*{showServerManagementDialog ? <ServerManagement title={"Servers"}/> : null}*/}
            {/*{showSettingsDialog ? <Settings title={"Settings"}/> : null}*/}
            {/*{showAddServerDialog ? <AddServer title={"Configure New Server"}/> : null}*/}
            {/*{showObservablesDialog ? <Observables title={"Observables"}/> : null}*/}
            {/*{showSystemsDialog ? <Systems title={"Systems"}/> : null}*/}

            {/*{showSplashScreen ? <SplashScreen onEnded={() => setShowSplashScreen(false)}/> : null}*/}

            {/*// <div id={"overview-section"}>*/}
            {/*//     <div className={'grid'} id={"ov-left"}>*/}
            {/*//         <RpmStatus datasource={rpm1EntryProps.datasource} name={rpm1EntryProps.name}/>*/}
            {/*//         <RpmStatus datasource={rpm2EntryProps.datasource} name={rpm2EntryProps.name}/>*/}
            {/*//         <RpmStatus datasource={rpm3EntryProps.datasource} name={rpm3EntryProps.name}/>*/}
            {/*//         <RpmStatus name={aspectRpmProps.name} datasource={aspectRpmProps.datasource}/>*/}
            {/*//     </div>*/}
            {/*//     <div id={"ov-right"}>*/}
            {/*//         <SiteMap sites={siteProps}/>*/}
            {/*//     </div>*/}
            {/*// </div>*/}
            {/*// <SiteTable sites={siteProps}/>*/}
            {/*<OccupancyTable datasource={rpm1EntryProps.datasource} name={rpm1EntryProps.name}/>*/}
            {/*<RpmEntry datasource={rpm1EntryProps.datasource} name={rpm1EntryProps.name}/>*/}
            {/*<RpmEntry datasource={rpm2EntryProps.datasource} name={rpm2EntryProps.name}/>*/}
            {/*<RpmEntry datasource={rpm3EntryProps.datasource} name={rpm3EntryProps.name}/>*/}
            {/*<RpmEntry name={aspectRpmProps.name} datasource={aspectRpmProps.datasource}/>*/}

            {/*<OccupancyView name={rpm2EntryProps.name} datasource={rpm2EntryProps.datasource} occupancy={rpm2EntryProps.occupancy}/>*/}



            {/*{videoDialogs.length > 0 ? videoDialogs : null}*/}

            {/*{showConfirmation ?*/}
            {/*    <CenteredPopover anchorEl={document.getElementById('root')}>*/}
            {/*        <Alert severity="success">*/}
            {/*            <AlertTitle>Initialization Complete!</AlertTitle>*/}
            {/*        </Alert>*/}
            {/*    </CenteredPopover>*/}
            {/*    : null*/}
            {/*}*/}


            {/*{showError ?*/}
            {/*    <CenteredPopover anchorEl={document.getElementById('root')}>*/}
            {/*        <Alert severity="warning">*/}
            {/*            <AlertTitle>{errorMsg} : Invalid Server Configuration or Server Not Responding</AlertTitle>*/}
            {/*        </Alert>*/}
            {/*    </CenteredPopover>*/}
            {/*    : null*/}
            {/*}*/}

         </div>
    );
};

export default App;