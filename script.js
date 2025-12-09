function scanText() {
    const text = document.getElementById("inputText").value.trim();
    const resultBox = document.getElementById("result");

    if (text === "") {
        resultBox.innerHTML = "<p>Please enter some text to scan.</p>";
        return;
    }

    let warnings = [];
    let score = 0;

    // --- URL Pattern Detection ---
    const urlPattern = /(https?:\/\/[^\s]+)/gi;
    const urls = text.match(urlPattern);

    if (urls) {
        urls.forEach(url => {
            if (url.includes("http://")) {
                warnings.push("⚠ URL uses **HTTP**, not secure HTTPS.");
                score += 20;
            }
            if (url.match(/\d+\.\d+\.\d+\.\d+/)) {
                warnings.push("⚠ URL contains an **IP address**, often used in phishing.");
                score += 20;
            }
            if (url.split(".").length > 4) {
                warnings.push("⚠ URL has **too many subdomains** (possible phishing).");
                score += 15;
            }
            if (url.includes("login") || url.includes("verify") || url.includes("update")) {
                warnings.push("⚠ URL contains suspicious keywords: login/verify/update.");
                score += 15;
            }
        });
    }

    // --- Email / Message Scam Words ---
    const scamWords = [
        "urgent", "verify", "update", "password", "bank", 
        "click here", "limited time", "confirm now", "suspended"
    ];

    scamWords.forEach(word => {
        if (text.toLowerCase().includes(word)) {
            warnings.push(`⚠ Suspicious keyword detected: **${word}**`);
            score += 5;
        }
    });

    // --- Final Result Display ---
    let riskLevel = "Safe";
    let color = "#0f0";

    if (score > 60) {
        riskLevel = "High Risk";
        color = "#f00";
    } else if (score > 30) {
        riskLevel = "Medium Risk";
        color = "#ff0";
    }

    resultBox.innerHTML = `
        <h3 style="color:${color}">Risk Level: ${riskLevel}</h3>
        <p><strong>Score:</strong> ${score}/100</p>
        <hr>
        <p>${warnings.length ? warnings.join("<br>") : "No phishing indicators found."}</p>
    `;
}
