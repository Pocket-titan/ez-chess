import React, { Component } from 'react'
import { DragSource } from 'react-dnd'

const generateMoves = (piece, board) => {
  const { name, side, coords: [ownX, ownY] } = piece
  const FORWARDS = side === 'white' ? 1 : -1
  const [ REJECT, STOP, CONTINUE ] = [ true, true, false ]

  let moves = []
  possibleMoves[name].forEach(direction => {
    direction.some(([x, y]) => {
      // isValidMove ?
      if (name === 'pawn' && (ownY !== 1 && ownY !== 6) && y === 2) {
        // only allow double pawn jump in starting position
        return REJECT
      }
      const move = [ ownX + x, ownY + FORWARDS*y ]
      if (outOfBounds(move) || !board.hasOwnProperty(move)) {
        return REJECT
      }
      const pieceOnSquare = board[move].piece
      if (pieceOnSquare && pieceOnSquare.side === side) {
        // can't take our own pieces
        return REJECT
      }
      if (name === 'pawn' && !!pieceOnSquare === (x === 0)) {
        // pawns can only take diagonally, not move, and can't take vertically
        return REJECT
      }
      // isValidMove = true
      moves.push(move)
      if (pieceOnSquare) {
        // if this move took a piece, stop propagation, as it was in our way & we can't jump over it
        return STOP
      }
      return CONTINUE
    })
  })
  return moves
}

const getNewBoard = (from, to, board) => ({
  ...board,
  [from]: {
    ...board[from],
    piece: void 0,
  },
  [to]: {
    ...board[to],
    piece: {
      ...board[from].piece,
      coords: to,
    },
  }
})

const isKingChecked = (side, board) => {
  const check = Object.entries(board)
    .filter(([, sq]) => sq.piece && sq.piece.side !== side)
    .map(([, { piece: enemyPiece }]) => generateMoves(enemyPiece, board))
    .flat(1)
    .some(sq => board[sq].piece && board[sq].piece.name === 'king')
  return check
}

const getMoves = (piece, board) => (
  generateMoves(piece, board).filter(move => {
    const newBoard = getNewBoard(piece.coords, move, board)
    return !isKingChecked(piece.side, newBoard)
  })
)

export default class Game extends Component {
  state = {
    squares: getSquares(initialPieces),
    activeSquare: { coords: [], moves: [] },
    lastMove: { from: [], to: [] },
  }

  movePiece = (from, to) => {
    const squares = getNewBoard(from, to, this.state.squares)
  
    if (isKingChecked(this.state.squares[from].piece.side === 'white' ? 'black' : 'white', squares)) {
      console.log('check!')
    }
  
    this.setState({
      squares,
      activeSquare: { coords: [], moves: [] },
      lastMove: { from, to },
    })
  }

  onSquareClick = square => {
    const { coords: to, highlighted } = square
    if (!highlighted) {
      return
    }
    const { coords: from } = this.state.activeSquare
    this.movePiece(from, to)
  }

