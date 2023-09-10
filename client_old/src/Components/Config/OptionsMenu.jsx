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
                <li className={styles.containerDelay}>
                    <p>Delay</p>
                    <label className={styles.labelDelay}>{globalConfigs.delay}s</label>
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
                        onstyle="success"
                        offstyle="danger"
                        width={150}
                        offlabel="Off"
                        onChange={(checked) => {
                            setGlobalConfigs({
                                bgVideo: checked,
                                delay: globalConfigs.delay,
                            });
                        }}
                    />
                </li>
            </ul>
        </div>
    );
};

export default MenuOptions;
