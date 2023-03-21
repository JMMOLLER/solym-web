import React from "react";
import axios from "axios";
import ProgressBar from "react-bootstrap/ProgressBar";
import HomeStyle from "./Home.module.css";

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
        this.sendFile = this.sendFile.bind(this);
        this.enableSubmit = this.enableSubmit.bind(this);
    }

    componentDidMount() {
        this.delete_cookie("Symly");
        this.delete_cookie("selectedTrack");
        this.btnSubmit.current.setAttribute("disabled", "disabled");

        this.btnInput.current.addEventListener("change", this.enableSubmit);
    }

    enableSubmit() {
        this.btnSubmit.current.removeAttribute("disabled");
    }

    async sendFile(e) {
        e.preventDefault();
        this.btnSubmit.current.setAttribute("disabled", "disabled");
        this.btnInput.current.setAttribute("disabled", "disabled");

        this.loaderDiv.current.classList.remove("desactivate");
        this.mainContent.current.classList.add("activate");
        this.containerDiv.current.classList.add("loading");

        const file = this.btnInput.current.files[0];
        const formData = new FormData();
        formData.append("song", file);

        axios.post(`${process.env.REACT_APP_API_URL}/uploadFile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const { loaded, total } = progressEvent;

                    let percent = Math.floor((loaded * 100) / total);

                    this.setState({ now: percent });
                },
            })
            .then((res) => {
                if (res.status === 200) {
                    axios.get(`${process.env.REACT_APP_API_URL}/uploadFileInfo/${res.data.id}`).then((res) => {
                        if(res.status === 200)
                            document.location.href = "/select";
                    });
                } else {
                    alert("Error uploading file. Please try again.");
                }
            })
            .catch((err) => {
                console.log(err);
                alert("Error uploading file. Please try again.");
            });
    }

    componentDidUpdate() {
        this.progressDiv.current.style.width = `${this.state.now}%`;
        document.getElementsByClassName("progress-bar")[0].innerHTMLL = `${this.state.now}%`;
        if(this.state.now === 100)
            setTimeout(() => {
                document.getElementsByClassName("progress-bar")[0].innerHTML = `Processing...`;
            }, 500);
    }

    delete_cookie(name) {
        document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }

    render() {
        return (
            <div className="container" ref={this.containerDiv}>
                
                <div className={HomeStyle.content} ref={this.mainContent}>
                    <h1>Uploaded File</h1>

                    <form action="/select" onSubmit={(e) => {this.sendFile(e)}}>
                        <input
                            type="file"
                            ref={this.btnInput}
                            name="song"
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
        );
    }
}

export default Home;
