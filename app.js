let rollOffset = 0;
let pitchOffset = 0;

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

    // ✅ 今の“表示ロジック後”の値でリセット
    rollOffset = currentRoll;
    pitchOffset = currentPitch;
}

// 🧠 表示用グローバル（これが重要）
let currentRoll = 0;
let currentPitch = 0;

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let beta = event.beta;
        let gamma = event.gamma;

        // 重力判定
        const isLandscapeLike = Math.abs(gamma) > Math.abs(beta);

        let roll, pitch;

        if (!isLandscapeLike) {
            roll = gamma;
            pitch = beta;
        } else {
            roll = beta;
            pitch = -gamma;
        }

        // 🎯 最終値を作る
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

function update(id, angle) {

    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
