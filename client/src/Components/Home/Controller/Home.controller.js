import axios from "axios";
const axiosConfig = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    withCredentials: true,
});

function enableSubmit() {
    this.btnSubmit.current.removeAttribute("disabled");
    this.setState({ buttonHidden: false }); // Show submit button
}

function changeContent(showLoader) {
    if(showLoader) {
        this.containerDiv.current.style.display = "none"; // Hide drop zone
        this.loaderDiv.current.style.display = "block"; // Show loader
    } else {
        this.containerDiv.current.style.display = "block"; // Show drop zone
        this.loaderDiv.current.style.display = "none"; // Hide loader
        this.btnInput.current.removeAttribute("disabled"); // Enable submit input
        this.btnSubmit.current.removeAttribute("disabled"); // Enable submit button
    }
}

function resetUploadContent() {
    this.btnInput.current.value = "";
    this.textDropZone.current.innerHTML = "Choose <strong>your music file</strong> or drag it here.";
    this.setState({ now: 0, buttonHidden: true }, () => {this.changeContent(false);});
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

    axiosConfig.post('/uploadFile', formData, {
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
        console.log("Response: ");
        console.log(res);
        if (res.status === 200) {
            axiosConfig.get(`/uploadFileInfo/${res.data.id}`).then((res) => {
                if(res.status === 200)
                    document.location.href = "/select";
            }).catch((err) => {
                console.log(err);
                alert("Error uploading file. Please try again.");
                this.resetUploadContent();
            });
        } else {
            alert("Error uploading file. Please try again.");
            this.resetUploadContent();
        }
    })
    .catch((err) => {
        console.log(err);
        alert("Error uploading file. Please try again.");
        this.resetUploadContent();
    });
}

function delete_cookie(name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function enableEvents() {

    const fileInput = this.btnInput.current; // Get file input
    const dropZone = this.dropZone.current; // Get drop zone
    const acceptContent = this.btnInput.current.getAttribute("accept").split(", "); // Get accepted extensions

    fileInput.addEventListener("change", (e) => {
        this.enableSubmit(); // Enable submit button
        this.textDropZone.current.innerHTML = "You have selected <strong>"+e.target.files[0].name+"</strong> file."; // Set text element to drop zone
    }); // Add event listener to file input

    this.btnSubmit.current.addEventListener("click", (e) => {
        this.btnInput.current.setAttribute("disabled", "disabled"); // Disable file input
    }); // Add event listener to submit button

    this.dropZone.current.addEventListener("submit", (e) => {
        if(this.state.formHasBeenSent){
            return e.preventDefault(); // Prevent default behavior (Prevent file from being opened)
        }
        this.setState({formHasBeenSent: true}, () => {
            this.sendFile(e); // Send file
            this.changeContent(true); // Change content
        });
    }); // Add event listener to drop zone

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault(); // Prevent default behavior (Prevent file from being opened)
        e.dataTransfer.dropEffect = "copy"; // Set the dropEffect to copy
    });

    dropZone.addEventListener("drop", (e) => {
        e.preventDefault(); // Prevent default behavior (Prevent file from being opened)

        if(e.dataTransfer.files.length > 1) { // Validate file quantity
            return alert("Please drop only one file.") // If more than one file
        }
        if(!validateExtension(e.dataTransfer.files[0].name)) { // Validate file extension
            return alert("Please drop a valid file."); // If invalid extension
        }

        fileInput.files = e.dataTransfer.files // Set file input files
        this.btnSubmit.current.removeAttribute("disabled"); // Enable submit button
        this.btnSubmit.current.click(); // Click submit button
    });

    function getExtension(filename) {
        var parts = filename.split("."); // Split filename by dot
        return "."+parts[parts.length - 1]; // Return extension
    }

    function validateExtension(filename) {
        return acceptContent.includes(getExtension(filename)); // Return if extension is valid
    }

}

export {
    enableSubmit,
    sendFile,
    delete_cookie,
    enableEvents,
    changeContent,
    resetUploadContent,
}