function startSensor() {
    window.addEventListener("deviceorientation", (e) => {

        let roll = e.gamma || 0;
        let pitch = e.beta || 0;

        document.getElementById("rollBoat").style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("rollValue").innerText =
            Math.round(roll) + "°";

        document.getElementById("pitchValue").innerText =
            Math.round(pitch) + "°";
    });
}

function requestPermission() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(permissionState => {

                if (permissionState === "granted") {
                    startSensor();
                } else {
                    alert("センサー許可が必要です");
                }

            })
            .catch(console.error);

    } else {
        startSensor();
    }
}
