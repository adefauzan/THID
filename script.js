// 1. Inisialisasi peta (fokus ke Indonesia)
var map = L.map('map').setView([-7.2575, 112.7521], 6); // Fokus awal ke Surabaya/Jawa

// 2. Tambahkan Base Map (Tema Abu-abu/Gelap cocok untuk arsip sejarah)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors | Colonial Tomb Archive ID'
}).addTo(map);

// 3. Fungsi untuk memanggil data GeoJSON
// Pastikan anda sudah memiliki file 'data.geojson' di repositori
fetch('data.geojson')
    .then(response => response.json())
    .then(geojsonData => {
        L.geoJSON(geojsonData, {
            onEachFeature: function (feature, layer) {
                // Menampilkan informasi dari metadata FAIR
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
