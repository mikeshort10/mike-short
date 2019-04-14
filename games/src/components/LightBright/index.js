import React, { Component } from 'react';
import './style.css';
import {
    DropdownButton, 
    Dropdown, 
    Button, 
    ButtonGroup, 
    ButtonToolbar} from 'react-bootstrap'

//ensure app can work on touch screen as well 
//Add Redux
    //Undo
    //Redo

class Light {
    constructor() {
        this.hue = 330;
        this.lit = false;
    }
    get color() {
        return this.hue;
    }
    set color(command) {
        if (command === "f") this.hue = (this.hue + 30) % 360;
        else if (command === "b") this.hue = (this.hue - 30) % 360;
        else if (!Number.isNaN(command)) this.hue = command;
    }
    get light() {
        return this.lit;
    }
    set light(on) {
        this.lit = !!on;
    }
}

function Bulb(props) {
    let on = props.light.light ? '50' : '0';
    let divStyle = {
        background: 'hsl(' + props.light.color + ', 100%, ' + on + '%)'
    }
    return (
        <div 
        className="bulb" 
        style={divStyle} 
        onClick={props.handleClick}  
        onPointerOver={props.handleSlide}/>)
}

function Picture(props) {
    function createBulbs(bulbArr = []) {
        for (let i = 0; i < props.lights.length; i++) {
            bulbArr.push(
                <Bulb 
                key={i} 
                light={props.lights[i]} 
                changeClicking={props.changeClicking} 
                handleClick={() => props.handleClick(i)} 
                handleSlide={() => props.handleSlide(i)} />);
        }
        return bulbArr;
    }
    return <div id="board">{createBulbs()}</div>
}

export default class LightBright extends Component {
    initBoardSize = 70;
    constructor(props) {
        super(props);
        this.state = {
            stepNumber: 0,
            sensitivity: 250,
            clicking: false,
            lights: Array(Math.pow(this.initBoardSize, 2)).fill().map(x => new Light()),
            history: []
        }
    }

    handleClick = (index, clr) => {
        let lights = [...this.state.lights];
        let current = new Light(lights[index]);
        let recentClick = this.state.recentClick;
        let stepNumber = this.state.stepNumber + 1;
        let timeout; 
        if (recentClick === index && current.light) {
            current.color = 330;
            current.light = false;
        } else {
            if (this.state.clicking) current.color = clr;
            else if (current.light) current.color = "f";
            else current.color = this.state.lastColor || 0;
            current.light = true;
            timeout = setTimeout(() => this.setState({ recentClick: undefined }), this.state.sensitivity);
        }
        lights[index] = current;
        clearTimeout(this.state.timeout);
        this.setState({
            stepNumber, lights, timeout,
            lastClicked: recentClick === index ? undefined : index,
            recentClick: recentClick === index ? undefined : index,
            lastColor: clr || current.color,
            history: this.state.history.slice(0, stepNumber).concat([lights])
        })
    }

    handleSlide = (index) => {
        if (this.state.clicking) this.handleClick(index, this.state.lastColor);
    }

    changeClicking = () => {
        this.setState({ clicking: !this.state.clicking })
    }

    resetAll = () => {
        let lights = [...this.state.lights];
        for (let i = 0; i < lights.length; i++) {
            lights[i] = {...lights[i], light: false, color: 330};
        }
        this.setState({
            lights,
            lastClicked: undefined,
            lastColor: undefined,
            history: [lights],
            stepNumber: 0
        })
    }

    goBack = (undo) => {
        let stepNumber = undo ? this.state.stepNumber - 1 : this.state.stepNumber + 1;
        if (stepNumber >= this.state.history.length || stepNumber < 0) return;
        let lights = this.state.history[stepNumber].slice(0);
        this.setState({ stepNumber, lights })
    }

    changeSize = (size) => {
        document.documentElement.style.setProperty('--cell-width', 'calc(var(--board-width)/' + size + ')')
        this.setState({
            lastColor: undefined,
            clicking: false,
            recentClick: undefined,
            lastClicked: undefined,
            lights: Array(Math.pow(size, 2)).fill().map(x => new Light())
        })
    }

    changeSensitivity = (speed) => {
        this.setState({ sensitivity : speed })
    }

    componentDidMount () {
        document.getElementsByTagName('body')[0].setAttribute('class','light-bright');
        document.addEventListener("mousedown", this.changeClicking);
        document.addEventListener("mouseup", this.changeClicking);
        document.addEventListener("touchstart", this.changeClicking);
        document.addEventListener("touchend", this.changeClicking);
        this.setState({
            history: [...this.state.history, this.state.lights.slice(0)]
        })
    }

    render() {
        return (
            <div id="app">
                <div className="buttons">
                <ButtonToolbar>
                    <ButtonGroup>
                      <Button onClick={() => this.goBack(true)}>Undo</Button>
                      <Button onClick={() => this.goBack(false)}>Redo</Button>
                      <Button bsStyle="danger" onClick={this.resetAll}>Reset All</Button>
                      </ButtonGroup>
                      </ButtonToolbar>
                      <ButtonToolbar>
                      <ButtonGroup>
                      <DropdownButton title="Size" pullLeft noCaret id="size">
                        <Dropdown.Item header>
                            Change the size of the bulbs
                        </Dropdown.Item>
                        <Dropdown.Item divider/>
                        <Dropdown.Item onClick={() => this.changeSize(10)}>10x10</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.changeSize(20)}>20x20</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.changeSize(30)}>30x30</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.changeSize(40)}>40x40</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.changeSize(50)}>50x50</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.changeSize(60)}>60x60</Dropdown.Item>
                        <Dropdown.Item onClick={() => this.changeSize(70)}>70x70</Dropdown.Item>
                      </DropdownButton>
                      <DropdownButton title="Sensitivity" noCaret id="sensitivity">
                        <Dropdown.Item header>
                            Change double click speed
                        </Dropdown.Item>
                        <Dropdown.Item divider/>
                        <Dropdown.Item 
                        onClick={() => this.changeSensitivity(500)}>
                            Slow - For Turning Off Bulbs
                        </Dropdown.Item>
                        <Dropdown.Item 
                        onClick={() => this.changeSensitivity(250)}>
                            Normal
                        </Dropdown.Item>
                        <Dropdown.Item 
                        onClick={() => this.changeSensitivity(100)}>
                            Fast - For Changing Colors
                        </Dropdown.Item>
                      </DropdownButton>
                      <DropdownButton title="Help" pullRight noCaret id="instructions">
                        <Dropdown.Item disabled>
                            Click on any bulb to light it up.
                        </Dropdown.Item>
                        <Dropdown.Item disabled>
                            Drag to light up multiple bulbs.
                        </Dropdown.Item>
                        <Dropdown.Item disabled>
                            Double click quickly to turn off a bulb.
                        </Dropdown.Item>
                        <Dropdown.Item disabled>
                            Click on any bulb to change the current color.
                        </Dropdown.Item>                 
                        </DropdownButton>
                    </ButtonGroup>
                </ButtonToolbar>
                </div>
                <Picture 
                lights={this.state.lights} 
                changeClicking={this.changeClicking} 
                handleClick={x => this.handleClick(x)}
                handleSlide={x => this.handleSlide(x)}
                />
             </div>
        )
    }
}