let baseRoll = 0;
let basePitch = 0;

let currentRoll = 0;
let currentPitch = 0;

function requestPermission() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {

        DeviceOrientationEvent.requestPermission()
            .then(res => {
                if (res === "granted") startSensor();
            });

    } else {
        startSensor();
    }
}

function resetZero() {

    // 👉 今“表示されてる値”をゼロ基準にする
    baseRoll = currentRoll;
    basePitch = currentPitch;
}

function getIsLandscape() {
    return (screen.orientation && Math.abs(screen.orientation.angle) === 90)
        || window.innerWidth > window.innerHeight;
}

function startSensor() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let beta = event.beta;
        let gamma = event.gamma;

        const isLandscape = getIsLandscape();

        let roll = !isLandscape ? gamma : beta;
        let pitch = !isLandscape ? beta : -gamma;

        // 🎯 差分を1本化（ここが重要）
        currentRoll = roll - baseRoll;
        currentPitch = pitch - basePitch;

        // 🚤 画像も数字も同じ値を使う
        render("rollBoat", currentRoll);
        render("pitchBoat", currentPitch);

        document.getElementById("rollValue").innerText =
            `${Math.round(currentRoll)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(currentPitch)}°`;
    });
}

function render(id, angle) {

    document.getElementById(id).style.transform =
        `translate(-50%, -50%) rotate(${angle}deg)`;
}
