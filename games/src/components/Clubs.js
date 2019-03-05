import React, { Component } from 'react';
import './Clubs.css';

function Activity (props) {
	let club = props.club;
	let timeClass = ` ${club.meets}${club.time.split(" ").join("")}`;

	function categoryClass() {
		let arr = "";
		if (club.categories)
			for (let i = 0; i < club.categories.length; i++)
				arr += " " + club.categories[i];
		arr += club.requirements ? " requirements " : "";
		arr += club.application ? " application " : "";
		return arr;
	}

	return (
		<div
		onClick={() => props.divClick(props.club.name, timeClass})}
		className={`club tooltip${categoryClass()}${timeClass} ${club.name}`}>
			<span className="name" id={club.name}>
				<span className="emoji"> {club.emoji} </span>
				<br />{club.name}
			</span>
		</div>
	);
}

function Schedule (props) {
	function createSchedule() {
		let arr = [];
		for (let i = 0; i < props.schedule.length; i++) {
			let slot = props.schedule[i];
			if (typeof slot === "string")
				arr.push(<div key={i} id={"block" + i} className="block"> {slot} </div>);
			else if (typeof slot === "object") {
				var subArr = [];
				for (let j = 0; j < slot.length; j++) {
					subArr.push(
						<Activity
							divClick={(x, y) => props.divClick(x, y)}
							key={i.toString() + j}
							club={slot[j]}
							emoji={slot[j].emoji}/>
					);
				}
				arr.push(<div key={i} id={"block" + i} className="block"> {subArr} </div>
				);
			}
		}
		return arr;
	}
	return <div id="schedule">{createSchedule()}</div>;
}

function Interests (props) {
	function createChecklist(sort, checked, list) {
		let arr = [];
		if (sort) 
			var sorted = list.sort((a, b) => b.slice(2) < a.slice(2));
		for (let i = 0; i < list.length; i++) {
			arr.push(
				<span key={list[i]}>
					<input
						type="checkbox"
						onChange={() => props.handleChange(list[i])}
						className="interest-filter"
						id={list[i]}/>
					<label htmlFor={list[i]}> {list[i]} </label>
				</span>
			);
		}
		return arr;
	}

	return (
		<div className="choices" id="interests">
			{createChecklist(2, false, props.interests)}
		</div>
	);
}

function Requirements(props) {
	return (
		<form className="choices" action="">
			Include Clubs with {props.filter}?<span>
				<input
					name="reqs"
					type="radio"
					onChange={(klasse, yesno) => props.onChange(props.value, true)}/>
				Yes
			</span>
			<span>
				<input
					name="reqs"
					type="radio"
					onChange={(klasse, yesno) => props.onChange(props.value, false)}/>
				No
			</span>
		</form>
	);
}

