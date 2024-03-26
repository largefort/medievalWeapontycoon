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
function loadGameProgress() {
    const savedData = localStorage.getItem('weapon_tycoon_data');
    if (savedData) {
        const data = JSON.parse(savedData);
        weapons = data.weapons;
        income = data.income;
        productionUpgradeCost = data.productionUpgradeCost;
        newWeaponCost = data.newWeaponCost;
        updateDisplays();
    }
}

// Save game progress
function saveGameProgress() {
    const data = {
        weapons: weapons,
        income: income,
        productionUpgradeCost: productionUpgradeCost,
        newWeaponCost: newWeaponCost
    };
    localStorage.setItem('weapon_tycoon_data', JSON.stringify(data));
}

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
    saveGameProgress();
}

function formatNumber(number) {
    if (number >= 1e9) return (number / 1e9).toFixed(2) + 'B';
    if (number >= 1e6) return (number / 1e6).toFixed(2) + 'M';
    if (number >= 1e3) return (number / 1e3).toFixed(2) + 'K';
    return number.toString();
}

function collectIncome() {
    weapons += income;
    updateDisplays();
}

// Load game progress on page load
loadGameProgress();

// Set interval to collect income
setInterval(collectIncome, 1000);
