let baseRoll = 0;
let basePitch = 0;

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

/* 横判定 */
function isLandscape() {
    return Math.abs(window.orientation) === 90;
}

/* 🔥 リセットは“表示値ベース”でやる */
let currentRoll = 0;
let currentPitch = 0;

function resetZero() {
    baseRoll = currentRoll;
    basePitch = currentPitch;
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let rollRaw = event.gamma;
        let pitchRaw = event.beta;

        let roll, pitch;

        if (isLandscape()) {
            roll = pitchRaw;
            pitch = -rollRaw;
        } else {
            roll = rollRaw;
            pitch = pitchRaw;
        }

        // 補正後の値（ここが唯一の正解）
        currentRoll = roll - baseRoll;
        currentPitch = pitch - basePitch;

        // 表示（数値と絵を完全一致させる）
        document.getElementById("rollBoat").style.transform =
            `rotate(${currentRoll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${currentPitch}deg)`;

        document.getElementById("rollValue").innerText =
            Math.round(currentRoll) + "°";

        document.getElementById("pitchValue").innerText =
            Math.round(currentPitch) + "°";
    });
}
