const spellsData = [
    // Cantrips
    { name: "Mage Hand", level: "cantrip", class: ["druid", "ranger"], time: "1 action", range: "30ft", components: "V, S", duration: "1 minute" },
    { name: "Chill Touch", level: "cantrip", class: ["druid", "ranger"], time: "1 action", range: "120ft", components: "V, S", duration: "Instantaneous" },
    { name: "Guidance", level: "cantrip", class: ["druid"], time: "1 action", range: "Touch", components: "V, S", duration: "Concentration up to 1 minute" },
    { name: "Shillelagh", level: "cantrip", class: ["druid"], time: "1 bonus action", range: "Self", components: "V, S, M", duration: "1 minute" },
    { name: "Thunderclap", level: "cantrip", class: ["druid", "ranger"], time: "1 action", range: "Self", components: "S", duration: "Instantaneous" },
    
    // 1st Level
    { name: "Detect Magic", level: "1", class: ["druid", "ranger"], time: "1 action", range: "Self", components: "V, S", duration: "Concentration up to 10 minutes" },
    { name: "Disguise Self", level: "1", class: ["ranger"], time: "1 action", range: "Self", components: "V, S", duration: "1 hour" },
    { name: "Absorb Elements", level: "1", class: ["druid", "ranger"], time: "Reaction", range: "Self", components: "S", duration: "1 Round" },
    { name: "Animal Friendship", level: "1", class: ["druid", "ranger"], time: "1 action", range: "30ft", components: "V, S, M", duration: "24 hours" },
    { name: "Beast Bond", level: "1", class: ["druid", "ranger"], time: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration up to 1 minute" },
    { name: "Cure Wounds", level: "1", class: ["druid", "ranger"], time: "1 action", range: "Touch", components: "V, S", duration: "Instantaneous" },
    { name: "Entangle", level: "1", class: ["druid"], time: "1 action", range: "90ft", components: "V, S", duration: "Concentration up to 1 minute" },
    { name: "Faerie Fire", level: "1", class: ["druid", "ranger"], time: "1 action", range: "60ft", components: "V", duration: "Concentration up to 1 minute" },
    { name: "Fog Cloud", level: "1", class: ["druid", "ranger"], time: "1 action", range: "120ft", components: "V, S", duration: "Concentration up to 1 hour" },
    { name: "Goodberry", level: "1", class: ["druid"], time: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous" },
    { name: "Healing Word", level: "1", class: ["druid", "ranger"], time: "1 bonus action", range: "60ft", components: "V, S", duration: "Instantaneous" },
    { name: "Hunter's Mark", level: "1", class: ["ranger"], time: "1 bonus action", range: "90ft", components: "V", duration: "Concentration up to 1 hour" },
    { name: "Speak with Animals", level: "1", class: ["druid", "ranger"], time: "1 action", range: "Self", components: "V, S", duration: "10 minutes" },
    { name: "Thunderwave", level: "1", class: ["druid"], time: "1 action", range: "Self", components: "V, S", duration: "Instantaneous" },
    
    // 2nd Level
    { name: "Barkskin", level: "2", class: ["druid"], time: "1 action", range: "Touch", components: "V, S, M", duration: "Concentration up to 1 hour" },
    { name: "Beast Sense", level: "2", class: ["druid", "ranger"], time: "1 action", range: "Touch", components: "S", duration: "Concentration up to 1 hour" },
    { name: "Enhance Ability", level: "2", class: ["druid", "ranger"], time: "1 action", range: "Touch", components: "V, S", duration: "Concentration up to 1 hour" },
    { name: "Healing Spirit", level: "2", class: ["druid", "ranger"], time: "1 bonus action", range: "60ft", components: "V, S", duration: "Concentration up to 1 minute" },
    { name: "Pass Without Trace", level: "2", class: ["druid", "ranger"], time: "1 action", range: "Self", components: "V, S, M", duration: "Concentration up to 1 hour" },
    { name: "Spike Growth", level: "2", class: ["druid", "ranger"], time: "1 action", range: "150ft", components: "V, S, M", duration: "Concentration up to 10 minutes" },
    { name: "Web", level: "2", class: ["ranger"], time: "1 action", range: "60ft", components: "V, S, M", duration: "Concentration up to 1 hour" },
    
    // 3rd Level
    { name: "Call Lightning", level: "3", class: ["druid"], time: "1 action", range: "120ft", components: "V, S", duration: "Concentration up to 10 minutes" },
    { name: "Conjure Animals", level: "3", class: ["druid"], time: "1 action", range: "60ft", components: "V, S", duration: "Concentration up to 1 hour" },
    { name: "Dispel Magic", level: "3", class: ["druid", "ranger"], time: "1 action", range: "120ft", components: "V, S", duration: "Instantaneous" },
    { name: "Revivify", level: "3", class: ["druid"], time: "1 action", range: "Touch", components: "V, S, M", duration: "Instantaneous" },
    { name: "Water Breathing", level: "3", class: ["druid"], time: "1 action", range: "30ft", components: "V, S, M", duration: "24 hours" },
];

function displaySpells() {
    const levels = Array.from(document.querySelectorAll('input[name="level"]:checked')).map(el => el.value);
    const classes = Array.from(document.querySelectorAll('input[name="class"]:checked')).map(el => el.value);
    
    const filtered = spellsData.filter(spell => 
        levels.includes(spell.level) && spell.class.some(c => classes.includes(c))
    );
    
    const container = document.getElementById('spells-list');
    container.innerHTML = '';
    
    const grouped = {};
    filtered.forEach(spell => {
        if (!grouped[spell.level]) grouped[spell.level] = [];
        grouped[spell.level].push(spell);
    });
    
    const levelOrder = ['cantrip', '1', '2', '3'];
    levelOrder.forEach(level => {
        if (grouped[level]) {
            const levelTitle = level === 'cantrip' ? 'Cantrips' : `${level}${level === '1' ? 'st' : level === '2' ? 'nd' : 'rd'} Level`;
            const section = document.createElement('div');
            section.className = 'spell-level-section';
            section.innerHTML = `<h3>${levelTitle}</h3>`;
            
            grouped[level].forEach(spell => {
                const spellCard = document.createElement('div');
                spellCard.className = 'spell-card';
                spellCard.innerHTML = `
                    <div class="spell-header">
                        <p class="spell-name">${spell.name}</p>
                        <p class="spell-class">${spell.class.map(c => c.charAt(0).toUpperCase() + c.slice(1)).join(', ')}</p>
                    </div>
                    <div class="spell-details">
                        <p><strong>Time:</strong> ${spell.time}</p>
                        <p><strong>Range:</strong> ${spell.range}</p>
                        <p><strong>Components:</strong> ${spell.components}</p>
                        <p><strong>Duration:</strong> ${spell.duration}</p>
                    </div>
                `;
                section.appendChild(spellCard);
            });
            
            container.appendChild(section);
        }
    });
}

document.querySelectorAll('input[name="level"], input[name="class"]').forEach(checkbox => {
    checkbox.addEventListener('change', displaySpells);
});

displaySpells();
