import React, { Component } from 'react';

export default class Banana extends Component {
  render(){
    return (
      <div style={
        { width: '60px', 
          position: 'absolute',
          zIndex: 999,
          height: '80px', 
          backgroundImage: 'url(assets/8bit_banana.png)',
          backgroundSize: 'cover',
          top: this.props.y,
          left: this.props.x }}></div>
    )
  }
}
