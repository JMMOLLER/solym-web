const config = {
    delay: 0.15,
};

function changeDelayValue(e) {
    let delay = 0.15;
    if (e.target.value === "0") delay = 0;
    if (e.target.value === "1") delay = 0.08;
    else if (e.target.value === "2") delay = 0.1;
    else if (e.target.value === "3") delay = 0.15;
    else if (e.target.value === "4") delay = 0.2;
    else if (e.target.value === "5") delay = 0.25;
    else if (e.target.value === "6") delay = 0.3;
    this.config.delay = delay;
    console.log("Delay cambiado a: "+this.config.delay+"ms");
}

export { config, changeDelayValue };
