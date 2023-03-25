/* eslint-disable array-callback-return */
import axios from "axios";
import StylesStart from "../Start.module.css";

function setEvent() {
    window.addEventListener("beforeunload", this.saveProgress);
}

function setAnimation(isReverse) {
    if (!isReverse) {
        this.p_lyricDOM.current.style.setProperty("animation",`${StylesStart.previous} .15s linear`);
        this.c_lyricDOM.current.style.setProperty("animation", `${StylesStart.current} .15s linear`);
        this.n_lyricDOM.current.style.setProperty("animation", `${StylesStart.next} .15s linear`);
        this.n_aux_lyricDOM.current.style.setProperty("animation", `${StylesStart.AuxNext} .2s linear`);
    } else {
        this.p_aux_lyricDOM.current.style.setProperty("animation",`${StylesStart.reverse_aux_previous} .15s linear`);
        this.p_lyricDOM.current.style.setProperty("animation",`${StylesStart.reverse_previous} .15s linear`);
        this.c_lyricDOM.current.style.setProperty("animation",`${StylesStart.reverseCurrent} .15s linear`);
        this.n_lyricDOM.current.style.setProperty("animation",`${StylesStart.reverse_next} .15s linear`);
    }
}

function removeAnimation() {
    this.p_aux_lyricDOM.current.style.removeProperty("animation");
    this.p_lyricDOM.current.style.removeProperty("animation");
    this.c_lyricDOM.current.style.removeProperty("animation");
    this.n_lyricDOM.current.style.removeProperty("animation");
    this.n_aux_lyricDOM.current.style.removeProperty("animation");
}

function saveProgress() {
    window.localStorage.setItem(
        "times",
        JSON.stringify(Array.from(this.times))
    );
    window.localStorage.setItem(
        "lyrics",
        JSON.stringify(this.state.lyrics)
    );
    window.localStorage.setItem("index", this.index);
}

function getTrackID() {
    const indexS = document.cookie.indexOf(":") + 1;
    const tmp = document.cookie.substring(indexS);
    const id = Number.parseInt(tmp.substring(0, tmp.length - 1));
    if(!id) {
        alert("Error: No se pudo obtener el ID de la canción seleccionada.");
        window.location.href = "/";
    }
    return id;
}

async function getLyrics(id) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/lyrics/${id}`
        );
        return filterVerses(await response.data.lyrics);;
    } catch (err) {
        alert(
            "Error: No se pudo obtener la letra de la canción seleccionada."
        );
        return (window.location.href = "/");
    }
}

function filterVerses(lyrics) {
    const temp = lyrics.split("\n");
    const temp2 = [],
        temp3 = [];
    temp.filter((lyric) => {
        if (lyric !== "") temp2.push(lyric);
    });
    temp2.filter((lyric) => {
        if (!lyric.includes("[")) temp3.push(lyric);
    });
    return temp3;
}

async function getInfoSelected(id) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/info/${id}`
        );
        return await response.data;
    } catch (err) {
        alert(
            "Se generó un error al intentar obtener la información de la canción, intente recargar la página."
        );
        return (window.location.href = "/");
    }
}

function processInfo(info) {
    this.backgroundDOM.current.style.backgroundImage = `url(${info.cover})`;
    this.setState({ infoExport: info }, () => {
        document.title = `${info.title} - ${info.artist}`;
        this.state.toExport.push("[ar:" + info.artist + "]");
        this.state.toExport.push("\n");
        this.state.toExport.push("[al:" + info.album + "]");
        this.state.toExport.push("\n");
        this.state.toExport.push("[ti:" + info.title + "]");
        this.state.toExport.push("\n");
        if (
            this.state.lyrics[0].includes("[") &&
            this.state.lyrics[0].includes("]")
        ) {
            console.log("Lyrics is maybe separated by verses");
            this.nextLyric();
        }
    });
}

/* LOCAL STORAGE */

