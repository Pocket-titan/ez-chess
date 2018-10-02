import React from 'react'

const squareTarget = {
  drop(props, monitor) {
    props.movePiece()
  },
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

export default Square