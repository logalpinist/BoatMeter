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

        if (event.beta == null || event.gamma == null) {
            return;
        }

        currentPitch = event.beta;
        currentRoll = event.gamma;

        let roll;
        let pitch;

        // 縦持ち判定
        if (Math.abs(event.beta) > 45) {

            // 縦持ち
            roll = event.gamma - rollOffset;
            pitch = event.beta - pitchOffset;

        } else {

            // 横持ち
            roll = event.beta - pitchOffset;
            pitch = event.gamma - rollOffset;

        }

        document.getElementById("rollBoat").style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${pitch}deg)`;

        document.getElementById("rollValue").innerText =
            `Roll ${Math.round(roll)}°`;

        document.getElementById("pitchValue").innerText =
            `Pitch ${Math.round(pitch)}°`;

    });

}
