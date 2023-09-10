/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useContext } from "react";
import { GlobalConfigContext } from "../../GlobalConfigContext.js";
import MenuOptions from "../Config/OptionsMenu";
import style from "./style.module.css";

const SolymHeader = () => {
    const globalConfig = useContext(GlobalConfigContext);

    const [showMenuOptions, setShowMenuOptions] = React.useState(false);

    const toggleMenuOptions = (e) => {
        e.preventDefault()
        setShowMenuOptions(!showMenuOptions);
    };

    return (
        <header className={style.navbar}>
            <div className={style.logo}>
                <img src="./logo192.png" alt="logo"></img>
            </div>
            <div className={style.rigthContainer}>
                <nav>
                    <ul className={style.navList}>
                        <li>
                            <a href="#">socials</a>
                        </li>
                        <li>
                            <a href="#">about me</a>
                        </li>
                        <li className={style.optionsLi}>
                            <a href="#" onClick={toggleMenuOptions}>options</a>
                            {showMenuOptions && (
                                <MenuOptions {...globalConfig} />
                            )}
                        </li>
                        <li>
                            <a href="#">register</a>
                        </li>
                        <li>
                            <a href="#">login</a>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default SolymHeader;
