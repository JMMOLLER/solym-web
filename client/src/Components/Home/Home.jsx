import React from "react";
import HomeStyle from "./Home.module.css";
import ProgressBar from "react-bootstrap/ProgressBar";
import * as controller from "./Controller/Home.controller.js";
import DelayConfig from "../Config/DelayConfig.jsx";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            now: 0,
        };
        this.progressDiv = React.createRef();
        this.btnSubmit = React.createRef();
        this.btnInput = React.createRef();
        this.loaderDiv = React.createRef();
        this.mainContent = React.createRef();
        this.containerDiv = React.createRef();
        // FUNCTIONS
        this.sendFile = controller.sendFile.bind(this);
        this.enableSubmit = controller.enableSubmit.bind(this);
        this.delete_cookie = controller.delete_cookie.bind(this);
    }

    componentDidMount() {
        this.delete_cookie("Symly");
        this.delete_cookie("selectedTrack");
        this.btnSubmit.current.setAttribute("disabled", "disabled");

        this.btnInput.current.addEventListener("change", this.enableSubmit);
    }

    componentDidUpdate() {
        document.getElementsByClassName("progress-bar")[0].innerHTMLL = `${this.state.now}%`;
        if(this.state.now === 100)
            setTimeout(() => {
                document.getElementsByClassName("progress-bar")[0].innerHTML = `Processing...`;
            }, 500);
    }

    render() {
        const { globalConfigs } = this.props;
        const { setGlobalConfigs } = this.props;

        return (
            <>
                <div className="container" ref={this.containerDiv}>

                    <div className={HomeStyle.content} ref={this.mainContent}>
                        <h1>Uploaded File</h1>

                        <form action="/select" onSubmit={(e) => {this.sendFile(e)}}>
                            <label htmlFor="song" style={{display:"none"}}>Song:</label>
                            <input
                                type="file"
                                ref={this.btnInput}
                                name="song"
                                id="song"
                                accept=".mp3, .flac"
                            ></input>
                            <button type="submit" ref={this.btnSubmit}>
                                Enviar
                            </button>
                        </form>
                    </div>

                    <div className="progressBar desactivate" ref={this.loaderDiv}>
                        <ProgressBar
                            animated={true}
                            ref={this.progressDiv}
                            style={{ height: "20px" }}
                            now={this.state.now}
                            label={`${this.state.now}%`}
                        />
                    </div>

                </div>
                <DelayConfig globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />
            </>
        );
    }
}

export default Home;
