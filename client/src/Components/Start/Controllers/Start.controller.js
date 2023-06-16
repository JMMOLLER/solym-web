/* eslint-disable array-callback-return */
import axios from "axios";
import StylesStart from "../Start.module.css";
const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

function enableEvents() {
    window.addEventListener("beforeunload", this.saveProgress);
    window.addEventListener("keydown", (e) => {
        if(e.key === "ArrowRight") this.nextLyric();
        else if(e.key === "ArrowLeft") this.previousLyric();
        else if(e.key === " "&&this.state.musicArePlaying) this.stopMusic();
        else if(e.key === " "&&!this.state.musicArePlaying) this.playMusic();
    });
    this.bgVideo.current.addEventListener("loadeddata", () => {
        this.setState({ hasVideo: true });
    })
    this.audioDOM.current.onpause = () => {
        if(this.state.hasVideo){
            document.getElementById("backgroundDOM").style.animation = `${StylesStart.hiddenVideo} .1s ease-in forwards`;
            this.bgVideo.current.pause();
        }
    };
    this.audioDOM.current.onplay = () => {
        if(this.state.hasVideo){
            document.getElementById("backgroundDOM").style.animation = `${StylesStart.showVideo} .3s ease-in-out forwards`;
            this.bgVideo.current.play();
        }
    };
}

function reorganizeStyles() {
    document.body.style.overflow = "hidden";
    document.querySelector("html").style.overflow = "hidden";
    document.querySelector("html").style.minWidth = "100%";
    document.getElementsByTagName("header")[0].style.display = "none";
    document.getElementById("root").style.height = "100vh";
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

async function getLyrics() {
    try {
        const response = await axiosConfig.get(
            `/lyrics`
        );
        return filterVerses(await response.data.lyrics);
    } catch (err) {
        alert(
            "Error: No se pudo obtener la letra de la canción seleccionada."
        );
        console.log(err); 
        /*
        * hay que crear un state para comprobar si se genero
        * un error ya que tambien hay que añadir un setTimeout
        * cada vez que se intent hacer un redirect porque si no
        * no se puede visualizar el mensaje de error
        */
        return (window.location.href = "/");
    }
}

function filterVerses(lyrics) {
    const temp = lyrics.split("\n");
    const temp2 = [], temp3 = [];
    temp.filter((lyric) => {
        if (lyric !== "") temp2.push(lyric);
    });
    temp2.filter((lyric) => {
        if (!lyric.includes("[")) temp3.push(lyric);
    });
    return temp3;
}

async function getInfoSelected() {
    try {
        const response = await axiosConfig.get(
            `/info`
        );
        return await response.data;
    } catch (err) {
        alert(
            "Se generó un error al intentar obtener la información de la canción, intente recargar la página."
        );
        return (window.location.href = "/");
    }
}

function setBGImage(URL){
    this.backgroundDOM.current.style.setProperty("background-size",'auto 100%');
    this.backgroundDOM.current.style.setProperty("background-repeat",'no-repeat');
    this.backgroundDOM.current.style.setProperty("background-position",'center');
    this.backgroundDOM.current.style.setProperty("background-image",`url(${URL})`);
}

function processInfo(info) {
    this.setBGImage(info.cover);
    this.bgVideo.current.src = info.videoURL;
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

/**
 * The function fades the volume of an audio element to zero and pauses it.
 */
function fadeAudioVolume() {
    let currentVolume = this.audioDOM.current.volume; // El volumen actual
    let temp = currentVolume; // Guardar el volumen actual
    const targetVolume = 0; // El volumen deseado
    const volumeStep = 0.01; // Cuánto cambiar el volumen en cada paso
    const timeStep = 90; // Cuánto tiempo esperar entre cada paso (en milisegundos)

    const intervalId = setInterval(() => {
        if (currentVolume > targetVolume) { // Si el volumen actual es mayor que el volumen deseado
            currentVolume = Math.max(currentVolume - volumeStep, 0); // Restar el volumen
            this.audioDOM.current.volume = currentVolume; // Establecer el volumen
        } else {
            this.audioDOM.current.pause(); // Pausar la canción
            this.audioDOM.current.currentTime = 0; // Establecer el tiempo de reproducción al inicio
            this.audioDOM.current.volume = temp; // Establecer el volumen al valor guardado
            clearInterval(intervalId); // Limpiar el intervalo
        }
    }, timeStep); // Repetir cada timeStep milisegundos
}

/**
 * The function increases the volume of an audio element gradually over time.
 */
function increaseAudioVolume() {
    const targetVolume = this.audioDOM.current.volume; // El volumen deseado
    let currentVolume = this.audioDOM.current.volume = 0; // El volumen actual
    const volumeStep = 0.01; // Cuánto cambiar el volumen en cada paso
    const timeStep = 90; // Cuánto tiempo esperar entre cada paso (en milisegundos)

    const intervalId = setInterval(() => {
        if (currentVolume < targetVolume) { // Si el volumen actual es menor que el volumen deseado
            currentVolume = Math.min(currentVolume + volumeStep, 1); // Sumar el volumen
            this.audioDOM.current.volume = currentVolume; // Establecer el volumen
        } else {
            clearInterval(intervalId); // Limpiar el intervalo
        }
    }, timeStep); // Repetir cada timeStep milisegundos
}

/* ============ LOCAL STORAGE ============ */

/**
 * The function checks if there is data stored in the local storage and compares it with the current
 * state of the lyrics, and displays a modal if they match.
 */
function checkLocalStorage() {
    try{
        if (
            window.localStorage.getItem("lyrics") &&
            JSON.parse(window.localStorage.getItem("times"))
                .length > 1
        ) { // Si hay datos en el local storage
            let response = true; // La respuesta es verdadera
            const localLyrics = JSON.parse(window.localStorage.getItem("lyrics")); // Obtener las letras del local storage
            this.state.lyrics.forEach((lyric, index) => { // Por cada letra en el estado
                if (lyric !== localLyrics[index]) { // Si la letra actual es diferente a la letra en el local storage
                    response = false; // La respuesta es falsa
                }
            });
            if (response) { // Si la respuesta es verdadera
                this.LocalStorageModal(
                    JSON.parse( window.localStorage.getItem("times"))
                        .length === this.state.lyrics.length // Si el número de tiempos en el local storage es igual al número de letras en el estado
                ); // Mostrar el modal
            }
        }
    }catch(err){
        console.log(err); // Mostrar el error en la consola
    }
}

/**
 * The function builds and sets the state of a local storage object for a music player.
 */
function buildLocalStorage() {
    this.times = new Map(JSON.parse(window.localStorage.getItem("times"))); // Obtener los tiempos del local storage
    this.index = Number.parseInt(window.localStorage.getItem("index")); // Obtener el índice del local storage
    if(this.index > -1) {this.setState({ previousDisabled: false });} // Si el índice es mayor a -1, habilitar el botón de anterior
    this.n_aux_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 2]; // Establecer la letra siguiente
    this.state.lyrics.map((lyric, index) => { // Por cada letra en el estado
        if (index < this.index) { // Si el índice es menor al índice del local storage
            this.state.toExport.push(formatTime(this.times.get(index)) + lyric); // Agregar el tiempo y la letra al array de exportación
            this.state.toExport.push("\n"); // Agregar un salto de línea al array de exportación
        }
    });
    this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "♪"; // Establecer la letra anterior
    this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index]; // Establecer la letra actual
    this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || ""; // Establecer la letra siguiente
    this.audioDOM.current.currentTime = this.times.get(this.index); // Establecer el tiempo de reproducción
    this.Toggle(); // Pausar la canción
}

