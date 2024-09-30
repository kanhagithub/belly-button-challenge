// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
  console.log(`Data: ${data}`);

    // get the metadata field
  const metadata = data.metadata;


    // Filter the metadata for the object with the desired sample number
  const filteredMetadata = metadata.filter(obj => obj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
  let sampleMetadataPanel = d3.select("#sample-metadata");  

    // Use `.html("") to clear any existing metadata
    sampleMetadataPanel.html(""); 

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    if (filteredMetadata) {
      // Loop through each key-value pair in the filtered metadata object
      Object.entries(filteredMetadata).forEach(([key, value]) => {
        // Append a new <p> element for each key-value pair
        sampleMetadataPanel.append("p").text(`${key}: ${value}`);
      });
    } else {
      // If no sample is found
      sampleMetadataPanel.append("p").text(`Sample with ID ${sample} not found.`);
    }
  })
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
  const samples = data.samples;

    // Filter the samples for the object with the desired sample number
  const filteredSampledata = samples.filter(obj1 => obj1.id === (sample))[0];

    // Get the otu_ids, otu_labels, and sample_values
  const otu_ids = filteredSampledata.otu_ids;
  const otu_labels = filteredSampledata.otu_labels;
  const sample_values = filteredSampledata.sample_values;

    // Build a Bubble Chart
    let bubbleData = [{
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
        colorscale: 'Earth'
      }
    }];

    let bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 30 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 50 }
    };

    // Render the Bubble Chart
  
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [{
      x: sample_values.slice(0, 10).reverse(),
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0, 10).reverse(),
      type: 'bar',
      orientation: 'h'
    }];

    let barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Render the Bar Chart
    Plotly.newPlot("bar", barData, barLayout);
  
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    const samplenames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dataSetDropDown = d3.select("#selDataset"); 

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    samplenames.forEach((sample) => {
      dataSetDropDown.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list
    let firstSample = samplenames[0]

    // Build charts and metadata panel with the first sample
    buildMetadata(firstSample);
    buildCharts(firstSample);

  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
}

// Initialize the dashboard
init();