function Selected (props) {
	
	function populate (forEmail) {
		let arr = [];
		let divArr = [];
		let finalArr = [];
		let sc = [...props.selectedClubs]
		let clubs = [...props.clubs]
		sc.map(x => {
			let id = x.childNodes[0].id
			clubs.map(data => if (data.name === id) arr.push(data))
		})
		arr.sort((a,b) => {
			let aMeets = props.days.indexOf(a.meets); 
			let bMeets = props.days.indexOf(b.meets);
			let aTime = props.times.indexOf(a.time);
			let bTime = props.times.indexOf(b.time);
			if (aMeets === bMeets) 
				return aTime > bTime ? 1 : -1 
			return aMeets > bMeets ? 1 : -1
		})
		arr.map(datum => {
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
		if (forEmail) {
			let emailHTML = "";
			arr.map(datum => {
				let time = datum.exactTime ? datum.exactTime : datum.time
				let notes = datum.notes ? `%0D%0A${datum.notes}` : ""
				emailHTML += `${datum.name}%0D%0AMeets on: ${datum.meets} %40  ${time}%0D%0A \
				Room: ${datum.room + notes}%0D%0A%0D%0A%0D%0A`
			})
			return emailHTML
		}
		return divArr;
	}
	
	return (
		<div className={populate().length === 0 ? "hidden" : "choices"} id="selected-list">
			<h3 className="clubs">Selected Clubs</h3>
			<div id="to-print">{populate()}</div>
			<div id="email-print"><button id="print-button" onClick={
					() => window.print()}>Print</button>
				<button 
				id="print-button" 
				onClick={() => window.open(`mailto:?subject=My Clubs Schedule&body=${populate(true)}`)}>
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
			color: "black",
			opacity: 1,
			hideColor: "",
			hideOpacity: 0.3,
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
						"Play chess with fellow Seton students or learn the game for the first time! \ 
						It's a great way to exercise your brain!",
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
						"Don't have enough room in your class schedule for Engineering classes? \
						Here's your chance to practice your skills and learn some new ones!",
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
				}
			]
		};
	}

	handleCheckedInterest(klasse) {
		let int = [...this.state.selectedInterests];
		let x = int.indexOf(klasse);
		let sliced = int.slice(0, x).concat(int.slice(x + 1, int.length));
		let checked = document.getElementById(klasse).checked;
		this.setState({ selectedInterests: checked ? int.concat(klasse) : sliced }, this.showClubs);
	}

	showClubs() {
		let clubs = document.getElementsByClassName("club");
		Array.prototype.map.call(clubs, club => (club.style.visibility = "hidden"));
		for (let i = 0; i < this.state.clubs.length; i++) {
			let element = document.getElementsByClassName(this.state.clubs[i].name);
			let color = this.state.color;
			let x = false;
			for (let j = 0; j < this.state.selectedInterests.length; j++) {
				for (let k = 0; k < this.state.clubs[i].categories.length; k++) {
					if (this.state.clubs[i].categories[k] === this.state.selectedInterests[j]) {
						x = true;
						for (let l = 0; l < element.length; l++)
							element[l].style.visibility = "visible";
					}
				}
			}
			if (!x) {
				let state = Object.assign(this);
				let zeitKlasse = "";
				Array.prototype.map.call(element, function(ele) {
					if (ele.style.color === color) {
						let timeClasses = state.state.zeitKlasse;
						Array.prototype.map.call(timeClasses,
							(zk) => zeitKlasse = ele.className.includes(zk) ? " " + zk : zeitKlasse);
					}
			});
			if (document.getElementsByClassName(state.state.clubs[i].name, 
				zeitKlasse)[0].style.color === this.state.color) 
				state.divClick(state.state.clubs[i].name, zeitKlasse,true);
			}
		}
	}

	createDays(day, time) {
		let arr = [];
		for (let j = 0; j < this.state.clubs.length; j++) {
			let club = this.state.clubs[j];
			if (club.meets.includes(day) 
				&& (club.time[club.meets.indexOf(day)] === time || club.time === time))
					arr.push(club);
		}
		return arr;
	}

	divClick(id, timeClass, autoRun) {
		let ment = document.getElementsByClassName(id + timeClass)[0];
		let cls = document.getElementsByClassName(timeClass);
		let hideOpacity = this.state.hideOpacity;
		let opacity = this.state.opacity;
		let color = this.state.color + "";
		let mentColor = ment.style.color.toString();
		let sc = [...this.state.selectedClubs];
		Array.prototype.map.call(cls, function(ele) {
			ele.style.opacity =
				mentColor === color || ele.className.includes(id) ? opacity : hideOpacity;
			ele.style.color =
				ele.className.includes(id) && mentColor !== color
					? color
					: document.getElementById("#block0").style.color;
			let isSelected = sc.indexOf(ele);
			console.log('b',sc,sc.slice(0, isSelected).concat(isSelected + 1,sc.length))
			if (ele.style.color !== color&&isSelected>-1&&ele!==ment) 
				sc = sc.slice(0, isSelected).concat(sc.slice(isSelected + 1,sc.length))
		});
		let x = sc.indexOf(ment);
		let selectedClubs = (mentColor === color) 
			? sc.slice(0, x).concat(sc.slice(x + 1, sc.length)) 
			: autoRun ? sc : sc.concat(ment)
		this.setState({ selectedClubs });
	}

	reqClick(klasse, yesno) {
		let required = document.getElementsByClassName(klasse);
		Array.prototype.map.call(required, x => (x.style.visibility = yesno ? "visible" : "hidden"));
	}

	componentDidMount() {
		document.getElementsByTagName('body')[0].setAttribute('class','clubs');
		let interestFilter = document.getElementsByClassName("interest-filter");
		Array.prototype.map.call(interestFilter, filter => (filter.checked = true));

		let timeArr = [];
		[...this.state.days].map(x =>
			[...this.state.times].map(y => timeArr.push(x + y.split(" ").join("")))
		);

		this.setState({
			zeitKlasse: timeArr,
			schedule: [
				"",
				"Monday",
				"Tuesday",
				"Wednesday",
				"Thursday",
				"Friday",
				"Before School",
				this.createDays(this.state.days[0], this.state.times[0]),
				this.createDays(this.state.days[1], this.state.times[0]),
				this.createDays(this.state.days[2], this.state.times[0]),
				this.createDays(this.state.days[3], this.state.times[0]),
				this.createDays(this.state.days[4], this.state.times[0]),
				"Lunch",
				this.createDays(this.state.days[0], this.state.times[1]),
				this.createDays(this.state.days[1], this.state.times[1]),
				this.createDays(this.state.days[2], this.state.times[1]),
				this.createDays(this.state.days[3], this.state.times[1]),
				this.createDays(this.state.days[4], this.state.times[1]),
				"After School",
				this.createDays(this.state.days[0], this.state.times[2]),
				this.createDays(this.state.days[1], this.state.times[2]),
				this.createDays(this.state.days[2], this.state.times[2]),
				this.createDays(this.state.days[3], this.state.times[2])
			]
		});
	}

	render() {
		return (
			<div id="form">
				<Schedule
					divClick={(x, y) => this.divClick(x, y)}
					schedule={this.state.schedule}/>
				<div id="filters">
					<Interests
						interests={this.state.interests}
						handleChange={x => this.handleCheckedInterest(x)}/>
					<Requirements
						filter="Requirements"
						value="requirements"
						onChange={(klasse, yesno) => this.reqClick(klasse, yesno)}/>
					<Requirements
						filter="an Application"
						value="application"
						onChange={(klasse, yesno) => this.reqClick(klasse, yesno)}/>
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