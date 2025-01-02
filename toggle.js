// Function to toggle layer visibility
function toggleLayer(map, layerId, isVisible) {
    const visibility = isVisible ? "visible" : "none";
    if (map.getLayer(layerId)) {
        map.setLayoutProperty(layerId, "visibility", visibility);
    }
}

// Add event listeners for layer toggle controls
document.getElementById("toggle-neighborhoods").addEventListener("change", (e) => {
    const isVisible = e.target.checked;
    toggleLayer(map, "neighborhoods-layer", isVisible);
    toggleLayer(map, "neighborhood-borders", isVisible);
    toggleLayer(map, "neighborhood-labels", isVisible);
});

document.getElementById("toggle-food").addEventListener("change", (e) => {
    const isVisible = e.target.checked;
    toggleLayer(map, "food-points", isVisible);
});



