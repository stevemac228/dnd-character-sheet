// Character Sheet Manager
class CharacterSheet {
    constructor() {
        this.characterData = {};
        this.initializeEventListeners();
        this.calculateModifiers();
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
        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        abilities.forEach(ability => {
            const input = document.querySelector(`[data-ability="${ability}"]`);
            const modifier = input.parentElement.querySelector('.modifier');
            const score = parseInt(input.value);
            const mod = Math.floor((score - 10) / 2);
            const modSign = mod >= 0 ? '+' : '';
            modifier.textContent = `${modSign}${mod}`;
        });

        // Update initiative bonus
        const dexScore = parseInt(document.querySelector('[data-ability="dexterity"]').value);
        const dexMod = Math.floor((dexScore - 10) / 2);
        const initiativeBonusSign = dexMod >= 0 ? '+' : '';
        document.getElementById('initiativeBonus').textContent = `${initiativeBonusSign}${dexMod}`;
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