/**
 * The function removes specific items from local storage and removes an event listener.
 */
function cleanLocalStorage() {
    window.localStorage.removeItem("lyrics"); // Eliminar las letras del local storage
    window.localStorage.removeItem("times"); // Eliminar los tiempos del local storage
    window.localStorage.removeItem("index"); // Eliminar el índice del local storage
    window.removeEventListener("beforeunload", this.saveProgress); // Eliminar el evento de guardar el progreso
}

/**
 * The function formats a given time in seconds into a string with minutes, seconds, and milliseconds
 * in a specific format.
 * @param time - The time parameter is a number representing the time in seconds.
 * @returns a formatted string representing the time in minutes, seconds, and milliseconds. The string
 * is enclosed in square brackets and has the format [mm:ss.mmm].
 */
function formatTime(time) {
    let minutes = Math.floor(time / 60); // Obtener los minutos
    let seconds = Math.floor(time - minutes * 60); // Obtener los segundos
    let milliseconds =
        (time - minutes * 60 - Math.floor(time - minutes * 60)).toFixed(3) *
        1000; // Obtener los milisegundos
    if (minutes < 10) minutes = `0${minutes}`; // Si los minutos son menores a 10, agregar un 0 al inicio
    if (seconds < 10) seconds = `0${seconds}`; // Si los segundos son menores a 10, agregar un 0 al inicio
    if (milliseconds < 10) milliseconds = `00${milliseconds}`; // Si los milisegundos son menores a 10, agregar dos 0 al inicio
    else if (milliseconds < 100) milliseconds = `0${milliseconds}`; // Si los milisegundos son menores a 100, agregar un 0 al inicio
    return `[${minutes}:${seconds}.${milliseconds}]`; // Devolver el tiempo en el formato [mm:ss.mmm]
}

