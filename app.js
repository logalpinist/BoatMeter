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
            .then(response => {
                if (response === "granted") {
                    startSensor();
                }
            })
            .catch(console.error);

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

        currentPitch = event.beta;
        currentRoll = event.gamma;

        let roll;
        let pitch;

        // 画面の向き
        const angle = (screen.orientation && screen.orientation.angle) || 0;
        const isLandscape = angle === 90 || angle === -90 || angle === 270;

        if (!isLandscape) {

            // 📱 縦持ち
            roll = event.gamma - rollOffset;
            pitch = event.beta - pitchOffset;

        } else {

            // 📱 横持ち（軸入れ替え＋反転補正）
            roll = event.beta - pitchOffset;

            if (angle === 90 || angle === -90) {
                pitch = -event.gamma + rollOffset;
            } else {
                pitch = event.gamma - rollOffset;
            }
        }

        document.getElementById("rollBoat").style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${pitch}deg)`;

        document.getElementById("rollValue").innerText =
            `Roll ${Math.round(roll)}°`;

        document.getElementById("pitchValue").innerText =
            `Pitch ${Math.round(pitch)}°`;
    });
}
