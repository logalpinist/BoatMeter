window.addEventListener("deviceorientation", (e) => {

    // 横傾き（左右）
    let roll = e.gamma || 0;

    // 縦傾き（前後）
    let pitch = e.beta || 0;

    // ROLL
    document.getElementById("rollBoat").style.transform =
        `rotate(${roll}deg)`;

    document.getElementById("rollValue").innerText =
        Math.round(roll) + "°";

    // PITCH（上下動っぽく表現）
    document.getElementById("pitchBoat").style.transform =
        `translateY(${pitch}px)`;

    document.getElementById("pitchValue").innerText =
        Math.round(pitch) + "°";
});