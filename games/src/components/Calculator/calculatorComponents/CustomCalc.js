import React, { Component } from 'react';
import '../style.css';

//tab down select-menu

function Multipliers (props) {

	return(
		<button
		className="choice"
		type="button"
		onClick={props.click} 
		value={props.title}>
			{props.title}
		</button>)
}

function LineItem (props) {
	
	function click (event) {
		props.handleChange(props.num, "multiplier")(event);
		document.getElementById(`select-menu-${props.num}`).style.display = "none";
	}

	function openClose () {
		let display = (document.getElementById(`select-menu-${props.num}`).style.display === "flex") ? "none" : "flex";
		document.getElementById(`select-menu-${props.num}`).style.display = display;
		if (display === "flex") document.getElementsByClassName('better-select')[props.num].focus();
	}

	function renderDropdownItems (options) {
		let arr = [];
		for (let i = 0; i < options.length; i++) {
			arr.push(<Multipliers 
				key={i} 
				click={click}
				title={options[i]} 
				num={props.num} 
				handleChange={props.handleChange}/>)
		}
		return arr;
	}

	return(
		<div className="line-item">
			<input 
			onChange={props.handleChange(props.num, "costName")} 
			placeholder="Cost Name" 
			value={props.lineItem.costName}/>
			<input
			type="number"
			onChange={props.handleChange(props.num, "unitCost")} 
			onBlur={props.calculateCosts} 
			placeholder="Unit Cost" 
			value={props.lineItem.unitCost}/>
			<div className="ddmenu">
				<button 
				className="ddbutton"
				type="button" 
				onClick={openClose}>
				{props.lineItem.multiplier}
				</button>
				<div 
				tabindex={0} 
				className="better-select">
					<div id={`select-menu-${props.num}`}  className="select-menu">
						{renderDropdownItems([
							"Flat Rate", 
							"Per Student", 
							"Per Chaperone", 
							"Per Person", 
							"Per Vehicle", 
							"Per Hotel Room"
						])}
						<input 
						min={1}
						type="number" 
						onBlur={click} 
						placeholder="Custom Number"/>
					</div>
				</div>
			</div>
			<div 
			className="total-cost">
			{isNaN(props.lineItem.totalCost) 
				? "---"
				: '$' + Number(props.lineItem.totalCost).toFixed(2)}
			</div>
			<div className="li-buttons">
				{props.showDeleteButton ?
					<button 
					className="delete-line-item" 
					type="button"
					onClick={() => props.removeLineItem(props.num)} >
						<i className="fa fa-trash" />
					</button>
					: ""}
				<button 
				className="add-line-item" 
				type="button"
				onClick={() => props.addLineItem(props.num)} >
					<i className="fa fa-plus" />
				</button>
			</div>
		</div>


			
	);
}

export default class Calculator extends Component {
	constructor(props) {
		super(props);
		this.renderLineItems = this.renderLineItems.bind(this);
	}

	renderLineItems () {
		let arr = [];
		for (let i = 0; i < this.props.lineItems.length; i++) {
			arr.push(<LineItem 
				key={i} 
				num={i} 
				calculateCosts={() => this.props.calculateCosts(i)} 
				handleChange={this.props.handleChange} 
				lineItem={ this.props.lineItems[i] } 
				addLineItem={this.props.addLineItem}
				removeLineItem={this.props.removeLineItem}
				showDeleteButton={this.props.lineItems.length > 1 ? true : false} />)
		}
		return arr;
	}

	render () {
		return(
			<form id="calculator">
				{this.renderLineItems()}
			</form>
		);
	}
}