  onPieceClick = piece => {
    if (sameCoords(this.state.activeSquare.coords, piece. coords)) {
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

class Board extends Component {
  render() {
    const { children: mapSquare } = this.props
    const squares = Object.entries(this.props.squares)
      .sort(([a], [b]) => {
        if (a[2] === b[2]) {
          return a[0] - b[0]
        }
        return b[2] - a[2]
      })
      .map(([, square]) => square)

    return (
      <div className="board">
        {
          squares.map(square =>
            mapSquare(square)
          )
        }
      </div>
    )
  }
}

const Square = square => {
  const {
    coords: [x, y], highlighted, active,
    movedFrom, movedTo, onClick, children
  } = square

  const color = x % 2 === y % 2 ? 'dark' : 'light'

  return (
    <div
      className={
        highlighted ? (children
          ? `highlighted ${color} piece`
          : `highlighted ${color} nopiece`)
          : (active ? 'active' : (movedFrom ? 'from' : (movedTo ? 'to' : `${color}`)))
      }
      onClick={() => onClick(square)}
    >
      {children}
    </div>
  )
}

const pieceSource = {
  beginDrag(props) {
    return props
  }
}

const pieceCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const Piece = DragSource('Piece', pieceSource, pieceCollect)(piece => {
  const { side, name, onClick, connectDragSource, isDragging } = piece
  return connectDragSource(
    <div
      className={`piece ${side}-${name}`}
      onClick={() => onClick(piece)}
    />
  )
})

const getSquares = pieces => {
  const coordinates = [
  [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
  [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4],
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6],
  [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
]

return coordinates.reduce((obj, [x, y]) => {
  const square = {
    coords: [x, y],
    piece: pieces.filter(piece => sameCoords(piece.coords, [x, y]))[0] || undefined,
  }
  obj[[x, y]] = square
  return obj
}, {})
}

const outOfBounds = ([x, y]) => !(x <= 7 && x >= 0 && y <= 7 && y >= 0)

const sameCoords = ([x1, y1], [x2, y2]) => x1 === x2 && y1 === y2

let possibleMoves = {
  'pawn': [
    [[0, 1], [0, 2]],
    [[1, 1]],
    [[-1, 1]],
  ],
  'rook': [
    [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
    [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
    [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
    [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
  ],
  'knight': [
    [[1, 2]],
    [[-1, 2]],
    [[1, -2]],
    [[-1, -2]],
    [[2, 1]],
    [[-2, 1]],
    [[2, -1]],
    [[-2, -1]],
  ],
  'bishop': [
    [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
    [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
    [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
    [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
  ],
  'queen': [
    [[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0]],
    [[-1, 0], [-2, 0], [-3, 0], [-4, 0], [-5, 0], [-6, 0], [-7, 0]],
    [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7]],
    [[0, -1], [0, -2], [0, -3], [0, -4], [0, -5], [0, -6], [0, -7]],
    [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7]],
    [[1, -1], [2, -2], [3, -3], [4, -4], [5, -5], [6, -6], [7, -7]],
    [[-1, 1], [-2, 2], [-3, 3], [-4, 4], [-5, 5], [-6, 6], [-7, 7]],
    [[-1, -1], [-2, -2], [-3, -3], [-4, -4], [-5, -5], [-6, -6], [-7, -7]],
  ],
  'king': [
    [[1, 0]],
    [[-1, 0]],
    [[0, 1]],
    [[0, -1]],
    [[1, 1]],
    [[1, -1]],
    [[-1, 1]],
    [[-1, -1]]
  ],
}

const initialPieces = [
  // black
  { name: 'rook', side: 'black', coords: [0, 7] },
  { name: 'knight', side: 'black', coords: [1, 7] },
  { name: 'bishop', side: 'black', coords: [2, 7] },
  { name: 'queen', side: 'black', coords: [3, 7] },
  { name: 'king', side: 'black', coords: [4, 7] },
  { name: 'bishop', side: 'black', coords: [5, 7] },
  { name: 'knight', side: 'black', coords: [6, 7] },
  { name: 'rook', side: 'black', coords: [7, 7] },
  { name: 'pawn', side: 'black', coords: [0, 6] },
  { name: 'pawn', side: 'black', coords: [1, 6] },
  { name: 'pawn', side: 'black', coords: [2, 6] },
  { name: 'pawn', side: 'black', coords: [3, 6] },
  { name: 'pawn', side: 'black', coords: [4, 6] },
  { name: 'pawn', side: 'black', coords: [5, 6] },
  { name: 'pawn', side: 'black', coords: [6, 6] },
  { name: 'pawn', side: 'black', coords: [7, 6] },
  // white
  { name: 'rook', side: 'white', coords: [0, 0] },
  { name: 'knight', side: 'white', coords: [1, 0] },
  { name: 'bishop', side: 'white', coords: [2, 0] },
  { name: 'queen', side: 'white', coords: [3, 0] },
  { name: 'king', side: 'white', coords: [4, 0] },
  { name: 'bishop', side: 'white', coords: [5, 0] },
  { name: 'knight', side: 'white', coords: [6, 0] },
  { name: 'rook', side: 'white', coords: [7, 0] },
  { name: 'pawn', side: 'white', coords: [0, 1] },
  { name: 'pawn', side: 'white', coords: [1, 1] },
  { name: 'pawn', side: 'white', coords: [2, 1] },
  { name: 'pawn', side: 'white', coords: [3, 1] },
  { name: 'pawn', side: 'white', coords: [4, 1] },
  { name: 'pawn', side: 'white', coords: [5, 1] },
  { name: 'pawn', side: 'white', coords: [6, 1] },
  { name: 'pawn', side: 'white', coords: [7, 1] },
]