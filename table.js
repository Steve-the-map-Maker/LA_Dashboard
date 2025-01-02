// Function to populate the DataTable with features
function populateDataTable(features) {
  // Convert features to DataTables-friendly format
  const data = features.map((feature) => {
    const properties = feature.properties;
    return [
      properties.name || "N/A",
      properties.cat2 || "N/A",
      properties.cat3 || "N/A",
      `${properties.addrln1 || ""} ${properties.city || ""}, ${
        properties.state || ""
      } ${properties.zip || ""}`,
      properties.enrollment || "N/A",
    ];
  });

  const table = $("#data-table").DataTable({
    data: data,
    destroy: true, // Allows re-initialization
    columns: [
      { title: "Name" },
      { title: "Type" },
      { title: "Category" },
      { title: "Address" },
      { title: "Enrollment", type: "num" }, // Specify numeric type for Enrollment
    ],
    dom: "lBfrtip", // Add filtering input and controls
    pageLength: 10, // Default number of rows
    lengthMenu: [5, 10, 25, 50, 100], // Dropdown options for rows per page
    order: [[4, "desc"]], // Default sorting: Enrollment, descending
  });

  // Add click event for row highlighting
  $("#data-table tbody").on("click", "tr", function () {
    $(this).toggleClass("selected").siblings().removeClass("selected");

    // Get the clicked row's data
    const rowIndex = table.row(this).index();
    const feature = features[rowIndex]; // Match row index to feature array

    // Highlight the feature on the map
    highlightFeature(feature);
  });

  // Enable column-specific filtering
  enableColumnFiltering(table);
}

// Function to enable column-specific filtering
function enableColumnFiltering(table) {
  // Add a text input or dropdown filter for each column in the table
  $("#data-table thead th").each(function (index) {
    const title = $(this).text();
    if (title === "Type" || title === "Category") {
      // Add dropdown filters for specific columns
      $(this).append(`
                  <select class="column-filter" data-index="${index}">
                      <option value="">All</option>
                  </select>
              `);
    } else {
      // Add text inputs for other columns
      $(this).append(`
                  <input type="text" class="column-filter" data-index="${index}" placeholder="Filter ${title}" />
              `);
    }
  });

  // Populate dropdown filters dynamically
  table.columns().every(function (index) {
    const column = this;
    if (index === 1 || index === 2) {
      // Assuming Type and Category are columns 1 and 2
      const uniqueValues = new Set(column.data().toArray());
      uniqueValues.forEach((value) => {
        const sanitizedValue = value.replace(/"/g, "&quot;");
        $(`select[data-index="${index}"]`).append(
          `<option value="${sanitizedValue}">${sanitizedValue}</option>`
        );
      });
    }
  });

  // Add event listeners for filtering
  $(".column-filter").on("keyup change", function () {
    const columnIndex = $(this).data("index");
    const searchValue = $(this).val();
    table.column(columnIndex).search(searchValue).draw();
  });
}

// Function to highlight a feature on the map
function highlightFeature(feature) {
  const coordinates = feature.geometry.coordinates;

  // Fly to the selected feature
  map.flyTo({
    center: coordinates,
    zoom: 14,
  });

  // Add or update the highlight layer
  if (!map.getLayer("highlighted-point")) {
    map.addLayer({
      id: "highlighted-point",
      type: "circle",
      source: {
        type: "geojson",
        data: feature,
      },
      paint: {
        "circle-radius": 10,
        "circle-color": "#FF0000",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#000000",
      },
    });
  } else {
    map.getSource("highlighted-point").setData(feature);
  }
}

// Function to update the DataTable from map features
function updateDataTableFromMap() {
  const schoolSource = map.getSource("school-data");
  const foodSource = map.getSource("food-data");

  if (schoolSource && foodSource) {
    const schoolFeatures = schoolSource._data.features || [];
    const foodFeatures = foodSource._data.features || [];

    // Combine features
    const combinedFeatures = [...schoolFeatures, ...foodFeatures];

    populateDataTable(combinedFeatures);
  }
}

// Initialize table after map loads
map.on("load", () => {
  updateDataTableFromMap();
});
