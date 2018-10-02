import React, { Component } from 'react'

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

export default Board