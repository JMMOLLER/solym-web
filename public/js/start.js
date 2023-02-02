let index = -1, m = 0, s = 0, ms = 0, mAux='00', sAux='00', msAux='00', lyrics;
const toExport = [], infoExport = {};
const c_lyricDOM = document.querySelector("#current-lyric");
const p_lyricDOM = document.querySelector("#previous-lyric");
const n_lyricDOM = document.querySelector("#next-lyric");
const audio = document.querySelector("audio");
const start = document.querySelector("#start");
const stopEl = document.querySelector("#stop");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const indexS = document.cookie.indexOf(":") + 1;
const tmp = document.cookie.substr(indexS);
const id = tmp.substr(0, tmp.length - 1);
fetch(`/api/lyrics/${id}`)
    .then((res) => res.json())
    .then((data) => {
        const text = data.lyrics;
        lyrics = text.split("\n");
        n_lyricDOM.innerHTML = lyrics[0];
        fetch(`/api/info/${id}`)
            .then((res) => res.json())
            .then((data) => {
                infoExport.artist = data.artist;
                infoExport.album = data.album;
                infoExport.title = data.title;
                toExport.push("[ar:"+data.artist+"]");
                toExport.push("\n");
                toExport.push("[al:"+data.album+"]");
                toExport.push("\n");
                toExport.push("[ti:"+data.title+"]");
                toExport.push("\n");
                if(lyrics[0].includes("[") && lyrics[0].includes("]")){
                    console.log("Lyrics already have time");
                    nextLyric();
                }
            });
    });


next.addEventListener("click", nextLyric);

function nextLyric(){
    if (index < lyrics.length - 1) {
        while(lyrics[index+1]==""){
            index++;
        }
        index++;
        const currentLyric = "["+mAux + ":" + sAux + "." + msAux+"]"+lyrics[index];
        toExport.push(currentLyric);
        toExport.push("\n");
        console.log(currentLyric+" Index: "+index);
        if(lyrics[index - 1] == ""){
            p_lyricDOM.innerHTML = lyrics[index - 2];
        }else{
            p_lyricDOM.innerHTML = lyrics[index - 1] || "START";
        }
        c_lyricDOM.innerHTML = lyrics[index];
        if(lyrics[index + 1] == ""){
            index++;
            return nextLyric();
        }else{
            n_lyricDOM.innerHTML = lyrics[index + 1] || "END";
        }
    }
}

window.onload = init;

function init(){
    audio.addEventListener("play", cronometrar);
    audio.addEventListener("pause", parar);
    audio.addEventListener("ended", exportLyric);
    stopEl.addEventListener("click", () => {
        audio.pause();
    });
    start.addEventListener("click", () =>{
        if(audio.duration > 0 && audio.paused){
            stopEl.style.display = "block";
            previous.style.display = "block";
            next.style.display = "block";
            audio.play();
        }else{
            console.log("la music aun no carga");
        }
    });
    document.querySelector(".reiniciar").addEventListener("click",reiniciar);
    document.getElementById("hms").innerHTML="00:00:00";
}
async function exportLyric(){
    if(confirm("Do you want to export the lyrics?")){
        console.log(toExport);
        const document = new Blob(toExport, {type: "text/plain;charset=utf-8"}, `${infoExport.title} - ${infoExport.artist}.lrc`);
        const link = window.URL.createObjectURL(document);
        await saveAs(link, "lyrics.lrc");
    }
    await fetch(`/api/delete`, {
        method: "DELETE"
    })
    location.href = "/";
}
async function saveAs(uri, filename) {
    let link = document.createElement('a');
    if (typeof link.download === 'string') {
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
function cronometrar(){
    escribir();
    current = setInterval(escribir,10);
    document.querySelector(".start").removeEventListener("click",cronometrar);
}
function escribir(){
    ms++;
    if (ms>99){
        s++;
        ms=0;
    }if (s>59){
        m++;
        s=0;
    }if (m>59){
        m=0;
    }

    if (ms<10){msAux="0"+ms;}else{msAux=ms;}
    if (s<10){sAux="0"+s;}else{sAux=s;}
    if (m<10){mAux="0"+m;}else{mAux=m;}

    document.getElementById("hms").innerHTML = mAux + ":" + sAux + ":" + msAux; 
}
function parar(){
    clearInterval(current);
    document.querySelector(".start").addEventListener("click",cronometrar);

}
function reiniciar(){
    clearInterval(current);
    document.getElementById("hms").innerHTML="00:00:00";
    m=0;s=0;ms=0;
    document.querySelector(".start").addEventListener("click",cronometrar);
}

// setTimeout(() => {
//     console.log("playing");
//     audio.play();
// }, 5000);
