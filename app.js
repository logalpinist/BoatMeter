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

    // 👉 今の“実測値”を基準にするのが正解
    rollOffset = currentRoll;
    pitchOffset = currentPitch;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        // 🧠 センサー値（固定軸）
        let rawRoll = event.gamma;
        let rawPitch = event.beta;

        // 🧠 オフセット適用（ここが正しい順番）
        currentRoll = rawRoll - rollOffset;
        currentPitch = rawPitch - pitchOffset;

        // 🚤 表示（ロール＝後方、ピッチ＝側面）
        update("rollBoat", currentRoll);
        update("pitchBoat", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}

/* 共通表示 */
function update(id, angle) {

    const el = document.getElementById(id);

    // ロール：左右回転
    // ピッチ：上下回転（同じrotateでOK）
    el.style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
