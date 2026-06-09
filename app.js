let rollOffset = 0;
let pitchOffset = 0;

function requestPermission(){

    if(
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ){

        DeviceOrientationEvent.requestPermission()
        .then(permissionState => {

            if(permissionState === "granted"){
                window.addEventListener(
                    "deviceorientation",
                    handleOrientation
                );
            }

        })
        .catch(console.error);

    }else{

        window.addEventListener(
            "deviceorientation",
            handleOrientation
        );

    }

}

function resetZero(){

    currentRollZero = currentRoll;
    currentPitchZero = currentPitch;

}

let currentRoll = 0;
let currentPitch = 0;

let currentRollZero = 0;
let currentPitchZero = 0;

function handleOrientation(event){

    currentRoll = event.gamma || 0;
    currentPitch = event.beta || 0;

    let roll = currentRoll - currentRollZero;
    let pitch = currentPitch - currentPitchZero;

    document.getElementById("rollValue").innerText =
        roll.toFixed(1) + "°";

    document.getElementById("pitchValue").innerText =
        pitch.toFixed(1) + "°";

    const boat = document.getElementById("boat");

    boat.style.transform =
        `translate(-50%,-50%)
         rotate(${roll}deg)
         translateY(${pitch}px)`;

}
