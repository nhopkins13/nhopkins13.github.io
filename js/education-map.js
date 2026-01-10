document.addEventListener("DOMContentLoaded", function () {
  
  var map = L.map('map', {
    minZoom: 4,
    maxZoom: 18,
    worldCopyJump: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  const universities = [
    { name: "Colorado School of Mines", location: [39.7510, -105.2220], info: "Golden, Colorado, USA" },
    { name: "Budapest University of Technology and Economics", location: [47.4810, 19.0551], info: "Budapest, Hungary" },
    { name: "Algebra University College", location: [45.8150, 15.9819], info: "Zagreb, Croatia" },
    { name: "Shawnee Mission South High School", location: [38.936667, -94.653333], info: "Overland Park, Kansas, USA"}
  ];

    const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconSize: [45, 71],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

  const markers = universities.map(u => {
    const marker = L.marker(u.location, { icon: defaultIcon }).addTo(map);

    marker.bindTooltip(
      `<strong>${u.name}</strong><br>${u.info}`,
      {
        permanent: true,
        direction: "top",
        offset: [0, -70],
        className: "big-tooltip"
      }
    );

    return marker;
  });

  const group = L.featureGroup(markers);
  map.fitBounds(group.getBounds().pad(0.9));
  const bounds = group.getBounds().pad(0.9);
  map.setMaxBounds(bounds);

  map.on('zoomend', function() {
    if (map.getZoom() < map.getBoundsZoom(bounds)) {
      map.setZoom(map.getBoundsZoom(bounds));
    }
  });

  const logoRow = document.getElementById('logo-row');
  if (logoRow) {
    const eduLogos = Array.from(document.querySelectorAll('.edu-logo'));
    eduLogos.forEach((sourceImg, index) => {
      const thumb = document.createElement('img');
      thumb.className = 'map-logo';
      thumb.src = sourceImg.src;
      thumb.alt = sourceImg.alt || (universities[index] && universities[index].name) || `logo-${index}`;

      thumb.addEventListener('click', () => {
        document.querySelectorAll('.map-logo').forEach(i => i.classList.remove('selected'));
        thumb.classList.add('selected');
        const marker = markers[index];
        if (marker) {
          map.setView(marker.getLatLng(), 14, { animate: true });
        }
      });

      logoRow.appendChild(thumb);
    });
  }

});