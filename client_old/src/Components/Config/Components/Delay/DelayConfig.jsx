import React, { useRef, useEffect } from "react";
import "./controller/config.js";
import SelectionStyle from "./Selection.module.css";

const ConfigEditor = ({ globalConfigs, setGlobalConfigs }) => {
    const thumb = useRef(null);
    const selectDOM = useRef(null);
    const childThumb = useRef(null);
    const coverRangeInput = useRef(null);

    const handleChange = () => {
        const delay = selectDOM.current.value / 100;
        setGlobalConfigs({ delay, bgVideo: globalConfigs.bgVideo });
    };

    useEffect(() => {
        const rangeInput = selectDOM.current;
        const rangeCover = coverRangeInput.current;
        const thumbCover = thumb.current;
        const min = rangeInput.min || 0;
        const max = rangeInput.max || 100;
        drawInput();

        rangeInput.addEventListener("input", drawInput);

        rangeInput.addEventListener("focus", () => {
            thumbCover.style.display = "block";
            rangeCover.style.setProperty("display", "block");
            rangeCover.style.setProperty("animation", `${SelectionStyle.fadeIn} 0.2s ease-in forwards`);
        });

        rangeInput.addEventListener("blur", () => {
            rangeCover.style.setProperty("animation", `${SelectionStyle.fadeOut} 0.2s ease-out forwards`);
            setTimeout(() => {
                rangeCover.style.removeProperty("display", "block");
            }, 200);
        });



        function getCalc(){
            return `calc(${((rangeInput.value - min) / (max - min)) * 100}% - ${getThumbOffset(rangeInput.value) / 2}px)`
        }

        function getCalcCover(){
            return `calc(${((rangeInput.value - min) / (max - min)) * 100}% - ${getThumbOffset(rangeInput.value) / 10}px)`;
        }

        function drawInput(){
            drawHoverThumb(rangeInput.value / 100);
            drawCoverThumb();
        }

        function drawHoverThumb(value) {
            rangeCover.innerHTML = value;
            rangeCover.style.left = getCalc();
            rangeCover.style.left = (getComputedStyle(rangeCover).left).replace("px", "") - 24 + "px";
        }
        
        function drawCoverThumb() {
            thumbCover.style.left = rangeCover.style.left;
            childThumb.current.style.width = getCalcCover();
        }

        function getThumbOffset(value) {
            let thumbOffset = rangeInput.getBoundingClientRect().width * 0.03;
            if (value < 100) {
                thumbOffset -= (100 - value) * 0.35; // mientras mas grande sea el multiplicador, mas se acerca a la derecha
            }
            return thumbOffset;
        }
    }, []);

    return (
        <div className={SelectionStyle.containerDelay}>
            <span className={SelectionStyle.spanValue} ref={coverRangeInput}></span>
            <span className={SelectionStyle.cover} ref={childThumb}></span>
            <span className={SelectionStyle.thumb} ref={thumb}><span className={SelectionStyle.childThumb}></span></span>
            <input
                type="range"
                name="selectDelay"
                className={SelectionStyle.delayConfig}
                defaultValue={globalConfigs.delay * 100}
                onChange={handleChange}
                ref={selectDOM}
                aria-label="label for the select"
                id="selectDelay"
                step={0.5}
            />
        </div>
    );
};

export default ConfigEditor;
