import React, { Component } from 'react'
import _ from 'lodash'
import { equal, pieces } from '../logic'
import { highlightMoves, clearMoves, movePiece } from '../logic/actions'

// Components
import Board from './Board'
import Square from './Square'
import Piece from './Piece'

// Assets
import TakeSound from '../assets/Capture.mp3'
import MoveSound from '../assets/Move.mp3'

class Game extends Component {
  componentDidUpdate = ({ squares: oldSquares }) => {
    const { squares: newSquares } = this.props
    // if the board changed, we need to play a sound!
    if (!_.isEqual(oldSquares, newSquares)) {
      const audio = new Audio(
        pieces(oldSquares) > pieces(newSquares)
          ? TakeSound
          : MoveSound
      )
      audio.play()
    }
  }
  
  render() {
    const { squares, turn, side, lastMove, active, highlighted } = this.props
    let myTurn = turn === side

    let myPiece = piece => piece.side === side

    let onPieceClick = piece => {
      if (!myTurn || !myPiece(piece)) {
        return
      }

      if (equal(active, piece.coords)) {
        return clearMoves()
      }
    
      highlightMoves(piece)
    }

    let onSquareClick = square => {
      if (!square.highlighted) {
        return
      }
      movePiece(square.coords)
    }
    return (
      <Board squares={squares} side={side}>
        {
          square =>
            <Square
              {...square}
              onClick={onSquareClick}
              movedFrom={equal(square.coords, lastMove.from)}
              movedTo={equal(square.coords, lastMove.to)}
              active={equal(square.coords, active)}
              highlighted={highlighted.some(([x, y]) => equal(square.coords, [x, y]))}
            >
              {
                square.piece &&
                  <Piece
                    {...square.piece}
                    myPiece={myPiece(square.piece)}
                    onClick={onPieceClick}
                  />
              }
            </Square>
        }
      </Board>
    )
  }
}

export default Game