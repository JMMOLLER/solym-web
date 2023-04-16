// DelayConfig.jsx
import React from 'react';
import SelectionStyle from './Selection.module.css';

const ConfigEditor = ({ globalConfigs, setGlobalConfigs }) => {
    const selectDOM = React.createRef();


    const handleChange = () => {
        let delay = 0.15;
        if (selectDOM.current.value === '0') delay = 0;
        if (selectDOM.current.value === '1') delay = 0.08;
        else if (selectDOM.current.value === '2') delay = 0.1;
        else if (selectDOM.current.value === '3') delay = 0.15;
        else if (selectDOM.current.value === '4') delay = 0.2;
        else if (selectDOM.current.value === '5') delay = 0.25;
        else if (selectDOM.current.value === '6') delay = 0.3;
        setGlobalConfigs({ delay, delayValue: selectDOM.current.value });
    };

    return (
        <select
            className={SelectionStyle.delayConfig}
            name="selectDelay"
            id="selectDelay"
            onChange={handleChange}
            defaultValue={globalConfigs.delayValue}
            ref={selectDOM}
            aria-label="label for the select"
        >
            <option value="0">0 ms</option>
            <option value="1">80 ms</option>
            <option value="2">100 ms</option>
            <option value="3">150 ms</option>
            <option value="4">200 ms</option>
            <option value="5">250 ms</option>
            <option value="6">300 ms</option>
        </select>
    );
};

export default ConfigEditor;
