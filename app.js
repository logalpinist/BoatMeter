let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

let isLandscapeMode = false;

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

function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

/* 🔥 リセット修正版 */
function resetZero() {

    isLandscapeMode = isLandscape();

    if (!isLandscapeMode) {
        baseRoll = rollRaw;
        basePitch = pitchRaw;
    } else {
        // 横は軸変換後の状態で保存
        baseRoll = pitchRaw;
        basePitch = -rollRaw;
    }
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        rollRaw = event.gamma;
        pitchRaw = event.beta;

        let roll, pitch;

        if (!isLandscape()) {
            roll = rollRaw;
            pitch = pitchRaw;
        } else {
            roll = pitchRaw;
            pitch = -rollRaw;
        }

        let r = roll - baseRoll;
        let p = pitch - basePitch;

        document.getElementById("rollBoat").style.transform =
            `translate(-50%, -50%) rotate(${r}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `translate(-50%, -50%) rotate(${p}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(r)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(p)}°`;
    });
}
