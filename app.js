let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

let currentRoll = 0;
let currentPitch = 0;

function requestPermission() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(res => {
                if (res === "granted") startSensor();
            });

    } else {
        startSensor();
    }
}

function resetZero() {

    baseRoll = rollRaw;
    basePitch = pitchRaw;

    // 👉 見た目も即リセット
    currentRoll = 0;
    currentPitch = 0;

    render("rollBoat", 0);
    render("pitchBoat", 0);

    document.getElementById("rollValue").innerText = "0°";
    document.getElementById("pitchValue").innerText = "0°";
}

function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        rollRaw = event.gamma;
        pitchRaw = event.beta;

        let roll = !isLandscape() ? rollRaw : pitchRaw;
        let pitch = !isLandscape() ? pitchRaw : -rollRaw;

        currentRoll = roll - baseRoll;
        currentPitch = pitch - basePitch;

        render("rollBoat", currentRoll);
        render("pitchBoat", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}

function render(id, angle) {
    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
