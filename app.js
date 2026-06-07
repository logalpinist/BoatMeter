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

function getSign() {
    // 横向き補正（iOS安定用）
    const angle = screen.orientation?.angle ?? window.orientation ?? 90;
    return (angle === 90 || angle === -90) ? 1 : 1;
}

function resetZero() {
    // 現在値を基準化（同じ座標系で保存）
    baseRoll = rollRaw;
    basePitch = pitchRaw;
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        const sign = getSign();

        // 横専用スロープメーター
        rollRaw = event.gamma * sign;
        pitchRaw = event.beta;

        let r = rollRaw - baseRoll;
        let p = pitchRaw - basePitch;

        document.getElementById("rollBoat").style.transform =
            `rotate(${r}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${p}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(r)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(p)}°`;
    });
}
