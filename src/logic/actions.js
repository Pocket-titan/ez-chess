import { getSquares, initialPieces, updateSquares, getMoves } from './'

// miniredux
class Store {
  constructor(state) {
    this.state = state
    this.subscribers = []
  }

  subscribe = callback => {
    this.subscribers.push(callback)
    return this.state
  }

  emitChange = reducer => {
    this.state = reducer(this.state)
    this.subscribers.forEach(callback => callback(this.state))
  }
}

export const store$ = new Store({
  squares: getSquares(initialPieces),
  side: 'white',
  turn: 'white',
  lastMove: { from: [], to: [] },
  highlighted: [],
  active: [],
})

// actions
export const movePiece = to => {
  store$.emitChange(state => ({
    ...state,
    squares: updateSquares(state.active, to, state.squares),
    lastMove: { from: state.active, to },
    active: [],
    highlighted: [],
  }))
}

export const highlightMoves = piece => {
  const { active, squares } = store$.state
  // if (equal(active, piece.coords)) {
  //   return store$.emitChange(state => ({ ...state, highlighted: [], active: [] }))
  // }
  const moves = getMoves(piece, squares)
  store$.emitChange(state => ({
    ...state,
    highlighted: moves,
    active: piece.coords,
  }))
}

export const clearMoves = () => {
  store$.emitChange(state => ({ ...state, highlighted: [], active: [] }))
}