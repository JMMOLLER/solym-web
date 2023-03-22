/* eslint-disable array-callback-return */
import axios from "axios";
import React from "react";
import { createRoot } from "react-dom/client";
import StylesStart from "./Start.module.css";
import {
    nextLyric,
    previousLyric,
    exportLyric,
    getLyrics,
    getInfoSelected,
    buildLocalStorage,
    detectedLocalStorage,
} from "./Controllers/Start.controller.js";
axios.defaults.withCredentials = true;

/*
    HACER QUE CUANDO TERMINE LA MÚSICA SE MUESTRE UNA PREVIEW DE LA SINCRONIZACIÓN

    REMPLAZAR EL CRONÓMETRO POR CURRENTTIME DEL AUDIO
*/

class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lyrics: [],
            toExport: [],
            infoExport: {},
            id: NaN,
            startDisabled: true,
            previousDisabled: true,
            previewEnabled: false,
            notification: undefined,
            toggleShow: false,
        };
        this.index = -1;
        this.times = new Map();
        this.currentLyric = "";
        this.currentSecond = 0;
        this.Toggle = () => {
            this.setState({ toggleShow: !this.state.toggleShow });
        };
        this.checkTime = undefined;
        this.cacheBusting = Date.now();
        // DOM LYRICS
        this.c_lyricDOM = React.createRef();
        this.p_lyricDOM = React.createRef();
        this.n_lyricDOM = React.createRef();
        this.backgroundDOM = React.createRef();
        // DOM BUTTONS
        this.startDOM = React.createRef();
        this.stopDOM = React.createRef();
        this.previousDOM = React.createRef();
        this.nextDOM = React.createRef();
        this.exportDOM = React.createRef();
        this.resetDOM = React.createRef();
        this.previewDOM = React.createRef();
        // DOM AUDIO
        this.audioDOM = React.createRef();
        // DOM MODAL
        this.modal = React.createRef();
        this.modalContainer = React.createRef();
        // DOM CONTAINER
        this.containerDOM = React.createRef();
        // FUNCTIONS
        this.nextLyric = nextLyric.bind(this);
        this.previousLyric = previousLyric.bind(this);
        this.playMusic = this.playMusic.bind(this);
        this.exportLyric = exportLyric.bind(this);
        this.preview = this.preview.bind(this);
        this.buildLocalStorage = buildLocalStorage.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
        this.timeUpdate = this.timeUpdate.bind(this);
        this.renderModal = this.renderModal.bind(this);
        this.endedAction = this.endedAction.bind(this);
        this.checkLocalStorage = this.checkLocalStorage.bind(this);
        this.detectedLocalStorage = detectedLocalStorage.bind(this);
    }

    async componentDidMount() {
        try {
            window.addEventListener("beforeunload", (e) => {
                window.localStorage.setItem(
                    "times",
                    JSON.stringify(Array.from(this.times))
                );
                window.localStorage.setItem("index", this.index);
            });
            this.audioDOM.current.volume = 0.5;
            const indexS = document.cookie.indexOf(":") + 1;
            const tmp = document.cookie.substring(indexS);
            this.setState(
                { id: Number.parseInt(tmp.substring(0, tmp.length - 1)) },
                async () => {
                    try {
                        if (isNaN(this.state.id)) {
                            alert(
                                "Error: No se pudo obtener el ID de la canción seleccionada."
                            );
                            return (window.location.href = "/");
                        }
                        /* FETCH LYRICS */
                        const lyrics = await getLyrics(this.state.id);
                        if (!lyrics) {
                            alert(
                                "Error: No se pudo obtener la letra de la canción seleccionada."
                            );
                            return (window.location.href = "/");
                        }
                        this.state.lyrics.push(...lyrics);
                        window.localStorage.setItem(
                            "lyrics",
                            JSON.stringify(lyrics)
                        );
                        this.n_lyricDOM.current.innerHTML =
                            this.state.lyrics[0];

                        this.checkLocalStorage();
                        /* FETCH INFO */
                        const info = await getInfoSelected(this.state.id);
                        if (!info) {
                            alert(
                                "Se generó un error al intentar obtener la información de la canción, intente recargar la página"
                            );
                            return (window.location.href = "/");
                        }
                        console.log(info);
                        this.backgroundDOM.current.style.backgroundImage = `url(${info.cover})`;
                        this.setState({ infoExport: info }, () => {
                            document.title = `${info.title} - ${info.artist}`;
                            this.state.toExport.push(
                                "[ar:" + info.artist + "]"
                            );
                            this.state.toExport.push("\n");
                            this.state.toExport.push("[al:" + info.album + "]");
                            this.state.toExport.push("\n");
                            this.state.toExport.push("[ti:" + info.title + "]");
                            this.state.toExport.push("\n");
                            if (
                                this.state.lyrics[0].includes("[") &&
                                this.state.lyrics[0].includes("]")
                            ) {
                                console.log(
                                    "Lyrics is maybe separated by verses"
                                );
                                this.nextLyric();
                            }
                        });
                    } catch (err) {
                        console.log(err);
                        console.log("hello");
                    }
                }
            );
        } catch (err) {
            console.log(err);
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

    checkLocalStorage() {
        try{
            if (
                window.localStorage.getItem("lyrics") &&
                JSON.parse(window.localStorage.getItem("times"))
                    .length > 1
            ) {
                let response = true;
                const localLyrics = JSON.parse(
                    window.localStorage.getItem("lyrics")
                );
                this.state.lyrics.forEach((lyric, index) => {
                    if (lyric !== localLyrics[index]) {
                        response = false;
                    }
                });
                if (response) {
                    this.detectedLocalStorage(
                        JSON.parse(
                            window.localStorage.getItem("times")
                        ).length === this.state.lyrics.length
                    );
                }
            }
        }catch(err){
            console.log(err);
        }
    }

    renderModal({ title, body, footer }) {
        this.Toggle();
        const modal = (
            <div
                className={StylesStart.modal + " modal"}
                ref={this.modal}
                tabIndex="-1"
            >
                <div className="modal-dialog">
                    <div
                        className={
                            StylesStart["modal-content"] + " modal-content"
                        }
                    >
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button
                                type="button"
                                className={StylesStart.close + " btn-close"}
                                data-mdb-dismiss="modal"
                                aria-label="Close"
                                onClick={() => {
                                    this.Toggle();
                                }}
                            ></button>
                        </div>
                        <div className="modal-body">
                            <p>{body}</p>
                        </div>
                        <div className="modal-footer">{footer}</div>
                    </div>
                </div>
            </div>
        );
        this.setState({ notification: modal });
    }

    endedAction() {
        const title = "¡Último paso!";
        const body =
            "La música ha terminado, puede ver una previsualización del resultado o puede exportar directamente el archivo ahora. ¿Qué desea hacer?";
        const footer = (
            <>
                <button
                    type="button"
                    className="btn btn-danger btn-rounded"
                    data-mdb-dismiss="modal"
                    onClick={this.reset}
                >
                    Reiniciar
                </button>
                <button
                    type="button"
                    ref={this.previewDOM}
                    onClick={this.preview}
                    className="btn btn-success btn-rounded"
                >
                    Previsualizar
                </button>
                <button
                    type="button"
                    ref={this.exportDOM}
                    onClick={this.exportLyric}
                    className="btn btn-info btn-rounded"
                >
                    Exportar
                    <i className={StylesStart.icon + " fas fa-download"}></i>
                </button>
            </>
        );
        this.renderModal({ title, body, footer });
    }

    preview() {
        this.index = -1;
        this.audioDOM.current.currentTime = 0;
        this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "TEXT";
        this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index] || "START";
        this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || "END";
        this.previousDOM.current.style.display = "none";
        this.nextDOM.current.style.display = "none";
        this.setState({ previewEnabled: true }, () => {
            console.log("ready to preview => ", this.state.previewEnabled);
            this.Toggle();
            this.playMusic();
            this.checkTime = requestAnimationFrame(this.timeUpdate);
        });
    }

    timeUpdate() {
        if (this.state.previewEnabled) {
            if (
                this.audioDOM.current.currentTime >=
                this.times.get(this.index + 1)
            ) {
                this.nextLyric();
            }
            if (this.index < this.times.size) {
                this.checkTime = requestAnimationFrame(this.timeUpdate);
            }
        }
    }

    playMusic() {
        if (
            this.audioDOM.current.duration > 0 &&
            this.audioDOM.current.paused
        ) {
            this.stopDOM.current.style.display = "block";
            this.previousDOM.current.style.display = "block";
            this.nextDOM.current.style.display = "block";
            this.audioDOM.current.play();
        } else {
            console.log("la musica aun no carga");
        }
    }

    stopMusic() {
        this.audioDOM.current.pause();
        this.nextDOM.current.style.display = "none";
        this.stopDOM.current.style.display = "none";
    }

    reset() {
        window.location.reload();
    }

    render() {
        return (
            <div style={{ position: "relative", height: "100%" }}>
                <div ref={this.backgroundDOM} className={StylesStart.bg}></div>
                <div
                    style={{
                        height: "100%",
                        position: "relative",
                        zIndex: "2",
                    }}
                >
                    <div className={StylesStart.content}>
                        <div className="boton start"></div>
                        <div className="boton stop"></div>
                        <div className="boton reiniciar"></div>
                        <h1>Lyrics</h1>
                        <p
                            id="previous-lyric"
                            className={StylesStart.previousLyric}
                            ref={this.p_lyricDOM}
                        >
                            TEXT
                        </p>
                        <p id="current-lyric" ref={this.c_lyricDOM}>
                            TEXT
                        </p>
                        <p
                            id="next-lyric"
                            className={StylesStart.nextLiric}
                            ref={this.n_lyricDOM}
                        >
                            TEXT
                        </p>
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
                                disabled={this.state.startDisabled}
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
                            onEnded={this.endedAction}
                            onTimeUpdate={this.timeUpdate}
                            onCanPlayThrough={() => {
                                this.setState({ startDisabled: false });
                            }}
                        ></audio>
                    </div>
                </div>
                <div id="modalContainer">
                </div>
            </div>
        );
    }
}

export default Start;
