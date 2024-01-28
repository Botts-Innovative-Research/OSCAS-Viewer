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
import RpmEntry from "./oscas/RpmEntry"
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
import OccupancyTable from "./oscas/OccupancyTable";
import OccupancyView from "./oscas/OccupancyView";
import SiteMap from "./oscas/SiteMap";
import SiteTable from "./oscas/SiteTable";
import SiteView from "./oscas/SiteView"
import StatusAlarm from "./oscas/StatusAlarm";
import LaneView from "./oscas/LaneView";
import Heatmap from "./oscas/Heatmap";

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

    let server = "34.67.197.57:8484/sensorhub/sos";
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
    let mode = Mode.BATCH;

    let p1Start = "2023-11-30T17:47:03Z";
    let p1End = "2023-11-30T17:48:50Z";
    let p2Start = "2023-11-30T17:52:00Z";
    let p2End = "2023-11-30T17:54:20Z";
    let p3Start = "2023-11-30T17:56:01Z";
    let p3End = "2023-11-30T17:57:45Z";





    document.body.style.overflow = "scroll";

    let siteProps:any = [];

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
        name: "RS Lane 1",
        occupancy:{
            start: p1Start,
            end: p1End
        }
    }
    siteProps.push(rpm1EntryProps);

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
        name: "RS Lane 2",
        occupancy:{
            start: p2Start,
            end: p2End
        }
    }

    siteProps.push(rpm2EntryProps);

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
        name: "RS Lane 3"
    }

    siteProps.push(rpm3EntryProps);

    let aspectRpmProps: any = {
        datasource: {
            url: "34.67.197.57:8383/sensorhub/sos",
            mode: mode,
            start: "2023-12-26T19:25:46Z",
            end: "2023-12-26T19:27:00Z",
            rpm: {
                id: "urn:osh:sensor:aspect:sensor001",
                gammaProp: gammaProperty,
                neutronProp: neutronProperty
            },
            video:{
                id: videoOfferingID,
                property: videoProperty
            }
        },
        name: "Aspect: Lane 1"
    }

    siteProps.push(aspectRpmProps);


    return (


        <div id={"container"}>
            <Tabs style={{height: '100%'}}>
                <TabsList>
                    <Tab>Site View</Tab>
                    <Tab>Occupancy View</Tab>
                    <Tab>Lane View</Tab>
                    <Tab>Heat Map</Tab>
                </TabsList>
                <TabPanel value={0} sx={{
                    padding: '0',
                }}>
                    <SiteView sites={siteProps}/>
                </TabPanel>
                <TabPanel value={1}>
                    <OccupancyView name={rpm1EntryProps.name} datasource={rpm1EntryProps.datasource} occupancy={rpm1EntryProps.occupancy}/>
                </TabPanel>
                <TabPanel value={2}>
                    {/*<StatusAlarm name={"GAMMA"} datasource={rpm2EntryProps.datasource} observedProperty={gammaProperty}/>*/}
                    {/*<StatusAlarm name={"NEUTRON"} datasource={rpm2EntryProps.datasource} observedProperty={neutronProperty}/>*/}
                    <LaneView name={"Rapiscan: Lane 1"} datasource={rpm1EntryProps.datasource}/>

                </TabPanel>
                <TabPanel value={3}>
                    <Heatmap/>
                </TabPanel>
            </Tabs>
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