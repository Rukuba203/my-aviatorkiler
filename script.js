let predictionCount = 0;
let isPremium = false;
let selectedSite = null;

// Auto check activation
window.onload = function() {
    let activated = localStorage.getItem("aviatorActivated");
    let premiumStatus = localStorage.getItem("aviatorPremium");
    if (premiumStatus === "true") isPremium = true;

    if (activated === "true") {
        showApp();
    }
};

// ✅ Activation Code Verification
function verifyCode() {
    const codeInput = document.getElementById("activationCode").value.trim();
    const error = document.getElementById("codeError");

    error.innerText = "";

    const code = parseInt(codeInput);

    if (isNaN(code)) {
        error.innerText = "Please enter a valid number.";
        return;
    }

    if (code >= 10010 && code <= 11000) {
        localStorage.setItem("aviatorActivated", "true");
        showApp();
    } else {
        error.innerText = "Invalid activation code. Try again.";
    }
}

function showApp() {
    document.getElementById("activationScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    document.getElementById("userDisplay").innerText = "Activated User";

    if (isPremium)
        document.getElementById("premiumBadge").innerText = "★ Premium";
}

function logout() {
    localStorage.removeItem("aviatorActivated");
    location.reload();
}

// 🧠 Prediction Logic
function selectSite(element, site) {
    selectedSite = site;
    document.getElementById("selectedSite").innerText = site;
    document.querySelectorAll(".site").forEach(s => s.classList.remove("active"));
    element.classList.add("active");
}

function generatePrediction() {
    if (!selectedSite) {
        alert("Please select a betting site first!");
        return;
    }

    if (!isPremium && predictionCount >= 3) {
        alert("Free limit reached! Upgrade to Premium.");
        return;
    }

    const loader = document.getElementById("loader");
    const predictionBox = document.getElementById("prediction");
    const confidenceText = document.getElementById("confidenceValue");
    const patternAnalysis = document.getElementById("patternAnalysis");

    loader.style.display = "block";
    patternAnalysis.style.display = "flex";
    predictionBox.innerText = "...";
    confidenceText.innerText = "--";
    confidenceText.className = "";

    setTimeout(() => {
        let multiplier = (Math.random() * 15 + 1).toFixed(2);
        let confidence = Math.floor(Math.random() * 100);

        loader.style.display = "none";
        patternAnalysis.style.display = "none";

        predictionBox.innerText = multiplier + "x";
        confidenceText.innerText = confidence + "%";

        if (confidence > 70) confidenceText.classList.add("green");
        else if (confidence > 40) confidenceText.classList.add("yellow");
        else confidenceText.classList.add("red");

        addToHistory(selectedSite, multiplier);
        predictionCount++;
    }, 2000);
}

function addToHistory(site, value) {
    const history = document.getElementById("history");
    const li = document.createElement("li");
    li.innerText = site + " → " + value + "x";
    history.prepend(li);
}

// 💰 Premium
function upgradeToPremium() {
    const popup = document.createElement("div");
    popup.className = "premium-popup";

    popup.innerHTML = `
        <div class="popup-box">
            <h2>Upgrade to Premium</h2>
            <p>Unlimited Predictions</p>
            <p>Price: $10 (Simulation)</p>
            <button onclick="confirmPayment()">Pay Now</button>
            <button onclick="closePopup()">Cancel</button>
        </div>
    `;

    document.body.appendChild(popup);
}

function confirmPayment() {
    localStorage.setItem("aviatorPremium", "true");
    alert("Payment Successful! Premium Activated.");
    location.reload();
}

function closePopup() {
    document.querySelector(".premium-popup").remove();
}

// 🎲 Live Bets
function randomUser() {
    const names = ["Alex", "John", "Mike", "Sarah", "Lucky", "King", "Queen"];
    return names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100);
}

function generateLiveBet() {
    const liveContainer = document.getElementById("liveBets");
    const betAmount = (Math.random() * 100 + 1).toFixed(2);
    const cashout = (Math.random() * 10 + 1).toFixed(2);
    const betDiv = document.createElement("div");
    betDiv.classList.add("bet-item");
    betDiv.innerHTML = `
        <span>${randomUser()}</span>
        <span class="bet-amount">$${betAmount}</span>
        <span class="cashout">${cashout}x</span>
    `;
    liveContainer.prepend(betDiv);
    if (liveContainer.children.length > 20) liveContainer.removeChild(liveContainer.lastChild);
}
setInterval(generateLiveBet, 1500);

// 💬 Chat
function randomChatUser() {
    const names = ["ProX", "LuckyMan", "QueenBet", "CrashKing", "HighRoller", "SkyMaster", "JetX"];
    return names[Math.floor(Math.random() * names.length)];
}

function randomChatMessage() {
    const messages = [
        "Let's goooo 🚀",
        "Big win incoming!",
        "Cash out early guys",
        "Risky round 👀",
        "100x today!",
        "I lost that one 😭",
        "Next round is big"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

function addChatMessage(user, message, type = "normal") {
    const chatBox = document.getElementById("chatBox");
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("chat-message");
    if (type === "win") msgDiv.classList.add("chat-win");
    if (type === "loss") msgDiv.classList.add("chat-loss");
    msgDiv.innerHTML = `<span class="chat-user">${user}:</span> ${message}`;
    chatBox.appendChild(msgDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (chatBox.children.length > 30) chatBox.removeChild(chatBox.firstChild);
}

setInterval(() => {
    const randomType = Math.random();
    if (randomType > 0.7)
        addChatMessage(randomChatUser(), "Cashed out at " + (Math.random() * 10 + 1).toFixed(2) + "x 🔥", "win");
    else if (randomType < 0.3)
        addChatMessage(randomChatUser(), "Crashed too early 😭", "loss");
    else
        addChatMessage(randomChatUser(), randomChatMessage());
}, 2000);

function sendMessage() {
    const input = document.getElementById("chatInput");
    const message = input.value.trim();
    if (!message) return;
    addChatMessage("You", message);
    input.value = "";
}
