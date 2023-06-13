import React from "react";
import styles from "./OptionsMenu.module.css";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import DelayConfig from "../Config/Components/Delay/DelayConfig.jsx";

const MenuOptions = (props) => {
    const { globalConfigs } = props;
    const { setGlobalConfigs } = props;

    return (
        <div className={styles.optionsContainer}>
            <p>Options</p>
            <ul>
                <li>
                    <p>Delay</p>
                    <DelayConfig
                        globalConfigs={globalConfigs}
                        setGlobalConfigs={setGlobalConfigs}
                    />
                </li>
                <li>
                    <p>Enable Background Video</p>
                    <BootstrapSwitchButton
                        checked={globalConfigs.bgVideo}
                        onlabel="On"
                        offlabel="Off"
                        onChange={(checked) => {
                            setGlobalConfigs({bgVideo: checked, delay: globalConfigs.delay})
                        }}
                    />
                </li>
            </ul>
        </div>
    );
};

export default MenuOptions;
