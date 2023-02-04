let selected;

let checkboxes = document.querySelectorAll('input[type="checkbox"]');
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const search = document.getElementById("btn-search");
const resultsEl = document.getElementById("results");
const inputEl = document.getElementById("search-lyric");
const results_searchEl = document.getElementById("results-search");

inputEl.addEventListener("blur", (e) => {
    if(inputEl.value != ""){
        inputEl.focus();
    }else{
        document.querySelector("#label_input").style.backgroundColor = "transparent";
    }
});

inputEl.addEventListener("focus", (e) => {
    document.querySelector("#label_input").style.backgroundColor = "white";
});

function createEvents(){
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                checkSelected(checkbox.dataset.target);
            }
        });
    });
}

function checkSelected(id) {
    if(!selected) {
        selected = id;
        document.querySelector(`#label_${selected}`).classList.add("selected");
    }else if (selected != id) {
        document.querySelector(`#label_${selected}`).classList.remove("selected");
        document.querySelector(`#label_${id}`).classList.add("selected");
        selected = id;
    }
}

next.addEventListener("click", () => {
    if (selected) {
        document.cookie = `selectedTrack={id:${selected}}`;
        window.location.href = `/start`;
    } else {
        alert("Please select a track");
    }
});

previous.addEventListener("click", async () => {
    await fetch("/api/delete", {
        method: "DELETE",
    }).then((res) => {
        window.location.href = `/`;
    });
});

function setLoader(){
    const loader = document.createElement("div");
    loader.classList.add("loader");
    loader.style = "margin-top: 40px;margin-bottom: 40px;";
    const span = document.createElement("span");
    span.classList.add("loader");
    loader.appendChild(span);
    resultsEl.insertBefore(loader, results_searchEl);
}

function removeLoader(){
    const loader = document.querySelector(".loader");
    loader.remove();
}

async function searchForm(e){
    e.preventDefault();
    if (e.target[0].value) {
        let child = results_searchEl.lastChild;
        while(child){
            results_searchEl.removeChild(child)
            child = results_searchEl.lastElementChild;
        }
        setLoader()
        const results = await getSearch(e.target[0].value);
        console.log(results);
        if (results.length == 0) {
            console.log("No results found");
            const newEl = document.createElement("h2");
            resultsEl.appendChild(newEl);
            removeLoader();
            newEl.innerHTML = "No results found";
        }else{
            removeLoader();
            results.forEach((result) => {
                result = result.result;
                results_searchEl.innerHTML += 
                `<div class="card">
                    <img src="${result.header_image_url}" class="card-img-top" alt="image" style="max-height: 300px; min-height: 300px;">
                    <div class="card-body">
                        <h5 class="card-title">${result.full_title}</h5>
                        <div class="text-container">
                            <p class="card-text"><strong>Título:</strong> ${result.title}</p>
                            <p class="card-text"><strong>Artista:</strong> ${result.primary_artist.name}</p>
                        </div>
                        <input type="checkbox" class="btn-check" id="${result.id}" autocomplete="off" data-target="${result.id}">
                        <label id="label_${result.id}" class="btn btn-primary" for="${result.id}">Seleccionar</label>
                    </div>
                </div>`
                checkboxes = document.querySelectorAll('input[type="checkbox"]');
                createEvents();
            });
        }
    }else{
        alert("Please enter a title of music to search");
    }
};

async function getSearch(title) {
    const response = await fetch(`/api/search/${title}`, {method: "POST"});
    const results = await response.json();
    return results;
}

window.onload = createEvents;