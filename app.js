let rollOffset = 0;
let pitchOffset = 0;

function resetZero() {
    rollOffset = currentRoll;
    pitchOffset = currentPitch;
}

let currentRoll = 0;
let currentPitch = 0;

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        currentRoll = Math.round(event.gamma);
        currentPitch = Math.round(event.beta);

        let roll = currentRoll - rollOffset;
        let pitch = currentPitch - pitchOffset;

        document.getElementById("rollBoat")
            .style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("pitchBoat")
            .style.transform =
            `rotate(${pitch}deg)`;

        document.getElementById("rollValue")
            .innerText =
            `${roll}°`;

        document.getElementById("pitchValue")
            .innerText =
            `${pitch}°`;

    });

}

function requestPermission() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(permission => {

                if (permission === "granted") {
                    startSensor();
                }

            });

    } else {

        startSensor();

    }

}