function checkLocalStorage() {
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
                this.LocalStorageModal(
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

function buildLocalStorage() {
    this.times = new Map(JSON.parse(window.localStorage.getItem("times")));
    this.index = Number.parseInt(window.localStorage.getItem("index"));
    if(this.index > -1) {this.setState({ previousDisabled: false });}
    this.n_aux_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 2];
    this.state.lyrics.map((lyric, index) => {
        if (index < this.index) {
            this.state.toExport.push(formatTime(this.times.get(index)) + lyric);
            this.state.toExport.push("\n");
        }
    });
    this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "♪";
    this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index];
    this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || "";
    this.audioDOM.current.currentTime = this.times.get(this.index);
    this.Toggle();
}

function cleanLocalStorage() {
    window.localStorage.removeItem("lyrics");
    window.localStorage.removeItem("times");
    window.localStorage.removeItem("index");
    window.removeEventListener("beforeunload", this.saveProgress);
}

function formatTime(time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    let milliseconds =
        (time - minutes * 60 - Math.floor(time - minutes * 60)).toFixed(3) *
        1000;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    if (milliseconds < 10) milliseconds = `00${milliseconds}`;
    else if (milliseconds < 100) milliseconds = `0${milliseconds}`;
    return `[${minutes}:${seconds}.${milliseconds}]`;
}

/* CONTROLLERS */

function nextLyric() {
    if (this.index >= -1) {
        this.setState({ previousDisabled: false });
    }
    if (this.index < this.state.lyrics.length - 1) {
        this.index++;
        this.setAnimation(false);
        setTimeout(() => {
            this.removeAnimation();
            if (!this.state.previewEnabled) {
                this.currentSecond = this.audioDOM.current.currentTime - 0.15;
                this.times.set(this.index, this.currentSecond);
                this.currentLyric = formatTime(this.currentSecond) + this.state.lyrics[this.index];
                this.state.toExport.push(this.currentLyric);
                this.state.toExport.push("\n");
                console.log(this.currentLyric + " Index: " + this.index);
            }
            this.p_aux_lyricDOM.current.innerText = this.state.lyrics[this.index - 2] || "";
            this.p_lyricDOM.current.innerText = this.state.lyrics[this.index - 1] || "♪";
            this.c_lyricDOM.current.innerText = this.state.lyrics[this.index];
            this.n_lyricDOM.current.innerText = this.state.lyrics[this.index + 1] || "";
            this.n_aux_lyricDOM.current.innerText = this.state.lyrics[this.index + 2] || "";
        }, 150);
    }
}

function previousLyric() {
    this.stopDOM.current.style.display = "none";
    this.nextDOM.current.style.display = "none";
    this.setAnimation(true);
    setTimeout(() => {
        this.removeAnimation();
        if (this.index > 0) {
            this.index--; //REDUCE EL INDICE
            this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
            const currentTime = this.times.get(this.index); //OBTIENE EL TIEMPO DE LA LETRA ANTERIOR
            this.audioDOM.current.currentTime = currentTime; //SETEA EL TIEMPO DEL AUDIO A EL TIEMPO DE LA LETRA ANTERIOR
            this.times.delete(this.index + 1); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
            this.state.toExport.pop();
            this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
            this.p_aux_lyricDOM.current.innerText = this.state.lyrics[this.index - 2] || "";
            this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "♪"; //ESCRIBE LA LETRA ANTERIOR
            this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index]; //ESCRIBE LA LETRA ACTUAL
            this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || ""; //ESCRIBE LA LETRA SIGUIENTE
            this.n_aux_lyricDOM.current.innerText = this.state.lyrics[this.index + 2] || "";
        } else {
            this.setState({ previousDisabled: true }); //DESACTIVA EL BOTON DE LETRA ANTERIOR
            this.times.delete(this.index); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
            this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
            this.state.toExport.pop();
            this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
            this.index--; //REDUCE EL INDICE
            this.p_aux_lyricDOM.current.innerText = this.state.lyrics[this.index - 2] || "";
            this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || ""; //ESCRIBE LA LETRA ANTERIOR
            this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index] || "♪"; //ESCRIBE LA LETRA ACTUAL
            this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || ""; //ESCRIBE LA LETRA SIGUIENTE
            this.n_aux_lyricDOM.current.innerText = this.state.lyrics[this.index + 2] || "";
            this.audioDOM.current.currentTime = 0; //SETEA EL TIEMPO DEL AUDIO A 0
        }
    }, 150);
}

