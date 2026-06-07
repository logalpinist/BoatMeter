let baseRoll = 0;
let basePitch = 0;

let lastRoll = 0;
let lastPitch = 0;

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

    // 👉 “今表示されてる値”をそのまま基準にする
    baseRoll = currentRoll;
    basePitch = currentPitch;
}

function getIsLandscape() {

    if (screen.orientation && screen.orientation.angle !== undefined) {
        return Math.abs(screen.orientation.angle) === 90;
    }

    return window.innerWidth > window.innerHeight;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let beta = event.beta;
        let gamma = event.gamma;

        const isLandscape = getIsLandscape();

        let roll, pitch;

        if (!isLandscape) {
            roll = gamma;
            pitch = beta;
        } else {
            roll = beta;
            pitch = -gamma;
        }

        lastRoll = roll;
        lastPitch = pitch;

        // 🎯 表示値（ここが唯一の正解ソース）
        currentRoll = roll - baseRoll;
        currentPitch = pitch - basePitch;

        update("rollBoat", currentRoll);
        update("pitchBoat", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}

function update(id, angle) {

    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
