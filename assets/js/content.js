const db = firebase.firestore();
const auth = firebase.auth();

auth.onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById("kullaniciadi").innerText = user.email;
    }
});

function logout() {
    auth.signOut();
    window.location.href = "index.html"
}

function addTab(isim) {
    tabHeader(isim);
    tabContent(isim);
    grafikCiz(isim);
}

function tabHeader(isim) {
    const li = document.createElement("li");
    li.classList.add("nav-item");
    li.setAttribute("role", "presentation");
    const a = document.createElement("a");
    a.classList.add("nav-link");
    a.innerText = isim;
    a.setAttribute("role", "tab");
    a.setAttribute("data-bs-toggle", "tab");
    a.setAttribute("href", `#tab-${isim}`);
    li.appendChild(a);
    document.getElementById("tabList").appendChild(li);
}

function tabContent(isim) {
    const div = document.createElement("div");
    div.classList.add("tab-pane", "pulse", "animated");
    div.setAttribute("role", "tabpanel");
    div.id = `tab-${isim}`;
    const grafik = document.createElement("div");
    grafik.id = `grafik-${isim}`;
    const grafikTarih = document.createElement("div");
    grafikTarih.id = `grafikTarih-${isim}`;
    div.append(grafik, grafikTarih);
    document.getElementById("tabContent").appendChild(div);
}

function grafikCiz(isim) {
    db.collection(isim).get().then((querySnapshot) => {
        const data = [];
        querySnapshot.forEach((doc) => {
            const dat = [];
            for (const [key, value] of Object.entries(doc.data())) {
                const date = doc.id.split(".");
                const clock = key.split(":");
                dat.push(
                    [
                        new Date(Number(date[2]),
                            Number(date[1]), Number(date[0]),
                            Number(clock[0]), Number(clock[1]),
                            Number(clock[2]), Number(clock[3])).getTime(),
                        value
                    ]);
            }
            dat.sort((a, b) => a[0] - b[0]);
            for (const da of dat)
                data.push(da);
        });

        console.log(data);

        const options = {
            series: [{
                name: isim,
                data: data
            }],
            chart: {
                id: `grafikk${isim}`,
                type: 'area',
                height: 230,
                toolbar: {
                    autoSelected: 'pan',
                    show: false
                }
            },
            colors: ['#546E7A'],
            stroke: {
                width: 3
            },
            dataLabels: {
                enabled: true
            },
            fill: {
                opacity: 1,
            },
            markers: {
                size: 0
            },
            xaxis: {
                type: 'datetime'
            }
        };

        const chart = new ApexCharts(document.getElementById(`grafik-${isim}`), options);
        chart.render();

        const optionsLine = {
            series: [{
                data: data
            }],
            chart: {
                id: `tarihh${isim}`,
                height: 130,
                type: 'area',
                brush: {
                    target: `grafikk${isim}`,
                    enabled: true
                },
                selection: {
                    enabled: true,
                    xaxis: {
                        min: data[data.length - 1][0],
                        max: data[0][0]
                    }
                },
            },
            colors: ['#008FFB'],
            fill: {
                type: 'gradient',
                gradient: {
                    opacityFrom: 0.91,
                    opacityTo: 0.1,
                }
            },
            xaxis: {
                type: 'datetime',
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                tickAmount: 2
            }
        };

        const chartLine = new ApexCharts(document.getElementById(`grafikTarih-${isim}`), optionsLine);
        chartLine.render();
    });
}

db.collection("sensörler").get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
        addTab(doc.id);
    });
});