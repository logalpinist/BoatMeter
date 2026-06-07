let baseRoll = 0;
let basePitch = 0;

let roll = 0;
let pitch = 0;

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

    // 👉 “変換後の値”を基準にする（ここが重要）
    baseRoll = roll;
    basePitch = pitch;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let beta = event.beta;
        let gamma = event.gamma;

        // 🧠 固定座標化（ここで全部統一）
        const isLandscape = window.innerWidth > window.innerHeight;

        if (!isLandscape) {
            roll = gamma;
            pitch = beta;
        } else {
            roll = beta;
            pitch = -gamma;
        }

        // 🎯 オフセット適用（ここ1回だけ）
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

function update(id, angle) {

    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
