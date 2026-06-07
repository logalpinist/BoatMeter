let roll = 0;
let isRunning = false;
let baseGamma = null;

async function requestPermission() {
    try {
        if (
            typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function"
        ) {
            const res = await DeviceOrientationEvent.requestPermission();
            if (res !== "granted") {
                alert("センサー許可が必要");
                return;
            }
        }

        startSensor();
    } catch (e) {
        console.log(e);
    }
}

function startSensor() {
    isRunning = true;
    window.addEventListener("deviceorientation", handleOrientation);
}

function handleOrientation(event) {
    if (!isRunning) return;

    let gamma = event.gamma;
    if (gamma === null) return;

    if (baseGamma === null) {
        baseGamma = gamma;
    }

    roll = gamma - baseGamma;

    if (roll > 45) roll = 45;
    if (roll < -45) roll = -45;

    document.getElementById("rollBoat").style.transform =
        `translate(-50%, -50%) rotate(${roll}deg)`;

    document.getElementById("rollValue").innerText =
        roll.toFixed(1) + "°";
}
