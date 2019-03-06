import React, { Component } from 'react';
import './Clubs.css';
import { days, times, interests, clubs } from './clubList.json'

//create each club to be placed in the schedule
function Activity (props) {
	let style = () => {
		let visibility = props.club.hide ? "hidden" : "visibile";
		let obj = { visibility };
		if (props.club.greyedOut)
			return Object.assign(obj, { opacity: .3, color: "initial"})
		else if (props.club.selected)
			return Object.assign(obj, { opacity: 1, color: "black"})
		else 
			return Object.assign(obj, { opacity: 1, color: "initial"})
	}
	return (
		<div
		style={style()} 
		className="club"
		onClick={props.divClick}>
			<span className="name">
				{props.club.name}
				<span className="emoji"> {props.club.emoji} </span>
			</span>
		</div>
	)
}
//create grid of schedule based on times and days
function Schedule (props) {
	let schedule = () => {
		let arr = [];
		for (let i = 0; i < props.schedule.length; i++) {
			let slot = props.schedule[i];
			if (typeof slot === "string")
				arr.push(<div key={i} className="block"> {slot} </div>)
			else if (typeof slot === "object") {
				var subArr = [];
				for (let j = 0; j < slot.length; j++) {
					console.log(slot);
					subArr.push(
						<Activity
						key={i+j}
						divClick={() => props.divClick(slot[j].num)}
						club={slot[j]} />
					)
				}
			arr.push(<div key={i} className="block"> {subArr} </div>)
			}
		}
		return arr;
	}
	return <div id="schedule"> {schedule()} </div>
}
//create checkboxes for students to determine what categories they're interested in
function Interests (props) {
	let arr = [];
	let interests = props.interests.sort((a, b) => b.slice(2) < a.slice(2));
	for (let i = 0; i < interests.length; i++) {
		let checked = props.selectedInterests.includes(interests[i]) ? "checked" : "";
		arr.push(
			<span key={i}>
				<input
					{...checked}
					type="checkbox"
					value={interests[i]}
					onChange={props.handleCheck} />
				<label>{interests[i]}</label>
			</span>
		);
	}
	return <div className="choices" id="interests"> {arr} </div>;
}
//create radio button to toggle whether to show only clubs with easy access
function Requirements(props) {
	function button (showHide) {
		return (
			<span key={showHide ? 1 : 0}>
				<input
					name="reqs" type="radio" value={showHide}
					onClick={props.reqClick()}/>
				{showHide ? "Yes" : "No"}
			</span>
		)
	}
	return (
		<form className="choices">
			{`Include Clubs with ${props.filter}?`}
			{button(true)}
			{button(false)}
		</form>
	);
}
//create list of clubs that have been selected, to be printed/emailed
function Selected (props) {
	let sc = props.selectedClubs.sort((a, b) => (a === b) ? a.time - b.time : a.meets - b.meets);

	function forEmail () {
		let emailHTML = "";
		sc.forEach(datum => {
			let notes = datum.notes ? `%0D%0A${datum.notes}` : ""
			emailHTML += `${datum.name}%0D%0AMeets on: ${days[datum.meets]} %40  
			${datum.exactTime || times[datum.time]}%0D%0A
			Room: ${datum.room + notes}%0D%0A%0D%0A%0D%0A`
		})
		return emailHTML;
	}

	const forPrint = (() => {
		let divArr = [];
		sc.forEach(datum => {
			divArr.push(
				<div key={datum.name}>
					<p>
						<span className="selected-name">{datum.name}</span>
						<br/>{days[datum.meets]}, {datum.exactTime || times[datum.time]}
						<br/>{"Room: " + datum.room}
						<br/>
						<span className="notes">{datum.notes}</span>
					</p>
				</div>)
		})
		return divArr;
	})();

	console.log(sc, forPrint);

	return (
		<div className={forPrint.length ? "choices" : "hidden"} id="selected-list">
			<h3 className="clubs"> Selected Clubs </h3>
			<div id="to-print"> 
				{forPrint} 
			</div>
			<div id="email-print">
				<button 
				id="print-button" 
				onClick={window.print}>
					Print
				</button>
				<button 
				id="email-button" 
				onClick={() => window.open(`mailto:?subject=My Clubs Schedule&body=${forEmail()}`)}>
					Email
				</button>
			</div>
		</div>
	)
}

