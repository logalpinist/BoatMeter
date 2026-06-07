let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

let modeLandscape = false; // ←固定モード

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

/* 🚀 ここ重要：常に最新状態を取得 */
function getLandscape() {
    return window.innerWidth > window.innerHeight;
}

/* 🔥 リセット（ここが修正ポイント） */
function resetZero() {

    modeLandscape = getLandscape();

    if (!modeLandscape) {
        baseRoll = rollRaw;
        basePitch = pitchRaw;
    } else {
        // 横モードは軸変換後で保存
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

        // 🔥 重要：リセット時のモードを使う
        if (!modeLandscape) {
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
