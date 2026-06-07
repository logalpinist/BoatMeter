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

                if (response === "granted") {
                    startSensor();
                }

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

        if (event.beta == null || event.gamma == null) {
            return;
        }

        currentRoll = event.gamma;
        currentPitch = event.beta;

        let roll;
        let pitch;

        // βが小さいときは横持ちと判定
        if (Math.abs(currentPitch) < 45) {

            roll = currentPitch - pitchOffset;
            pitch = currentRoll - rollOffset;

        } else {

            roll = currentRoll - rollOffset;
            pitch = currentPitch - pitchOffset;

        }

        document.getElementById("rollBoat").style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${pitch}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(roll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(pitch)}°`;

    });

}
