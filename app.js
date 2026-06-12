let baseRoll = 0;
let basePitch = 0;

let rawRoll = 0;
let rawPitch = 0;

let currentRoll = 0;
let currentPitch = 0;

let sensorAttached = false;

function startSensor(){

    if(sensorAttached) return;

    if(
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ){

        DeviceOrientationEvent.requestPermission()
            .then(result => {

                if(result === "granted"){

                    attachSensor();
                    sensorAttached = true;

                }

            });

    }else{

        attachSensor();
        sensorAttached = true;

    }
}

function attachSensor(){

    window.addEventListener(
        "deviceorientation",
        handleOrientation
    );
}

function resetZero(){

    baseRoll = rawRoll;
    basePitch = rawPitch;

    currentRoll = 0;
    currentPitch = 0;

    updateDisplay();
}

function clamp(value,min,max){

    return Math.min(
        max,
        Math.max(min,value)
    );
}

function handleOrientation(event){

    if(
        event.beta == null ||
        event.gamma == null
    ) return;

    /*
        横画面固定前提。
        まずは安定重視。
        開始後にリセットを押した姿勢を0°にする。
    */

    rawRoll = event.gamma;
    rawPitch = event.beta;

    currentRoll = clamp(
        rawRoll - baseRoll,
        -90,
        90
    );

    currentPitch = clamp(
        rawPitch - basePitch,
        -90,
        90
    );

    updateDisplay();
}

function updateDisplay(){

    const rollBoat =
        document.getElementById("rollBoat");

    const pitchBoat =
        document.getElementById("pitchBoat");

    const rollValue =
        document.getElementById("rollValue");

    const pitchValue =
        document.getElementById("pitchValue");

    if(rollBoat){
        rollBoat.style.transform =
            `rotate(${currentRoll}deg)`;
    }

    if(pitchBoat){
        pitchBoat.style.transform =
            `rotate(${currentPitch}deg)`;
    }

    if(rollValue){
        rollValue.innerText =
            `${Math.abs(Math.round(currentRoll))}°`;
    }

    if(pitchValue){
        pitchValue.innerText =
            `${Math.abs(Math.round(currentPitch))}°`;
    }
}

function updateOrientation(){

    const notice =
        document.getElementById("rotateNotice");

    if(!notice) return;

    if(window.innerHeight > window.innerWidth){

        notice.style.display = "flex";

    }else{

        notice.style.display = "none";

    }
}

window.addEventListener(
    "resize",
    updateOrientation
);

window.addEventListener(
    "orientationchange",
    updateOrientation
);

window.addEventListener(
    "load",
    () => {

        updateOrientation();
        updateDisplay();

    }
);
