import React, { Component } from 'react';
import styles from './App.css';
import Vertical from './components/Vertical';
import Horizontal from './components/Horizontal';
import Answer from './components/Answer';
import CSSModules from 'react-css-modules';

const QUESTIONS = [
  "What's happening?",
  "Where are you going?",
  "Why are you leaving?",
  "But seriously, why?",
  "Are you sad to leave frog?",
  "Are you moving?",
  "What will you miss the most about frog?",
  "Who will you miss the most?",
  "When is your last day?",
  "Can I use this website for my next deliverable that needs some $izzle?"
];

const ANSWERS = [
  "I (Jeff Ong) am leaving frog, and I made a website to tell you / deal with my feelings",
  'A company called Automattic — they are the primary custodian of Wordpress, among other Internet-related tools',
  'To work with John Maeda among others bringing shape to an idea they call "computational design"',
  'The entire company works remotely, so it will be easier to spend time with my family and pursue my dreamz',
  'Extremely',
  'Sort of, I\'ll be in and out of the area, so please still invite me to your parties, bat / bar mitzvahs, seances, etc',
  '1. You\n2. The tech team camraderie\n3. Working on ID / environments projects\n4. Tuesdays thru Friday around 4pm',
  'costar',
  'Thursday, Dec 6',
  'paypal'
];

class App extends Component {
  constructor(props){
    super(props);

    this.answerRef = React.createRef();
    this.state = { index: 0, x: window.innerWidth / 2, y: window.innerHeight / 2 }
    this.prev = this.prev.bind(this);
    this.next = this.next.bind(this);
  }

  _onTouchStart(e){
    // console.log(e.touches);
    this.setState({
      x: e.touches[0].pageX,
      y: e.touches[0].pageY
    });
  }

  _onMouseMove(e){
    this.setState({
      x: e.pageX,
      y: e.pageY
    });
  }

  prev(e){
    e.preventDefault();
    if (this.state.index > 0){
      this.setState({
        index: this.state.index - 1
      });
    } else {
      this.setState({
        index: ANSWERS.length - 1
      });
    }
  }

  next(e){
    e.preventDefault();
    if (this.state.index === ANSWERS.length - 1){
      this.setState({
        index: 0
      });
    } else {
      this.setState({
        index: this.state.index + 1
      });
    }

    this.answerRef.current.render();
  }
  
  render() {
    const { x, y, index } = this.state;
    return (
      <div styleName="App" onTouchStart={this._onTouchStart.bind(this)} onMouseMove={this._onMouseMove.bind(this)}>
        <Vertical x={x} />
        <Horizontal y={y} />
        <Answer length={ANSWERS.length} q={QUESTIONS[this.state.index]} a={ANSWERS[this.state.index]} x={x} y={y} index={index} ref={this.answerRef}/>
        <div onTouchEnd={this.prev} onClick={this.prev} styleName="previous">Previous</div>
        <div onTouchEnd={this.next} onClick={this.next} styleName="next">Next</div>
      </div>
    );
  }
}

export default CSSModules(App, styles);
