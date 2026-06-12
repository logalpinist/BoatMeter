let rollOffset = 0;
let pitchOffset = 0;

let currentRoll = 0;
let currentPitch = 0;

function startSensor(){

    if(
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ){

        DeviceOrientationEvent
            .requestPermission()
            .then(permission => {

                if(permission === "granted"){
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

    rollOffset = currentRoll;
    pitchOffset = currentPitch;

}

function handleOrientation(event){

    if(
        event.beta === null ||
        event.gamma === null
    ){
        return;
    }

    let roll =
        event.gamma;

    let pitch =
        event.beta - 90;

    currentRoll = roll;
    currentPitch = pitch;

    roll -= rollOffset;
    pitch -= pitchOffset;

    roll = Math.max(
        -45,
        Math.min(45, roll)
    );

    pitch = Math.max(
        -45,
        Math.min(45, pitch)
    );

    document.getElementById(
        "rollValue"
    ).innerText =
        `${roll.toFixed(1)}°`;

    document.getElementById(
        "pitchValue"
    ).innerText =
        `${pitch.toFixed(1)}°`;

    const rollGroup =
        document.getElementById(
            "rollGroup"
        );

    rollGroup.style.transform =
        `rotate(${roll}deg)`;

    const pitchGroup =
        document.getElementById(
            "pitchGroup"
        );

    pitchGroup.style.transform =
        `translateY(${pitch * 1.8}px)`;

}
