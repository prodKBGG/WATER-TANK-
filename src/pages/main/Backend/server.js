const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const ChartJSNodeCanvas = require("chartjs-node-canvas");
const { stringify } = require("querystring");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/waterflow", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log("MongoDB connected successfully to waterflow database")
  )
  .catch((err) => console.error("MongoDB connection error:", err));

const dailyWaterOutputSchema = new mongoose.Schema(
  {
    deviceName: String,
    dailyOutput: Number,
    waterLevel: Number,
    date: { type: Date, unique: true }, // Added 'unique' to prevent duplicate dates
  },
  { collection: "dailyoutputs" }
);

// Define schema for data collection
const dataSchema = new mongoose.Schema({
  totalWaterOutput: { type: Number, required: true },
  weeklyData: { type: [Number], default: Array(7).fill(0) },
});

const DataModel = mongoose.model("Data", dataSchema);
const DailyWaterOutputModel = mongoose.model(
  "DailyOutput",
  dailyWaterOutputSchema
);

// Initialize database with default data if empty
const initializeData = async () => {
  try {
    const count = await DataModel.countDocuments();
    if (count === 0) {
      await new DataModel({
        totalWaterOutput: 0,
        weeklyData: Array(7).fill(0),
      }).save();
    }
  } catch (error) {
    console.error("Error initializing data:", error);
  }
};
initializeData();

app.post("/save-daily-data", async (req, res) => {
  try {
    const { dailyOutput, waterLevel, date, deviceName } = req.body;

    if (dailyOutput === undefined || !date) {
      return res
        .status(400)
        .json({ message: "Daily water output and date must be provided" });
    }

    // Convert the date from the frontend into UTC and ensure it's handled correctly
    const localDate = new Date(date); // Get date from frontend (local time)
    const utcDate = localDate.toISOString().split("T")[0]; // Convert to UTC date only (YYYY-MM-DD)

    // Check if a document already exists for the requested date
    const existingDoc = await DailyWaterOutputModel.findOne({ date: utcDate });

    if (existingDoc) {
      // Update existing document
      existingDoc.dailyOutput += dailyOutput;
      await existingDoc.save();
      res.status(200).json({
        message: "Daily water output updated successfully",
        data: existingDoc,
      });
    } else {
      // Create new document with UTC date
      const newOutput = {
        deviceName: deviceName,
        dailyOutput: parseFloat(dailyOutput),
        waterLevel: parseInt(waterLevel),
        date: date,
      };

      const savedDocument = await DailyWaterOutputModel.create(newOutput);
      res.status(200).json({
        message: "Daily water output saved successfully",
        data: savedDocument,
      });
    }
  } catch (error) {
    console.error("Error saving daily water output:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/getall", async (req, res) => {
  try {
    const dailyOutputData = await DailyWaterOutputModel.find(); // Fetch all data from dailyoutputs collection

    if (dailyOutputData.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({ data: dailyOutputData });
  } catch (error) {
    console.error("Error fetching all daily water output:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/get-daily-output", async (req, res) => {
  try {
    const { date } = req.query; // Ambil tanggal dari query parameter

    if (!date) {
      return res.status(400).json({ message: "Date must be provided" });
    }

    const targetDate = new Date(date); // Mengubah tanggal string menjadi object Date
    const formattedDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    ); // Menghapus waktu dari tanggal

    const dailyOutputData = await DailyWaterOutputModel.find({
      date: formattedDate,
    });

    if (dailyOutputData.length === 0) {
      return res.status(404).json({ message: "No data found for this date" });
    }

    res.status(200).json({ data: dailyOutputData });
  } catch (error) {
    console.error("Error fetching daily water output:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// POST endpoint to update total water output data in the database
app.post("/data", async (req, res) => {
  try {
    const { totalWaterOutput } = req.body;
    if (totalWaterOutput === undefined) {
      return res
        .status(400)
        .json({ message: "Total water output must be provided" });
    }

    const updateResult = await DataModel.findOneAndUpdate(
      {},
      { $set: { totalWaterOutput } },
      { new: true, upsert: true }
    );

    return res.status(200).json(updateResult);
  } catch (error) {
    console.error("Error updating data:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Get weekly water data from MongoDB
app.get("/weekly-data", async (req, res) => {
  try {
    const data = await DataModel.findOne();
    if (!data) {
      return res.status(404).json({ message: "No weekly water data found" });
    }
    res.status(200).json({ weeklyData: data.weeklyData });
  } catch (error) {
    console.error("Error retrieving weekly data:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Get current total water output data from database
app.get("/data", async (req, res) => {
  try {
    const data = await DataModel.findOne();
    if (!data) {
      return res.status(404).json({ message: "No data found" });
    }
    res.json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
});

// Catch-all route for unmatched endpoints (optional)
app.use((req, res) => {
  res.status(404).send({ message: "Not Found" });
});

// Start the Express server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
