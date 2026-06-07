let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

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
    baseRoll = rollRaw;
    basePitch = pitchRaw;
}

function isLandscape() {
    return window.innerWidth > window.innerHeight;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        rollRaw = event.gamma;
        pitchRaw = event.beta;

        let roll, pitch;

        if (!isLandscape()) {
            // 縦
            roll = rollRaw;
            pitch = pitchRaw;
        } else {
            // 横は軸入れ替え（重要）
            roll = pitchRaw;
            pitch = -rollRaw;
        }

        let r = roll - baseRoll;
        let p = pitch - basePitch;

        update("rollBoat", r);
        update("pitchBoat", p);

        document.getElementById("rollValue").innerText =
            `${Math.round(r)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(p)}°`;
    });
}

function update(id, angle) {
    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
