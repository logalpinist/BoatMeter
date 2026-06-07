let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

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

function isLandscape() {
    return window.matchMedia("(orientation: landscape)").matches;
}

function resetZero() {
    baseRoll = rollRaw;
    basePitch = pitchRaw;
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        rollRaw = event.gamma;
        pitchRaw = event.beta;

        let roll, pitch;

        // 🔥 常に現在の向きで切り替え
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
            `rotate(${r}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${p}deg)`;

        document.getElementById("rollValue").innerText =
            Math.round(r) + "°";

        document.getElementById("pitchValue").innerText =
            Math.round(p) + "°";
    });
}
