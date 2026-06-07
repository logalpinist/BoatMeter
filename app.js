let baseRoll = 0;
let basePitch = 0;

let rollRaw = 0;
let pitchRaw = 0;

function startSensor() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission()
            .then(res => {
                if (res === "granted") attach();
            });
    } else {
        attach();
    }
}

function resetZero() {
    baseRoll = rollRaw;
    basePitch = pitchRaw;
}

/* 横専用補正（iOS安定版） */
function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        // 横専用補正（ズレ防止）
        const roll = event.gamma;
        const pitch = event.beta;

        rollRaw = roll;
        pitchRaw = pitch;

        let r = roll - baseRoll;
        let p = pitch - basePitch;

        document.getElementById("rollBoat").style.transform =
            `rotate(${r}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${p}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(r)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(p)}°`;
    });
}
