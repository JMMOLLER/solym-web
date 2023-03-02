import React from 'react';
import axios from 'axios';
import { MDBInput } from "mdb-react-ui-kit";
import selectScript from './Scripts/select.js';
import './Styles/select.css';


class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            selected: undefined,
        };
        this.results_searchEl = React.createRef();
        this.resultsContainer = React.createRef();
        this.doSelected = this.doSelected.bind(this);
        this.searchForm = this.searchForm.bind(this);
        this.setLoader = this.setLoader.bind(this);
        this.goNextStep = this.goNextStep.bind(this);
    }

    componentDidMount() {
        selectScript();
    }

    doSelected(element) {
        const id = element.target.dataset.target;
        console.log("Item \"N°"+id+"\" seleccionado.");
        if(!this.state.selected) {
            this.setState({selected: id}, () => {
                document.querySelector(`#label_${this.state.selected}`).classList.add("selected");
            });
        }else if (this.state.selected !== id) {
            document.querySelector(`#label_${this.state.selected}`).classList.remove("selected");
            document.querySelector(`#label_${id}`).classList.add("selected");
            this.setState({selected: id});
        }
    }

    goNextStep() {
        if (this.state.selected) {
            document.cookie = `selectedTrack={id:${this.state.selected}}`;
            window.location.href = `/start`;
        } else {
            alert("Please select a track");
        }
    }

    setLoader(){
        const loader = document.createElement("div");
        loader.classList.add("loader");
        loader.style = "margin-top: 40px;margin-bottom: 40px;";
        const span = document.createElement("span");
        span.classList.add("loader");
        loader.appendChild(span);
        this.resultsContainer.current.insertBefore(loader, this.results_searchEl.current);
    }

    removeLoader(){
        const loader = document.querySelector(".loader");
        loader.remove();
    }

    async searchForm(form){
        form.preventDefault();
        if (form.target[0].value) {
            let child = this.results_searchEl.current.lastChild;
            while(child){
                this.results_searchEl.current.removeChild(child)
                child = this.results_searchEl.current.lastElementChild;
            }
            this.setLoader()
            const results = await this.getSearch(form.target[0].value);
            console.log(results);
            if (results.length === 0) {
                console.log("No results found");
                const newEl = document.createElement("h2");
                this.resultsContainer.current.appendChild(newEl);
                this.removeLoader();
                newEl.innerHTML = "No results found";
            }else{
                this.removeLoader();
                const IDs = [];
                results.forEach((result) => {
                    result = result.result;
                    this.results_searchEl.current.innerHTML +=
                    `<div class="card">
                        <img src=${result.header_image_url} class="card-img-top" alt="cover"></img>
                        <div class="card-body">
                            <h5 class="card-title">${result.full_title}</h5>
                            <div class="text-container">
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
        }else{
            alert("Please enter a title of music to search");
        }
    }

    newResults(IDs) {
        IDs.forEach((id) => {
            const element = document.getElementById(id);
            element.addEventListener("click", this.doSelected);
        });
    }

    async getSearch(title) {
        const response = await axios.post(`/api/search/${title}`);
        const results = await response.data;
        return results;
    }

    componentWillMount() {
        axios.get('/api/select').then((res) => {
            console.log(res.data);
            const responseURL = new URL(res.request.responseURL);
            if(responseURL.pathname !== '/api/select') {
                window.location.href = res.request.responseURL;
            }
            this.setState({response: res.data});
        });
    }

    getResults() {
        console.log("enviando resultados");
        if(this.state.response.length === 0) {
            return <h1>No se puedo encontrar resultados automaticamente</h1>
        }else{
            return this.state.response.map((item) => 
            <div class="card">
                <img src={item.result.header_image_url} class="card-img-top" alt="cover"></img>
                <div class="card-body">
                    <h5 class="card-title">{item.result.full_title}</h5>
                    <div class="text-container">
                        <p class="card-text"><strong>Título: </strong>{item.result.title}</p>
                        <p class="card-text"><strong>Artista: </strong>{item.result.primary_artist.name}</p>
                    </div>
                    <input type="checkbox" class="btn-check" id={item.result.id} autocomplete="off" data-target={item.result.id} onChange={this.doSelected}></input>
                    <label id={"label_"+item.result.id} class="btn btn-primary" for={item.result.id}>Seleccionar</label>
                </div>
            </div>
        )
        }
    }

    render(){
        return (
            <div>
                <h1 class="titles">SELECIONA LA MÚSICA QUE DESEAS SINCRONIZAR</h1>
                <div class="container">
                    <div class="card-columns">
                        {this.getResults()}
                    </div>
                    <h2 class="titles">¿No encuentras lo que buscas?</h2>
                    <div class="search-container">
                        <form onSubmit={this.searchForm}>
                            <div class="input-group">
                                <div class="form-outline">
                                    <MDBInput type="search" label="Search" name="search_input" id="search-lyric"></MDBInput>
                                </div>
                                <button type="button" name="search" id="btn-search" class="btn btn-primary">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div class="sub-container" ref={this.resultsContainer} id="results">

                        <div class="card-columns" ref={this.results_searchEl} id="results-search"></div>
                    </div>
                    <div class="options">
                        <button type="button" class="btn btn-warning" id="previous">Regresar</button>
                        <button type="button" class="btn btn-success" id="next" onClick={this.goNextStep}>Continuar</button>
                    </div>
                </div>
            </div>
        );
    };
}

export default Select;