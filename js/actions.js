const actionsData = [
    { name: "Attack", type: "action", description: "Make one melee or ranged attack with a weapon you're holding, or an unarmed strike." },
    { name: "Cast a Spell", type: "action", description: "Cast a spell that takes an action to cast. See the Spells section for details." },
    { name: "Dash", type: "action", description: "Your speed increases by your walking speed until the end of the turn." },
    { name: "Disengage", type: "action", description: "Your movement doesn't provoke opportunity attacks for the rest of the turn." },
    { name: "Dodge", type: "action", description: "Until the start of your next turn, any attack roll made against you has disadvantage if you can see the attacker, and you make Dexterity saving throws with advantage." },
    { name: "Help", type: "action", description: "You lend your aid to another creature in the completion of a task. The creature gains advantage on the next ability check it makes to perform the task you are helping with within 1 minute." },
    { name: "Hide", type: "action", description: "Make a Stealth check to hide from enemies." },
    { name: "Ready", type: "action", description: "You can take the Ready action to prepare a reaction that occurs in response to a specific trigger." },
    { name: "Search", type: "action", description: "You devote your attention to finding something, such as a secret door or a trap." },
    { name: "Shove", type: "action", description: "Using the Attack action, you can make a Special melee attack to shove a creature." },
    { name: "Bonus Action", type: "bonus", description: "You can take a bonus action only when a special ability, spell, or other feature of the game states you can take one." },
    { name: "Reaction", type: "reaction", description: "An opportunity attack is the most common sort of reaction. When an enemy you can see moves away from you, you can use your reaction to make one melee attack against that creature." },
    { name: "Interact with Object", type: "interaction", description: "You can communicate however you are able, through brief utterances and gestures, as you take your turn." },
];

function displayActions() {
    const container = document.getElementById('actions-list');
    container.innerHTML = '';
    
    const types = ['action', 'bonus', 'reaction', 'interaction'];
    const typeNames = { action: 'Actions', bonus: 'Bonus Actions', reaction: 'Reactions', interaction: 'Interactions' };
    
    types.forEach(type => {
        const typeActions = actionsData.filter(a => a.type === type);
        if (typeActions.length > 0) {
            const section = document.createElement('div');
            section.className = 'action-section';
            section.innerHTML = `<h2>${typeNames[type]}</h2>`;
            
            typeActions.forEach(action => {
                const card = document.createElement('div');
                card.className = 'action-card';
                card.innerHTML = `
                    <h3>${action.name}</h3>
                    <p>${action.description}</p>
                `;
                section.appendChild(card);
            });
            
            container.appendChild(section);
        }
    });
}

document.addEventListener('DOMContentLoaded', displayActions);
