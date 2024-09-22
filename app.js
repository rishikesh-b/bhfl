const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: "10mb" }));

const USER_ID = "Prakhar Pandey";
const EMAIL = "pr6026@srmist.edu.in";
const ROLL_NUMBER = "RA2111026010341";

app.post("/bfhl", (req, res) => {
  console.log("Received POST request to /bfhl");
  console.log("Request body:", JSON.stringify(req.body));

  try {
    let { data, file_b64 } = req.body;
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch (parseError) {
        console.error("Error parsing data string:", parseError);
        throw new Error("Invalid data format: unable to parse data string");
      }
    }

    if (!Array.isArray(data)) {
      throw new Error("Invalid data format: data must be an array");
    }

    console.log("Processing data array:", JSON.stringify(data));

    const numbers = data.filter((item) => /^\d+$/.test(String(item)));
    const alphabets = data.filter((item) => /^[a-zA-Z]$/.test(String(item)));
    const lowercaseAlphabets = alphabets.filter(
      (char) => char === char.toLowerCase()
    );
    const highest_lowercase =
      lowercaseAlphabets.length > 0
        ? [lowercaseAlphabets.reduce((a, b) => (a > b ? a : b))]
        : [];

    console.log("Processed data:");
    console.log("Numbers:", numbers);
    console.log("Alphabets:", alphabets);
    console.log("Highest lowercase:", highest_lowercase);

    let file_valid = Boolean(file_b64);
    let file_mime_type = null;
    let file_size_kb = null;

    if (file_valid) {
      try {
        const file_content = Buffer.from(file_b64, "base64");
        if (file_content.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
          file_mime_type = "image/png";
        } else if (file_content.slice(0, 4).toString() === "%PDF") {
          file_mime_type = "application/pdf";
        } else {
          file_mime_type = "application/octet-stream";
        }

        file_size_kb = Number((file_content.length / 1024).toFixed(2));
        console.log("File processed successfully");
      } catch (error) {
        console.error("Error processing file:", error);
        file_valid = false;
      }
    } else {
      console.log("No file provided");
    }

    const response = {
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers: numbers,
      alphabets: alphabets,
      highest_lowercase_alphabet: highest_lowercase,
      file_valid: file_valid,
      file_mime_type: file_mime_type,
      file_size_kb: file_size_kb,
    };

    console.log("Sending response:", JSON.stringify(response));
    res.json(response);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(400).json({ is_success: false, error: error.message });
  }
});

app.get("/bfhl", (req, res) => {
  console.log("Received GET request to /bfhl");
  res.json({ operation_code: 1 });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
