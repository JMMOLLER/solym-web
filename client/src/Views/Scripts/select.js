const selectScript = () => {
    const previous = document.getElementById("previous");

    previous.addEventListener("click", async () => {
        await fetch("/api/delete", {
            method: "DELETE",
        }).then((res) => {
            window.location.href = `/`;
        });
    });

};

export default selectScript;