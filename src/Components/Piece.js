import React from 'react'
import { DragSource } from 'react-dnd'
import { highlightMoves } from '../logic/actions'

const pieceSource = {
  beginDrag(piece) {
    highlightMoves(piece)
    return piece
  }
}

const pieceCollect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}

const Piece = piece => {
  const { side, name, onClick, connectDragSource, isDragging, myPiece } = piece
  return connectDragSource(
    <div
      className={`piece ${side}-${name}`}
      onClick={() => onClick(piece)}
      style={{
        cursor: myPiece ? 'pointer' : 'default',
        opacity: isDragging ? 0.5 : 1,
      }}
    />
  )
}

export default DragSource('Piece', pieceSource, pieceCollect)(Piece)