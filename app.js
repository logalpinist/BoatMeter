let baseRoll = 0;
let basePitch = 0;

let lastRoll = 0;
let lastPitch = 0;

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

    // 👉 今見えてる状態をゼロにする
    baseRoll = lastRoll;
    basePitch = lastPitch;
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
            // 縦
            roll = gamma;
            pitch = beta;
        } else {
            // 横（入れ替え安定版）
            roll = beta;
            pitch = -gamma;
        }

        // 🧠 生データ保存
        lastRoll = roll;
        lastPitch = pitch;

        // 🎯 基準との差分
        let finalRoll = roll - baseRoll;
        let finalPitch = pitch - basePitch;

        update("rollBoat", finalRoll);
        update("pitchBoat", finalPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(finalRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(finalPitch)}°`;
    });
}

/* 表示 */
function update(id, angle) {

    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
