import React, { Component } from 'react';
import './Clubs.css';

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
					subArr.push(
						<Activity
						key={i+j}
						divClick={() => props.divClick(props.slot[j].num)}
						club={slot[j]} />
					)
				}
			arr.push(<div key={i} className="block"> {subArr} </div>)
			}
		}
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
					onChange={props.handleCheck()} />
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
					name="reqs"
					type="radio"
					value={showHide}
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
	let sc = props.selectedClubs.sort(( a, b ) => {
		let aMeets = props.days.indexOf(a.meets); 
		let bMeets = props.days.indexOf(b.meets);
		let aTime = props.times.indexOf(a.time);
		let bTime = props.times.indexOf(b.time);
		if (aMeets === bMeets) 
			return aTime > bTime ? 1 : -1 
		return aMeets > bMeets ? 1 : -1
	})

	function forEmail () {
		let emailHTML = "";
		sc.forEach(datum => {
			let time = datum.exactTime || datum.time
			let notes = datum.notes ? `%0D%0A${datum.notes}` : ""
			emailHTML += `${datum.name}%0D%0AMeets on: ${datum.meets} %40  ${time}%0D%0A
			Room: ${datum.room + notes}%0D%0A%0D%0A%0D%0A`
		})
		return emailHTML;
	}

	function forPrint () {
		let divArr = [];
		sc.forEach(datum => {
			divArr.push(
				<div key={datum.name}>
					<p>
						<span className="selected-name">{datum.name}</span>
						<br/>{datum.meets}, {datum.exactTime ? datum.exactTime : datum.time}
						<br/>{"Room: " + datum.room}
						<br/>
						<span className="notes">{datum.notes}</span>
					</p>
				</div>)
		})
		return divArr;
	}

	return (
		<div className={forPrint().length ? "choices" : "hidden"} id="selected-list">
			<h3 className="clubs"> Selected Clubs </h3>
			<div id="to-print"> {forPrint()} </div>
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

export default class Container extends Component {
	constructor(props) {
		super(props);
		let times = ["Before School", "Lunch", "After School"];
		let days = ["Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays"];
		let interests = [
			"🎷Music",
			"🖌Art",
			"⚖️Social Justice",
			"🤣Fun!",
			"🌏Culture",
			"🥇Leadership",
			"🗣Language",
			"💻Computer Science",
			"🔬Math & Science"
			];
		this.state = {
			times: [...times],
			days: [...days],
			interests: [...interests],
			selectedInterests: [...interests],
			schedule: [],
			selectedClubs: [],
			clubs: [
				{
					emoji: "👾",
					name: "Animation Club",
					meets: days[2],
					time: times[2],
					description: "TBW",
					room: "107",
					categories: [interests[1], interests[7]]
				},
				{
					emoji: "🎨",
					name: "Art Club",
					meets: days[1],
					time: times[2],
					description:
						"Hang out with friends and use the art classrooms supplies to create any art want!",
					room: "102",
					categories: [interests[1], interests[3]]
				},
				{
					emoji: "♞",
					name: "Chess Club",
					meets: days[0],
					time: times[1],
					description:
						`Play chess with fellow Seton students or learn the game for the first time!
						It's a great way to exercise your brain!`,
					room: "A8",
					categories: [interests[3]]
				},
				{
					emoji: "🇨🇳",
					name: "Chinese Mandarin Club",
					meets: days[3],
					time: times[1],
					description:
						"Learn about Chinese language and culture, or if you already speak it, share it!",
					room: "C2",
					notes: "only meets on the 1st Thursday of the month",
					categories: [interests[4], interests[6]]
				},
				{
					emoji: "🕺🏾",
					name: "Dance Club",
					meets: days[3],
					time: times[2],
					description: "Learn to dance and practice your skillzzzz",
					room: "Dance Studio",
					categories: [interests[3]]
				},
				{
					emoji: "⚙️",
					name: "Engineering Club",
					meets: days[1],
					time: times[1],
					description:
						`Don't have enough room in your class schedule for Engineering classes?
						Here's your chance to practice your skills and learn some new ones!`,
					room: "B5",
					categories: [interests[7], interests[8]]
				},
				{
					emoji: "⛪️",
					name: "Faith and Freedom Club",
					meets: days[0],
					time: times[1],
					description: "do art",
					room: "A2",
					categories: [interests[2]]
				},
				{
					emoji: "🎊",
					name: "Fiesta Club",
					meets: days[2],
					time: times[1],
					description: "Learn about ",
					room: "C2",
					categories: [interests[4], interests[3]]
				},
				{
					emoji: "🇫🇷",
					name: "French Club",
					meets: days[2],
					time: times[1],
					description: "do art",
					room: "A4",
					categories: [interests[4], interests[6]]
				},
				{
					emoji: "🇫🇷",
					name: "French Honors Club",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "A2",
					categories: [interests[4], interests[6]],
					notes: "must be in French class"
				},
				{
					emoji: "🇫🇷",
					name: "French Honors Club ",
					meets: days[3],
					time: times[2],
					description: "do art",
					room: "A2",
					categories: [interests[4], interests[6]],
					notes: "must be in French class"
				},
				{
					emoji: "🌐",
					name: "Global Ambassador Club",
					meets: days[0],
					time: times[1],
					description: "do art",
					room: "D3",
					categories: [interests[4], interests[6], interests[2]],
					notes: "must be in French class"
				},
				{
					emoji: "⚡️",
					name: "Harry Potter Club",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "A3",
					categories: [interests[3]]
				},
				{
					emoji: "🏘",
					name: "House Leadership",
					meets: days[1],
					time: times[0],
					exactTime: "7:30AM",
					description: "do art",
					room: "E1",
					categories: [interests[5]]
				},
				{
					emoji: "🏘",
					name: "House Leadership ",
					meets: days[3],
					time: times[0],
					exactTime: "7:30AM",
					description: "do art",
					room: "E1",
					categories: [interests[5]]
				},
				{
					emoji: "🙏",
					name: "Kairos Leadership Team",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "A6",
					categories: [interests[5]]
				},
				{
					emoji: "🇻🇦",
					name: "Latin Club",
					meets: days[1],
					time: times[1],
					description: "do art",
					room: "C4",
					categories: [interests[6]],
					notes: "only meets A Week"
				},
				{
					emoji: "📚",
					name: "Literature and Art Magazine",
					meets: days[2],
					time: times[1],
					description: "do art",
					room: "D1",
					categories: [interests[1]]
				},
				{
					emoji: "📝",
					name: "Math Club",
					meets: days[1],
					time: times[1],
					description: "do art",
					room: "A2",
					categories: [interests[8]]
				},
				{
					emoji: "📝",
					name: "Math Club ",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "A2",
					categories: [interests[8]]
				},
				{
					emoji: "🏅",
					name: "National Honor Society",
					meets: days[1],
					time: times[1],
					description: "do art",
					room: "A2",
					categories: [interests[5]],
					requirements: "Honor Roll; Service"
				},
				{
					emoji: "🎺",
					name: "Pep Band",
					meets: days[2],
					time: times[0],
					exactTime: "7:15AM",
					description: "do art",
					room: "104",
					categories: [interests[0]]
				},
				{
					emoji: "👍",
					name: "Pinterest Club",
					meets: days[0],
					time: times[1],
					description: "do art",
					room: "A6",
					categories: [interests[3]]
				},
				{
					emoji: "✝️",
					name: "Pro-Life Club",
					meets: days[0],
					time: times[1],
					description: "do art",
					room: "A3",
					categories: [interests[2]],
					notes: "only meets B Week"
				},
				{
					emoji: "💃🏻",
					name: "Prom Committee",
					meets: days[0],
					time: times[2],
					description: "do art",
					room: "E1",
					categories: [interests[5]]
				},
				{
					emoji: "📖",
					name: "Publications Club",
					meets: days[0],
					time: times[1],
					description: "do art",
					room: "B4",
					categories: [interests[1]]
				},
				{
					emoji: "🤖",
					name: "Robotics",
					meets: days[4],
					time: times[1],
					exactTime: "After School",
					description: "do art",
					room: "Cafeteria",
					categories: [interests[7], interests[8]]
				},
				{
					emoji: "🤖",
					name: "Robotics ",
					meets: days[2],
					time: times[1],
					exactTime: "After School",
					description: "do art",
					room: "B5",
					categories: [interests[7], interests[8]]
				},
				{
					emoji: "🎻",
					name: "SCOPE",
					meets: days[3],
					time: times[0],
					exactTime: "7:15AM",
					description: "do art",
					room: "104",
					categories: [interests[0]]
				},
				{
					emoji: "🛡",
					name: "Sentinel Ambassador Society",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "Gym",
					categories: [interests[5]],
					notes: "only meets last Thursday of the month"
				},
				{
					emoji: "👭",
					name: "Seton Buddies",
					meets: days[2],
					time: times[1],
					description: "do art",
					room: "A6",
					categories: [interests[5], interests[2]]
				},
				{
					emoji: "🎉",
					name: "Seton Spirit Club",
					meets: days[1],
					time: times[2],
					description: "do art",
					room: "Cafeteria",
					categories: [interests[3]]
				},
				{
					emoji: "🤙",
					name: "Sign Language Club",
					meets: days[2],
					time: times[1],
					description: "do art",
					room: "D3",
					categories: [interests[6]]
				},
				{
					emoji: "🌎",
					name: "Sister Cities Connection Club",
					meets: days[0],
					time: times[1],
					description: "do art",
					room: "B3",
					categories: [interests[4]]
				},
				{
					emoji: "🤝",
					name: "Solidarity Club",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "D1",
					categories: [interests[2]]
				},
				{
					emoji: "🇪🇸",
					name: "Spanish Honor Society",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "C2",
					categories: [interests[4], interests[6]]
				},
				{
					emoji: "📺",
					name: "The Office Club",
					meets: days[3],
					time: times[1],
					description: "do art",
					room: "A4",
					categories: [interests[3]],
					notes: "only meets A Week"
				},
				{
					emoji: "🥂",
					name: "Toastmasters Youth Leadership Program",
					meets: days[4],
					time: times[0],
					exactTime: "6:50AM",
					description: "do art",
					room: "D2",
					categories: [interests[6], interests[5]]
				}]
		};
		this.reqClick = this.reqClick.bind(this);
		this.handleCheck = this.handleCheck.bind(this);
	}
	//adjust selectedInterests and visible clubs based on Interests
	handleCheck = event => {
		let selectedInterests = [...this.state.selectedInterests];
		let clubs = [...this.state.clubs].map( club => {
			club = Object.assign({}, club);
			let categories = [...club.categories];
			for (let i = 0; i < selectedInterests.length; i++)
				categories = categories.filter(x => x !== selectedInterests[i]);
				//if (!categories.length) break;
			if (!categories.length) club.hide = true;
			return club;
		});
		let x = selectedInterests.indexOf(event.target.value);
		if (x === -1) selectedInterests.push(event.target.value);
		else selectedInterests.splice(x, 1);
		this.setState({ clubs, selectedInterests });
	}
	//create arrays of clubs for a given day and time
	createDays(day, time) {
		let arr = [];
		for (let i = 0; i < this.state.clubs.length; i++) {
			let club = this.state.clubs[i];
			if ( club.meets === day && club.time === time )
				arr.push(Object.assign({}, club));
		}
		return arr;
	}
	//change data in clubs to pass down to Activity for opacity and color styling
	divClick (num) {
		let selected = !this.state.clubs[num].selected;
		let clubs = [...this.state.clubs].map(club => Object.assign({}, club, { selected: false }));
		clubs.forEach(x => x.greyedOut = !selected);
		let selectedClub = Object.assign({}, clubs[num], { selected, greyedOut: false });
		clubs.splice(num, 1, selectedClub);
		this.setState({ clubs });
	}
	//adjust visibility based on whether clubs have requirements or applications
	reqClick = req => event => {
		this.setState({ [req]: event.target.value })
	}
 
	componentDidMount() {
		//assign clubs static/iterative properties
		let clubs = [...this.state.clubs].map((club, i) => {
			return Object.assign({}, club, { num: i, selected: false, greyedOut: false, hide: false })
		});
		//set html values to index.html
		document.getElementsByTagName('body')[0].setAttribute('class','clubs');
		document.getElementsByTagName('title')[0].innerHTML = "Clubs";
		//set arrays of clubs assigned to dates and times
		schedule = (() => {
			let arr = [];
			for (let i = 0; i < 3; i++) {
				if (i === 0) arr.push('Before School')
				else if (i === 1) arr.push('Lunch')
				else if (i === 2) arr.push('After School')
				for (let j = 0; j < 4; j++) {
					arr.push(this.createDays(this.state.days[j], this.state.times[i]));
					if (i === 2 && j ===3) break;
				}
			}
			return [null, ...this.state.days, ...arr];
		})();
		
		this.setState({ clubs, schedule });
	}

	render() {
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