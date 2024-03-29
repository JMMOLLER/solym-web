import axios from "axios";
import SelectStyle from "../Select.module.css";
const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true
});

function getResults() {
    console.log("enviando resultados");
    if (this.state.response.length === 0) {
        return <h2>No se encontró coindicendias</h2>;
    } else {
        return this.state.response.map((item) => (
            <div
                className={SelectStyle.card + " card"}
                key={item.result.id}
            >
                <img
                    src={item.result.song_art_image_url}
                    className={SelectStyle.cardImgTop + " card-img-top"}
                    alt="cover"
                ></img>
                <div className="card-body">
                    <h5 className={SelectStyle.cardTitle + "card-title"}>
                        {item.result.full_title}
                    </h5>
                    <div
                        className={
                            SelectStyle.textContainer + " text-container"
                        }
                    >
                        <p className="card-text">
                            <strong>Título: </strong>
                            {item.result.title}
                        </p>
                        <p className="card-text">
                            <strong>Artista: </strong>
                            {item.result.primary_artist.name}
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        className="btn-check"
                        id={item.result.id}
                        autoComplete="off"
                        data-target={item.result.id}
                        onChange={this.doSelected}
                    ></input>
                    <label
                        id={"label_" + item.result.id}
                        className="btn btn-primary"
                        htmlFor={item.result.id}
                    >
                        Seleccionar
                    </label>
                </div>
            </div>
        ));
    }
}

/* SEARCH */

async function getSearch(title) {
    const response = await axiosConfig.post(
        `/search/${title}`
    );
    const results = await response.data;
    return results;
}

async function searchForm(form) {
    form.preventDefault();
    if (form.target[0].value) {
        let child = this.results_searchEl.current.lastChild;
        while (child) {
            this.results_searchEl.current.removeChild(child);
            child = this.results_searchEl.current.lastElementChild;
        }
        this.setLoader();
        const results = await this.getSearch(form.target[0].value);
        console.log(results);
        if (results.length === 0) {
            console.log("No results found");
            const newEl = document.createElement("h2");
            this.resultsContainer.current.appendChild(newEl);
            this.removeLoader();
            newEl.innerHTML = "No results found";
        } else {
            this.removeLoader();
            const IDs = [];
            results.forEach((result) => {
                result = result.result;
                this.results_searchEl.current.innerHTML +=
                `<div class="${SelectStyle.card} card">
                    <img src=${result.song_art_image_url} class="${SelectStyle.cardImgTop} card-img-top" alt="cover"></img>
                    <div class="card-body">
                        <h5 class="${SelectStyle.cardTitle} card-title">${result.full_title}</h5>
                        <div class="${SelectStyle.textContainer} text-container">
                            <p class="card-text"><strong>Título:</strong> ${result.title}</p>
                            <p class="card-text"><strong>Artista:</strong> ${result.primary_artist.name}</p>
                        </div>
                        <input type="checkbox" class="btn-check" id=${result.id} autocomplete="off" data-target=${result.id}></input>
                        <label id="label_${result.id}" class="btn btn-primary" for=${result.id}>Seleccionar</label>
                    </div>
                </div>`;
                IDs.push(result.id);
            });
            this.newResults(IDs);
        }
    } else {
        this.results_searchEl.current.innerHTML = "";
    }
}

function newResults(IDs) {
    IDs.forEach((id) => {
        const element = document.getElementById(id);
        element.addEventListener("click", this.doSelected);
    });
}

/* SELECT ITEM */

function doSelected(element) {
    const id = element.target.dataset.target; // ID del elemento seleccionado
    console.log('Item "N°' + id + '" seleccionado.'); // Log
    if (!this.state.selected) {
        this.setState({ selected: id }, () => {
            document
                .querySelector(`#label_${this.state.selected}`)
                .classList.add(`${SelectStyle.selected}`); // Agrega la clase "selected" al elemento seleccionado
        });
    } else if (this.state.selected !== id) {
        document
            .querySelector(`#label_${this.state.selected}`)
            .classList.remove(`${SelectStyle.selected}`); // Remueve la clase "selected" del elemento seleccionado
        document
            .querySelector(`#label_${id}`)
            .classList.add(`${SelectStyle.selected}`); // Agrega la clase "selected" al elemento seleccionado
        this.setState({ selected: id }); // Actualiza el estado
    }
}

/* LOADER */

function setLoader() {
    this.spinner.current.classList.remove(`${SelectStyle.hidden}`);
}

function removeLoader() {
    this.spinner.current.classList.add(`${SelectStyle.hidden}`);
}

/* BUTTONS */

function goNextStep() {
    if (this.state.selected) {
        axiosConfig.put('/updateCookie', {trackID: this.state.selected}).then((res) => {
            if(res.status !== 200){throw new Error("Error updating cookie on backend.")}
            window.location.href = `/start`;
        }).catch((err) => {
            console.log(err)
            alert("It couldn't be saved the selected track.")
        });
    } else {
        alert("Please select a track");
    }
}

function backToHome() {
    axiosConfig
        .delete('/delete')
        .then((res) => {
            window.location.href = "/";
        })
        .catch((err) => {
            window.location.href = "/";
        });
}

export {
    getResults,
    searchForm,
    doSelected,
    backToHome,
    goNextStep,
    setLoader,
    removeLoader,
    newResults,
    getSearch,
}