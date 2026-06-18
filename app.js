let baseRoll = 0;
let basePitch = 0;

let rawRoll = 0;
let rawPitch = 0;

let currentRoll = 0;
let currentPitch = 0;

let sensorAttached = false;
let wakeLock = null;

let displayLocked = false;

async function keepScreenAwake() {
    if (!("wakeLock" in navigator)) return;

    try {
        wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
        console.log("Wake Lock error:", err);
    }
}

function startSensor() {

    if (sensorAttached) return;

    displayLocked = true;

    document.getElementById("rollValue").style.visibility = "hidden";
    document.getElementById("pitchValue").style.visibility = "hidden";

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(res => {

                if (res === "granted") {

                    keepScreenAwake();

                    attach();
                    sensorAttached = true;

                    setTimeout(() => {

                        resetZero();

                        displayLocked = false;
                        updateDisplay();

                        document.getElementById("rollValue").style.visibility = "visible";
                        document.getElementById("pitchValue").style.visibility = "visible";

                    }, 300);

                    document.getElementById("startBtn").style.display = "none";
                }
            })
            .catch(err => {
                displayLocked = false;
                alert("エラー: " + err);
            });

    } else {

        attach();
        sensorAttached = true;

        setTimeout(() => {

            resetZero();

            displayLocked = false;
            updateDisplay();

            document.getElementById("rollValue").style.visibility = "visible";
            document.getElementById("pitchValue").style.visibility = "visible";

        }, 300);
    }
}

function isLandscape() {

    return window.innerWidth > window.innerHeight;

}

function resetZero() {

    baseRoll = rawRoll;
    basePitch = rawPitch;

    currentRoll = 0;
    currentPitch = 0;
}

function attach() {

    window.addEventListener(
        "deviceorientation",
        handleOrientation
    );

}

function handleOrientation(event) {

    if (
        event.beta == null ||
        event.gamma == null
    ) return;

    let rollRaw = event.gamma;
    let pitchRaw = event.beta;

    let roll;
    let pitch;

    if (isLandscape()) {

        const angle =
            screen.orientation
                ? screen.orientation.angle
                : window.orientation || 0;

        if (
            angle === -90 ||
            angle === 270
        ) {
            roll = -pitchRaw;
            pitch = -rollRaw;

        } else {
            roll = pitchRaw;
            pitch = rollRaw;
        }

    } else {

        roll = rollRaw;
        pitch = pitchRaw;

    }

    rawRoll = roll;
    rawPitch = pitch;

    currentRoll =
        normalizeAngle(rawRoll - baseRoll);

    currentPitch =
        normalizeAngle(rawPitch - basePitch);

    updateDisplay();
}

function updateDisplay() {

    if (displayLocked) return;

    document.getElementById("rollBoat").style.transform =
        `rotate(${currentRoll}deg)`;

    document.getElementById("pitchBoat").style.transform =
        `rotate(${-currentPitch}deg)`;

    document.getElementById("rollValue").innerText =
        `${Math.abs(Math.round(currentRoll))}°`;

    document.getElementById("pitchValue").innerText =
        `${Math.abs(Math.round(currentPitch))}°`;
}

function updateOrientation() {

    const notice =
        document.getElementById(
            "rotateNotice"
        );

    if (!notice) return;

    const landscape =
        window.matchMedia(
            "(orientation: landscape)"
        ).matches;

    if (landscape) {

        notice.style.display =
            "none";

    } else {

        notice.style.display =
            "flex";

    }
}

window.addEventListener(
    "resize",
    updateOrientation
);

window.addEventListener(
    "orientationchange",
    updateOrientation
);

window.addEventListener(
    "load",
    updateOrientation
);

updateOrientation();

window.addEventListener(
    "load",
    () => {
        document.getElementById("rollBoat").style.transform =
            "rotate(0deg)";

        document.getElementById("pitchBoat").style.transform =
            "rotate(0deg)";
    }
);

function normalizeAngle(angle) {

    while (angle > 90) {
        angle -= 180;
    }

    while (angle < -90) {
        angle += 180;
    }

    return angle;
}
