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

    updateDisplay();
}

function clamp(value, min, max) {

    return Math.min(
        max,
        Math.max(min, value)
    );
}

function handleOrientation(event) {

    if (
        event.beta == null ||
        event.gamma == null
    ) return;

    /*
     * 横向き固定前提
     * ROLL = 左右傾き
     * PITCH = 前後傾き
     */

    rawRoll = event.gamma;
    rawPitch = event.beta;

    currentRoll =
        clamp(
            rawRoll - baseRoll,
            -90,
            90
        );

    currentPitch =
        clamp(
            rawPitch - basePitch,
            -90,
            90
        );

    updateDisplay();
}

function updateDisplay() {

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

        notice.style.display =
            "flex";

    } else {

        notice.style.display =
            "none";

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
