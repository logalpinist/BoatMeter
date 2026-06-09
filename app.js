let baseRoll = 0;
let basePitch = 0;

let currentRoll = 0;
let currentPitch = 0;

function startSensor() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission()
            .then(res => {
                if (res === "granted") {
                    attach();
                }
            });
    } else {
        attach();
    }
}

function isLandscape() {
    return Math.abs(window.orientation) === 90;
}

function resetZero() {
    baseRoll = currentRoll;
    basePitch = currentPitch;
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let rollRaw = event.gamma;
        let pitchRaw = event.beta;

        let roll;
        let pitch;

        if (isLandscape()) {
            roll = pitchRaw;
            pitch = -rollRaw;
        } else {
            roll = rollRaw;
            pitch = pitchRaw;
        }

        currentRoll = roll - baseRoll;
        currentPitch = pitch - basePitch;

        document.getElementById("rollBoat").style.transform =
            `rotate(${currentRoll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${currentPitch}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}
