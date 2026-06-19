let rows = [];

const map =
    L.map("map")
        .setView(
            [35.0,138.0],
            10
        );

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
}

function drawTrack(){

    const points =
        rows.map(
            r=>[
                r.lat,
                r.lng
            ]
        );

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

