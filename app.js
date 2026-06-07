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

function getAngleRad() {
    return (window.orientation || 0) * Math.PI / 180;
}

/* 🔥 ここが修正ポイント */
function resetZero() {

    // 現在の画面回転を考慮した状態で保存
    let angle = getAngleRad();

    let gx = x;
    let gy = y;

    // 逆回転して基準化
    baseX = gx;
    baseY = gy;
}

function attach() {

    window.addEventListener("deviceorientation", (event) => {

        if (event.beta == null || event.gamma == null) return;

        let gx = event.gamma;
        let gy = event.beta;

        let angle = getAngleRad();

        // 🌍 回転補正（重力ベクトル→画面座標）
        x = gx * Math.cos(angle) - gy * Math.sin(angle);
        y = gx * Math.sin(angle) + gy * Math.cos(angle);

        let rx = x - baseX;
        let ry = y - baseY;

        document.getElementById("rollBoat").style.transform =
            `rotate(${rx}deg)`;

        document.getElementById("pitchBoat").style.transform =
            `rotate(${ry}deg)`;

        document.getElementById("rollValue").innerText =
            Math.round(rx) + "°";

        document.getElementById("pitchValue").innerText =
            Math.round(ry) + "°";
    });
}
