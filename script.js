class FirewallPlacementGame {
    constructor() {
        this.boardSize = 8;
        this.board = [];
        this.firewalls = [];
        this.regions = [];
        this.regionColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
        this.isGameComplete = false;
        this.score = 0;
        this.animationTimeout = null;
        
        this.initializeGame();
        this.setupEventListeners();
        this.showMessage("Welcome! Each colored region needs one firewall for protection.", "info");
    }

    initializeGame() {
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.firewalls = [];
        this.isGameComplete = false;
        this.score = 0;
        
        this.generateRegions();
        this.createBoard();
        this.updateDisplay();
        this.updateTargetFirewalls();
    }

    generateRegions() {
        this.regions = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(-1));
        
        if (this.boardSize === 4) {
            this.createSmallBoardRegions();
        } else if (this.boardSize === 6) {
            this.createMediumBoardRegions();
        } else if (this.boardSize === 8) {
            this.createLargeBoardRegions();
        } else {
            this.createCustomBoardRegions();
        }
    }

    createSmallBoardRegions() {
        const patterns = [
            [0, 0, 1, 1],
            [0, 0, 1, 1],
            [2, 2, 3, 3],
            [2, 2, 3, 3]
        ];
        
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                this.regions[row][col] = patterns[row][col];
            }
        }
    }

    createMediumBoardRegions() {
        const patterns = [
            [0, 0, 1, 1, 1, 2],
            [0, 0, 1, 1, 1, 2],
            [3, 3, 4, 4, 4, 2],
            [3, 3, 4, 4, 4, 5],
            [3, 3, 4, 4, 4, 5],
            [0, 1, 2, 3, 4, 5]
        ];
        
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 6; col++) {
                this.regions[row][col] = patterns[row][col];
            }
        }
    }

    createLargeBoardRegions() {
        const patterns = [
            [0, 0, 1, 1, 2, 2, 3, 3],
            [0, 0, 1, 1, 2, 2, 3, 3],
            [4, 4, 5, 5, 6, 6, 7, 7],
            [4, 4, 5, 5, 6, 6, 7, 7],
            [0, 1, 2, 3, 4, 5, 6, 7],
            [0, 1, 2, 3, 4, 5, 6, 7],
            [4, 5, 6, 7, 0, 1, 2, 3],
            [4, 5, 6, 7, 0, 1, 2, 3]
        ];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                this.regions[row][col] = patterns[row][col];
            }
        }
    }

    createCustomBoardRegions() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                this.regions[row][col] = (row + col) % this.boardSize;
            }
        }
    }

    createBoard() {
        const gameBoard = document.getElementById('gameBoard');
        gameBoard.innerHTML = '';
        gameBoard.style.gridTemplateColumns = `repeat(${this.boardSize}, 1fr)`;
        
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = row;
                cell.dataset.col = col;
                
                const regionId = this.regions[row][col];
                cell.style.backgroundColor = this.regionColors[regionId % this.regionColors.length];
                cell.style.opacity = '0.8';
                cell.style.border = '2px solid rgba(255,255,255,0.3)';
                cell.dataset.region = regionId;
                cell.title = `Region ${regionId + 1} - Row ${row + 1}, Col ${col + 1}`;
                
                const regionLabel = document.createElement('div');
                regionLabel.className = 'region-label';
                regionLabel.textContent = regionId + 1;
                regionLabel.style.position = 'absolute';
                regionLabel.style.top = '2px';
                regionLabel.style.right = '2px';
                regionLabel.style.fontSize = '10px';
                regionLabel.style.color = 'rgba(0,0,0,0.6)';
                regionLabel.style.fontWeight = 'bold';
                cell.appendChild(regionLabel);
                
                cell.addEventListener('click', () => this.handleCellClick(row, col));
                gameBoard.appendChild(cell);
            }
        }
    }

    setupEventListeners() {
        document.getElementById('newGameBtn').addEventListener('click', () => this.newGame());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBoard());
        document.getElementById('hintBtn').addEventListener('click', () => this.showHint());
        document.getElementById('solveBtn').addEventListener('click', () => this.autoSolve());
        document.getElementById('boardSize').addEventListener('change', (e) => this.changeBoardSize(parseInt(e.target.value)));
    }

    handleCellClick(row, col) {
        if (this.isGameComplete) return;

        const cell = this.getCell(row, col);
        
        if (cell.classList.contains('firewall')) {
            this.removeFirewall(row, col);
            this.showMessage(`Firewall removed from Region ${this.regions[row][col] + 1}`, "info");
        } else {
            if (this.canPlaceFirewall(row, col)) {
                this.placeFirewall(row, col);
                this.showMessage(`Firewall placed in Region ${this.regions[row][col] + 1}`, "success");
            } else {
                this.showMessage("Cannot place firewall here - conflicts with existing firewalls!", "error");
                this.highlightConflicts(row, col);
            }
        }

        this.updateBoard();
        this.updateDisplay();
        this.checkGameComplete();
    }

    canPlaceFirewall(row, col) {
        for (const firewall of this.firewalls) {
            const [fRow, fCol] = firewall;
            
            if (fRow === row || fCol === col) {
                return false;
            }
            
            if (Math.abs(fRow - row) === Math.abs(fCol - col)) {
                return false;
            }
        }
        return true;
    }

    placeFirewall(row, col) {
        this.firewalls.push([row, col]);
        this.board[row][col] = 1;
    }

    removeFirewall(row, col) {
        this.firewalls = this.firewalls.filter(([r, c]) => r !== row || c !== col);
        this.board[row][col] = 0;
    }

    updateBoard() {
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.getCell(row, col);
                cell.classList.remove('firewall', 'protected', 'vulnerable', 'conflict', 'hint');
                
                const regionId = this.regions[row][col];
                cell.style.backgroundColor = this.regionColors[regionId % this.regionColors.length];
                cell.style.opacity = '0.8';
                cell.style.border = '2px solid rgba(255,255,255,0.3)';
                cell.style.boxShadow = '';
                
                const firewallSpan = cell.querySelector('span');
                if (firewallSpan) {
                    firewallSpan.remove();
                }
                
                if (this.board[row][col] === 1) {
                    cell.classList.add('firewall');
                    const firewallIcon = document.createElement('span');
                    firewallIcon.style.fontSize = '2em';
                    firewallIcon.textContent = '🛡️';
                    firewallIcon.style.position = 'absolute';
                    firewallIcon.style.top = '50%';
                    firewallIcon.style.left = '50%';
                    firewallIcon.style.transform = 'translate(-50%, -50%)';
                    cell.appendChild(firewallIcon);
                    cell.style.opacity = '1';
                    cell.style.backgroundColor = '#4CAF50';
                }
            }
        }

        this.markProtectedZones();
        this.checkRegionCoverage();
    }

    markProtectedZones() {
        const protectedCells = new Set();
        
        for (const [fRow, fCol] of this.firewalls) {
            for (let col = 0; col < this.boardSize; col++) {
                if (col !== fCol) {
                    protectedCells.add(`${fRow}-${col}`);
                }
            }
            
            for (let row = 0; row < this.boardSize; row++) {
                if (row !== fRow) {
                    protectedCells.add(`${row}-${fCol}`);
                }
            }
            
            for (let i = 1; i < this.boardSize; i++) {
                if (fRow + i < this.boardSize && fCol + i < this.boardSize) {
                    protectedCells.add(`${fRow + i}-${fCol + i}`);
                }
                if (fRow - i >= 0 && fCol - i >= 0) {
                    protectedCells.add(`${fRow - i}-${fCol - i}`);
                }
                
                if (fRow + i < this.boardSize && fCol - i >= 0) {
                    protectedCells.add(`${fRow + i}-${fCol - i}`);
                }
                if (fRow - i >= 0 && fCol + i < this.boardSize) {
                    protectedCells.add(`${fRow - i}-${fCol + i}`);
                }
            }
        }

        for (const cellKey of protectedCells) {
            const [row, col] = cellKey.split('-').map(Number);
            const cell = this.getCell(row, col);
            if (!cell.classList.contains('firewall')) {
                cell.classList.add('protected');
                cell.style.border = '2px solid #4CAF50';
                cell.style.opacity = '0.6';
            }
        }

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.getCell(row, col);
                if (!cell.classList.contains('firewall') && !cell.classList.contains('protected')) {
                    cell.classList.add('vulnerable');
                    cell.style.border = '2px solid #FF9800';
                    cell.style.opacity = '0.9';
                }
            }
        }
    }

    checkRegionCoverage() {
        const regionCoverage = new Array(this.boardSize).fill(0);
        
        for (const [fRow, fCol] of this.firewalls) {
            const regionId = this.regions[fRow][fCol];
            regionCoverage[regionId]++;
        }

        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const cell = this.getCell(row, col);
                const regionId = this.regions[row][col];
                
                if (regionCoverage[regionId] === 1 && !cell.classList.contains('firewall')) {
                    cell.style.boxShadow = 'inset 0 0 10px rgba(76, 175, 80, 0.5)';
                } else if (regionCoverage[regionId] > 1) {
                    cell.style.boxShadow = 'inset 0 0 10px rgba(244, 67, 54, 0.5)';
                } else {
                    cell.style.boxShadow = '';
                }
            }
        }
    }

    highlightConflicts(row, col) {
        const conflicts = [];
        
        for (const [fRow, fCol] of this.firewalls) {
            if (fRow === row || fCol === col || Math.abs(fRow - row) === Math.abs(fCol - col)) {
                conflicts.push([fRow, fCol]);
            }
        }

        conflicts.forEach(([r, c]) => {
            const cell = this.getCell(r, c);
            cell.classList.add('conflict');
            cell.style.animation = 'shake 0.5s';
        });

        setTimeout(() => {
            conflicts.forEach(([r, c]) => {
                const cell = this.getCell(r, c);
                cell.classList.remove('conflict');
                cell.style.animation = '';
            });
        }, 1000);
    }

    updateDisplay() {
        document.getElementById('firewallCount').textContent = this.firewalls.length;
        
        const regionCoverage = new Array(this.boardSize).fill(0);
        for (const [fRow, fCol] of this.firewalls) {
            const regionId = this.regions[fRow][fCol];
            regionCoverage[regionId]++;
        }
        
        const properlyCovered = regionCoverage.filter(count => count === 1).length;
        const coverage = Math.round((properlyCovered / this.boardSize) * 100);
        
        document.getElementById('coverage').textContent = `${coverage}%`;
        
        this.score = Math.max(0, (coverage * 10) + (properlyCovered * 5) - (this.firewalls.length * 2));
        document.getElementById('securityScore').textContent = this.score;
        
        const statusElement = document.getElementById('gameStatus');
        if (this.isGameComplete) {
            statusElement.textContent = 'Network Secured!';
            statusElement.className = 'score-value status-success';
        } else if (this.firewalls.length > 0) {
            statusElement.textContent = 'Deploying...';
            statusElement.className = 'score-value status-pending';
        } else {
            statusElement.textContent = 'Planning';
            statusElement.className = 'score-value status-pending';
        }
    }

    updateTargetFirewalls() {
        document.getElementById('targetFirewalls').textContent = this.boardSize;
    }

    checkGameComplete() {
        const regionCoverage = new Array(this.boardSize).fill(0);
        
        for (const [fRow, fCol] of this.firewalls) {
            const regionId = this.regions[fRow][fCol];
            regionCoverage[regionId]++;
        }
        
        const allRegionsCovered = regionCoverage.every(count => count === 1);
        const correctFirewallCount = this.firewalls.length === this.boardSize;
        
        if (allRegionsCovered && correctFirewallCount) {
            this.isGameComplete = true;
            this.showMessage(`🎉 Perfect! All ${this.boardSize} regions secured with optimal firewall placement!`, "success");
            
            document.getElementById('gameBoard').classList.add('game-complete');
            setTimeout(() => {
                document.getElementById('gameBoard').classList.remove('game-complete');
            }, 1000);
        }
    }

    showHint() {
        if (this.isGameComplete) {
            this.showMessage("Network already secured!", "info");
            return;
        }

        document.querySelectorAll('.cell.hint').forEach(cell => {
            cell.classList.remove('hint');
        });

        const regionCoverage = new Array(this.boardSize).fill(0);
        for (const [fRow, fCol] of this.firewalls) {
            const regionId = this.regions[fRow][fCol];
            regionCoverage[regionId]++;
        }

        const uncoveredRegion = regionCoverage.findIndex(count => count === 0);
        
        if (uncoveredRegion !== -1) {
            for (let row = 0; row < this.boardSize; row++) {
                for (let col = 0; col < this.boardSize; col++) {
                    if (this.regions[row][col] === uncoveredRegion && this.canPlaceFirewall(row, col)) {
                        const cell = this.getCell(row, col);
                        cell.classList.add('hint');
                        cell.style.animation = 'pulse 1s infinite';
                        this.showMessage(`Hint: Try placing a firewall in Region ${uncoveredRegion + 1}`, "info");
                        
                        setTimeout(() => {
                            cell.classList.remove('hint');
                            cell.style.animation = '';
                        }, 4000);
                        return;
                    }
                }
            }
        }

        this.showMessage("Try removing conflicting firewalls or choose different positions.", "info");
    }

    autoSolve() {
        this.resetBoard();
        const solution = this.solveNQueens();
        
        if (solution) {
            solution.forEach(([row, col], index) => {
                setTimeout(() => {
                    this.placeFirewall(row, col);
                    this.updateBoard();
                    this.updateDisplay();
                    
                    if (index === solution.length - 1) {
                        this.checkGameComplete();
                    }
                }, index * 400);
            });
            
            this.showMessage("Auto-solving... Watch the strategic firewall deployment!", "info");
        } else {
            this.showMessage("No solution found for this configuration.", "error");
        }
    }

    solveNQueens() {
        const result = [];
        const board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(false));
        
        const isValid = (row, col) => {
            for (let i = 0; i < row; i++) {
                if (board[i][col]) return false;
            }
            
            for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
                if (board[i][j]) return false;
            }
            
            for (let i = row - 1, j = col + 1; i >= 0 && j < this.boardSize; i--, j++) {
                if (board[i][j]) return false;
            }
            
            return true;
        };
        
        const solve = (row) => {
            if (row === this.boardSize) return true;
            
            for (let col = 0; col < this.boardSize; col++) {
                if (isValid(row, col)) {
                    board[row][col] = true;
                    result.push([row, col]);
                    
                    if (solve(row + 1)) return true;
                    
                    board[row][col] = false;
                    result.pop();
                }
            }
            
            return false;
        };
        
        return solve(0) ? result : null;
    }

    newGame() {
        this.initializeGame();
        this.showMessage("New network topology generated! Secure all regions with firewalls.", "info");
    }

    resetBoard() {
        this.firewalls = [];
        this.board = Array(this.boardSize).fill().map(() => Array(this.boardSize).fill(0));
        this.isGameComplete = false;
        this.updateBoard();
        this.updateDisplay();
        this.showMessage("Board reset. Each colored region needs one firewall!", "info");
    }

    changeBoardSize(newSize) {
        this.boardSize = newSize;
        this.initializeGame();
        this.showMessage(`Network size changed to ${newSize}x${newSize} with ${newSize} regions`, "info");
    }

    getCell(row, col) {
        return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    }

    showMessage(text, type = "info") {
        const messageDisplay = document.getElementById('messageDisplay');
        const messageText = document.getElementById('messageText');
        
        if (this.animationTimeout) {
            clearTimeout(this.animationTimeout);
        }
        
        messageText.textContent = text;
        
        const messageContent = messageDisplay.querySelector('.message-content');
        messageContent.className = 'message-content';
        
        if (type === "success") {
            messageContent.style.borderLeftColor = '#4CAF50';
            messageContent.querySelector('i').style.color = '#4CAF50';
        } else if (type === "error") {
            messageContent.style.borderLeftColor = '#f44336';
            messageContent.querySelector('i').style.color = '#f44336';
        } else {
            messageContent.style.borderLeftColor = '#2196F3';
            messageContent.querySelector('i').style.color = '#2196F3';
        }
        
        messageDisplay.classList.add('show');
        
        this.animationTimeout = setTimeout(() => {
            messageDisplay.classList.remove('show');
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const game = new FirewallPlacementGame();
    
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'n':
            case 'N':
                if (e.ctrlKey) {
                    e.preventDefault();
                    game.newGame();
                }
                break;
            case 'r':
            case 'R':
                if (e.ctrlKey) {
                    e.preventDefault();
                    game.resetBoard();
                }
                break;
            case 'h':
            case 'H':
                if (e.ctrlKey) {
                    e.preventDefault();
                    game.showHint();
                }
                break;
            case 's':
            case 'S':
                if (e.ctrlKey) {
                    e.preventDefault();
                    game.autoSolve();
                }
                break;
        }
    });
});
