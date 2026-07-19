# D&D 5e Character Sheet Application

A comprehensive web-based D&D 5th Edition character sheet application. Create, manage, and export your character with an intuitive interface.

## Features

### 📋 Character Information
- Character name, player name, class, race
- Background and alignment selection
- Level and experience point tracking

### 💪 Ability Scores
- Six ability scores (STR, DEX, CON, INT, WIS, CHA)
- Automatic modifier calculation
- Real-time updates

### ⚔️ Combat Stats
- Armor Class (AC)
- Hit Points (HP) - max and current
- Movement speed
- Initiative bonus (auto-calculated from DEX)

### 🎯 Skills
- All 18 D&D 5e skills
- Quick checkboxes for proficiency marking
- Skills linked to proper ability scores:
  - **Strength**: Athletics
  - **Dexterity**: Acrobatics, Sleight of Hand, Stealth
  - **Constitution**: Endurance
  - **Intelligence**: Arcana, History, Investigation, Nature, Religion
  - **Wisdom**: Animal Handling, Insight, Medicine, Perception, Survival
  - **Charisma**: Deception, Intimidation, Performance, Persuasion

### 🛡️ Proficiencies & Languages
- Weapon, armor, and tool proficiencies
- Languages known by the character

### ✨ Features & Traits
- Class features and abilities
- Personality traits
- Character ideals
- Character bonds
- Character flaws

### 🎒 Equipment & Inventory
- Equipment and items
- Gold/treasure tracking

### 🔮 Spells
- Spellcasting ability selection
- Support for spellcasters

### 💾 Data Management
- **Save**: Save character to browser's local storage
- **Load**: Load previously saved characters
- **Export**: Download character as JSON file for backup or sharing
- **Reset**: Clear the form to start fresh

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/stevemac228/dnd-character-sheet.git
   cd dnd-character-sheet
   ```

2. Open `index.html` in your web browser
   - No server or build process required!
   - Works entirely in the browser

### Usage

1. **Fill in your character information** starting with the basic details
2. **Set ability scores** - modifiers calculate automatically
3. **Configure combat stats** like AC, HP, and speed
4. **Select proficient skills** by checking the boxes
5. **Add character details** like equipment, traits, and background
6. **Save your character** using the Save button
   - Saves to browser local storage with character name as key
   - Can be loaded anytime from any browser session on the same device
7. **Export as JSON** to create backups or share with others

## Data Storage

- **Local Storage**: Characters are saved locally in your browser
  - ~5-10MB storage per domain (varies by browser)
  - Data persists across browser sessions
  - Clearing browser data will delete saved characters
- **JSON Export**: Export characters as `.json` files for:
  - Sharing with other players
  - Backing up on your computer
  - Importing into other tools

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## File Structure

```
dnd-character-sheet/
├── index.html      # Main HTML structure
├── styles.css      # Styling and responsive design
├── script.js       # Character sheet logic
├── README.md       # This file
└── LICENSE         # MIT License
```

## Features in Detail

### Automatic Calculations
- **Ability Modifiers**: Calculated automatically from ability scores
- **Initiative Bonus**: Based on DEX modifier
- **Skill Proficiencies**: Linked to relevant ability scores

### Responsive Design
- Works on desktop, tablet, and mobile
- Grid-based layout that adapts to screen size
- Touch-friendly buttons and inputs

### Persistent Storage
- Characters saved locally in browser
- No account or login required
- Export/import for portability

## Tips & Tricks

1. **Save frequently** - Use the Save button to prevent data loss
2. **Use character names** - Name your character to organize saves
3. **Export for backup** - Keep JSON backups of important characters
4. **Share characters** - Export JSON and share with your party
5. **Mobile friendly** - Use on your phone at the game table

## Roadmap / Future Features

- [ ] Spell list management with slot tracking
- [ ] Multiclass support
- [ ] Attack roll calculator
- [ ] Ability check roller
- [ ] Cloud backup and sync
- [ ] Character image upload
- [ ] PDF export
- [ ] Dark mode
- [ ] Offline support (PWA)

## Troubleshooting

### Characters not saving?
- Check if local storage is enabled in your browser
- Try a different browser
- Clear browser cache and try again

### Lost characters?
- Check if you cleared browser data
- Look for JSON exports on your computer
- Characters are browser/device-specific

### Export file won't download?
- Check browser download settings
- Try a different browser
- Check your Downloads folder

## Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

## License

MIT License - See LICENSE file for details

## Disclaimer

This is a fan-made tool for D&D 5th Edition. D&D and all related trademarks are property of Wizards of the Coast.

## Support

Having issues? 
- Check the troubleshooting section above
- Open an issue on GitHub
- Check your browser console for error messages

---

**Happy adventuring! 🐉**