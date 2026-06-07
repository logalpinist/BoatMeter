let roll = 0;

function requestPermission() {
    // iOS対応
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission()
            .then(response => {
                if (response === "granted") {
                    startSensor();
                } else {
                    alert("センサー許可が必要です");
                }
            })
            .catch(console.error);
    } else {
        // Android / PC
        startSensor();
    }
}

function startSensor() {
    window.addEventListener("deviceorientation", (event) => {
        let gamma = event.gamma;

        if (gamma === null) return;

        // そのままロールに使う（まずはシンプルに動かす）
        roll = gamma;

        // 制限
        if (roll > 45) roll = 45;
        if (roll < -45) roll = -45;

        const boat = document.getElementById("rollBoat");
        const value = document.getElementById("rollValue");

        if (boat) {
            boat.style.transform = `translate(-50%, -50%) rotate(${roll}deg)`;
        }

        if (value) {
            value.innerText = roll.toFixed(1) + "°";
        }
    });
}
