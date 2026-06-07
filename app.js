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

        // 📌 iOS補正（ここが重要）
        const isUpsideDown = beta > 90 || beta < -90;

        if (Math.abs(beta) < 45) {
            // 横持ちっぽい状態
            currentRoll = beta;
            currentPitch = gamma;
        } else {
            // 縦持ち
            currentRoll = gamma;
            currentPitch = beta;
        }

        // ゼロ補正
        let roll = currentRoll - rollOffset;
        let pitch = currentPitch - pitchOffset;

        move("rollBoat", roll);
        move("pitchBoat", pitch);

        marker("rollMarker", roll);
        marker("pitchMarker", pitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(roll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(pitch)}°`;

    });
}

/* 船の動き */
function move(id, angle) {

    const r = 120;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * r;
    const y = -Math.cos(rad) * r;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

/* マーカー */
function marker(id, angle) {

    const r = 130;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * r;
    const y = -Math.cos(rad) * r;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}
