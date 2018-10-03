import React from 'react'
import { DropTarget } from 'react-dnd'
import { movePiece } from '../logic/actions'

const squareTarget = {
  drop(square, monitor) {
    if (!square.highlighted) {
      return
    }
    movePiece(square.coords)
  },
}

const squareCollect = (connect, monitor) => {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver()
  }
}

const Square = square => {
  const {
    coords: [x, y], highlighted, active, movedFrom,
    movedTo, onClick, children, connectDropTarget, isOver
  } = square

  const color = x % 2 === y % 2 ? 'dark' : 'light'

  return connectDropTarget(
    <div
      className={
        highlighted ? (children
          ? `highlighted ${color} ${isOver ? 'isOver' : ''} piece`
          : `highlighted ${color} ${isOver ? 'isOver' : ''} nopiece`)
          : (active ? 'active' : (movedFrom ? 'from' : (movedTo ? 'to' : `${color}`)))
      }
      onClick={() => onClick(square)}
    >
      {children}
    </div>
  )
}

export default DropTarget('Piece', squareTarget, squareCollect)(Square)