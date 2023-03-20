/* eslint-disable array-callback-return */
import axios from "axios";
import React from "react";
import StylesStart from "./Start.module.css";
import { nextLyric, previousLyric, exportLyric } from "./Controllers/Start.controller.js";

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
        };
        this.m = 0;
        this.s = 0;
        this.ms = 0;
        this.mAux = "00";
        this.sAux = "00";
        this.msAux = "00";
        this.current = undefined;
        this.index = -1;
        this.times = new Map();
        this.currentLyric = "";
        this.currentSecond = 0;
        this.toggleShow = false;
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
        // FUNCTIONS
        this.nextLyric = nextLyric.bind(this);
        this.previousLyric = previousLyric.bind(this);
        this.playMusic = this.playMusic.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
        this.exportLyric = exportLyric.bind(this);
        this.Toggle = this.Toggle.bind(this);
    }

    Toggle() {
        this.toggleShow = !this.toggleShow;
        console.log(this.toggleShow);
        if(this.toggleShow){
            this.modal.current.classList.add(StylesStart.mostrar);
        }else{
            this.modal.current.classList.remove(StylesStart.mostrar);
        }
    }
    
    async componentDidMount() {
        const response = await axios.get("/api/start", {
            withCredentials: true,
        });
        if (response.data.error)
            return (window.location.href = response.data.error.returnTo);
        const indexS = document.cookie.indexOf(":") + 1;
        const tmp = document.cookie.substring(indexS);
        this.setState(
            { id: Number.parseInt(tmp.substring(0, tmp.length - 1)) },
            () => {
                if (isNaN(this.state.id)) {
                    alert(
                        "Error: No se pudo obtener el ID de la canción seleccionada."
                    );
                    return (window.location.href = "/");
                }
                axios
                    .get(`/api/lyrics/${this.state.id}`)
                    .then((res) => {
                        const responseURL = new URL(res.request.responseURL);
                        if (
                            responseURL.pathname !==
                            `/api/lyrics/${this.state.id}`
                        ) {
                            return (window.location.href =
                                res.request.responseURL);
                        }
                        return res.data;
                    })
                    .then((data) => {
                        const text = data.lyrics;
                        const temp = text.split("\n");
                        const temp2 = [];
                        temp.filter((lyric) => {
                            if (lyric !== "") temp2.push(lyric);
                        });
                        temp2.filter((lyric) => {
                            if (!lyric.includes("["))
                                this.state.lyrics.push(lyric);
                        });
                        this.n_lyricDOM.current.innerHTML =
                            this.state.lyrics[0];
                        axios
                            .get(`/api/info/${this.state.id}`)
                            .then((res) => {
                                const responseURL = new URL(
                                    res.request.responseURL
                                );
                                if (
                                    responseURL.pathname !==
                                    `/api/info/${this.state.id}`
                                ) {
                                    return (window.location.href =
                                        res.request.responseURL);
                                }
                                return res.data;
                            })
                            .then((data) => {
                                console.log(data);
                                document.styleSheets[4].cssRules.item(22).style.backgroundImage = `url(${data.cover})`;
                                this.setState({ infoExport: data }, () => {
                                    document.title = `${data.title} - ${data.artist}`;
                                    this.state.toExport.push(
                                        "[ar:" + data.artist + "]"
                                    );
                                    this.state.toExport.push("\n");
                                    this.state.toExport.push(
                                        "[al:" + data.album + "]"
                                    );
                                    this.state.toExport.push("\n");
                                    this.state.toExport.push(
                                        "[ti:" + data.title + "]"
                                    );
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
                            })
                            .catch((err) => {
                                alert(
                                    "Se generó un error al intentar obtener la información de la canción, intente recargar la página"
                                );
                                console.log(err);
                            });
                    })
                    .catch((err) => {
                        alert(
                            "Se generó un error al intentar obtener la letra de la canción, intente recargar la página"
                        );
                        console.log(err);
                    });
            }
        );
    }

    preview() {
        this.audioDOM.current.currentTime = 0;
        this.p_lyricDOM.current.innerHTML = "TEXT";
        this.c_lyricDOM.current.innerHTML = this.state.lyrics[0];
        this.n_lyricDOM.current.innerHTML = this.state.lyrics[1];
    }

    removeDisbaled(dom) {
        console.log("function removeDisabled");
        dom.removeAttribute("disabled");
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
    }

    reset() {
        window.location.reload();
    }

    OnErrorFile() {
        alert(
            "Se produjo un error al intentar reproducir tu archivo, vuelve a intentarlo"
        );
        axios.delete("/api/delete")
            .then((res) => {
                window.location.href = "/";
            })
            .catch(() => {
                window.location.href = "/";
            });
    }

    render() {
        return (
            <div style={{position: "relative", height: "100%"}}>
                <div ref={this.backgroundDOM} className={StylesStart.bg}></div>
                <div style={{height: "100%", position: "relative", zIndex: "2"}}>
                    <div className={StylesStart.content}>
                        <div class="boton start"></div>
                        <div class="boton stop"></div>
                        <div class="boton reiniciar"></div>
                        <h1>Lyrics</h1>
                        <p id="previous-lyric" className={StylesStart.previousLyric} ref={this.p_lyricDOM}>
                            TEXT
                        </p>
                        <p id="current-lyric" ref={this.c_lyricDOM}>
                            TEXT
                        </p>
                        <p id="next-lyric" className={StylesStart.nextLiric} ref={this.n_lyricDOM}>
                            TEXT
                        </p>
                        <div className={StylesStart.controllers}>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.previousDOM}
                                class="btn btn-warning"
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
                                class="btn btn-info"
                                id="next"
                                onClick={this.nextLyric}
                            >
                                Next
                            </button>
                            <button
                                style={{ display: "none" }}
                                type="button"
                                ref={this.stopDOM}
                                class="btn btn-danger"
                                id="stop"
                                onClick={this.stopMusic}
                            >
                                stop
                            </button>
                            <button
                                type="button"
                                ref={this.startDOM}
                                class="btn btn-success"
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
                            src="/api/uploadFile"
                            onError={this.OnErrorFile}
                            onPlay={this.cronometrar}
                            onEnded={this.Toggle}
                            onPause={this.parar}
                            onCanPlayThrough={() => {
                                this.setState({ startDisabled: false });
                            }}
                        ></audio>
                    </div>
                </div>
                <div className={StylesStart.modal+' modal'} ref={this.modal} tabindex="-1">
                    <div class="modal-dialog">
                        <div className={StylesStart["modal-content"]+" modal-content"}>
                            <div class="modal-header">
                                <h5 class="modal-title">¡Último paso!</h5>
                                <button
                                    type="button"
                                    className={StylesStart.close+" btn-close"}
                                    data-mdb-dismiss="modal"
                                    aria-label="Close"
                                    onClick={this.Toggle}
                                ></button>
                            </div>
                            <div class="modal-body">
                                <p>La música ha terminado, puede ver una previsualización del resultado
                                    o puede exportar directamente el archivo ahora. ¿Qué desea hacer?
                                </p>
                            </div>
                            <div class="modal-footer">
                                <button
                                    type="button"
                                    class="btn btn-danger btn-rounded"
                                    data-mdb-dismiss="modal"
                                    onClick={this.reset}
                                >
                                    Reiniciar
                                </button>
                                <button type="button" ref={this.previewDOM} class="btn btn-success btn-rounded">
                                    Previsualizar
                                </button>
                                <button type="button" ref={this.exportDOM} onClick={this.exportLyric} class="btn btn-info btn-rounded">
                                    Exportar<i className={StylesStart.icon+" fas fa-download"}></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Start;
