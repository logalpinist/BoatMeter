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
                if (response === "granted") startSensor();
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

        const angle = (screen.orientation && screen.orientation.angle) || 0;
        const isLandscape = angle === 90 || angle === -90 || angle === 270;

        let roll, pitch;

        if (!isLandscape) {
            roll = event.gamma;
            pitch = event.beta;
        } else {
            // 横画面は軸を入れ替えて安定化
            roll = event.beta;
            pitch = -event.gamma;
        }

        currentRoll = roll - rollOffset;
        currentPitch = pitch - pitchOffset;

        moveBoat("rollBoat", currentRoll);
        moveBoat("pitchBoat", currentPitch);

        setMarker("rollMarker", currentRoll);
        setMarker("pitchMarker", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}

/* ボール挙動（共通） */
function moveBoat(id, angle) {

    const radius = 120;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * radius;
    const y = -Math.cos(rad) * radius;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

/* マーカー */
function setMarker(id, angle) {

    const radius = 130;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * radius;
    const y = -Math.cos(rad) * radius;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), ${y}px)`;
}
