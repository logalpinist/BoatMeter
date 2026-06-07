let baseX = 0;
let baseY = 0;

let x = 0;
let y = 0;

function startSensor() {

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission()
            .then(res => {
                if (res === "granted") attach();
            });
    } else {
        attach();
    }
}

/* 重力ベクトルリセット */
function resetZero() {
    baseX = x;
    baseY = y;
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        // 重力ベクトル
        let gx = event.gamma;
        let gy = event.beta;

        x = gx;
        y = gy;

        let rx = x - baseX;
        let ry = y - baseY;

        document.getElementById("rollBoat").style.transform =
            `rotate(${rx}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${ry}deg)`;

        document.getElementById("rollValue").innerText =
            `${Math.round(rx)}°`;

        document.getElementById("pitchValue").innerText =
            `${Math.round(ry)}°`;
    });
}
