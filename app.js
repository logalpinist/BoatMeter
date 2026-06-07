let rollOffset = 0;
let pitchOffset = 0;

let currentRoll = 0;
let currentPitch = 0;

let sensorStarted = false;

function resetZero() {
    rollOffset = currentRoll;
    pitchOffset = currentPitch;
}

function startSensor() {

    if (sensorStarted) {
        return;
    }

    sensorStarted = true;

    window.addEventListener("deviceorientation", (event) => {

        currentRoll = Math.round(event.gamma || 0);
        currentPitch = Math.round(event.beta || 0);

        let roll = currentRoll - rollOffset;
        let pitch = currentPitch - pitchOffset;

        document.getElementById("rollBoat").style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${pitch}deg)`;

        document.getElementById("rollValue").innerText =
            `${roll}°`;

        document.getElementById("pitchValue").innerText =
            `β:${Math.round(event.beta || 0)} γ:${Math.round(event.gamma || 0)}`;

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
                } else {
                    alert("センサーの使用が許可されませんでした");
                }

            })
            .catch(error => {
                alert("エラー: " + error);
            });

    } else {

        startSensor();

    }

}
