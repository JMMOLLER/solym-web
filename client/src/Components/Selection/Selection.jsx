import React from "react";
import SelectionStyle from "./Selection.module.css";
import * as global from "../../Scripts/config.js";

class Selection extends React.Component {
    constructor(props) {
        super(props);
        this.config = global.config;
        this.changeDelayValue = global.changeDelayValue.bind(this);
    }

    render() {
        return(
            <>
                <select
                name="select"
                id="select"
                onChange={(e) => {this.changeDelayValue(e)}}
                defaultValue={3}
                className={SelectionStyle.delayConfig}
                >
                    <option value="0">0 ms</option>
                    <option value="1">80 ms</option>
                    <option value="2">100 ms</option>
                    <option value="3">150 ms</option>
                    <option value="4">200 ms</option>
                    <option value="5">250 ms</option>
                    <option value="6">300 ms</option>
                </select>
            </>
        )
    }
}

export default Selection;