
const myScript = () => {
    const btnSubmit = document.getElementById('btn-submit');
    const btnInput = document.getElementById('song-input');
    btnSubmit.setAttribute("disabled","disabled")
    
    btnInput.addEventListener('change', enableSubmit);
    
    btnSubmit.addEventListener('click', sendFile);
    
    function enableSubmit() {
        btnSubmit.removeAttribute("disabled")
    }
    
    async function sendFile() {
        btnSubmit.setAttribute("disabled","disabled")
        btnInput.setAttribute("disabled","disabled")
        document.querySelector("#loader").classList.remove("desactivate");
        document.querySelector("#content").classList.add("activate");
        document.querySelector("#container").classList.add("loading");
        const file = btnInput.files[0];
        console.log(file);
        const formData = new FormData();
        formData.append('song', file);
        const response = await fetch('/api/uploadFile', {
            method: 'POST',
            body: formData
        });
        if(response.status===200){
            document.location.href = '/select';
        }else{
            alert("Error uploading file. Please try again.")
        }
    }
}

export default myScript;