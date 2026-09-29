let inventoryData = [
    { name: "Longsword", type: "weapon", description: "A versatile melee weapon" },
    { name: "Shield", type: "armor", description: "Wooden shield with steel reinforcement" },
    { name: "Leather Armor", type: "armor", description: "Light protective gear" },
    { name: "Backpack", type: "equipment", description: "For carrying supplies" },
    { name: "Bedroll", type: "equipment", description: "For resting outdoors" },
    { name: "Rope (50ft)", type: "equipment", description: "Hempen rope, useful for climbing" },
    { name: "Waterskin", type: "equipment", description: "Holds up to 4 pints of liquid" },
    { name: "Rations (days)", type: "consumable", description: "10 days worth of food" },
    { name: "Torch", type: "equipment", description: "Provides light in darkness" },
    { name: "Gold Pieces", type: "currency", description: "45 GP in total" },
];

let draggedIndex = null;

// Currency data
let currencyData = {
    'cp': 0,
    'sp': 0,
    'gp': 0,
    'pp': 0
};

const currencyInfo = {
    'cp': { name: 'Copper', ratio: 0.01 },
    'sp': { name: 'Silver', ratio: 0.1 },
    'gp': { name: 'Gold', ratio: 1 },
    'pp': { name: 'Platinum', ratio: 10 }
};

const conversionMap = {
    cp: { upTo: 'sp', upCost: 10, downFrom: 'sp', downGain: 10 },
    sp: { upTo: 'gp', upCost: 10, downFrom: 'gp', downGain: 10 },
    gp: { upTo: 'pp', upCost: 10, downFrom: 'pp', downGain: 10 },
    pp: { upTo: null, upCost: null, downFrom: null, downGain: null }
};

// Load from localStorage
function loadInventory() {
    const saved = localStorage.getItem('inventoryData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) {
                inventoryData.length = 0;
                inventoryData.push(...parsed);
            }
        } catch (e) {
            console.error('Error loading inventory:', e);
        }
    }
    
    const savedCurrency = localStorage.getItem('currencyData');
    if (savedCurrency) {
        try {
            const parsed = JSON.parse(savedCurrency);
            currencyData = {
                cp: Number.isFinite(+parsed?.cp) ? Math.max(0, Math.floor(+parsed.cp)) : 0,
                sp: Number.isFinite(+parsed?.sp) ? Math.max(0, Math.floor(+parsed.sp)) : 0,
                gp: Number.isFinite(+parsed?.gp) ? Math.max(0, Math.floor(+parsed.gp)) : 0,
                pp: Number.isFinite(+parsed?.pp) ? Math.max(0, Math.floor(+parsed.pp)) : 0
            };
        } catch (e) {
            console.error('Error loading currency:', e);
            currencyData = { cp: 0, sp: 0, gp: 0, pp: 0 };
        }
    }

    loadCurrencyInputs();
}

// Load currency values into input fields
function loadCurrencyInputs() {
    Object.keys(currencyData).forEach((key) => {
        const input = document.getElementById(`${key}-input`);
        if (input) input.value = Math.max(0, parseInt(currencyData[key] || 0, 10));
    });
    updateTotalGold();
}

// Save to localStorage
function saveInventory() {
    localStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    localStorage.setItem('currencyData', JSON.stringify(currencyData));
}

