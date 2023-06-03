import React from "react";
import axios from "axios";
import SelectStyle from "./Select.module.css";
import DelayConfig from "../Config/DelayConfig.jsx";
import { MDBInput, MDBSpinner } from "mdb-react-ui-kit";
import * as controller from "./Controller/Select.controller.js";
axios.defaults.withCredentials = true;

class Select extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: [],
            results: [],
            selected: undefined,
        };
        /* REFS */
        this.fetchResults = React.createRef();
        this.spinner = React.createRef();
        this.resultsDOM = React.createRef();
        this.results_searchEl = React.createRef();
        this.resultsContainer = React.createRef();
        /* FUNCTIONS */
        this.setLoader = controller.setLoader.bind(this);
        this.doSelected = controller.doSelected.bind(this);
        this.searchForm = controller.searchForm.bind(this);
        this.goNextStep = controller.goNextStep.bind(this);
        this.backToHome = controller.backToHome.bind(this);
        this.getResults = controller.getResults.bind(this);
        this.removeLoader = controller.removeLoader.bind(this);
        this.newResults = controller.newResults.bind(this);
        this.getSearch = controller.getSearch.bind(this);
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_URL}/select`)
            .then((res) => {
                console.log(res.data);
                this.fetchResults.current.style.display = "none";
                this.setState({ response: res.data }, () => {
                    this.setState({ results: this.getResults() });
                });
            })
            .catch((err) => {
                alert("Error while fetching data, please try again later");
                // window.location.href = err.response.data.returnTo;
            });
    }

    render() {
        const { globalConfigs } = this.props;
        const { setGlobalConfigs } = this.props;

        return (
            <div className={SelectStyle.contentResults}>
                <DelayConfig globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />
                <h1 className={SelectStyle.titles}>
                    SELECIONA LA MÚSICA QUE DESEAS SINCRONIZAR
                </h1>
                <div className={SelectStyle.container + " container"}>
                    <div ref={this.resultsDOM} className={SelectStyle.cardColumns}>
                        {this.state.results}
                        <div ref={this.fetchResults} className={SelectStyle.fetchResults}>
                            <h2>Buscando coindicendias...</h2>
                            <MDBSpinner
                                className={
                                    SelectStyle.spinner +
                                    " mx-2 " +
                                    SelectStyle.hidden
                                }
                                color="info"
                                style={{display: "block"}}
                            ></MDBSpinner>
                        </div>
                    </div>
                    <h2 className={SelectStyle.titles}>
                        ¿No encuentras lo que buscas?
                    </h2>
                    <div className={SelectStyle.searchContainer}>
                        <form onSubmit={this.searchForm}>
                            <div className="input-group">
                                <div className="form-outline">
                                    <MDBInput
                                        type="search"
                                        label="Search"
                                        name="search_input"
                                        id="search-lyric"
                                    ></MDBInput>
                                </div>
                                <button
                                    type="submit"
                                    name="search"
                                    className={
                                        SelectStyle.btnSearch +
                                        " btn btn-primary"
                                    }
                                >
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </form>
                    </div>
                    <div
                        className="sub-container"
                        ref={this.resultsContainer}
                        id="results"
                    >
                        <MDBSpinner
                            className={
                                SelectStyle.spinner +
                                " mx-2 " +
                                SelectStyle.hidden
                            }
                            color="info"
                            ref={this.spinner}
                        ></MDBSpinner>
                        <div
                            className={SelectStyle.cardColumns}
                            ref={this.results_searchEl}
                            id="results-search"
                        ></div>
                    </div>
                    <div className={SelectStyle.options}>
                        <button
                            type="button"
                            className="btn btn-warning"
                            id="previous"
                            onClick={this.backToHome}
                        >
                            Regresar
                        </button>
                        <button
                            type="button"
                            className="btn btn-success"
                            id="next"
                            onClick={this.goNextStep}
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Select;
