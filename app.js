let rollOffset = 0;
let pitchOffset = 0;

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
    rollOffset = currentRoll;
    pitchOffset = currentPitch;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let beta = event.beta;
        let gamma = event.gamma;

        // 🧠 重力ベース判定
        const isLandscapeLike = Math.abs(gamma) > Math.abs(beta);

        let roll, pitch;

        if (!isLandscapeLike) {
            // 📱 縦持ち
            roll = gamma;
            pitch = beta;
        } else {
            // 📱 横持ち（自動入れ替え）
            roll = beta;
            pitch = -gamma;
        }

        currentRoll = roll - rollOffset;
        currentPitch = pitch - pitchOffset;

        update("rollBoat", currentRoll);
        update("pitchBoat", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}

/* 表示 */
function update(id, angle) {

    const el = document.getElementById(id);

    el.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
