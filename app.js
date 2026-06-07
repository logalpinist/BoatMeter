let rollOffset = 0;
let pitchOffset = 0;

// 🧠 生データ（これが基準）
let rawRoll = 0;
let rawPitch = 0;

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

    // ✅ 必ず生データ基準でリセット
    rollOffset = rawRoll;
    pitchOffset = rawPitch;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let beta = event.beta;
        let gamma = event.gamma;

        // 🧠 生データ保存
        rawRoll = gamma;
        rawPitch = beta;

        // 🧭 重力ベース判定（安定版）
        const isLandscapeLike = Math.abs(gamma) > Math.abs(beta);

        let roll, pitch;

        if (!isLandscapeLike) {
            // 縦持ち
            roll = gamma;
            pitch = beta;
        } else {
            // 横持ち（入れ替え）
            roll = beta;
            pitch = -gamma;
        }

        // 🎯 オフセット適用（ここが最重要）
        let finalRoll = roll - rollOffset;
        let finalPitch = pitch - pitchOffset;

        update("rollBoat", finalRoll);
        update("pitchBoat", finalPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(finalRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(finalPitch)}°`;
    });
}

/* 共通描画 */
function update(id, angle) {

    const el = document.getElementById(id);

    el.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
