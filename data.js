// Load the LA neighborhoods GeoJSON file and display it on the map
fetch("data/LA_Neighborhood_Boundaries.geojson")
  .then((response) => response.json())
  .then((data) => {
    // Add the GeoJSON data as a source to the map
    map.addSource("la-neighborhoods", {
      type: "geojson",
      data: data,
    });

    // Add a layer to display the polygons
    map.addLayer({
      id: "neighborhoods-layer",
      type: "fill",
      source: "la-neighborhoods",
      paint: {
        "fill-color": "#088",
        "fill-opacity": 0.5,
      },
    });

    // Add a border to the polygons
    map.addLayer({
      id: "neighborhoods-borders",
      type: "line",
      source: "la-neighborhoods",
      paint: {
        "line-color": "#000",
        "line-width": 1,
      },
    });

    // Add a layer for labels using the neighborhood name
    map.addLayer({
      id: "neighborhood-labels",
      type: "symbol",
      source: "la-neighborhoods",
      layout: {
        "text-field": ["get", "name"], // Get the name property for labels
        "text-font": ["Open Sans Bold", "Arial Unicode MS Bold"], // Font for the labels
        "text-size": 12, // Font size for the labels
        "text-offset": [0, 0.5], // Offset for better placement
        "text-anchor": "top", // Anchor position for the text
      },
      paint: {
        "text-color": "#000", // Label text color
        "text-halo-color": "#fff", // Halo color for better visibility
        "text-halo-width": 1, // Width of the halo around the text
      },
    });
  })
  .catch((error) =>
    console.error("Error loading LA neighborhoods GeoJSON:", error)
  );

// Add a data source and display points with pop-ups
fetch("data/Food.geojson")
  .then((response) => response.json())
  .then((data) => {
    // Add the GeoJSON data as a source to the map
    map.addSource("food-data", {
      type: "geojson",
      data: data,
    });

    // Add a layer to display the points
    map.addLayer({
      id: "food-points",
      type: "circle",
      source: "food-data",
      paint: {
        "circle-radius": 6,
        "circle-color": "#FF5722",
      },
    });

    // Add a click event to show pop-ups with all properties
    map.on("click", "food-points", (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const properties = e.features[0].properties;

      // Create a pop-up content string with all properties
      let popupContent = "<strong>Properties:</strong><br>";
      for (const [key, value] of Object.entries(properties)) {
        popupContent += `<strong>${key}:</strong> ${value || "N/A"}<br>`;
      }

      // Display the pop-up
      new maplibregl.Popup()
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map);
    });

    // Change the cursor to a pointer when hovering over the points
    map.on("mouseenter", "food-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "food-points", () => {
      map.getCanvas().style.cursor = "";
    });
  })
  .catch((error) => console.error("Error loading GeoJSON data:", error));


  // Load the school data GeoJSON file and display it on the map
fetch('data/LA_Schools_Colleges_Universities.geojson')
.then(response => response.json())
.then(data => {
    // Add the GeoJSON data as a source to the map
    map.addSource('school-data', {
        type: 'geojson',
        data: data
    });

    // Add a layer to display the points
    map.addLayer({
        id: 'school-points',
        type: 'circle',
        source: 'school-data',
        paint: {
            'circle-radius': 6,
            'circle-color': '#2196F3'
        }
    });

    // Add a click event to show pop-ups with relevant fields
    map.on('click', 'school-points', (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();
        const properties = e.features[0].properties;

        // Create a pop-up content string with relevant fields
        const popupContent = `
            <strong>${properties.name}</strong><br>
            <strong>Address:</strong> ${properties.addrln1 || ''} ${properties.addrln2 || ''}, ${properties.city}, ${properties.state} ${properties.zip}<br>
            <strong>Category:</strong> ${properties.cat1} > ${properties.cat2} > ${properties.cat3}<br>
            <strong>Enrollment:</strong> ${properties.enrollment || 'N/A'}
        `;

        // Display the pop-up
        new maplibregl.Popup()
            .setLngLat(coordinates)
            .setHTML(popupContent)
            .addTo(map);
    });

    // Change the cursor to a pointer when hovering over the points
    map.on('mouseenter', 'school-points', () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    map.on('mouseleave', 'school-points', () => {
        map.getCanvas().style.cursor = '';
    });
})
.catch(error => console.error('Error loading school GeoJSON data:', error));

