import React, { Component } from 'react'
import {
  getSquares,
  getMoves,
  getNewBoard,
  initialPieces,
  isEnemyKingChecked,
  sameCoords
} from '../logic'
import Board from './Board'
import Square from './Square'
import Piece from './Piece'

class Game extends Component {
  state = {
    squares: getSquares(initialPieces),
    activeSquare: { coords: [], moves: [] },
    lastMove: { from: [], to: [] },
    side: 'white',
    turn: 'white',
  }

  ourTurn = () => this.state.side === this.state.turn

  ourPiece = ({ side }) => side === this.state.side

  movePiece = (from, to) => {
    const squares = getNewBoard(from, to, this.state.squares)
  
    if (isEnemyKingChecked(this.state.side, squares)) {
      console.log('check!')
    }
  
    this.setState({
      squares,
      activeSquare: { coords: [], moves: [] },
      lastMove: { from, to },
      turn: this.state.turn === 'white' ? 'black' : 'white',
      // TODO remove in production
      side: this.state.side === 'white' ? 'black' : 'white',
    })
  }

  onSquareClick = square => {
    if (!this.ourTurn()) {
      return
    }
  
    const { coords: to, highlighted } = square
    if (!highlighted) {
      return
    }
    const { coords: from } = this.state.activeSquare
    this.movePiece(from, to)
  }

  onPieceClick = piece => {
    if (!this.ourTurn() || !this.ourPiece(piece)) {
      return
    }
  
    if (sameCoords(this.state.activeSquare.coords, piece.coords)) {
      return this.setState({ activeSquare: { coords: [], moves: [] } })
    }
  
    const moves = getMoves(piece, this.state.squares)
    this.setState({ activeSquare: { coords: piece.coords, moves } })
  }

  render() {
    const { squares, activeSquare, lastMove } = this.state
    return (
      <Board squares={squares}>
        {
          square =>
            <Square
              {...square}
              active={sameCoords(activeSquare.coords, square.coords)}
              highlighted={activeSquare.moves.some(coords => sameCoords(coords, square.coords))}
              movedFrom={sameCoords(lastMove.from, square.coords)}
              movedTo={sameCoords(lastMove.to, square.coords)}
              onClick={this.onSquareClick}
            >
              {
                square.piece &&
                  <Piece
                    {...square.piece}
                    onClick={this.onPieceClick}
                  />
              }
            </Square>
        }
      </Board>
    )
  }
}

export default Game