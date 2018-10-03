import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Game from './Components/Game'
import './App.css'

import { store$ } from './logic/actions'

class App extends Component {
  state = store$.subscribe(state => {
    this.setState(state)
  })
  
  render() {
    return (
      <div className="App">
        <Game {...this.state}/>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
