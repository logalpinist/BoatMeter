window.addEventListener("deviceorientation", (event) => {

    currentRoll = Math.round(event.gamma);
    currentPitch = Math.round(event.beta);

    let roll;
    let pitch;

    const angle =
        window.screen.orientation?.angle ??
        window.orientation ??
        0;

    if (Math.abs(angle) === 90) {

        roll = currentPitch - pitchOffset;
        pitch = currentRoll - rollOffset;

    } else {

        roll = currentRoll - rollOffset;
        pitch = currentPitch - pitchOffset;

    }

    document.getElementById("rollBoat")
        .style.transform =
        `rotate(${roll}deg)`;

    document.getElementById("pitchBoat")
        .style.transform =
        `rotate(${pitch}deg)`;

    document.getElementById("rollValue")
        .innerText =
        `${roll}°`;

    document.getElementById("pitchValue")
        .innerText =
        `B:${Math.round(event.beta)} G:${Math.round(event.gamma)}`;

});
