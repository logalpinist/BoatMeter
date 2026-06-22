let gpsReady = false;

let baseRoll = 0;
let basePitch = 0;

let rawRoll = 0;
let rawPitch = 0;

let currentRoll = 0;
let currentPitch = 0;

let sensorAttached = false;
let wakeLock = null;

let displayLocked = false;
let isRecording = false;

let records = [];

let currentLat = "";
let currentLng = "";
let currentSpeed = "";

let recordTimer = null;
let sessionStartTime = 0;

async function keepScreenAwake() {

    if (!("wakeLock" in navigator)) return;

    try {
        wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
        console.log("Wake Lock error:", err);
    }
}

function startGps() {

    if (!navigator.geolocation) return;

    navigator.geolocation.watchPosition(

        pos => {

            currentLat =
                pos.coords.latitude;

            currentLng =
                pos.coords.longitude;

            currentSpeed =
                pos.coords.speed ?? 0;

            gpsReady = true;

if (isRecording) {

    document.getElementById(
        "recIndicator"
    ).innerText =
        "● REC";
}
        },

        err => {
            console.log(err);
        },

        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 10000
        }
    );
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
                    startGps();
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

    startGps();

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

function toggleRecording() {

    if (!isRecording) {

     records = [];
isRecording = true;

sessionStartTime = Date.now();

        document.getElementById("recordBtn").innerText =
            "停止";

        document.getElementById("recIndicator").style.display =
            "block";

        document.getElementById("recIndicator").innerText =
            gpsReady
                ? "● REC"
                : "GPS待機中...";

        recordTimer = setInterval(
            recordSample,
            200
        );

    } else {

        isRecording = false;

        clearInterval(recordTimer);

        document.getElementById("recordBtn").innerText =
            "開始";

        document.getElementById("recIndicator").style.display =
            "none";

        const save = confirm(
            "CSVを保存しますか？"
        );

        if (save) {
            downloadCsv();
        }
    }
}

function recordSample() {

if (!gpsReady) {
    return;
}

const elapsed =
    (
        Date.now() -
        sessionStartTime
    ) / 1000;

records.push({

    elapsed:
        elapsed.toFixed(1),

    time:
        new Date().toISOString(),

    roll:
        currentRoll.toFixed(2),

    pitch:
        currentPitch.toFixed(2),

    lat:
        currentLat,

    lng:
        currentLng,

    speed:
        currentSpeed
});
}

function calculateHeading(records){

    let lastHeading = "";

    return records.map((row, index) => {

        if(index === 0){
            return {
                ...row,
                heading:""
            };
        }

        const prev =
            records[index - 1];

        const lat1 =
            Number(prev.lat);

        const lon1 =
            Number(prev.lng);

        const lat2 =
            Number(row.lat);

        const lon2 =
            Number(row.lng);

        if(
            lat1 === lat2 &&
            lon1 === lon2
        ){
            return {
                ...row,
                heading:lastHeading
            };
        }

        const y =
            Math.sin(
                (lon2 - lon1) *
                Math.PI / 180
            ) *
            Math.cos(
                lat2 *
                Math.PI / 180
            );

        const x =
            Math.cos(
                lat1 *
                Math.PI / 180
            ) *
            Math.sin(
                lat2 *
                Math.PI / 180
            ) -

            Math.sin(
                lat1 *
                Math.PI / 180
            ) *
            Math.cos(
                lat2 *
                Math.PI / 180
            ) *
            Math.cos(
                (lon2 - lon1) *
                Math.PI / 180
            );

        let heading =
            Math.atan2(y, x) *
            180 / Math.PI;

        heading =
            (heading + 360) % 360;

        lastHeading =
            heading.toFixed(1);

        return {
            ...row,
            heading:lastHeading
        };
    });
}

function calculateTurnRate(records){

    return records.map((row,index)=>{

        if(index === 0){
            return {
                ...row,
                turnRate:""
            };
        }

        const prev =
            records[index - 1];

        const h1 =
            Number(prev.heading);

        const h2 =
            Number(row.heading);

        if(
            isNaN(h1) ||
            isNaN(h2)
        ){
            return {
                ...row,
                turnRate:""
            };
        }

        let delta =
            h2 - h1;

        if(delta > 180){
            delta -= 360;
        }

        if(delta < -180){
            delta += 360;
        }

        const dt =
            Number(row.elapsed) -
            Number(prev.elapsed);

        const turnRate =
            dt > 0
                ? delta / dt
                : 0;

        return {
            ...row,
            turnRate:
                turnRate.toFixed(2)
        };
    });
}

function calculateRadius(records){

    return records.map(row => {

        const speed =
            Number(row.speed);

        const turnRate =
            Number(row.turnRate);

        if(
            isNaN(speed) ||
            isNaN(turnRate) ||
            Math.abs(turnRate) < 0.01
        ){
            return {
                ...row,
                radius:""
            };
        }

        const omega =
            turnRate *
            Math.PI / 180;

        const radius =
            speed / omega;

        return {
            ...row,
            radius:
                radius.toFixed(1)
        };
    });
}

async function downloadCsv() {

    if (records.length === 0) {
        alert("保存するデータがありません");
        return;
    }

 const headingRecords =
    calculateHeading(records);

const turnRecords =
    calculateTurnRate(
        headingRecords
    );

const analyzedRecords =
    calculateRadius(
        turnRecords
    );
    
 let csv =
"elapsed,time,roll,pitch,lat,lng,speed,heading,turnRate,radius\n";
    analyzedRecords.forEach(row => {

csv +=
`${row.elapsed},${row.time},${row.roll},${row.pitch},${row.lat},${row.lng},${row.speed},${row.heading},${row.turnRate},${row.radius}\n`;
    const fileName =
        makeCsvFileName();

    const file =
        new File(
            [csv],
            fileName,
            { type: "text/csv" }
        );

    if (
        navigator.canShare &&
        navigator.canShare({ files: [file] })
    ) {
        await navigator.share({
            files: [file],
        });
    } else {
        alert("この環境では共有保存に対応していません");
    }
}

function makeCsvFileName() {

    const d = new Date();

    const yyyy = d.getFullYear();

    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");

    const hh = String(d.getHours()).padStart(2, "0");
    const mi = String(d.getMinutes()).padStart(2, "0");
    const ss = String(d.getSeconds()).padStart(2, "0");

    return `BoatMeter_${yyyy}-${mm}-${dd}_${hh}${mi}${ss}.csv`;
}

function openViewer() {

    window.location.href =
        "viewer.html";
}
