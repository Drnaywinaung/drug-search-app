// server.js

const express = require('express');
const path = require('path');
const fs = require('fs').promises; // Use the promise-based version of fs

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the static front-end files (html, css, client-side js)
app.use(express.static('public'));

// Create our API endpoint for search
app.get('/api/search', async (req, res) => {
    // Get the search query from the URL (e.g., /api/search?q=para)
    const { q } = req.query;

    if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    const firstLetter = q.toLowerCase().charAt(0);
    const filePath = path.join(__dirname, 'data', `${firstLetter}.json`);

    try {
        // Read the correct JSON file from the server's local 'data' folder
        const fileContent = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContent);

        // Perform the filtering logic on the server
        const matches = data.filter(drug => {
            const nameMatch = drug.name && drug.name.toLowerCase().includes(q.toLowerCase());
            const composition1Match = drug.short_composition1 && drug.short_composition1.toLowerCase().includes(q.toLowerCase());
            const composition2Match = drug.short_composition2 && drug.short_composition2.toLowerCase().includes(q.toLowerCase());
            return nameMatch || composition1Match || composition2Match;
        });

        // Send back ONLY the matching results
        res.json(matches);

    } catch (error) {
        // If file doesn't exist (e.g., for 'x.json') or other error occurs
        if (error.code === 'ENOENT') {
            return res.json([]); // Send back an empty array for no results
        }
        console.error(error);
        res.status(500).json({ error: 'An error occurred on the server.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});