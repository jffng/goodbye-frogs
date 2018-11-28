import React, { Component } from 'react';
import CSSModules from 'react-css-modules';
import Snowglobe from './Snowglobe';
import styles from './Answer.css';

const IMAGES = ['assets/rock.png', 'assets/earth.png', 'assets/skull.png'];

class Answer extends Component {
  constructor(props){
    super(props);
    this.renderAnswers = this.renderAnswers.bind(this);
    this.renderDots = this.renderDots.bind(this);
    this.explode = this.explode.bind(this);

    this.state = {
      clicked: [false,false,false,false,false,false,false,false,false,false]
    }
    this.snowglobeRef = React.createRef();
  }

  explode(i){
    if (!this.state.clicked[i]){
      this.snowglobeRef.current.explode();
    }
    let temp = this.state.clicked;
    temp[i] = true;
    this.setState({
      clicked: temp
    });
  }

  renderAnswers(i){
    const path = IMAGES[i % 3];
    let partial;
    if (this.props.a === 'costar'){
      partial = (<div><a href="https://www.costarastrology.com/" target="_blank" rel="noopener noreferrer">???</a></div>);
    } else if (this.props.a === 'paypal'){
      partial = (<div><a href="https://www.paypal.me/jffng" target="_blank" rel="noopener noreferrer">$ $ $ $ $ $ $</a><div style={{fontSize: '18px'}}>(JK <a href="https://github.com/jffng/goodbye-frogs" target="_blank" rel="noopener noreferrer">here's the code.</a> Also this design is pretty much a stolen item #Took™)</div></div>);
    } else {
      partial = this.props.a.split('\n').map(t => (<div key={t}>{t}</div>));
    }
    return (
      <div>
        <h1>{this.props.q}</h1>
        <div styleName="standard" onTouchStart={()=> this.explode(i)} onClick={() => this.explode(i)}>
          <span style={{backgroundImage: this.state.clicked[i] ? '' : `url(${path})`}} className={this.state.clicked[i] ? 'exploded' : 'costar'}>
            { this.state.clicked[i] ? partial : '' }
          </span>
        </div>
      </div>
    )
  }

  renderDots(answerIndex){
    let dots = [];

    for (let i = 0; i < this.props.length; i++){
      let className;
      i === answerIndex ? className = 'dot active' : className = 'dot';
      dots.push((<span key={Math.random() * 100000 / 12489} className={className}></span>))
    }

    return dots;
  }

  render(){
    const {x, y, index} = this.props;
    const rangeX = (x / window.innerWidth * 100) - 50;
    const rangeY = -(y / window.innerHeight * 100 - 50);
    return (
      <div>
        <div styleName="perspective" style={{perspective: `${window.innerWidth}px`}}>
          <div styleName="tilter" style={{ transform: `rotateX(${rangeY}deg) rotateY(${rangeX}deg)` }}>
            { this.renderAnswers(index) }
            <div styleName="dots">
              { this.renderDots(index) }
            </div>
          </div>
        </div>
        <Snowglobe ref={this.snowglobeRef}/>
      </div>
    )
  }
}

export default CSSModules(Answer, styles);
