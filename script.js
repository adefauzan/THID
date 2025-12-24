var map = L.map('map').setView([-7.2575, 112.7521], 6); 
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors | Colonial Tomb Archive ID'
}).addTo(map);
fetch('data.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        L.geoJSON(geojsonData, {
            onEachFeature: function (feature, layer) {
                let popupContent = `
                    <strong>Nama:</strong> ${feature.properties.nama}<br>
                    <strong>Tahun:</strong> ${feature.properties.tahun_wafat}<br>
                    <strong>Sumber KITLV:</strong> <a href="${feature.properties.link_arsip}" target="_blank">Lihat Arsip</a>
                `;
                layer.bindPopup(popupContent);
            }
        }).addTo(map);
    })
    .catch(error => console.log("Gagal memuat data:", error));
