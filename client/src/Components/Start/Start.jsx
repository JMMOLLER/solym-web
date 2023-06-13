/* eslint-disable array-callback-return */
import axios from "axios";
import React from "react";
import StylesStart from "./Start.module.css";
import { createRoot } from "react-dom/client";
import DelayConfig from "../Config/Components/Delay/DelayConfig.jsx";
import * as controller from "./Controllers/Start.controller.js";
axios.defaults.withCredentials = true;

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: NaN,
            lyrics: [],
            toExport: [],
            infoExport: {},
            hasVideo: false,
            notLoadYet: true,
            toggleShow: false,
            hasStarted: false,
            previewEnabled: false,
            musicArePlaying: false,
            previousDisabled: true,
            notification: undefined,
        };
        this.index = -1;
        this.times = new Map();
        this.currentLyric = "";
        this.currentSecond = 0;
        this.checkTime = undefined;
        this.cacheBusting = Date.now();
        this.Toggle = () => {
            this.setState({
                toggleShow: !this.state.toggleShow
            });
        };
        // DOM LYRICS
        this.c_lyricDOM = React.createRef();
        this.p_lyricDOM = React.createRef();
        this.n_lyricDOM = React.createRef();
        this.p_aux_lyricDOM = React.createRef();
        this.n_aux_lyricDOM = React.createRef();
        // DOM BUTTONS
        this.stopDOM = React.createRef();
        this.nextDOM = React.createRef();
        this.startDOM = React.createRef();
        this.resetDOM = React.createRef();
        this.exportDOM = React.createRef();
        this.previewDOM = React.createRef();
        this.previousDOM = React.createRef();
        // DOM AUDIO
        this.audioDOM = React.createRef();
        // DOM BACKGROUND
        this.bgVideo = React.createRef();
        this.coverImg = React.createRef();
        this.backgroundDOM = React.createRef();
        // DOM MODAL
        this.modal = React.createRef();
        this.modalContainer = React.createRef();
        // DOM CONTAINER
        this.containerDOM = React.createRef();
        // FUNCTIONS
        this.preview = controller.preview.bind(this);
        this.playMusic = controller.playMusic.bind(this);
        this.stopMusic = controller.stopMusic.bind(this);
        this.nextLyric = controller.nextLyric.bind(this);
        this.setBGImage = controller.setBGImage.bind(this);
        this.timeUpdate = controller.timeUpdate.bind(this);
        this.processInfo = controller.processInfo.bind(this);
        this.renderModal = controller.renderModal.bind(this);
        this.exportLyric = controller.exportLyric.bind(this);
        this.enableEvents = controller.enableEvents.bind(this);
        this.setAnimation = controller.setAnimation.bind(this);
        this.saveProgress = controller.saveProgress.bind(this);
        this.endTrackModal = controller.endTrackModal.bind(this);
        this.previousLyric = controller.previousLyric.bind(this);
        this.fadeAudioVolume = controller.fadeAudioVolume.bind(this);
        this.removeAnimation = controller.removeAnimation.bind(this);
        this.cleanLocalStorage = controller.cleanLocalStorage.bind(this);
        this.buildLocalStorage = controller.buildLocalStorage.bind(this);
        this.checkLocalStorage = controller.checkLocalStorage.bind(this);
        this.LocalStorageModal = controller.LocalStorageModal.bind(this);
        this.increaseAudioVolume = controller.increaseAudioVolume.bind(this);
    }

    async componentDidMount() {
        try {
            this.enableEvents();
            controller.reorganizeStyles();
            this.audioDOM.current.volume = 0.5;
            /* FETCH LYRICS */
            const lyrics = await controller.getLyrics();
            this.state.lyrics.push(...lyrics);
            this.n_lyricDOM.current.innerHTML = this.state.lyrics[0];
            this.n_aux_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 2];
            this.checkLocalStorage();
            /* FETCH INFO */
            const info = await controller.getInfoSelected();
            console.info(info);
            this.processInfo(info);
        } catch (err) {
            alert("Error al cargar la página");
            console.error(err);
            return (window.location.href = "/");
        }
    }

    componentDidUpdate() {
        if (this.state.toggleShow) {
            const root = createRoot(document.getElementById("modalContainer"));
            root.render(this.state.notification);
        }
        if (!this.state.toggleShow) {
            if (this.modal.current) {
                this.modal.current.remove();
            }
        }
    }

    render() {
        const { globalConfigs } = this.props
        const { setGlobalConfigs } = this.props


        return (
            <div style={{ position: "relative", height: "100%" }}>
                <div className={StylesStart.bgContainer}>
                    <div id="backgroundDOM" ref={this.backgroundDOM} className={StylesStart.bg}></div>
                    <video src="" ref={this.bgVideo} className={StylesStart.bgVideo} muted={true}></video>
                </div>
                <div className={StylesStart.content}>
                    <DelayConfig globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />
                    <div className={StylesStart.contentChild}>
                        <div className="boton start"></div>
                        <div className="boton stop"></div>
                        <div className="boton reiniciar"></div>
                        <h1>Lyrics</h1>
                        <div className={StylesStart.lyrics}>
                            <p id="previous-aux-lyric" className={StylesStart.previousAuxLyric} ref={this.p_aux_lyricDOM}></p>
                            <p id="previous-lyric" className={StylesStart.previousLyric} ref={this.p_lyricDOM}></p>
                            <p id="current-lyric" ref={this.c_lyricDOM}>♪</p>
                            <p id="next-lyric" className={StylesStart.nextLyric} ref={this.n_lyricDOM}></p>
                            <p id="next-aux-lyric" className={StylesStart.nextAuxLyric} ref={this.n_aux_lyricDOM}></p>
                        </div>
                        <div className={StylesStart.controllers}>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.previousDOM}
                                className={StylesStart.buttonsController+" btn btn-warning"}
                                id="previous"
                                onClick={this.previousLyric}
                                disabled={this.state.previousDisabled}
                            >
                                <span>previous</span>
                                <img className={StylesStart.keySymbol} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAA9ElEQVR4nLXUvS5EQRjG8d8KiYLYW7CRoBGJqFC6AxVRbKOwd+ACXICoKKh1JChoVGIdK6dyKZRyktnKjD1zlid5i/PMO//MMx+Hf1YL6+jiYER1Q28rBZvFHS5wWAPYwyVuMRMDnmKvQap9nMQG3jTXa8wsakycTvhFE+AOPjAxLnA5HNYVOuOu8Bj3WE2uOxN4hCdsxSY0jbwQ4j5g5S+AQ22jzDmU0mhNJvwyZn5iTr7a+IoNVOZ1JrSNmxSwCG/5HYPw/VsNQu2m9vAR8/LVCTfgh6p/2ws2MFUDVPVsoo+1VNMSzvFcI3LVc4bFBqnq6xtWyUMN2RAOUgAAAABJRU5ErkJggg==" alt="key symbol"></img>
                            </button>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.nextDOM}
                                className={StylesStart.buttonsController+" btn btn-info"}
                                id="next"
                                onClick={this.nextLyric}
                            >
                                <span>Next</span>
                                <img className={StylesStart.keySymbol} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAACdklEQVR4nO2ZP2sUQRjGf3dcNGonahM8Szsb8TNogmBhrUZyEQmChX/SWvoVLGwsLSz8c51+ABMLSaMguZgTS4OgiMldRgaeheEQ3J3d2ZmTfWDK932fZ2ffZ2bfhQYNGlSBQ8Ay0Ae+AHuACbT2VKOvmrOVKAAuAtsBif9rfQYWyoq4BYyV8C1wBTgJdAiHjmpcBdZUewSslNmJsZLcAVrUjxZw1+Ex79MT2etkRcTGfXHZKtozN5zXKcZOTMJyWBenHgXQV5DtiVRwTZxeFgkaKsg2XSroipN95XNjV0Eh3akoZsTJcsuNzMNTgynKy1dIGzjHfyCkA+wDTwP1l6lTSBb7A3hQ5V2JGoVYXAY+Ojk+AZc8c0UVku2MPVS/OrneAGdK5IwiJMMRYBX47lzRHwHHp01IhmPAQ+C38n4DbnucUya2kAyngWdO/g1ZdjBeJuCBaIk/dmp0plHIPPDeyf982nbkLPDayfvB8/PVxBLSlUtln8s7crEDnvlM3UKOyqV+KY8V8gQ4USJnrUJaeuI7FR+EUe9a25qEVAlTp5CfAS6LUV6tOcLB+ApJ8VPXFAkyCQ4fTpURUnWzlsH1MkLWEhzQmSKB7jTczl5jY3WCU25kAfs6le9F2pm2RIzFxVtIz7knrWts2ZWDhMKMaiwC75wrzpKPEHfSeAHYnNjaOtcmcN530jg5+z0sB7MD5IEjNMTaVY0XGqLbXxyu/Raa/b5K0H4XxckKzI3lxOy37fSL7ZXcmNVPyNTsdwAcLBq8oP92qdjvSE3vhRUliG2/I+BmFZOPrYj2OyizE3/rmZ4cY1iD/Q5Va8mnJxo0oDr8AdeQo5jOlqZzAAAAAElFTkSuQmCC" alt="key symbol"></img>
                            </button>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.stopDOM}
                                className={StylesStart.buttonsController+" btn btn-danger"}
                                id="stop"
                                onClick={this.stopMusic}
                            >
                                <span>stop</span>
                                <img className={StylesStart.keySymbol} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABFklEQVR4nO2YPU4DQQyFv4ZQbUgBBeFQ/BwjAW7JEqQloku4BknvaJAHmSgUaZAnep9kaWa38dMbS7ZBCCGEEEL8B+fAE7AAtoAljS3wCjwCo30RN8BHgiTtyFgC0+hEFbECboGOvHTAHbD2nN+rM89BxIR2mAQx8/LhzS/FidZ48NxLzbDxS+bn9Bdjz/2LUDitYjV/CUmCyZFkmBxJhsmRZNjJOtLRHheHhJTWuNWm0QiHdYNt/OchIVXMvXeVWRm7E1HELyFDgtHVjoyY83cvXw6XwMyHlOzLh95zvYrzyOIEir3H1yqtF/sM30AsGy72ATirP6dBTEsxANf7Ske+VunDQiJjbIAXf04/TgghhBBCkI8df+Nv3sQqFjkAAAAASUVORK5CYII=" alt="key symbol"></img>
                            </button>
                            <button
                                type="button"
                                ref={this.startDOM}
                                className={StylesStart.buttonsController+" btn btn-success"}
                                id="start"
                                onClick={this.playMusic}
                                disabled={this.state.notLoadYet||this.state.musicArePlaying}
                            >
                                <span>start</span>
                                <img className={StylesStart.keySymbol} src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAACXBIWXMAAAsTAAALEwEAmpwYAAABFklEQVR4nO2YPU4DQQyFv4ZQbUgBBeFQ/BwjAW7JEqQloku4BknvaJAHmSgUaZAnep9kaWa38dMbS7ZBCCGEEEL8B+fAE7AAtoAljS3wCjwCo30RN8BHgiTtyFgC0+hEFbECboGOvHTAHbD2nN+rM89BxIR2mAQx8/LhzS/FidZ48NxLzbDxS+bn9Bdjz/2LUDitYjV/CUmCyZFkmBxJhsmRZNjJOtLRHheHhJTWuNWm0QiHdYNt/OchIVXMvXeVWRm7E1HELyFDgtHVjoyY83cvXw6XwMyHlOzLh95zvYrzyOIEir3H1yqtF/sM30AsGy72ATirP6dBTEsxANf7Ske+VunDQiJjbIAXf04/TgghhBBCkI8df+Nv3sQqFjkAAAAASUVORK5CYII=" alt="key symbol"></img>
                            </button>
                        </div>
                        <audio
                            controls
                            preload="auto"
                            ref={this.audioDOM}
                            id="audio"
                            src={`${process.env.REACT_APP_API_URL}/uploadFile?v=${this.cacheBusting}`}
                            onError={() => {
                                alert(
                                    "Se produjo un error al intentar reproducir tu archivo, vuelve a intentarlo"
                                );
                                axios
                                    .delete(
                                        `${process.env.REACT_APP_API_URL}/delete`
                                    )
                                    .then((res) => {
                                        window.location.href = "/";
                                    })
                                    .catch(() => {
                                        window.location.href = "/";
                                    });
                            }}
                            onEnded={this.endTrackModal}
                            onTimeUpdate={this.timeUpdate}
                            onCanPlayThrough={() => {
                                this.setState({ notLoadYet: false });
                            }}
                        ></audio>
                    </div>
                </div>
                <div id="modalContainer"></div>
            </div>
        );
    }
}

export default Start;
