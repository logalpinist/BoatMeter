let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

let isLandscapeMode = false;

function startSensor() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission()
            .then(res => {
                if (res === "granted") attach();
            });
    } else {
        attach();
    }
}

function getMode() {
    return window.matchMedia("(orientation: landscape)").matches;
}

function resetZero() {
    // 🔥 現在のモードを固定して基準化
    isLandscapeMode = getMode();

    if (!isLandscapeMode) {
        baseRoll = rollRaw;
        basePitch = pitchRaw;
    } else {
        baseRoll = pitchRaw;
        basePitch = -rollRaw;
    }
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        rollRaw = event.gamma;
        pitchRaw = event.beta;

        // 🔥 重要：リセット時のモードを使う
        let roll, pitch;

        if (!isLandscapeMode) {
            roll = rollRaw;
            pitch = pitchRaw;
        } else {
            roll = pitchRaw;
            pitch = -rollRaw;
        }

        let r = roll - baseRoll;
        let p = pitch - basePitch;

        document.getElementById("rollBoat").style.transform =
            `rotate(${r}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${p}deg)`;

        document.getElementById("rollValue").innerText =
            Math.round(r) + "°";

        document.getElementById("pitchValue").innerText =
            Math.round(p) + "°";
    });
}
