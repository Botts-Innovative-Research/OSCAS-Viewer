import React, {useEffect, useState, ReactElement} from "react";

import LaneCamera from "./LaneCamera";
import { Pagination } from "@mui/material";


interface ILaneCameraDisplayProps {
     contents: ReactElement[];
}

const LaneCameraDisplay = (props: ILaneCameraDisplayProps)=> {

    let contents = props.contents;


  return (
    <div className="lane-camera-grid">
          {contents}
    </div>
  );
};

  export default LaneCameraDisplay;
