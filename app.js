function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        let roll = Math.round(event.gamma);
        let pitch = Math.round(event.beta);

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
