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

        // 基本軸
        currentRoll = gamma - rollOffset;
        currentPitch = beta - pitchOffset;

        // 🎯 ロール：後方ビューは左右回転だけ
        document.getElementById("rollBoat").style.transform =
            `translate(-50%, -50%) rotate(${currentRoll}deg)`;

        // 🎯 ピッチ：側面ビューは上下回転だけ
        document.getElementById("pitchBoat").style.transform =
            `translate(-50%, -50%) rotate(${currentPitch}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;

    });
}