/* ============ CONTROLLERS ============ */

/**
 * The function advances to the next lyric in a song and updates the displayed lyrics accordingly,
 * while also exporting the current time and lyric to an array if preview is disabled.
 */
function nextLyric() {
    if(this.state.hasStarted){ // Si la canción ha iniciado
        if (this.index >= -1) { // Si el índice es mayor o igual a -1
            this.setState({ previousDisabled: false }); // Habilitar el botón de anterior
        }
        if (this.index < this.state.lyrics.length - 1) { // Si el índice es menor al número de letras en el estado
            this.index++; // Aumentar el índice
            this.setAnimation(false); // Establecer la animación
            setTimeout(() => { // Después de 150 milisegundos
                this.removeAnimation(); // Eliminar la animación
                if (!this.state.previewEnabled) { // Si la vista previa está deshabilitada
                    this.currentSecond = this.audioDOM.current.currentTime - (0.15 + this.props.globalConfigs.delay); // Obtener el tiempo actual
                    this.times.set(this.index, this.currentSecond); // Establecer el tiempo actual
                    this.currentLyric = formatTime(this.currentSecond) + this.state.lyrics[this.index]; // Obtener el tiempo actual y la letra actual
                    this.state.toExport.push(this.currentLyric); // Agregar el tiempo actual y la letra actual al array de exportación
                    this.state.toExport.push("\n"); // Agregar un salto de línea al array de exportación
                    console.log(this.currentLyric + " Index: " + this.index); // Imprimir el tiempo actual y la letra actual en la consola
                }
                this.p_aux_lyricDOM.current.innerText = this.state.lyrics[this.index - 2] || ""; // Establecer la letra anterior
                this.p_lyricDOM.current.innerText = this.state.lyrics[this.index - 1] || "♪"; // Establecer la letra anterior
                this.c_lyricDOM.current.innerText = this.state.lyrics[this.index]; // Establecer la letra actual
                this.n_lyricDOM.current.innerText = this.state.lyrics[this.index + 1] || ""; // Establecer la letra siguiente
                this.n_aux_lyricDOM.current.innerText = this.state.lyrics[this.index + 2] || ""; // Establecer la letra siguiente
            }, 150);
        }
    }else{
        alert("You haven't started the song yet"); // SI LA CANCION NO HA EMPEZADO
    }
}

/**
 * The function allows the user to go back to the previous lyric of a song and synchronize it with the
 * audio.
 */
function previousLyric() {
    if(this.state.hasStarted){ // SI LA CANCION YA HA EMPEZADO
        this.stopDOM.current.style.display = "none"; // OCULTA EL BOTON DE PARAR
        this.nextDOM.current.style.display = "none"; // OCULTA EL BOTON DE SIGUIENTE
        this.setAnimation(true); // ESTABLECE LA ANIMACION DE LA LETRA ANTERIOR
        setTimeout(() => {
            this.removeAnimation(); // REMUEVE LA ANIMACION DE LA LETRA ANTERIOR
            if (this.index > 0) { // SI EL INDICE ES MAYOR A 0
                this.index--; //REDUCE EL INDICE
                this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
                const currentTime = this.times.get(this.index); //OBTIENE EL TIEMPO DE LA LETRA ANTERIOR
                this.audioDOM.current.currentTime = currentTime; //SETEA EL TIEMPO DEL AUDIO A EL TIEMPO DE LA LETRA ANTERIOR
                this.bgVideo.current.currentTime = currentTime; //SETEA EL TIEMPO DEL VIDEO A EL TIEMPO DE LA LETRA ANTERIOR
                this.times.delete(this.index + 1); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
                this.state.toExport.pop();
                this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
                this.p_aux_lyricDOM.current.innerText = this.state.lyrics[this.index - 2] || "";
                this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "♪"; //ESCRIBE LA LETRA ANTERIOR
                this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index]; //ESCRIBE LA LETRA ACTUAL
                this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || ""; //ESCRIBE LA LETRA SIGUIENTE
                this.n_aux_lyricDOM.current.innerText = this.state.lyrics[this.index + 2] || "";
            } else {
                this.index = -1;
                this.setState({ previousDisabled: true }); //DESACTIVA EL BOTON DE LETRA ANTERIOR
                this.times.delete(this.index + 1); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
                this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
                this.state.toExport.pop();
                this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
                this.p_aux_lyricDOM.current.innerText = this.state.lyrics[this.index - 2] || "";
                this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || ""; //ESCRIBE LA LETRA ANTERIOR
                this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index] || "♪"; //ESCRIBE LA LETRA ACTUAL
                this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || ""; //ESCRIBE LA LETRA SIGUIENTE
                this.n_aux_lyricDOM.current.innerText = this.state.lyrics[this.index + 2] || "";
                this.audioDOM.current.currentTime = 0; //SETEA EL TIEMPO DEL AUDIO A 0
            }
        }, 150); //ESPERA 150 MILISEGUNDOS
    }else{
        alert("You haven't started the song yet"); // SI LA CANCION NO HA EMPEZADO
    }
}

