// Initialize the map
const map = new maplibregl.Map({
    container: 'map', // ID of the map container
    style: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json', // OpenStreetMap basemap style
    center: [-118.2437, 34.0522],
    zoom: 9 // Initial zoom level
});

// Add zoom and rotation controls to the map
map.addControl(new maplibregl.NavigationControl(), 'top-right');