import React, { Component } from 'react';

export default class Horizontal extends Component {
  render(){
    return (
      <div style={
        { width: '100%', 
          position: 'absolute',
          margin: 0,
          padding: 0,
          zIndex: 100,
          height: '1px', 
          backgroundColor: 'white',
          top: this.props.y }}></div>
    )
  }
}
