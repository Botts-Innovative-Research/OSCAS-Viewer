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
import {
    pausePlayback,
    selectDataSynchronizer,
    selectMasterTime,
    selectPlaybackMode,
    selectPlaybackSpeed,
    setPlaybackMode,
    startPlayback,
    updatePlaybackSpeed,
    updatePlaybackStartTime,
} from "../../state/Slice";
import {useAppDispatch, useAppSelector} from "../../state/Hooks";
import * as noUiSlider from 'nouislider';
import {API, PipsMode} from 'nouislider';
import 'nouislider/dist/nouislider.min.css';
import {IMasterTime, TimePeriod} from "../../data/Models";
import {Box} from "@mui/material";
import PlaybackTimeControls from "./OccupancyPlaybackControls";
// import RealTimeControls from "./RealTimeControls";
// @ts-ignore
import * as wNumb from 'wnumb';
// @ts-ignore
import DataSynchronizer from "osh-js/source/core/timesync/DataSynchronizer"
// @ts-ignore
import {EventType} from "osh-js/source/core/event/EventType";
import OccupancyPlaybackControls from "./OccupancyPlaybackControls";
// @ts-ignore
import {Mode} from "osh-js/source/core/datasource/Mode";

interface ITimeControllerProps {

    children?: any,
    style?: React.CSSProperties,

    dataSync: DataSynchronizer,
    occupancy: any
}

let sliderApi: API;

const OccupancyTimeController = (props: ITimeControllerProps) => {

    let dispatch = useAppDispatch();

    // let masterTime: IMasterTime = useAppSelector(selectMasterTime);
    let inPlaybackMode: boolean = true;
    let playbackSpeed: number = 1;
    let dataSynchronizer: DataSynchronizer = props.dataSync;

    let [currentTime, setCurrentTime] = useState<number>(0)

    useEffect(() => {

        let sliderContainer = document.getElementById('TimeController');

        let startTime: number = TimePeriod.getEpochTime(props.occupancy.start);


        let endTime: number = TimePeriod.getEpochTime(props.occupancy.end);


        sliderApi = noUiSlider.create(sliderContainer, {
            start: startTime,
            range: {
                min: startTime,
                max: endTime
            },
            format: wNumb({
                decimals: 0
            }),
            behaviour: 'drag',
            connect: true,
            animate: false,
            pips: {
                mode: PipsMode.Positions,
                // values: [10, 25, 50, 75, 90],
                values: [20, 50, 80],
                density: 1,
                format: wNumb({
                    edit: function (value: string) {
                        return new Date(parseInt(value)).toISOString().replace(".000Z", "Z")
                            .replace("T", " T ")
                    }
                })
            },
        });

        sliderApi.on('update', updateCurrentTime);

    }, []);

    useEffect(() => {

                if (sliderApi) {

                    sliderApi.updateOptions(
                        {
                            start: TimePeriod.getEpochTime(props.occupancy.start),
                            range: {
                                min: TimePeriod.getEpochTime(props.occupancy.start),
                                max: TimePeriod.getEpochTime(props.occupancy.end)
                            }
                        },
                        false // Boolean 'fireSetEvent'
                    );
                }

                setCurrentTime(TimePeriod.getEpochTime(props.occupancy.start));
                document.getElementById('TimeController').removeAttribute('disabled');

    }, [inPlaybackMode]);

    useEffect(() => {

        //@ts-ignore
        dataSynchronizer.subscribe((message: { type: any; timestamp: any; }) => {

            if (message.type === EventType.LAST_TIME) {

                if (sliderApi) {

                    sliderApi.updateOptions(
                        {
                            start: message.timestamp,
                        },
                        false // Boolean 'fireSetEvent'
                    );
                }

                setCurrentTime(message.timestamp);
            }

        }, [EventType.LAST_TIME])

    }, [dataSynchronizer]);

    const updateCurrentTime = (values: string[]) => {

        setCurrentTime(Number(values[0]));
    }

    const slowDown = () => {

        let speed: number = (playbackSpeed - 0.25) > 0.25 ? (playbackSpeed - 0.25) : 0.25;

        //@ts-ignore
        dataSynchronizer.setReplaySpeed(speed);
    }

    const speedUp = () => {

        let speed: number = (playbackSpeed + 0.25) < 10 ? (playbackSpeed + 0.25) : 10;
        //@ts-ignore
        dataSynchronizer.setReplaySpeed(speed);
    }

    const togglePlaybackMode = () => {

        dispatch(setPlaybackMode(!inPlaybackMode));
    }

    const pause = () => {

        //@ts-ignore
        dataSynchronizer.disconnect();
    }

    const start = () => {


            //@ts-ignore
            dataSynchronizer.setTimeRange(TimePeriod.getFormattedTime(currentTime), props.occupancy.end,
                1, false, Mode.REPLAY);

        //@ts-ignore
        dataSynchronizer.connect();
    }

    const skip = (seconds: number) => {

        let adjustedTime: number = currentTime + seconds * 1000;

        if (sliderApi) {

            sliderApi.updateOptions(
                {
                    start: adjustedTime,
                },
                false // Boolean 'fireSetEvent'
            );
        }

        setCurrentTime(adjustedTime);

        //@ts-ignore
        dataSynchronizer.setTimeRange(TimePeriod.getFormattedTime(currentTime), endTime,
            speed, false, Mode.REPLAY);
    }

    return (
        <div>
        <Box>
            <Box id="TimeController"
                 style={{
                     height: '1vh',
                     position: 'relative',
                     background: 'transparent',
                     margin: "0em 1em 0em 1em", ...props.style
                 }}/>
            <Box style={{height: '4vh',  margin: '50px'}}>
                    <OccupancyPlaybackControls currentTime={currentTime}
                                          switchToRealtime={togglePlaybackMode}
                                          start={start}
                                          pause={pause}
                                          startTime={props.occupancy.start}
                                          endTime={props.occupancy.end}
                                          skip={skip}
                                          speedUp={speedUp}
                                          slowDown={slowDown}/>
            </Box>
        </Box>
        </div>
    );
}

export default OccupancyTimeController;