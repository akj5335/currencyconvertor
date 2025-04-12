// DOM Elements
const currencyFirstEl = document.getElementById("currency-first");
const worthFirstEl = document.getElementById("worth-first");
const currencySecondEl = document.getElementById("currency-second");
const worthSecondEl = document.getElementById("worth-second");
const exchangeRateEl = document.getElementById("exchange-rate");
const swapButtonEl = document.getElementById("swap-button");
const copyButtonEl = document.getElementById("copy-button");
const loadingEl = document.getElementById("loading");
const themeIconEl = document.getElementById("theme-icon");

// API endpoints
const API_URL = "https://api.frankfurter.app/latest";

// Check for saved theme preference
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
    themeIconEl.classList.remove("fa-moon");
    themeIconEl.classList.add("fa-sun");
}

// Initialize
updateRate();

// Functions
async function updateRate() {
    try {
        // Show loading spinner
        loadingEl.style.display = "flex";

        console.log("Fetching exchange rate...");

        // Using exchangerate.host API which is free and doesn't require a key
        const response = await fetch(
            `${API_URL}?base=${currencyFirstEl.value}&symbols=${currencySecondEl.value}`
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response:", data);

        // Frankfurter API doesn't have a success field

        const rate = data.rates[currencySecondEl.value];
        console.log("Exchange rate:", rate);

        if (!rate) {
            throw new Error(`Could not find rate for ${currencySecondEl.value}`);
        }

        // Update UI
        exchangeRateEl.innerText = `1 ${currencyFirstEl.value} = ${rate.toFixed(4)} ${currencySecondEl.value}`;
        worthSecondEl.value = (worthFirstEl.value * rate).toFixed(2);
        exchangeRateEl.style.color = "var(--primary-color)";

    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        exchangeRateEl.innerText = "Error fetching exchange rate. Please try again.";
        exchangeRateEl.style.color = "#e74c3c";
        worthSecondEl.value = "";
    } finally {
        // Hide loading spinner
        loadingEl.style.display = "none";
    }
}

// Swap currencies
function swapCurrencies() {
    const tempCurrency = currencyFirstEl.value;
    currencyFirstEl.value = currencySecondEl.value;
    currencySecondEl.value = tempCurrency;

    const tempWorth = worthFirstEl.value;
    worthFirstEl.value = worthSecondEl.value;

    // Animate swap button
    swapButtonEl.style.transform = "rotate(180deg)";
    setTimeout(() => {
        swapButtonEl.style.transform = "rotate(0deg)";
    }, 300);

    updateRate();
}

// Copy result to clipboard
function copyToClipboard() {
    const textToCopy = `${worthFirstEl.value} ${currencyFirstEl.value} = ${worthSecondEl.value} ${currencySecondEl.value}`;
    navigator.clipboard.writeText(textToCopy)
        .then(() => {
            // Change button text temporarily
            copyButtonEl.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyButtonEl.innerHTML = '<i class="far fa-copy"></i> Copy';
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
        });
}

// Toggle dark/light mode
function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        themeIconEl.classList.remove("fa-moon");
        themeIconEl.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
    } else {
        themeIconEl.classList.remove("fa-sun");
        themeIconEl.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
    }
}

// Event Listeners
currencyFirstEl.addEventListener("change", updateRate);
currencySecondEl.addEventListener("change", updateRate);
worthFirstEl.addEventListener("input", updateRate);
swapButtonEl.addEventListener("click", swapCurrencies);
copyButtonEl.addEventListener("click", copyToClipboard);
themeIconEl.addEventListener("click", toggleTheme);