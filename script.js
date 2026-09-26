// Character Sheet Manager
class CharacterSheet {
    constructor() {
        this.characterData = {};
        this.initializeEventListeners();
        this.calculateModifiers();
        this.initializeCsvSections();
    }

    initializeEventListeners() {
        // Ability scores
        document.querySelectorAll('.ability-score').forEach(input => {
            input.addEventListener('change', () => this.calculateModifiers());
            input.addEventListener('input', () => this.calculateModifiers());
        });

        // HP calculation
        const maxHpInput = document.getElementById('maxHp');
        const currentHpInput = document.getElementById('currentHp');
        if (maxHpInput) {
            maxHpInput.addEventListener('change', () => {
                if (currentHpInput.value === '' || parseInt(currentHpInput.value) > parseInt(maxHpInput.value)) {
                    currentHpInput.value = maxHpInput.value;
                }
            });
        }

        // Buttons
        document.getElementById('saveBtn')?.addEventListener('click', () => this.saveCharacter());
        document.getElementById('loadBtn')?.addEventListener('click', () => this.loadCharacter());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportCharacter());
        document.getElementById('resetBtn')?.addEventListener('click', () => this.resetForm());
    }

    calculateModifiers() {
        const abilityMappings = [
            ['str', 'strength'],
            ['dex', 'dexterity'],
            ['con', 'constitution'],
            ['int', 'intelligence'],
            ['wis', 'wisdom'],
            ['cha', 'charisma']
        ];
        
        abilityMappings.forEach(([shortName, fullName]) => {
            const input = document.querySelector(`[data-ability="${shortName}"]`) || document.querySelector(`[data-ability="${fullName}"]`);
            if (!input) return;
            const modifier = input.parentElement.querySelector('.modifier');
            const score = parseInt(input.value);
            const mod = Math.floor((score - 10) / 2);
            const modSign = mod >= 0 ? '+' : '';
            if (modifier) {
                modifier.textContent = `${modSign}${mod}`;
            }
        });

    }

    async initializeCsvSections() {
        this.initializeTabs();
        try {
            const [abilitiesCsv, actionsCsv, inventoryCsv, spellsCsv] = await Promise.all([
                this.loadCsvFile('data/abilities-and-features.csv'),
                this.loadCsvFile('data/actions.csv'),
                this.loadCsvFile('data/inventory.csv'),
                this.loadCsvFile('data/spells.csv')
            ]);

            this.renderFeaturesPanel(this.parseCsv(abilitiesCsv));
            this.renderActionsPanel(this.parseCsv(actionsCsv));
            this.renderInventoryPanel(this.parseCsv(inventoryCsv));
            this.renderSpellsPanel(this.parseCsv(spellsCsv));
        } catch (error) {
            console.error(error);
            ['featuresPanel', 'actionsPanel', 'inventoryPanel', 'spellsPanel'].forEach(panelId => {
                const panel = document.getElementById(panelId);
                if (panel) panel.innerHTML = '<div class="csv-card">Failed to load CSV data.</div>';
            });
        }
    }

    initializeTabs() {
        const buttons = Array.from(document.querySelectorAll('.csv-tab-button'));
        const activateTab = (button) => {
            const target = button.dataset.target;
            buttons.forEach(btn => {
                const isActive = btn === button;
                btn.classList.toggle('active', isActive);
                btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
                btn.tabIndex = isActive ? 0 : -1;
            });

            document.querySelectorAll('.csv-panel').forEach(panel => {
                const isActive = panel.id === target;
                panel.classList.toggle('active', isActive);
                panel.hidden = !isActive;
            });
        };

        buttons.forEach(button => {
            button.addEventListener('click', () => activateTab(button));
            button.addEventListener('keydown', (event) => {
                const currentIndex = buttons.indexOf(button);
                let nextIndex = currentIndex;

                if (event.key === 'ArrowRight') {
                    nextIndex = (currentIndex + 1) % buttons.length;
                } else if (event.key === 'ArrowLeft') {
                    nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                } else if (event.key === 'Home') {
                    nextIndex = 0;
                } else if (event.key === 'End') {
                    nextIndex = buttons.length - 1;
                } else {
                    return;
                }

                event.preventDefault();
                const nextButton = buttons[nextIndex];
                nextButton.focus();
                activateTab(nextButton);
            });
        });

        const activeButton = buttons.find(button => button.classList.contains('active'));
        if (activeButton) activateTab(activeButton);
    }

    async loadCsvFile(path) {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error(`Unable to fetch ${path}`);
        }
        return response.text();
    }

    parseCsv(text) {
        const rows = [];
        let row = [];
        let value = '';
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    value += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                row.push(value);
                value = '';
            } else if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') i++;
                row.push(value);
                if (row.some(cell => cell !== '')) {
                    rows.push(row);
                }
                row = [];
                value = '';
            } else {
                value += char;
            }
        }

        if (value.length > 0 || row.length > 0) {
            row.push(value);
            if (row.some(cell => cell !== '')) {
                rows.push(row);
            }
        }

        return rows;
    }

    escapeHtml(value = '') {
        return value
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#39;');
    }

    renderFeaturesPanel(rows) {
        const panel = document.getElementById('featuresPanel');
        if (!panel || !rows.length) return;

        const abilityMods = rows[0]?.slice(0, 6) || [];
        const saves = rows[1]?.slice(0, 6) || [];
        const abilityScores = rows[2]?.slice(0, 6) || [];
        const coreStats = rows.slice(0, 9).map(row => ({ label: row[6], value: row[7] })).filter(item => item.label);
        const spellSlots = rows.slice(1, 9).map(row => row[8]).filter(Boolean);

        const abilityRows = abilityScores.map((entry, index) => {
            const match = entry.match(/^(?<score>-?\d+)\s+(?<name>[A-Za-z]+)/);
            return {
                name: match?.groups?.name || entry,
                score: match?.groups?.score || '',
                mod: abilityMods[index] || '',
                save: saves[index] || ''
            };
        });

        const skillRows = [];
        rows.slice(3, 9).forEach(row => {
            row.slice(0, 6).forEach(cell => {
                const trimmed = (cell || '').trim();
                if (!trimmed) return;
                const match = trimmed.match(/^(.*?)([-+]?\d+)$/);
                if (match) {
                    skillRows.push({ name: match[1].trim(), bonus: match[2] });
                }
            });
        });

        const featureStart = rows.findIndex(row => (row[0] || '').trim().toLowerCase() === 'features');
        const features = [];
        let proficiencies = '';
        const acBreakdown = [];
        let acTotal = '';

        if (featureStart === -1) {
            panel.innerHTML = '<div class="csv-card">Features data not found in CSV.</div>';
            return;
        }

        rows.slice(featureStart + 1).forEach(row => {
            if (row[0]) features.push({ name: row[0], description: row[1] || '' });
            if (!proficiencies && row[5]) proficiencies = row[5];

            const acItem = (row[9] || '').trim();
            if (acItem && acItem.toLowerCase() !== 'ac calculation') {
                const acValue = [...row].reverse().find(cell => String(cell).trim() !== '');
                acBreakdown.push({ item: acItem, bonus: acValue });
            } else if (!acItem) {
                const tail = [...row].reverse().find(cell => String(cell).trim() !== '');
                if (tail && /^\d+$/.test(String(tail).trim())) {
                    acTotal = String(tail).trim();
                }
            }
        });

        panel.innerHTML = `
            <div class="csv-grid-two">
                <div class="csv-card">
                    <h4>Ability Scores, Modifiers, and Saves</h4>
                    <table class="csv-table">
                        <thead><tr><th>Ability</th><th>Score</th><th>Mod</th><th>Save</th></tr></thead>
                        <tbody>${abilityRows.map(row => `<tr><td>${this.escapeHtml(row.name)}</td><td>${this.escapeHtml(row.score)}</td><td>${this.escapeHtml(row.mod)}</td><td>${this.escapeHtml(row.save)}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
                <div class="csv-card">
                    <h4>Core Stats</h4>
                    <table class="csv-table">
                        <tbody>${coreStats.map(stat => `<tr><th>${this.escapeHtml(stat.label)}</th><td>${this.escapeHtml(stat.value)}</td></tr>`).join('')}</tbody>
                    </table>
                    <h4 style="margin-top:10px;">Spell Slots</h4>
                    <table class="csv-table">
                        <thead><tr><th>Level</th><th>Slots</th></tr></thead>
                        <tbody>${spellSlots.map((slot, idx) => `<tr><td>${idx + 1}</td><td>${this.escapeHtml(slot)}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
            </div>
            <div class="csv-grid-two">
                <div class="csv-card">
                    <h4>Skills</h4>
                    <table class="csv-table">
                        <thead><tr><th>Skill</th><th>Bonus</th></tr></thead>
                        <tbody>${skillRows.map(skill => `<tr><td>${this.escapeHtml(skill.name)}</td><td>${this.escapeHtml(skill.bonus)}</td></tr>`).join('')}</tbody>
                    </table>
                </div>
                <div class="csv-card">
                    <h4>Proficiencies / Languages</h4>
                    <div class="multiline">${this.escapeHtml(proficiencies)}</div>
                    <h4 style="margin-top:10px;">AC Calculation</h4>
                    <table class="csv-table">
                        <thead><tr><th>Item</th><th>Bonus</th></tr></thead>
                        <tbody>${acBreakdown.map(row => `<tr><td>${this.escapeHtml(row.item)}</td><td>${this.escapeHtml(row.bonus)}</td></tr>`).join('')}
                        ${acTotal ? `<tr><th>Total</th><th>${this.escapeHtml(acTotal)}</th></tr>` : ''}</tbody>
                    </table>
                </div>
            </div>
            <div class="csv-card">
                <h4>Features</h4>
                <table class="csv-table">
                    <thead><tr><th>Name</th><th>Description</th></tr></thead>
                    <tbody>${features.map(feature => `<tr><td>${this.escapeHtml(feature.name)}</td><td class="multiline">${this.escapeHtml(feature.description)}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `;
    }

    renderActionsPanel(rows) {
        const panel = document.getElementById('actionsPanel');
        if (!panel || rows.length < 2) return;

        const groups = {};
        let currentGroup = '';
        rows.slice(1).forEach(row => {
            const name = (row[0] || '').trim();
            const toHit = row[1] || '';
            const effect = row[2] || '';
            if (!name && !toHit && !effect) return;
            if (name === name.toUpperCase() && !toHit && !effect) {
                currentGroup = name;
                groups[currentGroup] = [];
                return;
            }
            if (currentGroup && name) {
                groups[currentGroup].push({ name, toHit, effect });
            }
        });

        panel.innerHTML = Object.entries(groups).map(([groupName, entries]) => `
            <div class="csv-card">
                <h4>${this.escapeHtml(groupName)}</h4>
                <table class="csv-table">
                    <thead><tr><th>Name</th><th>To Hit</th><th>Damage / Effect</th></tr></thead>
                    <tbody>${entries.map(entry => `<tr><td>${this.escapeHtml(entry.name)}</td><td>${this.escapeHtml(entry.toHit)}</td><td class="multiline">${this.escapeHtml(entry.effect)}</td></tr>`).join('')}</tbody>
                </table>
            </div>
        `).join('');
    }

    renderInventoryPanel(rows) {
        const panel = document.getElementById('inventoryPanel');
        if (!panel || rows.length < 2) return;

        const headers = rows[0];
        const data = rows.slice(1).map(row => {
            const item = {};
            headers.forEach((header, index) => {
                item[header] = row[index] || '';
            });
            return item;
        });

        panel.innerHTML = `
            <div class="inventory-controls">
                <input type="text" id="inventoryFilter" placeholder="Filter inventory...">
                <select id="inventorySort">
                    ${headers.map(header => `<option value="${this.escapeHtml(header)}">${this.escapeHtml(header)}</option>`).join('')}
                </select>
                <select id="inventoryDirection">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
            <div id="inventoryTableWrap"></div>
        `;

        const filterInput = panel.querySelector('#inventoryFilter');
        const sortSelect = panel.querySelector('#inventorySort');
        const directionSelect = panel.querySelector('#inventoryDirection');
        const tableWrap = panel.querySelector('#inventoryTableWrap');

        const drawTable = () => {
            const filter = filterInput.value.trim().toLowerCase();
            const sortBy = sortSelect.value;
            const direction = directionSelect.value;

            const filtered = data.filter(row =>
                Object.values(row).join(' ').toLowerCase().includes(filter)
            );
            filtered.sort((a, b) => {
                const left = (a[sortBy] || '').toString().toLowerCase();
                const right = (b[sortBy] || '').toString().toLowerCase();
                if (left < right) return direction === 'asc' ? -1 : 1;
                if (left > right) return direction === 'asc' ? 1 : -1;
                return 0;
            });

            tableWrap.innerHTML = `
                <table class="csv-table">
                    <thead><tr>${headers.map(header => `<th>${this.escapeHtml(header)}</th>`).join('')}</tr></thead>
                    <tbody>${filtered.map(row => `<tr>${headers.map(header => `<td class="multiline">${this.escapeHtml(row[header] || '')}</td>`).join('')}</tr>`).join('')}</tbody>
                </table>
            `;
        };

        filterInput.addEventListener('input', drawTable);
        sortSelect.addEventListener('change', drawTable);
        directionSelect.addEventListener('change', drawTable);
        drawTable();
    }

    renderSpellsPanel(rows) {
        const panel = document.getElementById('spellsPanel');
        if (!panel || rows.length < 2) return;

        const groups = [];
        let currentGroup = { title: 'Spells', spells: [] };

        rows.slice(1).forEach(row => {
            const cells = [...row, '', '', '', '', '', '', '', '', '', '', ''];
            const name = (cells[0] || '').trim();
            const time = cells[1] || '';
            const range = cells[5] || '';
            const vsm = cells[9] || '';
            const duration = cells[10] || '';
            const description = cells[11] || '';

            const rest = cells.slice(1, 12).some(value => (value || '').trim() !== '');
            if (!name && !rest) return;

            if (name && !rest) {
                if (currentGroup.spells.length || currentGroup.title !== 'Spells') {
                    groups.push(currentGroup);
                }
                currentGroup = { title: name, spells: [] };
                return;
            }

            currentGroup.spells.push({ name, time, range, vsm, duration, description });
        });

        if (currentGroup.spells.length || currentGroup.title !== 'Spells') {
            groups.push(currentGroup);
        }

        panel.innerHTML = groups.map(group => `
            <div class="spell-group csv-card">
                <h4>${this.escapeHtml(group.title)}</h4>
                <table class="csv-table">
                    <thead><tr><th>Name</th><th>Time</th><th>Range</th><th>VSM</th><th>Duration</th><th>Description</th></tr></thead>
                    <tbody>${group.spells.map(spell => `<tr>
                        <td>${this.escapeHtml(spell.name)}</td>
                        <td>${this.escapeHtml(spell.time)}</td>
                        <td>${this.escapeHtml(spell.range)}</td>
                        <td>${this.escapeHtml(spell.vsm)}</td>
                        <td>${this.escapeHtml(spell.duration)}</td>
                        <td class="multiline">${this.escapeHtml(spell.description)}</td>
                    </tr>`).join('')}</tbody>
                </table>
            </div>
        `).join('');
    }

    getCharacterData() {
        const data = {
            characterInfo: {
                name: document.getElementById('charName').value,
                player: document.getElementById('playerName').value,
                class: document.getElementById('class').value,
                race: document.getElementById('race').value,
                background: document.getElementById('background').value,
                alignment: document.getElementById('alignment').value,
                level: parseInt(document.getElementById('level').value),
                experience: parseInt(document.getElementById('experience').value)
            },
            abilityScores: {
                strength: parseInt(document.querySelector('[data-ability="strength"]').value),
                dexterity: parseInt(document.querySelector('[data-ability="dexterity"]').value),
                constitution: parseInt(document.querySelector('[data-ability="constitution"]').value),
                intelligence: parseInt(document.querySelector('[data-ability="intelligence"]').value),
                wisdom: parseInt(document.querySelector('[data-ability="wisdom"]').value),
                charisma: parseInt(document.querySelector('[data-ability="charisma"]').value)
            },
            combatStats: {
                ac: parseInt(document.getElementById('ac').value),
                maxHp: parseInt(document.getElementById('maxHp').value),
                currentHp: parseInt(document.getElementById('currentHp').value),
                speed: parseInt(document.getElementById('speed').value)
            },
            skills: this.getSkillsData(),
            traits: {
                proficiencies: document.getElementById('proficiencies').value,
                languages: document.getElementById('languages').value,
                features: document.getElementById('features').value,
                traits: document.getElementById('traits').value,
                ideals: document.getElementById('ideals').value,
                bonds: document.getElementById('bonds').value,
                flaws: document.getElementById('flaws').value
            },
            inventory: {
                equipment: document.getElementById('equipment').value,
                gold: parseInt(document.getElementById('gold').value) || 0
            },
            spells: {
                spellcastingAbility: document.getElementById('spellcastingAbility').value
            }
        };
        return data;
    }

    getSkillsData() {
        const skills = {};
        document.querySelectorAll('.skill-checkbox').forEach(checkbox => {
            skills[checkbox.id] = checkbox.checked;
        });
        return skills;
    }

    setCharacterData(data) {
        // Set basic info
        document.getElementById('charName').value = data.characterInfo?.name || '';
        document.getElementById('playerName').value = data.characterInfo?.player || '';
        document.getElementById('class').value = data.characterInfo?.class || '';
        document.getElementById('race').value = data.characterInfo?.race || '';
        document.getElementById('background').value = data.characterInfo?.background || '';
        document.getElementById('alignment').value = data.characterInfo?.alignment || '';
        document.getElementById('level').value = data.characterInfo?.level || 1;
        document.getElementById('experience').value = data.characterInfo?.experience || 0;

        // Set ability scores
        if (data.abilityScores) {
            Object.keys(data.abilityScores).forEach(ability => {
                const input = document.querySelector(`[data-ability="${ability}"]`);
                if (input) input.value = data.abilityScores[ability];
            });
        }

        // Set combat stats
        if (data.combatStats) {
            document.getElementById('ac').value = data.combatStats.ac || 10;
            document.getElementById('maxHp').value = data.combatStats.maxHp || 10;
            document.getElementById('currentHp').value = data.combatStats.currentHp || 10;
            document.getElementById('speed').value = data.combatStats.speed || 30;
        }

        // Set skills
        if (data.skills) {
            Object.keys(data.skills).forEach(skillId => {
                const checkbox = document.getElementById(skillId);
                if (checkbox) checkbox.checked = data.skills[skillId];
            });
        }

        // Set traits
        if (data.traits) {
            document.getElementById('proficiencies').value = data.traits.proficiencies || '';
            document.getElementById('languages').value = data.traits.languages || '';
            document.getElementById('features').value = data.traits.features || '';
            document.getElementById('traits').value = data.traits.traits || '';
            document.getElementById('ideals').value = data.traits.ideals || '';
            document.getElementById('bonds').value = data.traits.bonds || '';
            document.getElementById('flaws').value = data.traits.flaws || '';
        }

        // Set inventory
        if (data.inventory) {
            document.getElementById('equipment').value = data.inventory.equipment || '';
            document.getElementById('gold').value = data.inventory.gold || 0;
        }

        // Set spells
        if (data.spells) {
            document.getElementById('spellcastingAbility').value = data.spells.spellcastingAbility || '';
        }

        this.calculateModifiers();
    }

    saveCharacter() {
        const charName = document.getElementById('charName').value.trim();
        if (!charName) {
            this.showMessage('Please enter a character name before saving.', 'error');
            return;
        }

        const data = this.getCharacterData();
        const key = `dnd_character_${charName}`;
        
        try {
            localStorage.setItem(key, JSON.stringify(data));
            this.showMessage(`Character "${charName}" saved successfully!`, 'success');
        } catch (e) {
            this.showMessage('Failed to save character. Local storage may be full.', 'error');
        }
    }

    loadCharacter() {
        const charName = document.getElementById('charName').value.trim();
        if (!charName) {
            this.showMessage('Please enter a character name to load.', 'error');
            return;
        }

        const key = `dnd_character_${charName}`;
        
        try {
            const data = localStorage.getItem(key);
            if (data) {
                this.setCharacterData(JSON.parse(data));
                this.showMessage(`Character "${charName}" loaded successfully!`, 'success');
            } else {
                this.showMessage(`No saved character found with name "${charName}".`, 'error');
            }
        } catch (e) {
            this.showMessage('Failed to load character.', 'error');
        }
    }

    exportCharacter() {
        const charName = document.getElementById('charName').value || 'character';
        const data = this.getCharacterData();
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${charName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('Character exported successfully!', 'success');
    }

    resetForm() {
        if (confirm('Are you sure you want to reset the form? This cannot be undone.')) {
            document.querySelectorAll('input[type="text"], input[type="number"], select, textarea').forEach(input => {
                if (input.type === 'number') {
                    const defaultValue = input.getAttribute('value');
                    input.value = defaultValue || 0;
                } else if (input.type === 'checkbox') {
                    input.checked = false;
                } else {
                    input.value = '';
                }
            });
            document.querySelectorAll('.skill-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
            this.calculateModifiers();
            this.showMessage('Form has been reset.', 'success');
        }
    }

    showMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.success-message, .error-message');
        if (existingMessage) existingMessage.remove();

        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        // Insert at the top of the header
        const header = document.querySelector('header');
        header.parentElement.insertBefore(messageDiv, header.nextSibling);

        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CharacterSheet();
});