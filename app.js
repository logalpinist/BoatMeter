function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        let roll = Math.round(event.gamma);

        document.getElementById("rollBoat")
            .style.transform =
            `rotate(${roll}deg)`;

        document.getElementById("rollValue")
            .innerText =
            `${roll}°`;

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
