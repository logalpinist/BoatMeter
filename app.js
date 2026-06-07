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

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        rollRaw = event.gamma;
        pitchRaw = event.beta;

        let r = rollRaw - baseRoll;
        let p = pitchRaw - basePitch;

        update("rollBoat", r);
        update("pitchBoat", p);

        document.getElementById("rollValue").innerText =
            Math.round(r) + "°";

        document.getElementById("pitchValue").innerText =
            Math.round(p) + "°";
    });
}

function resetZero() {
    baseRoll = rollRaw;
    basePitch = pitchRaw;
}

function update(id, angle) {
    document.getElementById(id).style.transform =
        `rotate(${angle}deg)`;
}
