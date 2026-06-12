let baseRoll = 0;
let basePitch = 0;

let rawRoll = 0;
let rawPitch = 0;

let currentRoll = 0;
let currentPitch = 0;

let sensorAttached = false;

function startSensor() {

    if (sensorAttached) return;

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(result => {

                if (result === "granted") {

                    attachSensor();
                    sensorAttached = true;

                }

            });

    } else {

        attachSensor();
        sensorAttached = true;

    }
}

function attachSensor() {

    window.addEventListener(
        "deviceorientation",
        handleOrientation
    );
}

function resetZero() {

    baseRoll = rawRoll;
    basePitch = rawPitch;

    currentRoll = 0;
    currentPitch = 0;

    document.getElementById(
        "rollValue"
    ).innerText = "0°";

    document.getElementById(
        "pitchValue"
    ).innerText = "0°";
}

function handleOrientation(event) {

    if (
        event.beta == null ||
        event.gamma == null
    ) return;

    let roll;
    let pitch;

    const angle =
        screen.orientation
            ? screen.orientation.angle
            : window.orientation || 0;

    if (angle === 90) {

        roll = event.beta;
        pitch = -event.gamma;

    } else if (
        angle === -90 ||
        angle === 270
    ) {

        roll = -event.beta;
        pitch = event.gamma;

    } else {

        roll = event.gamma;
        pitch = event.beta;

    }

    rawRoll = roll;
    rawPitch = pitch;

    currentRoll =
        rawRoll - baseRoll;

    currentPitch =
        rawPitch - basePitch;

    document.getElementById(
        "rollBoat"
    ).style.transform =
        `rotate(${currentRoll}deg)`;

    document.getElementById(
        "pitchBoat"
    ).style.transform =
        `rotate(${currentPitch}deg)`;

    document.getElementById(
        "rollValue"
    ).innerText =
        `${Math.abs(
            Math.round(currentRoll)
        )}°`;

    document.getElementById(
        "pitchValue"
    ).innerText =
        `${Math.abs(
            Math.round(currentPitch)
        )}°`;
}

function updateOrientation() {

    const notice =
        document.getElementById(
            "rotateNotice"
        );

    if (
        window.innerHeight >
        window.innerWidth
    ) {

        notice.style.display = "flex";

    } else {

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

updateOrientation();
