import React from 'react'
import { DragSource } from 'react-dnd'

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

const Piece = piece => {
  const { side, name, onClick, connectDragSource, isDragging } = piece
  return connectDragSource(
    <div
      className={`piece ${side}-${name}`}
      onClick={() => onClick(piece)}
      style={{
        opacity: isDragging ? 0.5 : 1
      }}
    />
  )
}

export default DragSource('Piece', pieceSource, pieceCollect)(Piece)