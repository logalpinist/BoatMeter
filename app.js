let baseRoll = 0;
let basePitch = 0;

let rawRoll = 0;
let rawPitch = 0;

function requestPermission() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
        .then(permissionState => {

            if (permissionState === "granted") {
                startSensor();
            }

        })
        .catch(console.error);

    } else {

        startSensor();

    }
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        let roll = event.gamma || 0;
        let pitch = event.beta || 0;

        rawRoll = roll;
        rawPitch = pitch;

        let currentRoll = roll - baseRoll;
        let currentPitch = pitch - basePitch;

        document.getElementById("rollValue").innerText =
            currentRoll.toFixed(1) + "°";

        document.getElementById("pitchValue").innerText =
            currentPitch.toFixed(1) + "°";

        document.getElementById("rollBoat").style.transform =
            `rotate(${currentRoll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${-currentPitch}deg)`;

    });

}

function resetZero() {

    baseRoll = rawRoll;
    basePitch = rawPitch;

}
