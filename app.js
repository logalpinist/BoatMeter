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

        currentRoll = event.gamma;
        currentPitch = event.beta;

        let roll = currentRoll - rollOffset;
        let pitch = currentPitch - pitchOffset;

        // ロール表示
        moveBoat("rollBoat", roll);
        setMarker("rollMarker", roll);

        // ピッチ表示
        moveBoat("pitchBoat", pitch);
        setMarker("pitchMarker", pitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(roll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(pitch)}°`;

    });
}

/* 船を円内で動かす（ボール風） */
function moveBoat(id, angle) {

    const radius = 120;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * radius;
    const y = -Math.cos(rad) * radius;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}

/* マーカーも同じ円上を動かす */
function setMarker(id, angle) {

    const radius = 130;
    const rad = angle * Math.PI / 180;

    const x = Math.sin(rad) * radius;
    const y = -Math.cos(rad) * radius;

    document.getElementById(id).style.transform =
        `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
}
