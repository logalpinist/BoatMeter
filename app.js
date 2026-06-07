let roll = 0;
let isRunning = false;

// 角度補正用（デバイスによってズレるので初期値）
let baseGamma = 0;

// ボタンから呼ぶ
async function requestPermission() {
    try {
        // iOS対応（許可が必要）
        if (typeof DeviceOrientationEvent !== "undefined" &&
            typeof DeviceOrientationEvent.requestPermission === "function") {

            const response = await DeviceOrientationEvent.requestPermission();
            if (response !== "granted") {
                alert("センサーの許可が必要です");
                return;
            }
        }

        startSensor();
    } catch (e) {
        console.error(e);
        alert("センサー開始に失敗しました");
    }
}

// センサー開始
function startSensor() {
    isRunning = true;
    window.addEventListener("deviceorientation", handleOrientation);
}

// センサー処理
function handleOrientation(event) {
    if (!isRunning) return;

    // 左右傾き（-90〜90）
    let gamma = event.gamma;

    if (gamma === null) return;

    // 初回だけ基準を取る
    if (baseGamma === 0) {
        baseGamma = gamma;
    }

    // 差分でロール計算
    roll = gamma - baseGamma;

    // 制限（見やすく）
    if (roll > 45) roll = 45;
    if (roll < -45) roll = -45;

    updateDisplay();
}

// 表示更新
function updateDisplay() {
    const boat = document.getElementById("rollBoat");
    const value = document.getElementById("rollValue");

    if (boat) {
        boat.style.transform = `rotate(${roll}deg)`;
    }

    if (value) {
        value.innerText = roll.toFixed(1) + "°";
    }
}

// もしリセットしたい場合用
function resetSensor() {
    baseGamma = 0;
    roll = 0;
    updateDisplay();
}
