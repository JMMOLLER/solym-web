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
            buttonHidden: true,
            formHasBeenSent: false,
        };
        this.dropZone = React.createRef();
        this.btnInput = React.createRef();
        this.loaderDiv = React.createRef();
        this.btnSubmit = React.createRef();
        this.progressDiv = React.createRef();
        this.mainContent = React.createRef();
        this.containerDiv = React.createRef();
        this.textDropZone = React.createRef();
        // FUNCTIONS
        this.sendFile = controller.sendFile.bind(this);
        this.enableEvents = controller.enableEvents.bind(this);
        this.enableSubmit = controller.enableSubmit.bind(this);
        this.delete_cookie = controller.delete_cookie.bind(this);
        this.changeContent = controller.changeContent.bind(this);
        this.resetUploadContent = controller.resetUploadContent.bind(this);
    }

    componentDidMount() {
        this.enableEvents();
        this.delete_cookie("Solym");
        this.delete_cookie("selectedTrack");
        this.btnSubmit.current.setAttribute("disabled", "disabled");
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
                <div className={HomeStyle.uploadContainer} ref={this.containerDiv}>

                    <div className={HomeStyle.content} ref={this.mainContent}>

                        <form 
                            action="/select" 
                            className={HomeStyle.formContainer} 
                            ref={this.dropZone}
                        >
                            <label htmlFor="song" style={{display:"none"}}>Song:</label>
                            <input
                                className={HomeStyle.inputZone}
                                type="file"
                                ref={this.btnInput}
                                name="song"
                                accept=".mp3, .aac, .ogg, .alac, .flac"
                            ></input>

                            <div className={HomeStyle.drawDropZone} onClick={(e) => {this.btnInput.current.click()}}>

                                <img src="./download_icon.png" alt="icon" />
                                <p ref={this.textDropZone}>Choose <strong>your music file</strong> or drag it here.</p>
                                <button type="submit" ref={this.btnSubmit} className={HomeStyle.btnSubmit} hidden={this.state.buttonHidden}>Enviar</button>

                            </div>
                            
                        </form>

                    </div>

                </div>

                <div className={"progressBar desactivate "+HomeStyle.ProgressBarContainer} ref={this.loaderDiv}>
                    <ProgressBar
                        animated={true}
                        ref={this.progressDiv}
                        style={{ height: "20px" }}
                        now={this.state.now}
                        label={`${this.state.now}%`}
                    />
                    <p>We are processing your file, please be patient...</p>
                </div>
                <DelayConfig globalConfigs={globalConfigs} setGlobalConfigs={setGlobalConfigs} />
            </>
        );
    }
}

export default Home;
