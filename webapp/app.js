let totalCoins = 0;
let lastClaimTime = 0;
const CLAIM_AMOUNT = 700;
const CLAIM_INTERVAL = 7 * 60 * 60 * 1000; // 7 hours in milliseconds

document.addEventListener("DOMContentLoaded", () => {
    const claimButton = document.getElementById("claim-button");
    const totalCoinsDisplay = document.getElementById("total-coins");
    const referralLinkDisplay = document.getElementById("referral-link");

    // Load previous data from localStorage if available
    totalCoins = parseInt(localStorage.getItem("totalCoins")) || 0;
    lastClaimTime = parseInt(localStorage.getItem("lastClaimTime")) || 0;
    totalCoinsDisplay.textContent = totalCoins;

    // Update claim button status
    updateClaimButton();

    // Claim button event listener
    claimButton.addEventListener("click", () => {
        totalCoins += CLAIM_AMOUNT;
        totalCoinsDisplay.textContent = totalCoins;
        lastClaimTime = Date.now();
        localStorage.setItem("totalCoins", totalCoins);
        localStorage.setItem("lastClaimTime", lastClaimTime);
        updateClaimButton();
    });

    // Referral link generation
    referralLinkDisplay.textContent = generateReferralLink();

    function updateClaimButton() {
        const timeSinceLastClaim = Date.now() - lastClaimTime;
        if (timeSinceLastClaim >= CLAIM_INTERVAL) {
            claimButton.disabled = false;
            claimButton.textContent = "Claim 700 Nepalicrypto";
        } else {
            claimButton.disabled = true;
            claimButton.textContent = `Next claim available in ${formatTimeRemaining(CLAIM_INTERVAL - timeSinceLastClaim)}`;
            setTimeout(updateClaimButton, 1000);
        }
    }

    function generateReferralLink() {
        const userCode = "user-" + Math.random().toString(36).substr(2, 9);
        return `https://nepalicrypto.com/referral/${userCode}`;
    }

    function formatTimeRemaining(ms) {
        const hours = Math.floor(ms / (60 * 60 * 1000));
        const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((ms % (60 * 1000)) / 1000);
        return `${hours}h ${minutes}m ${seconds}s`;
    }
});
