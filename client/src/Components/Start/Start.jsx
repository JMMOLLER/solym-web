/* eslint-disable array-callback-return */
import axios from "axios";
import React from "react";
import StylesStart from "./Start.module.css";
import { createRoot } from "react-dom/client";
import DelayConfig from "../Config/DelayConfig.jsx";
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
        this.backgroundDOM = React.createRef();
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
        this.timeUpdate = controller.timeUpdate.bind(this);
        this.processInfo = controller.processInfo.bind(this);
        this.renderModal = controller.renderModal.bind(this);
        this.exportLyric = controller.exportLyric.bind(this);
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
        this.enableEvents = controller.enableEvents.bind(this);
    }

    async componentDidMount() {
        try {
            this.enableEvents();
            document.getElementsByClassName("navbar")[0].style.display = "none";
            document.getElementById("root").style.height = "100vh";
            this.audioDOM.current.volume = 0.5;
            this.setState(
                { id: controller.getTrackID() },
                async () => {
                    try {
                        /* FETCH LYRICS */
                        const lyrics = await controller.getLyrics(this.state.id);
                        this.state.lyrics.push(...lyrics);
                        this.n_lyricDOM.current.innerHTML = this.state.lyrics[0];
                        this.n_aux_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 2];
                        this.checkLocalStorage();
                        /* FETCH INFO */
                        const info = await controller.getInfoSelected(this.state.id);
                        console.log(info);
                        this.processInfo(info);
                    } catch (err) {
                        console.log(err);
                    }
                }
            );
        } catch (err) {
            alert("Error al cargar la página");
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
                <div ref={this.backgroundDOM} className={StylesStart.bg}></div>
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
                                className="btn btn-warning"
                                id="previous"
                                onClick={this.previousLyric}
                                disabled={this.state.previousDisabled}
                            >
                                previous
                            </button>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.nextDOM}
                                className="btn btn-info"
                                id="next"
                                onClick={this.nextLyric}
                            >
                                Next
                            </button>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.stopDOM}
                                className="btn btn-danger"
                                id="stop"
                                onClick={this.stopMusic}
                            >
                                stop
                            </button>
                            <button
                                type="button"
                                ref={this.startDOM}
                                className="btn btn-success"
                                id="start"
                                onClick={this.playMusic}
                                disabled={this.state.notLoadYet}
                            >
                                start
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