/**
 * The function plays music if it has loaded and is not already playing, otherwise it logs a message.
 */
function playMusic() {
    if (
        this.audioDOM.current.duration > 0 &&
        this.audioDOM.current.paused
    ) {
        this.stopDOM.current.style.display = "block";
        this.previousDOM.current.style.display = "block";
        this.nextDOM.current.style.display = "block";
        this.audioDOM.current.play();
        this.setState({ musicArePlaying: true });
        if(!this.state.hasStarted){
            this.setState({ hasStarted: true });
        }
    } else {
        console.log("la musica aun no carga");
    }
}

/**
 * The function stops the currently playing music and hides the next and stop buttons while updating
 * the state to indicate that music is no longer playing.
 */
function stopMusic() {
    this.audioDOM.current.pause();
    this.nextDOM.current.style.display = "none";
    this.stopDOM.current.style.display = "none";
    this.setState({ musicArePlaying: false });
}

/**
 * The function resets the current webpage by reloading it.
 */
function reset() {
    window.location.reload();
}

/* ================= EXPORT ================= */

/**
 * This function exports a lyric file and deletes data from local storage and a server.
 */
function exportLyric() {
    const document = new Blob(this.state.toExport, {
        type: "text/plain;charset=utf-8",
    });
    const link = window.URL.createObjectURL(document);
    saveAs(link, `${this.state.infoExport.title}.lrc`);
    this.cleanLocalStorage();
    axiosConfig.delete("/delete")
        .then((res) => {
            window.location.href = "/";
        })
        .catch(() => {
            window.location.href = "/";
        });
}

/**
 * This function creates a download link for a given URI and filename, and simulates a click to
 * download the file.
 * @param uri - The URI (Uniform Resource Identifier) is a string of characters that identifies a name
 * or a resource on the Internet. In this function, it is the URL of the file to be downloaded or
 * saved.
 * @param filename - The name that the downloaded file will have.
 */
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

/* ================= RENDER MODAL ================= */

/**
 * The function renders a modal with a title, body, and footer.
 */
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

/* ================= SEND TO RENDER MODAL ================= */

/**
 * The function ends a track, sets the audio and video to a specific time, fades out the audio, and
 * displays a modal with options to preview or export the result.
 */
function endTrackModal() {
    const JUMP = 40
    this.audioDOM.current.currentTime=JUMP;
    this.bgVideo.current.currentTime=JUMP;
    this.playMusic();
    this.increaseAudioVolume();
    setTimeout(() => {
        this.fadeAudioVolume();
    }, 15000)
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

/**
 * The function creates a modal with options for handling saved progress in case of unexpected closure.
 * @param isCompleted - A boolean value indicating whether the progress is completed or not.
 */
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

/* ================= PREVIEW FUNCTIONS ================= */

/**
 * The function enables preview mode and plays music with lyrics displayed.
 */
function preview() {
    this.index = -1;
    this.audioDOM.current.currentTime = 0;
    this.bgVideo.current.currentTime = 0;
    this.p_lyricDOM.current.innerHTML = this.state.lyrics[this.index - 1] || "";
    this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index] || "♪";
    this.n_lyricDOM.current.innerHTML = this.state.lyrics[this.index + 1] || "";
    this.previousDOM.current.style.display = "none";
    this.nextDOM.current.style.display = "none";
    this.setState({ previewEnabled: true }, () => {
        console.info("preview has been enabled");
        this.Toggle();
        this.playMusic();
        this.checkTime = requestAnimationFrame(this.timeUpdate);
    });
}

/**
 * The function checks if the current time of an audio player is greater than the next lyric time and
 * updates the index accordingly.
 */
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
    playMusic,
    nextLyric,
    stopMusic,
    getLyrics,
    getTrackID,
    timeUpdate,
    setBGImage,
    processInfo,
    renderModal,
    enableEvents,
    exportLyric,
    setAnimation,
    saveProgress,
    previousLyric,
    endTrackModal,
    removeAnimation,
    getInfoSelected,
    fadeAudioVolume,
    reorganizeStyles,
    cleanLocalStorage,
    buildLocalStorage,
    checkLocalStorage,
    LocalStorageModal,
    increaseAudioVolume,
};