function displayInventory() {
    const tbody = document.getElementById('inventory-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!Array.isArray(inventoryData)) inventoryData = [];

    inventoryData.forEach((item, index) => {
        const row = document.createElement('tr');
        row.dataset.index = index;
        row.innerHTML = `
            <td class="drag-handle" data-index="${index}" draggable="true">≡</td>
            <td contenteditable="true" class="editable name-cell" data-index="${index}" data-field="name" spellcheck="false">${escapeHtml(item.name || '')}</td>
            <td contenteditable="true" class="editable type-cell" data-index="${index}" data-field="type" spellcheck="false">${escapeHtml(item.type || '')}</td>
            <td contenteditable="true" class="editable description-cell" data-index="${index}" data-field="description" spellcheck="false">${escapeHtml(item.description || '')}</td>
            <td class="action-col"><button class="delete-btn" data-index="${index}" type="button">−</button></td>
        `;
        tbody.appendChild(row);

        const dragHandle = row.querySelector('.drag-handle');
        dragHandle.addEventListener('dragstart', handleDragStart);
        dragHandle.addEventListener('dragend', handleDragEnd);

        row.addEventListener('dragover', handleDragOver);
        row.addEventListener('drop', handleDrop);

        row.querySelector('.delete-btn').addEventListener('click', (e) => {
            deleteRow(parseInt(e.currentTarget.dataset.index, 10));
        });
    });

    document.querySelectorAll('.editable').forEach((cell) => {
        cell.addEventListener('blur', (e) => {
            const index = parseInt(e.target.dataset.index, 10);
            const field = e.target.dataset.field;
            inventoryData[index][field] = (e.target.textContent || '').replace(/\r\n/g, '\n');
            saveInventory();
        });
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function handleDragStart(e) {
    draggedIndex = parseInt(e.currentTarget.parentElement.dataset.index);
    e.currentTarget.parentElement.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const targetIndex = parseInt(e.currentTarget.dataset.index);
    
    if (draggedIndex !== null && draggedIndex !== targetIndex) {
        const draggedItem = inventoryData[draggedIndex];
        inventoryData.splice(draggedIndex, 1);
        inventoryData.splice(targetIndex, 0, draggedItem);
        saveInventory();
        displayInventory();
    }
}

function handleDragEnd(e) {
    e.currentTarget.parentElement.classList.remove('dragging');
    draggedIndex = null;
}

function deleteRow(index) {
    inventoryData.splice(index, 1);
    saveInventory(); // Save after deletion
    displayInventory();
}

function addRow() {
    inventoryData.push({ name: "New Item", type: "equipment", description: "" });
    saveInventory(); // Save after adding
    displayInventory();
}

function updateTotalGold() {
    let totalGold = 0;
    Object.keys(currencyData).forEach(key => {
        totalGold += currencyData[key] * currencyInfo[key].ratio;
    });
    
    const totalElement = document.getElementById('total-gold');
    if (totalElement) {
        totalElement.textContent = `${totalGold.toFixed(2)} gp`;
    }
}

// This function is no longer needed - currency is handled in HTML inputs

document.addEventListener('DOMContentLoaded', () => {
    loadInventory();
    displayInventory();

    const addBtn = document.getElementById('add-row-btn');
    if (addBtn) addBtn.addEventListener('click', addRow);

    document.querySelectorAll('.currency-input').forEach((input) => {
        input.addEventListener('input', (e) => {
            const currency = e.target.dataset.currency;
            if (!currencyData.hasOwnProperty(currency)) return;

            currencyData[currency] = Math.max(0, Math.floor(parseInt(e.target.value || '0', 10)));
            e.target.value = currencyData[currency];
            updateTotalGold();
            updateConversionArrows();
            saveInventory();
        });
    });

    document.querySelectorAll('.currency-arrow').forEach((btn) => {
        btn.addEventListener('click', convertCurrency);
    });

    loadCurrencyInputs();
    updateConversionArrows();
});

function convertCurrency(e) {
    const fromCurrency = e.currentTarget.dataset.from;
    const toCurrency = e.currentTarget.dataset.to;
    if (!fromCurrency || !toCurrency) return;

    // Up conversion (cp->sp, sp->gp, gp->pp)
    if (conversionMap[fromCurrency]?.upTo === toCurrency) {
        const cost = conversionMap[fromCurrency].upCost;
        if (currencyData[fromCurrency] >= cost) {
            currencyData[fromCurrency] -= cost;
            currencyData[toCurrency] += 1;
        } else {
            return;
        }
    }
    // Down conversion (sp->cp, gp->sp, pp->gp)
    else if (conversionMap[toCurrency]?.upTo === fromCurrency) {
        // Example button: from=sp to=cp
        if (currencyData[fromCurrency] >= 1) {
            currencyData[fromCurrency] -= 1;
            currencyData[toCurrency] += conversionMap[toCurrency].upCost; // 10
        } else {
            return;
        }
    } else {
        return;
    }

    loadCurrencyInputs();
    updateConversionArrows();
    saveInventory();
}

function updateConversionArrows() {
    document.querySelectorAll('.currency-arrow').forEach((btn) => {
        const fromCurrency = btn.dataset.from;
        const toCurrency = btn.dataset.to;

        if (!fromCurrency || !toCurrency) {
            btn.disabled = true;
            return;
        }

        if (conversionMap[fromCurrency]?.upTo === toCurrency) {
            btn.disabled = currencyData[fromCurrency] < conversionMap[fromCurrency].upCost;
            return;
        }

        if (conversionMap[toCurrency]?.upTo === fromCurrency) {
            btn.disabled = currencyData[fromCurrency] < 1;
            return;
        }

        btn.disabled = true;
    });
}

// Save inventory before leaving the page
window.addEventListener('beforeunload', () => {
    saveInventory();
});

// Also save when page visibility changes (tab switch, minimize, etc.)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        saveInventory();
    }
});