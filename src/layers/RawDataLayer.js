import Layer from "osh-js/source/core/ui/layer/Layer";
import {isDefined} from "osh-js/source/core/utils/Utils";

class RawDataLayer extends Layer {

    /**
     *
     @param properties
     */
    constructor(properties) {
        super(properties);
        this.values = null;
        this.properties = properties;
        this.props.color = 'black';

        if(isDefined(properties.color)){
            this.props.color = properties.color;
        }

        let that = this;

        if(isDefined(properties.getDataValues)){
            let fn = function (rec) {
                that.values = that.getFunc('getDataValues')(rec);
            };
            this.addFn(that.getDataSourcesIdsByProperty('getDataValues'), fn);
        }
        this.saveState();
    }

}

export default RawDataLayer;