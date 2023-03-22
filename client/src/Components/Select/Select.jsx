import React from 'react';
import axios from 'axios';
import { MDBInput, MDBSpinner } from "mdb-react-ui-kit";
import SelectStyle from './Select.module.css';
axios.defaults.withCredentials = true;

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            selected: undefined,
        };
        /* REFS */
        this.spinner = React.createRef();
        this.results_searchEl = React.createRef();
        this.resultsContainer = React.createRef();
        /* FUNCTIONS */
        this.doSelected = this.doSelected.bind(this);
        this.searchForm = this.searchForm.bind(this);
        this.setLoader = this.setLoader.bind(this);
        this.goNextStep = this.goNextStep.bind(this);
    }

    doSelected(element) {
        const id = element.target.dataset.target;
        console.log("Item \"N°"+id+"\" seleccionado.");
        if(!this.state.selected) {
            this.setState({selected: id}, () => {
                document.querySelector(`#label_${this.state.selected}`).classList.add(`${SelectStyle.selected}`);
            });
        }else if (this.state.selected !== id) {
            document.querySelector(`#label_${this.state.selected}`).classList.remove(`${SelectStyle.selected}`);
            document.querySelector(`#label_${id}`).classList.add(`${SelectStyle.selected}`);
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
        this.spinner.current.classList.remove(`${SelectStyle.hidden}`);
    }

    removeLoader(){
        this.spinner.current.classList.add(`${SelectStyle.hidden}`);
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
                    `<div class="${SelectStyle.card} card">
                        <img src=${result.header_image_url} class="${SelectStyle.cardImgTop} card-img-top" alt="cover"></img>
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
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/search/${title}`);
        const results = await response.data;
        return results;
    }

    componentWillMount() {
        axios.get(`${process.env.REACT_APP_API_URL}/select`).then((res) => {
            console.log(res.data);
            this.setState({response: res.data});
        }).catch((err) => {
            window.location.href = err.response.data.returnTo;
        });
    }

    getResults() {
        console.log("enviando resultados");
        if(this.state.response.length === 0) {
            return <h1>No se puedo encontrar resultados automaticamente</h1>
        }else{
            return this.state.response.map((item) => 
            <div className={SelectStyle.card+' card'} key={item.result.id}>
                <img src={item.result.header_image_url} className={SelectStyle.cardImgTop+" card-img-top"} alt="cover"></img>
                <div className="card-body">
                    <h5 className={SelectStyle.cardTitle+"card-title"}>{item.result.full_title}</h5>
                    <div className={SelectStyle.textContainer+" text-container"}>
                        <p className="card-text"><strong>Título: </strong>{item.result.title}</p>
                        <p className="card-text"><strong>Artista: </strong>{item.result.primary_artist.name}</p>
                    </div>
                    <input type="checkbox" className="btn-check" id={item.result.id} autoComplete="off" data-target={item.result.id} onChange={this.doSelected}></input>
                    <label id={"label_"+item.result.id} className="btn btn-primary" htmlFor={item.result.id}>Seleccionar</label>
                </div>
            </div>
        )
        }
    }

    backToHome() {
        axios.delete(`${process.env.REACT_APP_API_URL}/delete`).then((res) => {
            window.location.href = "/";
        }).catch((err) => {
            window.location.href = "/";
        });
    }

    render(){
        return (
            <div className={SelectStyle.contentResults}>
                <h1 className={SelectStyle.titles}>SELECIONA LA MÚSICA QUE DESEAS SINCRONIZAR</h1>
                <div className={SelectStyle.container+' container'}>
                    <div className={SelectStyle.cardColumns}>
                        {this.getResults()}
                    </div>
                    <h2 className={SelectStyle.titles}>¿No encuentras lo que buscas?</h2>
                    <div className={SelectStyle.searchContainer}>
                        <form onSubmit={this.searchForm}>
                            <div className="input-group">
                                <div className="form-outline">
                                    <MDBInput type="search" label="Search" name="search_input" id="search-lyric"></MDBInput>
                                </div>
                                <button type="submit" name="search" className={SelectStyle.btnSearch+" btn btn-primary"}>
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="sub-container" ref={this.resultsContainer} id="results">
                        <MDBSpinner className={SelectStyle.spinner+' mx-2 '+SelectStyle.hidden} color='info' ref={this.spinner}></MDBSpinner>
                        <div className={SelectStyle.cardColumns} ref={this.results_searchEl} id="results-search"></div>
                    </div>
                    <div className={SelectStyle.options}>
                        <button type="button" className="btn btn-warning" id="previous" onClick={this.backToHome}>Regresar</button>
                        <button type="button" className="btn btn-success" id="next" onClick={this.goNextStep}>Continuar</button>
                    </div>
                </div>
            </div>
        );
    };
}

export default Select;