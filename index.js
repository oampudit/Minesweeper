window.onload = function () {
  const BOARD_SIZE = 10;
  const NUM_MINES = 10;

  // Get references to the start button and game board
  const startBtn = document.getElementById('startBtn');
  const board = document.getElementById('board');

  // Function to initialize the game board
  function initBoard() {
    // Create the game board
    for (let i = 0; i < BOARD_SIZE; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < BOARD_SIZE; j++) {
        const cell = document.createElement('td');
        cell.classList.add('hidden');
        cell.setAttribute('data-row', i);
        cell.setAttribute('data-col', j);
        row.appendChild(cell);
      }
      board.appendChild(row);
    }

    // Add mines to the game board
    const cells = board.getElementsByTagName('td');
    for (let i = 0; i < NUM_MINES; i++) {
      let randomIndex = Math.floor(Math.random() * cells.length);
      while (cells[randomIndex].classList.contains('mine')) {
        randomIndex = Math.floor(Math.random() * cells.length);
      }
      cells[randomIndex].classList.add('mine');
    }

    // Calculate the number of mines surrounding each cell
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      if (!cell.classList.contains('mine')) {
        let numMines = 0;
        const row = parseInt(cell.getAttribute('data-row'));
        const col = parseInt(cell.getAttribute('data-col'));
        for (let x = -1; x <= 1; x++) {
          for (let y = -1; y <= 1; y++) {
            if (x === 0 && y === 0) {
              continue;
            }
            const r = row + x;
            const c = col + y;
            if (
              r >= 0 &&
              r < BOARD_SIZE &&
              c >= 0 &&
              c < BOARD_SIZE &&
              cells[r * BOARD_SIZE + c].classList.contains('mine')
            ) {
              numMines++;
            }
          }
        }
        cell.textContent = numMines;
      }
    }

    // Add event listener to hide cells
    for (let i = 0; i < cells.length; i++) {
      cells[i].addEventListener('click', revealCell);
    }
  }

  // Function to reveal a cell
  function revealCell(event) {
    const cell = event.target;
    if (cell.classList.contains('hidden')) {
      cell.classList.remove('hidden');
      cell.classList.add('revealed');
      if (cell.classList.contains('mine')) {
        cell.textContent = '💣';
        alert('Game Over');
        initBoard();
      } else {
        if (cell.textContent === '0') {
          revealAdjacentCells(cell);
        }
      }
    }
  }

  // Function to reveal all adjacent cells without mines
  function revealAdjacentCells(cell) {
    const row = parseInt(cell.getAttribute('data-row'));
    const col = parseInt(cell.getAttribute('data-col'));
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) {
          continue;
        }
        const r = row + x;
        const c = col + y;
        if (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
          const adjacentCell = board.rows[r].cells[c];
          if (adjacentCell.classList.contains('hidden')) {
            adjacentCell.classList.remove('hidden');
            adjacentCell.classList.add('revealed');
            if (adjacentCell.classList.contains('mine')) {
              adjacentCell.textContent = '💣';
              alert('Game Over');
              initBoard();
            } else {
              if (adjacentCell.textContent === '0') {
                revealAdjacentCells(adjacentCell);
              }
            }
          }
        }
      }
    }
  }

  // Start the game when the start button is clicked
  startBtn.addEventListener('click', initBoard);
};
