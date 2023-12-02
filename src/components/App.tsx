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

import React, {useEffect, useState} from "react";

// @ts-ignore
import {appStore} from "../state/Store";

import CesiumMap from "./map/CesiumMap";
import RpmEntry from "./oscas/RpmEntry"
import LaneCamera from "./oscas/LaneCamera";


import RpmStatus from "./oscas/RpmStatus";
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
import {Alert, AlertTitle} from "@mui/material";
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
    let fullStart = "2023-11-30T16:00:46.867Z";
    let fullEnd = "2023-11-30T16:01:10Z";

    let testStart = "2023-11-01T15:03:13.515Z";
    let testEnd = "2023-11-01T15:08:14.515Z";

// Full Database
       let start = fullStart;
       let end = fullEnd;
       let offeringId = "urn:osh:sensor:rapiscansensor001";
       let videoOfferingID = "urn:android:device:3260a03a280be236";
       let gammaProperty = "http://www.opengis.net/def/gamma-scan";
       let neutronProperty = "http://www.opengis.net/def/neutron-scan";
       let videoProperty = "http://sensorml.com/ont/swe/property/VideoFrame";
       let mode = Mode.REPLAY;

       let p1Start = "2023-11-30T17:47:03Z";
       let p1End = "2023-11-30T17:48:50Z";
       let p2Start = "2023-11-30T17:52:00Z";
       let p2End = "2023-11-30T17:54:20Z";
       let p3Start = "2023-11-30T17:56:01Z";
       let p3End = "2023-11-30T17:57:45Z";


       document.body.style.overflow = "scroll";


       let rpm1EntryProps:any = {
           datasource: {
               url: server,
               mode: mode,
               start: p1Start,
               end: p1End,
               rpm: {
                   id: offeringId,
                   gammaProp: gammaProperty,
                   neutronProp: neutronProperty
               },
               video: {
                   id: videoOfferingID,
                   property: videoProperty

               }
           },
           name: "Lane 1"
       }

       let rpm2EntryProps:any = {
           datasource: {
               url: server,
               mode: mode,
               start: p2Start,
               end: p2End,
               rpm: {
                   id: offeringId,
                   gammaProp: gammaProperty,
                   neutronProp: neutronProperty
               },
               video: {
                   id: videoOfferingID,
                   property: videoProperty

               }
           },
           name: "Lane 2"
       }

       let rpm3EntryProps:any = {
           datasource: {
               url: server,
               mode: mode,
               start: p3Start,
               end: p3End,
               rpm: {
                   id: offeringId,
                   gammaProp: gammaProperty,
                   neutronProp: neutronProperty
               },
               video: {
                   id: videoOfferingID,
                   property: videoProperty

               }
           },
           name: "Lane 3"
       }

       let portalLane1CameraProps:any = {
            datasource: {
                url: server,
                mode: mode,
                start: p1Start,
                end: p1End,
                video: {
                    id: videoOfferingID,
                    property: videoProperty
                    }
                },
            name: "Portal Lane 1 Camera"
         }

       let portalLane2CameraProps:any = {
            datasource: {
                url: server,
                mode: mode,
                start: p2Start,
                end: p2End,
                video: {
                    id: videoOfferingID,
                    property: videoProperty
                }
            },
            name: " Portal Lane 2 Camera"
         }

       let portalLane3CameraProps:any = {
            datasource: {
                url: server,
                mode: mode,
                start: p3Start,
                end: p3End,
                video: {
                    id: videoOfferingID,
                    property: videoProperty
                }
            },
            name: "Portal Lane 3 Camera"
        }

 return (
        <div id={"container"}>
            {/*<ContextMenu/>*/}

            {/*{showServerManagementDialog ? <ServerManagement title={"Servers"}/> : null}*/}
            {/*{showSettingsDialog ? <Settings title={"Settings"}/> : null}*/}
            {/*{showAddServerDialog ? <AddServer title={"Configure New Server"}/> : null}*/}
            {/*{showObservablesDialog ? <Observables title={"Observables"}/> : null}*/}
            {/*{showSystemsDialog ? <Systems title={"Systems"}/> : null}*/}

            {/*{showSplashScreen ? <SplashScreen onEnded={() => setShowSplashScreen(false)}/> : null}*/}

            <div id={"overview-section"}>
                <div className={'grid'} id={"ov-left"}>
                    <RpmStatus datasource={rpm1EntryProps.datasource} name={rpm1EntryProps.name}/>
                    <RpmStatus datasource={rpm2EntryProps.datasource} name={rpm2EntryProps.name}/>
                    <RpmStatus datasource={rpm3EntryProps.datasource} name={rpm3EntryProps.name}/>
                </div>
                <div id={"ov-right"}>
                    <CesiumMap/>
                </div>
            </div>
            <RpmEntry datasource={rpm1EntryProps.datasource} name={rpm1EntryProps.name}/>
            <RpmEntry datasource={rpm2EntryProps.datasource} name={rpm2EntryProps.name}/>
            <RpmEntry datasource={rpm3EntryProps.datasource} name={rpm3EntryProps.name}/>

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




