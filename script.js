// 1. Initialize Map
const map = L.map('map', {
    zoomControl: false, 
    attributionControl: false
}).setView([-6.9, 110.4], 7);

// 2. Add Dark Theme Tiles (Keep CartoDB for the black theme)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; KITLV Archive',
    subdomains: 'abcd',
    maxZoom: 20
}).addTo(map);

// Add Zoom Control at bottom right
L.control.zoom({ position: 'bottomright' }).addTo(map);

// 3. Custom Marker Icon (Yellow/Black Theme)
const customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
        <div style="
            background-color: #fbbf24;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid #000;
            box-shadow: 0 0 12px #fbbf24;
        "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -10]
});

// 4. Load Data Logic
// Menggunakan URL Raw dari GitHub agar data bisa dibaca langsung (CORS enabled)
const DATA_URL = 'https://raw.githubusercontent.com/adefauzan/CTAID/main/data/data.geojson';

// Main function to load data
function loadMapData() {
    fetch(DATA_URL)
        .then(response => {
            if (!response.ok) throw new Error("File not found");
            return response.json();
        })
        .then(geojsonData => {
            renderGeoJson(geojsonData);
        })
        .catch(error => {
            console.warn("Gagal memuat main/data.json, menggunakan data sample untuk preview:", error);
            // Fallback to sample data if fetch fails (e.g. locally or preview mode)
            renderGeoJson(sampleData);
        });
}

// Function to render GeoJSON on Map
function renderGeoJson(data) {
    // Update statistic count
    const count = data.features ? data.features.length : 0;
    const statElement = document.getElementById('stat-count');
    if (statElement) {
        statElement.innerText = count;
    }

    L.geoJSON(data, {
        // Transform points to custom icons
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: customIcon });
        },
        // Bind popup to each feature
        onEachFeature: function (feature, layer) {
            // Validate properties to prevent undefined
            const nama = feature.properties.nama || "Tanpa Nama";
            const tahun = feature.properties.tahun_wafat || "?";
            const link = feature.properties.link_arsip || "#";

            const popupContent = `
                <div class="p-1 min-w-[220px]">
                    <div class="flex justify-between items-center mb-2 border-b border-gray-700 pb-1">
                        <span class="text-[10px] text-gray-400 uppercase tracking-wider">Tahun Wafat</span>
                        <span class="text-xs text-amber-400 font-bold font-mono">${tahun}</span>
                    </div>
                    <h3 class="text-lg font-bold text-white mb-3 leading-tight">${nama}</h3>
                    
                    <a href="${link}" target="_blank" class="popup-link">
                        Lihat Arsip KITLV &nearr;
                    </a>
                </div>
            `;
            layer.bindPopup(popupContent);
        }
    }).addTo(map);
}

// --- SAMPLE DATA (Fallback) ---
const sampleData = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "nama": "Tanah Abang (Makam Tua)",
                "tahun_wafat": "1790",
                "link_arsip": "https://www.kitlv.nl"
            },
            "geometry": { "type": "Point", "coordinates": [106.8135, -6.1878] }
        },
        {
            "type": "Feature",
            "properties": {
                "nama": "Makam Peneleh Surabaya",
                "tahun_wafat": "1840",
                "link_arsip": "https://www.kitlv.nl"
            },
            "geometry": { "type": "Point", "coordinates": [112.7378, -7.2575] }
        },
        {
            "type": "Feature",
            "properties": {
                "nama": "Bukit Sentiong Semarang",
                "tahun_wafat": "1810",
                "link_arsip": "https://www.kitlv.nl"
            },
            "geometry": { "type": "Point", "coordinates": [110.4203, -6.9932] }
        }
    ]
};

// 5. Interaction Logic

// Function called by button in HTML
function focusMap() {
    map.flyTo([-6.9, 110.4], 7, { animate: true, duration: 1.5 });
}

// Mouse move event for coordinate display
map.on('mousemove', function(e) {
    const latDisplay = document.getElementById('lat-display');
    const lngDisplay = document.getElementById('lng-display');
    
    if (latDisplay && lngDisplay) {
        latDisplay.innerText = e.latlng.lat.toFixed(4);
        lngDisplay.innerText = e.latlng.lng.toFixed(4);
    }
});

// Run Data Load
loadMapData();
