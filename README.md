# Firewall Placement Game

A modern web-based educational cybersecurity game that combines the classic N-Queens problem with network security concepts.

## Game Overview

The Firewall Placement Game challenges players to strategically place firewalls on a network grid to achieve complete security coverage. Using the mathematical constraints of the N-Queens problem, players must ensure that no two firewalls conflict with each other while maximizing network protection.

## Features

- **Interactive Grid-Based Gameplay**: Click to place and remove firewalls on a dynamic network grid
- **Multiple Difficulty Levels**: Choose from 4x4 (Beginner) to 10x10 (Expert) grid sizes
- **Real-Time Visual Feedback**: See protected zones, vulnerable areas, and conflicts instantly
- **Educational Elements**: Learn cybersecurity concepts through strategic gameplay
- **Hint System**: Get suggestions for optimal firewall placement
- **Auto-Solve Feature**: Watch the algorithm demonstrate optimal solutions
- **Responsive Design**: Play on desktop, tablet, or mobile devices
- **Accessibility**: Keyboard shortcuts and screen reader support

## How to Play

1. **Choose Your Network Size**: Select from 4x4 to 10x10 grid sizes in the difficulty selector
2. **Observe Region Colors**: Each colored region represents a different network segment
3. **Place Firewalls**: Click on network nodes to place firewalls (represented by 🛡️)
4. **Follow N-Queens Rules**: Firewalls cannot be placed on the same row, column, or diagonal
5. **Secure All Regions**: Each colored region must have exactly one firewall
6. **Achieve Perfect Coverage**: Complete the puzzle with optimal firewall placement

## Game Rules

- **Firewall Constraints**: No two firewalls can attack each other (N-Queens rules apply)
- **Region Coverage**: Each colored region must have exactly one firewall
- **Victory Condition**: Secure all regions with optimal firewall placement
- **Scoring System**: Higher scores for efficient placement and complete coverage

## Visual Elements

- **🛡️ Firewalls**: Green cells with shield icons
- **Colored Regions**: Different network segments with distinct colors and numbers
- **Protected Zones**: Areas secured by firewall coverage (green highlights)
- **Vulnerable Zones**: Unprotected areas (orange highlights)
- **Conflicts**: Red highlighting when placement rules are violated
- **Hints**: Blue highlighting for suggested placements

## Controls

### Mouse Controls
- **Left Click**: Place or remove firewall on a network node
- **Hover**: Preview placement location

### Keyboard Shortcuts
- **Ctrl + N**: Start a new game
- **Ctrl + R**: Reset the current board
- **Ctrl + H**: Show hint for next optimal move
- **Ctrl + S**: Auto-solve the current puzzle

### Game Buttons
- **New Game**: Start fresh with current difficulty settings
- **Hint**: Get a suggestion for the next best firewall placement
- **Auto Solve**: Watch the algorithm solve the puzzle automatically
- **Reset**: Clear all firewalls and start over

## Technical Implementation

### Technologies Used
- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Advanced styling with Grid, Flexbox, and animations
- **JavaScript (ES6+)**: Object-oriented game logic and DOM manipulation
- **Font Awesome**: Professional icons for enhanced UI
- **Google Fonts**: Typography with Roboto font family

### Architecture
- **Object-Oriented Design**: Clean separation of game logic and UI
- **Responsive Grid System**: CSS Grid for dynamic board layouts
- **Event-Driven Programming**: Efficient handling of user interactions
- **Animation System**: Smooth transitions and visual feedback

## Installation & Setup

1. **Clone or Download**: Get the project files to your local machine
2. **Open in Browser**: Simply open `index.html` in any modern web browser
3. **No Dependencies**: The game runs entirely in the browser with no additional setup required

```bash
# If using git
git clone [repository-url]
cd firewall-placement-game

# Open in browser
open index.html
# or
python -m http.server 8000  # For local server
```

## Learning Outcomes

After playing this game, users will understand:

- **N-Queens Problem**: Classic computer science constraint satisfaction problem
- **Network Security Principles**: Strategic placement of security measures
- **Optimization Strategies**: Balancing coverage and resource efficiency
- **Algorithmic Thinking**: Understanding backtracking and constraint solving

## Future Enhancements

Potential improvements and features:
- **Multiplayer Mode**: Compete with others in real-time
- **Custom Network Topologies**: Non-grid layouts representing real networks
- **Advanced Scoring**: Time-based scoring and leaderboards
- **Tutorial Mode**: Step-by-step guided learning experience
- **Save/Load Games**: Persistence for longer sessions
- **Theme Customization**: Different visual themes and color schemes