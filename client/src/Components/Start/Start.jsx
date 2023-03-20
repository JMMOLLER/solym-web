/* eslint-disable array-callback-return */
import axios from "axios";
import React, { useState } from "react";
import StylesStart from "./Start.module.css";

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
            temp2: [],
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
        // DOM AUDIO
        this.audioDOM = React.createRef();
        // DOM TIME
        this.chronometer = React.createRef();
        // FUNCTIONS
        this.nextLyric = this.nextLyric.bind(this);
        this.previousLyric = this.previousLyric.bind(this);
        this.playMusic = this.playMusic.bind(this);
        this.stopMusic = this.stopMusic.bind(this);
        this.cronometrar = this.cronometrar.bind(this);
        this.escribir = this.escribir.bind(this);
        this.parar = this.parar.bind(this);
        this.reiniciar = this.reiniciar.bind(this);
        this.exportLyric = this.exportLyric.bind(this);
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
                        temp.filter((lyric) => {
                            if (lyric !== "") this.state.temp2.push(lyric);
                        });
                        this.state.temp2.filter((lyric) => {
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

    nextLyric() {
        const currentMin = this.mAux,
        currentSeg = this.sAux,
        currentMs = this.msAux,
        start = window.performance.now();
        let executinTime = 0, end = 0;
        if (this.index >= -1) {
            this.setState({ previousDisabled: false });
        }if (this.index < this.state.lyrics.length - 1) {
            this.index++;
            this.currentSecond = (this.s + this.ms / 1000 + this.m * 60);
            this.times.set(this.index, this.currentSecond);
            executinTime = (end - start)/1000;
            //executinTime = executinTime - Number(currentSeg+"."+currentMs);
            this.currentLyric =
                "[" +
                currentMin +
                ":" +
                currentSeg +
                "." +
                (currentMs - executinTime).toFixed(0) +
                "]" +
                this.state.lyrics[this.index];
            this.state.toExport.push(this.currentLyric);
            this.state.toExport.push("\n");
            console.log(this.currentLyric + " Index: " + this.index);
            this.p_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index - 1] || "START";
            this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index];
            this.n_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index + 1] || "END";
        }
        // console.log(executinTime, Number(this.sAux+"."+this.msAux));
        console.log("Time to execute: " + executinTime + " ms");
    }

    editChronometer({ isRestart, currentTime }) {
        if (isRestart) {
            this.m = 0;
            this.s = 0;
            this.ms = 0;
            this.mAux = "00";
            this.sAux = "00";
            this.msAux = "00";
        } else {
            this.m = Math.floor(currentTime / 60); //OBTIENE LOS MINUTOS
            this.s = Math.floor(currentTime % 60); //OBTIENE LOS SEGUNDOS
            this.ms =
                Math.floor((currentTime - Math.floor(currentTime)) * 1000) - 1; //OBTIENE LOS MILISEGUNDOS
        }
        this.escribir();
    }

    previousLyric() {
        this.stopDOM.current.style.display = "none";
        this.nextDOM.current.style.display = "none";
        if (this.index > 0) {
            this.index--; //REDUCE EL INDICE
            this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
            const currentTime = this.times.get(this.index); //OBTIENE EL TIEMPO DE LA LETRA ANTERIOR
            this.audioDOM.current.currentTime = currentTime; //SETEA EL TIEMPO DEL AUDIO A EL TIEMPO DE LA LETRA ANTERIOR
            this.editChronometer({
                isRestart: false,
                currentTime: currentTime,
            }); //SETEA EL CRONOMETRO A EL TIEMPO DE LA LETRA ANTERIOR
            this.times.delete(this.index + 1); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
            this.state.toExport.pop();
            this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
            this.p_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index - 1] || "START"; //ESCRIBE LA LETRA ANTERIOR
            this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index]; //ESCRIBE LA LETRA ACTUAL
            this.n_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index + 1] || "END"; //ESCRIBE LA LETRA SIGUIENTE
        } else {
            this.editChronometer({ isRestart: true, currentTime: 0 }); //SETEA EL CRONOMETRO A 0
            this.setState({ previousDisabled: true }); //DESACTIVA EL BOTON DE LETRA ANTERIOR
            this.times.delete(this.index); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
            this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
            this.state.toExport.pop();
            this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
            this.index--; //REDUCE EL INDICE
            this.p_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index - 1] || "START"; //ESCRIBE LA LETRA ANTERIOR
            this.c_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index] || "TEXT"; //ESCRIBE LA LETRA ACTUAL
            this.n_lyricDOM.current.innerHTML =
                this.state.lyrics[this.index + 1] || "END"; //ESCRIBE LA LETRA SIGUIENTE
            this.audioDOM.current.currentTime = 0; //SETEA EL TIEMPO DEL AUDIO A 0
        }
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

    exportLyric() {
        if (window.confirm("Do you want to export the lyrics?")) {
            console.log(this.state.toExport);
            const document = new Blob(this.state.toExport, {
                type: "text/plain;charset=utf-8",
            });
            const link = window.URL.createObjectURL(document);
            this.saveAs(link, `${this.state.infoExport.title}.lrc`);
        }
        axios
            .delete("/api/delete")
            .then((res) => {
                window.location.href = "/";
            })
            .catch(() => {
                window.location.href = "/";
            });
    }

    saveAs(uri, filename) {
        let link = document.createElement("a");
        if (typeof link.download === "string") {
            link.href = uri;
            link.download = filename;

            //Firefox requires the link to be in the body
            document.body.appendChild(link);

            //simulate click
            link.click();

            //remove the link when done
            document.body.removeChild(link);
        } else {
            window.open(uri);
        }
    }

    OnErrorFile() {
        alert(
            "Se produjo un error al intentar reproducir tu archivo, vuelve a intentarlo"
        );
        axios
            .delete("/api/delete")
            .then((res) => {
                window.location.href = "/";
            })
            .catch(() => {
                window.location.href = "/";
            });
    }

    /* CRONOMETRO */
    cronometrar() {
        this.escribir();
        this.current = setInterval(this.escribir, 10);
        document
            .querySelector(".start")
            .removeEventListener("click", this.cronometrar);
    }
    escribir() {
        this.ms++;
        if (this.ms > 99) {
            this.s++;
            this.ms = 0;
        }
        if (this.s > 59) {
            this.m++;
            this.s = 0;
        }
        if (this.m > 59) {
            this.m = 0;
        }

        if (this.ms < 10) {
            this.msAux = "0" + this.ms;
        } else {
            this.msAux = this.ms;
        }
        if (this.s < 10) {
            this.sAux = "0" + this.s;
        } else {
            this.sAux = this.s;
        }
        if (this.m < 10) {
            this.mAux = "0" + this.m;
        } else {
            this.mAux = this.m;
        }

        this.chronometer.current.innerHTML =
            this.mAux + ":" + this.sAux + ":" + this.msAux;
    }

    parar() {
        clearInterval(this.current);
        document
            .querySelector(".start")
            .addEventListener("click", this.cronometrar);
    }

    reiniciar() {
        clearInterval(this.current);
        document.getElementById("hms").innerHTML = "00:00:00";
        this.m = 0;
        this.s = 0;
        this.ms = 0;
        document
            .querySelector(".start")
            .addEventListener("click", this.cronometrar);
    }

    render() {
        return (
            <div style={{position: "relative", height: "100%"}}>
                <div ref={this.backgroundDOM} className={StylesStart.bg}></div>
                <div style={{height: "100%", position: "relative", zIndex: "2"}}>
                    <div className={StylesStart.content}>
                        <div id="hms" ref={this.chronometer}>
                            00:00:00
                        </div>
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
                            src="/api/uploadFile"
                            onError={this.OnErrorFile}
                            onPlay={this.cronometrar}
                            onEnded={this.exportLyric}
                            onPause={this.parar}
                            onCanPlayThrough={() => {
                                this.setState({ startDisabled: false });
                            }}
                        ></audio>
                    </div>
                </div>
            </div>
        );
    }
}

export default Start;
