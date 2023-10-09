import { useState } from 'react';
import React, { Comment } from 'react';

function Square({ value, onSquareClick, win = false }) {
    let squareClass = "square " + 
        (win ? "winning-square " : "");
    
    return (
        <button className="square" onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    
    const winnerInfo = calculateWinner(squares);
    const win = winnerInfo ? winnerInfo[0] : null;
    const winningLine = winnerInfo ? winnerInfo[1] : [];
    
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares, i);
    }

    const winner = calculateWinner(squares);
    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (xIsNext ? 'X' : 'O');
    }

    return (
        <React.Fragment>
                <div className="status">{status}</div>
            <div className="board-row">
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} winning={winningLine.includes(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} winning={winningLine.includes(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} winning={winningLine.includes(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} winning={winningLine.includes(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} winning={winningLine.includes(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} winning={winningLine.includes(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} winning={winningLine.includes(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} winning={winningLine.includes(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} winning={winningLine.includes(8)} />
            </div>
        </React.Fragment>
    );
}

export default function Game() {
    const [history, setHistory] = useState([{squares: Array(9).fill(null), index: - 1}]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;

    function handlePlay(nextSquares, i) {
        const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, index: i }];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((turnInfo, move) => {
        let description;
        if (move > 0) {
            const row = (Math.floor(turnInfo.index / 3)) + 1;
            const col = (turnInfo.index%3) + 1;
            const symbol = turnInfo.index % 2 === 0 ? 'X' : 'O';
            //För att tydligare visa vilken rad och kolumn det gäller ökas rad och col med 1. 
            description = 'Go to move #' + move + '    X or O(Row, Col): ' + symbol + '(' + row + ', ' + col + ')';
        } else {
            description = 'Go to game start';
        }
        return (
            <li key={move}>
                {move === currentMove ? (
                    <React.Fragment>You are at move # {move}</React.Fragment>
                ) : (
                    <button onClick={() => jumpTo(move)}>{description}</button>
                )}
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];    
        }
    }
    return null;
}
