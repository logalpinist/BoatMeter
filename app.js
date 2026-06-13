
let baseRoll = 0;
let basePitch = 0;

let rawRoll = 0;
let rawPitch = 0;

let currentRoll = 0;
let currentPitch = 0;

let sensorAttached = false;


function startSensor() 
{

    if (sensorAttached) return;

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(res => {

if (res === "granted") {
    
    document.getElementById("rollValue")
    .style.visibility = "hidden";

document.getElementById("pitchValue")
    .style.visibility = "hidden";

    attach();
    sensorAttached = true;

  setTimeout(() => {

    resetZero();

    document.getElementById("rollValue")
        .style.visibility = "visible";

    document.getElementById("pitchValue")
        .style.visibility = "visible";

}, 300);

    document.getElementById("startBtn")
        .style.display = "none";
}

            })
            .catch(err => {
                alert("エラー: " + err);
            });

    } else {

        attach();
        sensorAttached = true;
    }
}

function isLandscape() {

    return window.innerWidth >
           window.innerHeight;

}

function resetZero() {

    baseRoll = rawRoll;
    basePitch = rawPitch;

    currentRoll = 0;
    currentPitch = 0;

    document.getElementById("rollValue")
        .innerText = "0°";

    document.getElementById("pitchValue")
        .innerText = "0°";

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
        // 左に倒した横画面：今OKな向き
        roll = -pitchRaw;
        pitch = rollRaw;

    } else {
        // 右に倒した横画面：反対なので符号反転
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
        rawRoll - baseRoll;

    currentPitch =
        rawPitch - basePitch;

    document.getElementById(
        "rollBoat"
    ).style.transform =
        `rotate(${currentRoll}deg)`;

    document.getElementById(
        "pitchBoat"
    ).style.transform =
        `rotate(${currentPitch}deg)`;

    document.getElementById(
        "rollValue"
    ).innerText =
        `${Math.abs(Math.round(currentRoll))}°`;

    document.getElementById(
        "pitchValue"
    ).innerText =
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
