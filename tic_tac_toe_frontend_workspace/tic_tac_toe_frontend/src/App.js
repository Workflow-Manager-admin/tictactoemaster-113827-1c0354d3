import React, { useState } from 'react';
import './App.css';

// PUBLIC_INTERFACE
function Square({ value, onClick, highlight }) {
  /** Square component for a cell in the grid. */
  return (
    <button
      className="ttt-square"
      style={highlight ? { background: 'var(--accent)' } : {}}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : "Empty cell"}
    >
      {value}
    </button>
  );
}

// PUBLIC_INTERFACE
function Board({ squares, onCellClick, winLine }) {
  /** Board component rendering 3x3 grid */
  const renderSquare = (i) => (
    <Square
      key={i}
      value={squares[i]}
      onClick={() => onCellClick(i)}
      highlight={winLine && winLine.includes(i)}
    />
  );
  let rows = [];
  for (let row = 0; row < 3; row++) {
    let cols = [];
    for (let col = 0; col < 3; col++) {
      let idx = row * 3 + col;
      cols.push(renderSquare(idx));
    }
    rows.push(
      <div key={row} className="ttt-row">
        {cols}
      </div>
    );
  }
  return <div className="ttt-board">{rows}</div>;
}

// Get winner or null. Returns {winner, winLine} or null
function calculateWinner(squares) {
  /** Returns the winner ('X' or 'O'), or null if no winner, and winning line */
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diags
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], winLine: line };
    }
  }
  return null;
}

function getNextPlayer(xIsNext) {
  return xIsNext ? 'X' : 'O';
}

// PUBLIC_INTERFACE
function App() {
  /**
   * Complete Tic Tac Toe Game Frontend.
   * Implements grid, player indication, win/draw, reset, score tracking, modern light-themed.
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, draw: 0 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [winLine, setWinLine] = useState(null);

  const currentPlayer = getNextPlayer(xIsNext);

  // Calculates winner or draw and handles end state
  function checkEndState(newSquares, advanceScore = false) {
    const winnerObj = calculateWinner(newSquares);
    if (winnerObj) {
      setIsGameOver(true);
      setWinLine(winnerObj.winLine);
      if (advanceScore) {
        setScores(prev => ({
          ...prev,
          [winnerObj.winner]: prev[winnerObj.winner] + 1
        }));
      }
      return;
    }
    if (!newSquares.includes(null)) {
      setIsGameOver(true);
      setWinLine(null);
      if (advanceScore) {
        setScores(prev => ({ ...prev, draw: prev.draw + 1 }));
      }
    }
  }

  // Handle click on grid cell
  function handleCellClick(i) {
    if (squares[i] || isGameOver) return;
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    setSquares(nextSquares);
    setXIsNext(x => !x);
    // Check for win or draw
    setTimeout(() => {
      checkEndState(nextSquares, true);
    }, 0);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    /** Reset board to play again, preserving scores */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setIsGameOver(false);
    setWinLine(null);
  }

  const winnerObj = calculateWinner(squares);
  const winner = winnerObj?.winner || null;
  const status = winner
    ? `Player ${winner} wins!`
    : (!squares.includes(null) && isGameOver)
      ? "It's a draw."
      : `Next: Player ${currentPlayer}`;

  return (
    <div className="app ttt-backdrop">
      <nav className="navbar">
        <div className="container" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <div className="logo">
            <span className="logo-symbol" aria-label="tic-tac-toe">#</span> Tic Tac Toe
          </div>
          <div />
        </div>
      </nav>
      <main>
        <div className="ttt-outer-container">
          <div className="ttt-panel">
            <div className="ttt-status">{status}</div>
            <Board
              squares={squares}
              onCellClick={handleCellClick}
              winLine={winLine}
            />
            <div className="ttt-controls">
              <button className="btn btn-large" onClick={handleReset} aria-label="Reset Game">
                {isGameOver ? 'Play Again' : 'Reset'}
              </button>
            </div>
            <div className="ttt-scoreboard" aria-label="Scoreboard">
              <div>
                <span className="ttt-score-x" title="Player X">X: {scores.X}</span>
                <span className="ttt-score-sep" /> 
                <span className="ttt-score-o" title="Player O">O: {scores.O}</span>
                <span className="ttt-score-sep" />
                <span className="ttt-score-draw" title="Draws">Draws: {scores.draw}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;