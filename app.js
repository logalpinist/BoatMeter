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

        let beta = event.beta;   // 前後
        let gamma = event.gamma;  // 左右

        // 📌 ★ここが本体（画面依存しない）
        let roll = gamma;
        let pitch = beta;

        // 横向き補正（ここが重要）
        if (window.innerWidth > window.innerHeight) {
            // 横画面なら入れ替え＋反転補正
            const temp = roll;
            roll = pitch;
            pitch = -temp;
        }

        currentRoll = roll - rollOffset;
        currentPitch = pitch - pitchOffset;

        move("rollBoat", currentRoll);
        move("pitchBoat", currentPitch);

        setMarker("rollMarker", currentRoll);
        setMarker("pitchMarker", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;

    });
}

/* ボール移動 */
function move(id, angle) {

    const r = 120;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * r;
    const y = -Math.cos(rad) * r;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), ${y}px)`;
}

/* マーカー */
function setMarker(id, angle) {

    const r = 130;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * r;
    const y = -Math.cos(rad) * r;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), ${y}px)`;
}
