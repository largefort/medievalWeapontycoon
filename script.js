let weapons = 0;
let income = 0;
let productionUpgradeCost = 10;
let newWeaponCost = 100;

const produceBtn = document.getElementById('produce-btn');
const weaponCountDisplay = document.getElementById('weapon-count');
const incomeDisplay = document.getElementById('income');
const upgradeBtn = document.getElementById('upgrade-btn');
const buyNewWeaponBtn = document.getElementById('buy-new-weapon-btn');

// Load game progress
document.addEventListener('DOMContentLoaded', () => {
    const request = window.indexedDB.open('weapon_tycoon_db', 1);
    request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.error);
    };
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['game_data'], 'readonly');
        const objectStore = transaction.objectStore('game_data');
        const getRequest = objectStore.get(1);
        getRequest.onerror = function(event) {
            console.error("Error getting game data:", event.target.error);
        };
        getRequest.onsuccess = function(event) {
            const data = event.target.result;
            if (data) {
                weapons = data.weapons;
                income = data.income;
                productionUpgradeCost = data.productionUpgradeCost;
                newWeaponCost = data.newWeaponCost;
                updateDisplays();
            }
        };
    };
});

produceBtn.addEventListener('click', produceWeapon);
upgradeBtn.addEventListener('click', upgradeProduction);
buyNewWeaponBtn.addEventListener('click', buyNewWeapon);

function produceWeapon() {
    weapons++;
    updateDisplays();
}

function upgradeProduction() {
    if (weapons >= productionUpgradeCost) {
        weapons -= productionUpgradeCost;
        productionUpgradeCost *= 2;
        income += 2;
        updateDisplays();
    } else {
        alert("Not enough weapons to upgrade production!");
    }
}

function buyNewWeapon() {
    if (weapons >= newWeaponCost) {
        weapons -= newWeaponCost;
        newWeaponCost *= 2;
        income += 10;
        updateDisplays();
    } else {
        alert("Not enough weapons to buy new weapon!");
    }
}

function updateDisplays() {
    weaponCountDisplay.textContent = `Weapons: ${formatNumber(weapons)}`;
    incomeDisplay.textContent = `Income: $${formatNumber(income)}/s`;
}

function collectIncome() {
    weapons += income;
    updateDisplays();
}

// Save game progress
setInterval(() => {
    const request = window.indexedDB.open('weapon_tycoon_db', 1);
    request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.error);
    };
    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction(['game_data'], 'readwrite');
        const objectStore = transaction.objectStore('game_data');
        const putRequest = objectStore.put({
            id: 1,
            weapons: weapons,
            income: income,
            productionUpgradeCost: productionUpgradeCost,
            newWeaponCost: newWeaponCost
        });
        putRequest.onerror = function(event) {
            console.error("Error putting game data:", event.target.error);
        };
    };
}, 10000); // Save every 10 seconds

// Format large numbers
function formatNumber(number) {
    if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
    if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
    if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
    return number.toString();
}

setInterval(collectIncome, 1000);
