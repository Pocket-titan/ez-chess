import React, { Component } from 'react'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Game from './Components/Game'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Game/>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(App)
