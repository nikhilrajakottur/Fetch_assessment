const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

let receipts = {};

// Function to calculate the points based on given rules
function calculatePoints(receipt) {
    let points = 0;

    // One point for every alphanumeric character in the retailer name
    points += receipt.retailer.replace(/[^a-zA-Z0-9]/g, "").length;

    // 50 points if the total is a round dollar amount (no cents)
    const total = parseFloat(receipt.total);
    if (total % 1 === 0) {
        points += 50;
    }

    // 25 points if the total is a multiple of 0.25
    if (total % 0.25 === 0) {
        points += 25;
    }

    // 5 points for every two items on the receipt
    points += Math.floor(receipt.items.length / 2) * 5;

    // If the trimmed length of the item description is a multiple of 3,
    // multiply the price by 0.2 and round up
    receipt.items.forEach((item) => {
        const description = item.shortDescription.trim();
        const price = parseFloat(item.price);
        if (description.length % 3 === 0) {
            points += Math.ceil(price * 0.2);
        }
    });

    // 5 extra points if the total is greater than 10.00
    if (total > 10.00) {
        points += 5;
    }

    // 6 points if the day in the purchase date is odd
    const day = parseInt(receipt.purchaseDate.split("-")[2], 10);
    if (day % 2 !== 0) {
        points += 6;
    }

    // 10 points if the purchase time is between 2:00 PM and 4:00 PM
    const [hour] = receipt.purchaseTime.split(":").map(Number);
    if (hour >= 14 && hour < 16) {
        points += 10;
    }

    return points;
}

// POST /receipts/process - This stores a receipt and returns the ID
app.post("/receipts/process", (req, res) => {
    try {
        const receipt = req.body;
        const id = uuidv4();
        receipts[id] = receipt;
        res.json({ id });
    } catch (error) {
        res.status(400).json({ error: "Invalid receipt format" });
    }
});

// GET /receipts/{id}/points - It will retrieve the points for a receipt
app.get("/receipts/:id/points", (req, res) => {
    const id = req.params.id;
    if (!receipts[id]) {
        return res.status(404).json({ error: "Receipt not found" });
    }

    const points = calculatePoints(receipts[id]);
    res.json({ points });
});

// Starting the server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
