import React, { Component } from 'react';

export default class Vertical extends Component {
  render(){
    return (
      <div style={
        { width: '1px', 
          position: 'absolute',
          zIndex: 100,
          height: '100%', 
          backgroundColor: 'white',
          left: this.props.x }}></div>
    )
  }
}
