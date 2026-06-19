let chart = null;

let marker = null;

let trackLine = null;

let rows = [];

const map =
    L.map("map")
        .setView(
            [35.0,138.0],
            10
        );

if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(
        pos => {

            map.setView(
                [
                    pos.coords.latitude,
                    pos.coords.longitude
                ],
                15
            );
        },

        err => {
            console.log(err);
        },

        {
            enableHighAccuracy:true,
            timeout:10000,
            maximumAge:0
        }
    );
}

L.tileLayer(
    "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        maxZoom:19
    }
).addTo(map);

document
.getElementById("csvFile")
.addEventListener(
    "change",
    loadCsv
);

function loadCsv(event){

    const file =
        event.target.files[0];

    if(!file) return;

    const reader =
        new FileReader();

    reader.onload =
        function(e){

            parseCsv(
                e.target.result
            );
        };

    reader.readAsText(file);
}

function parseCsv(text){

    const lines =
        text.trim().split("\n");

    rows = [];

    for(
        let i=1;
        i<lines.length;
        i++
    ){

        const c =
            lines[i].split(",");

        rows.push({

            elapsed:
                Number(c[0]),

            lat:
                Number(c[4]),

            lng:
                Number(c[5]),

            roll:
                Number(c[2]),

            pitch:
                Number(c[3])

        });
    }

drawTrack();
initSlider();
showPosition(0);
drawChart();
    
}

function drawTrack(){

    const points =
        rows.map(
            r => [
                r.lat,
                r.lng
            ]
        );

    if(trackLine){
        map.removeLayer(trackLine);
    }

    trackLine =
        L.polyline(
            points,
            {
                weight:4
            }
        ).addTo(map);

    map.fitBounds(points);
}
function goBack() {
    window.location.href = "index.html";
}


function initSlider(){

    const slider =
        document.getElementById("slider");

    slider.max =
        rows.length - 1;

    slider.value = 0;

    slider.oninput =
        function(){
            showPosition(
                Number(this.value)
            );
        };
}

function showPosition(index){

    const row =
        rows[index];

    if(!row) return;

    if(marker){
        marker.setLatLng([
            row.lat,
            row.lng
        ]);
    }else{
        marker =
            L.marker([
                row.lat,
                row.lng
            ]).addTo(map);
    }
}

function drawChart(){

    const ctx =
        document
        .getElementById("chart")
        .getContext("2d");

    if(chart){
        chart.destroy();
    }

    chart =
        new Chart(ctx,{

            type:"line",

            data:{

                labels:
                    rows.map(
                        r => r.elapsed
                    ),

                datasets:[

                    {
    label:"ROLL",
    borderWidth:3,
    pointRadius:0,
    tension:0.2,
    data: rows.map(r => r.roll)
},

{
    label:"PITCH",
    borderWidth:3,
    pointRadius:0,
    tension:0.2,
    data: rows.map(r => r.pitch)
}
                ]
            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                animation:false,

                scales:{
   x:{
    title:{
        display:true,
        text:"秒"
    },

    ticks:{
        autoSkip:true,
        maxTicksLimit:8,

        callback:function(value){
            return Math.round(
                this.getLabelForValue(value)
            );
        }
    }
},

    y:{
        min:-30,
        max:30,

        ticks:{
            stepSize:10
        }
    }
}
            }
        });
}
