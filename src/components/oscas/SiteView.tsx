import React, {useEffect, useState} from "react";
import RpmStatus from "./RpmStatus";
import SiteMap from "./SiteMap";
import SiteTable from "./SiteTable";
import {ReactJSXElement} from "@emotion/react/types/jsx-namespace";
import LaneCamera from "./LaneCamera";

interface ISiteViewProps {
    sites: any;
}

const SiteView = (props: ISiteViewProps)=>{

    let [rpmStatusSites, setRpmStatusSites] = useState<ReactJSXElement[]>([]);


    useEffect(() => {
        let siteArray: any[] = props.sites;

        siteArray.forEach((site)=>{
            let statusSite: ReactJSXElement = <RpmStatus datasource={site.datasource} name={site.name}/>;
            setRpmStatusSites([...rpmStatusSites, statusSite ]);
        })
    }, []);
    return (
        <div>
        <div id={"overview-section"}>
            <div className={'grid'} id={"ov-left"}>
                <RpmStatus name={props.sites[0].name} datasource={props.sites[0].datasource}/>
                <RpmStatus name={props.sites[1].name} datasource={props.sites[1].datasource}/>
                <RpmStatus name={props.sites[2].name} datasource={props.sites[2].datasource}/>
                <RpmStatus name={props.sites[3].name} datasource={props.sites[3].datasource}/>
                {/*<LaneCamera name={props.sites[0].name} datasource={props.sites[0].datasource}/>*/}
            </div>
            <div id={"ov-right"}>
                <SiteMap sites={props.sites}/>
            </div>
        </div>
    <SiteTable sites={props.sites}/>
        </div>
)
}

export default SiteView;