function playMusic() {
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

function stopMusic() {
    this.audioDOM.current.pause();
    this.nextDOM.current.style.display = "none";
    this.stopDOM.current.style.display = "none";
}

function reset() {
    window.location.reload();
}

/* EXPORT */
function exportLyric() {
    const document = new Blob(this.state.toExport, {
        type: "text/plain;charset=utf-8",
    });
    const link = window.URL.createObjectURL(document);
    saveAs(link, `${this.state.infoExport.title}.lrc`);
    this.cleanLocalStorage();
    axios.delete("/api/delete")
        .then((res) => {
            window.location.href = "/";
        })
        .catch(() => {
            window.location.href = "/";
        });
}

function saveAs(uri, filename) {
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

/* RENDER MODAL */

function renderModal({ title, body, footer }) {
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

/* SEND TO RENDER MODAL */

function endTrackModal() {
    const title = "¡Último paso!";
    const body =
        "La música ha terminado, puede ver una previsualización del resultado o puede exportar directamente el archivo ahora. ¿Qué desea hacer?";
    const footer = (
        <>
            <button
                type="button"
                className="btn btn-danger btn-rounded"
                data-mdb-dismiss="modal"
                onClick={() => {reset()}}
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

function LocalStorageModal(isCompleted) {
    const title = "Se ha detectado progreso guardado";
    const body =
        "Al parecer existe progreso guardado de un posible cierre inesperado. ¿Qué acción desea realizar?";
    const footer = (
        <>
            <button
                type="button"
                className="btn btn-danger btn-rounded"
                data-mdb-dismiss="modal"
                onClick={() => {reset()}}
                >
                Reiniciar
            </button>
            {isCompleted ? (
                <>
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
                        <i
                            className={StylesStart.icon + " fas fa-download"}
                            ></i>
                    </button>
                </>
            ) : (
                <>
                    <button
                        type="button"
                        ref={this.previewDOM}
                        onClick={this.buildLocalStorage}
                        className="btn btn-success btn-rounded"
                        >
                        Continuar
                    </button>
                </>
            )}
        </>
    );
    this.renderModal({ title, body, footer });
}

/* PREVIEW FUNCTIONS */

function preview() {
    this.index = -1;
    this.audioDOM.current.currentTime = 0;
    this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "";
    this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index] || "♪";
    this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || "";
    this.previousDOM.current.style.display = "none"; // ESTO NO ESTA FUNCIONANDO
    this.nextDOM.current.style.display = "none"; // ESTO NO ESTA FUNCIONANDO
    this.setState({ previewEnabled: true }, () => {
        console.log("ready to preview => ", this.state.previewEnabled);
        this.Toggle();
        this.playMusic();
        this.checkTime = requestAnimationFrame(this.timeUpdate);
    });
}

function timeUpdate() {
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

export {
    preview,
    setEvent,
    playMusic,
    nextLyric,
    stopMusic,
    getLyrics,
    getTrackID,
    timeUpdate,
    processInfo,
    renderModal,
    exportLyric,
    setAnimation,
    saveProgress,
    previousLyric,
    endTrackModal,
    removeAnimation,
    getInfoSelected,
    cleanLocalStorage,
    buildLocalStorage,
    checkLocalStorage,
    LocalStorageModal,
};
