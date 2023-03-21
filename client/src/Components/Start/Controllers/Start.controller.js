/* eslint-disable array-callback-return */
import axios from "axios";

async function getLyrics(id) {
    try {
        const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/lyrics/${id}`
        );
        return filterVerses(await response.data.lyrics);
    } catch (err) {
        console.log(err);
        return null;
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

async function getInfoSelected(id) {
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/info/${id}`)
        return await response.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

function nextLyric() {
    // let start = window.performance.now();
    // let executinTime = 0;
    if (this.index >= -1) {
        this.setState({ previousDisabled: false });
    }
    if (this.index < this.state.lyrics.length - 1) {
        this.index++;
        if (!this.state.previewEnabled) {
            this.currentSecond = this.audioDOM.current.currentTime;
            this.times.set(this.index, this.currentSecond);

            // executinTime = (window.performance.now() - start)/1000;

            this.currentLyric =
                formatTime(this.currentSecond) + this.state.lyrics[this.index];
            this.state.toExport.push(this.currentLyric);
            this.state.toExport.push("\n");
            console.log(this.currentLyric + " Index: " + this.index);
        }
        this.p_lyricDOM.current.innerHTML =
            this.state.lyrics[this.index - 1] || "START";
        this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index];
        this.n_lyricDOM.current.innerHTML =
            this.state.lyrics[this.index + 1] || "END";
    }
    // console.log("Time to execute: " + executinTime + " ms");
}

function previousLyric() {
    this.stopDOM.current.style.display = "none";
    this.nextDOM.current.style.display = "none";
    if (this.index > 0) {
        this.index--; //REDUCE EL INDICE
        this.stopDOM.current.click(); //HACE UN CLICK EN EL BOTON DE PARAR
        const currentTime = this.times.get(this.index); //OBTIENE EL TIEMPO DE LA LETRA ANTERIOR
        this.audioDOM.current.currentTime = currentTime; //SETEA EL TIEMPO DEL AUDIO A EL TIEMPO DE LA LETRA ANTERIOR
        this.times.delete(this.index + 1); //ELIMINA EL TIEMPO DE LA LETRA QUE SE ESTA MOSTRANDO
        this.state.toExport.pop();
        this.state.toExport.pop(); //ELIMINA LAS 2 ULTIMAS LETRAS SINCRONIZADAS
        this.p_lyricDOM.current.innerHTML =
            this.state.lyrics[this.index - 1] || "START"; //ESCRIBE LA LETRA ANTERIOR
        this.c_lyricDOM.current.innerHTML = this.state.lyrics[this.index]; //ESCRIBE LA LETRA ACTUAL
        this.n_lyricDOM.current.innerHTML =
            this.state.lyrics[this.index + 1] || "END"; //ESCRIBE LA LETRA SIGUIENTE
    } else {
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

function exportLyric() {
    console.log(this.state.toExport);
    const document = new Blob(this.state.toExport, {
        type: "text/plain;charset=utf-8",
    });
    const link = window.URL.createObjectURL(document);
    saveAs(link, `${this.state.infoExport.title}.lrc`);
    axios
        .delete("/api/delete")
        .then((res) => {
            window.location.href = "/";
        })
        .catch(() => {
            window.location.href = "/";
        });
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

export { nextLyric, previousLyric, exportLyric, getLyrics, getInfoSelected };
