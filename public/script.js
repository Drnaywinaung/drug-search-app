// public/script.js

// --- Get DOM Elements ---
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('resultsContainer');

// --- Event Listener ---
searchInput.addEventListener('input', handleSearch);

// --- Helper function to show loader ---
function showLoader() {
  resultsContainer.innerHTML = '<div class="loader"></div>';
}

async function handleSearch(event) {
    const query = event.target.value.toLowerCase().trim();

    if (query.length === 0) {
        resultsContainer.innerHTML = '<p>Enter a drug name to begin your search.</p>';
        return;
    }

    showLoader();

    // The URL now points to YOUR OWN server's API endpoint
    const url = `/api/search?q=${query}`;

    try {
        const response = await fetch(url);
        // The data is ALREADY filtered by the server!
        const matches = await response.json(); 

        // We don't need to filter here. We just display the results.
        displayResults(matches);

    } catch (error) {
        console.error("Failed to fetch search results:", error);
        resultsContainer.innerHTML = '<p>An error occurred while searching.</p>';
    }
}

// --- THIS IS THE FUNCTION THAT WAS LIKELY MISSING ---
function displayResults(matches) {
    // Clear the loader
    resultsContainer.innerHTML = '';

    if (matches.length === 0) {
        displayNoResults();
        return;
    }

    // Create and append a result item for each match
    matches.forEach(drug => {
        const resultElement = document.createElement('div');
        resultElement.classList.add('result-item');

        // Combine composition fields
        let composition = drug.short_composition1 ? drug.short_composition1.trim() : 'N/A';
        if (drug.short_composition2 && drug.short_composition2.trim() !== "") {
            composition += ` + ${drug.short_composition2.trim()}`;
        }

        // Build the HTML for the result item
        resultElement.innerHTML = `
            <h3>${drug.name || 'Name not available'}</h3>
            <p><strong>Composition:</strong> ${composition}</p>
            ${drug.manufacturer_name ? `<p><strong>Manufacturer:</strong> ${drug.manufacturer_name}</p>` : ''}
            ${drug.pack_size_label ? `<p><strong>Pack Size:</strong> ${drug.pack_size_label}</p>` : ''}
            ${drug.medicine_desc ? `<p><strong>Description:</strong> ${drug.medicine_desc}</p>` : ''}
            ${drug.side_effects ? `<p><strong>Side Effects:</strong> ${drug.side_effects}</p>` : ''}
        `;
        resultsContainer.appendChild(resultElement);
    });
}

// --- THIS FUNCTION WAS ALSO LIKELY MISSING ---
function displayNoResults() {
     resultsContainer.innerHTML = '<p>No matching drugs found.</p>';
}