export default class Clubs extends Component {
	constructor(props) {
		super(props);
		this.state = {
			times, days, interests, clubs,
			selectedInterests: [...interests],
			schedule: [],
			selectedClubs: [],
		}
		this.reqClick = this.reqClick.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
		this.divClick = this.divClick.bind(this);
	}
	//adjust selectedInterests and visible clubs based on Interests
	handleCheck = event => {
		let selectedInterests = [...this.state.selectedInterests];
		let clubs = [...this.state.clubs].map( club => {
			club = Object.assign({}, club);
			let categories = [...club.categories];
			for (let i = 0; i < selectedInterests.length; i++) {
				if (!categories.length) break;
				categories = categories.filter(x => this.state.interests[x] !== selectedInterests[i]);
			}
			if (!categories.length) club.hide = true;
			return club;
		});
		let x = selectedInterests.indexOf(event.target.value);
		if (x === -1) selectedInterests.push(event.target.value);
		else selectedInterests.splice(x, 1);
		this.setState({ clubs, selectedInterests, schedule: this.createSchedule(clubs) });
	}
	//create arrays of clubs for a given day and time
	createDays(clubs, day, time) {
		let arr = [];
		for (let i = 0; i < clubs.length; i++) 
			if ( clubs[i].meets === day && clubs[i].time === time )
				arr.push(Object.assign({}, clubs[i]));
		return arr;
	}
	//change data in clubs to pass down to Activity for opacity and color styling
	divClick (num) {
		console.log(1, selectedClubs);
		let selectedClubs = [...this.state.selectedClubs];
		let selected = !this.state.clubs[num].selected;
		let clubs = [...this.state.clubs].map(club => Object.assign({}, club));
		console.log(2, selectedClubs);
		clubs.forEach(x => {
			if (x.meets === clubs[num].meets && x.time === clubs[num].time) {
				x.greyedOut = selected;
				if (x.selected) 
					selectedClubs = selectedClubs.filter(y => y.num !== x.num);
				x.selected = false
			}
		});
		let selectedClub = Object.assign({}, clubs[num], { selected, greyedOut: false });
		clubs.splice(num, 1, selectedClub);
		console.log(3, selectedClubs);
		if (selected) selectedClubs.push(selectedClub);
		console.log(4, selectedClubs);
		this.setState({ clubs, selectedClubs, schedule: this.createSchedule(clubs) });
	}
	//adjust visibility based on whether clubs have requirements or applications
	reqClick = req => event => {
		this.setState({ [req]: event.target.value })
	}
	//set arrays of clubs assigned to dates and times
	createSchedule (clubs = this.state.clubs) {
		let arr = [];
		for (let i = 0; i < 3; i++) {
			if (i === 0) arr.push('Before School')
			else if (i === 1) arr.push('Lunch')
			else if (i === 2) arr.push('After School')
			for (let j = 0; j < 5; j++) {
				arr.push(this.createDays(clubs,j,i));
				if (i === 2 && j === 3) break;
			}
		}
		return ["", ...this.state.days, ...arr];
	}
 
	componentDidMount() {
		//assign clubs static/iterative properties
		let clubs = [...this.state.clubs].map((club, i) => {
			return Object.assign({}, club, { num: i, selected: false, greyedOut: false, hide: false })
		});
		//set html values to index.html
		document.getElementsByTagName('body')[0].setAttribute('class','clubs');
		document.getElementsByTagName('title')[0].innerHTML = "Clubs";

		this.setState({ clubs, schedule: this.createSchedule(clubs) });
	}

	render() {
		console.log(this.state.schedule)
		return (
			<div id="form">
				<Schedule
					divClick={this.divClick}
					schedule={this.state.schedule}/>
				<div id="filters">
					<Interests
						interests={this.state.interests}
						selectedInterests={this.state.selectedInterests}
						handleCheck={this.handleCheck}/>
					<Requirements
						filter="Requirements"
						reqClick={x => this.reqClick("requirements")}/>
					<Requirements
						filter="an Application"
						reqClick={x => this.reqClick("application")}/>
					<Selected 
					clubs={this.state.clubs} 
					selectedClubs={this.state.selectedClubs} 
					days={this.state.days} 
					times={this.state.times}/>
				</div>
			</div>
		);
	}
}