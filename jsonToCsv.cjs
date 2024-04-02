const fs = require("fs");
const path = require("path");
const csvWriter = require("csv-writer").createObjectCsvWriter;

// Directory containing JSON files
const directory = "./storage/datasets/default";

// Array to hold data for CSV
let csvData = [];

// Read all JSON files from the directory
fs.readdirSync(directory).forEach((file) => {
  const filePath = path.join(directory, file);
  const jsonData = JSON.parse(fs.readFileSync(filePath, "utf8"));

  // Extract required fields from JSON data
  const { title, vendor, description, price, text, location } = jsonData;

  // Add data to CSV array
  csvData.push({ title, vendor, description, price, text, location });
});

// Define CSV file path and header
const csvFilePath = "./storage/data.csv";
const csvHeader = [
  { id: "title", title: "Title" },
  { id: "vendor", title: "Vendor" },
  { id: "description", title: "Description" },
  { id: "price", title: "Price" },
  { id: "text", title: "Text" },
  { id: "location", title: "Location" },
];

// Create CSV writer
const csvWriterInstance = csvWriter({
  path: csvFilePath,
  header: csvHeader,
});

// Write data to CSV file
csvWriterInstance
  .writeRecords(csvData)
  .then(() => console.log("CSV file created successfully"))
  .catch((err) => console.error("Error writing CSV file:", err));
