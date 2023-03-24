import axios from "axios";

function enableSubmit() {
    this.btnSubmit.current.removeAttribute("disabled");
}

async function sendFile(e) {
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

function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export {
    enableSubmit,
    sendFile,
    delete_cookie,
}