let rollOffset = 0;
let pitchOffset = 0;

function requestPermission(){

    if(
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ){

        DeviceOrientationEvent.requestPermission()
        .then(response=>{

            if(response==="granted"){
                startSensor();
            }

        });

    }else{
        startSensor();
    }
}

function resetLevel(){

    navigator.vibrate?.(50);

    if(lastRoll !== null){
        rollOffset = lastRoll;
    }

    if(lastPitch !== null){
        pitchOffset = lastPitch;
    }
}

let lastRoll = null;
let lastPitch = null;

function startSensor(){

    window.addEventListener(
        "deviceorientation",
        event=>{

            let roll = event.gamma || 0;
            let pitch = event.beta || 0;

            roll -= rollOffset;
            pitch -= pitchOffset;

            lastRoll = event.gamma || 0;
            lastPitch = event.beta || 0;

            document.getElementById(
                "rollValue"
            ).innerText = roll.toFixed(1);

            document.getElementById(
                "pitchValue"
            ).innerText = pitch.toFixed(1);

            document.getElementById(
                "rollBoat"
            ).style.transform =
            `translate(-50%,-50%) rotate(${roll}deg)`;

            document.getElementById(
                "pitchBoat"
            ).style.transform =
            `translate(-50%,-50%) rotate(${pitch}deg)`;
        }
    );
}
