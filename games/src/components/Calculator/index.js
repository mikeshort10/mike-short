import React, { Component } from "react";
import "./style.css";
import CustomCalc from "./calculatorComponents/CustomCalc";
import StudentInfo from "./calculatorComponents/StudentInfo";

//make sure total, subtotal, and upcharge match up

export class Calculator extends Component {
	constructor(props) {
		super(props);
		this.state = {
			upcharge: 0,
			subtotal: 0,
			total: 0,
			students: {
				total: 1,
				min: 1,
				max: 300,
			},
			chaperones: {
				total: 1,
				min: 1,
				max: 5,
			},
			vehicles: {},
			hotelRooms: {},
			modal: {
				show: true,
				type: "Student Info",
			},
			lineItems: [
				{
					costName: "",
					unitCost: "0.00",
					multiplier: "Flat Rate",
					totalCost: 0,
					notes: "",
				},
			],
			buttons: [
				[
					{
						label: "Estimated/Total Students",
						key: "total",
					},
					{
						label: "Minimum Students",
						key: "min",
					},
					{
						label: "Maximum Students",
						key: "max",
					},
				],
				[
					{
						label: "Estimated/Total Chaperones",
						key: "total",
					},
					{
						label: "Minimum Chaperones",
						key: "min",
					},
					{
						label: "Maximum Chaperones",
						key: "max",
					},
				],
			],
		};
	}

	renderMultipliers = () => {
		let arr = [];
		for (let i = 0; i < 25; i++) {
			const title = `${i}% Upcharge`;
			arr.push(
				<button
					className="choice"
					type="button"
					onClick={this.adjustUpcharge(i / 100)}
					value={title}
				>
					{title}
				</button>,
			);
		}
	};

	handleChange = (num, key) => event => {
		let lineItems = [...this.state.lineItems];
		let val = event.target.value || event.target.innerHTML;
		if (!val && key === "multiplier") val = "Flat Rate";
		//if (key === "unitCost" || key === "totalCost") val = Number(val);
		lineItems[num][key] = val;
		this.setState({ lineItems }, () => {
			if (key === "multiplier") this.calculateCosts(num);
		});
	};

	changeData = (key, data, modalInfo) => {
		let state = Object.assign({}, this.state);
		state[key] = data;
		state.modal = modalInfo;
		this.setState(state);
	};

	closeModal = () => {
		this.setState({ modalShow: !this.state.modalShow });
	};

	renderModal() {
		switch (this.state.modal.type) {
			case "Student Info":
				return (
					<StudentInfo
						modal={this.state.modal}
						title={this.state.modal.type}
						buttons={this.state.buttons[0]}
						data={{ key: "students", data: this.state.students }}
						changeData={this.changeData}
						next={{ show: true, type: "Chaperone Info" }}
					/>
				);
			case "Chaperone Info":
				return (
					<StudentInfo
						modal={this.state.modal}
						title={this.state.modal.type}
						buttons={this.state.buttons[1]}
						data={{
							key: "chaperones",
							data: this.state.chaperones,
						}}
						changeData={this.changeData}
						next={{ show: false, type: undefined }}
					/>
				);
			default:
				return "";
		}
	}

	removeLineItem = num => {
		let lineItems = [...this.state.lineItems];
		lineItems.splice(num, 1);
		this.setState({ lineItems }, this.calculateTotal);
	};

	addLineItem = num => {
		let lineItems = [...this.state.lineItems];
		lineItems.splice(num + 1, 0, {
			costName: "",
			unitCost: "0.00",
			multiplier: "Flat Rate",
			totalCost: 0,
			notes: "",
		});
		this.setState({ lineItems });
	};

	calculateCosts = num => {
		let lineItems = [...this.state.lineItems];
		const { students, chaperones, vehicles, hotelRooms } = this.state;
		function multiplyBy() {
			switch (lineItems[num].multiplier) {
				case "Flat Rate":
					return 1;
				case "Per Student":
					return students.total;
				case "Per Chaperone":
					return chaperones.total;
				case "Per Person":
					return students.total + chaperones.total;
				case "Per Vehicle":
					return vehicles.total;
				case "Per Hotel Room":
					return hotelRooms.total;
				default:
					return lineItems[num].multiplier;
			}
		}
		if (isNaN(lineItems[num].unitCost)) lineItems[num].totalCost = "ERROR";
		else {
			lineItems[num].unitCost = Number(lineItems[num].unitCost).toFixed(
				2,
			);
			lineItems[num].totalCost =
				Number(lineItems[num].unitCost) * multiplyBy();
		}
		this.setState({ lineItems }, this.calculateTotal);
	};

	calculateTotal = () => {
		let subtotal = 0;
		let { upcharge, lineItems } = this.state;
		for (let i = 0; i < lineItems.length; i++)
			subtotal += lineItems[i].totalCost;
		this.setState({
			subtotal,
			total: this.state.subtotal * (1 + upcharge),
		});
	};

	adjustUpcharge = upcharge => event => {
		upcharge = upcharge || Number(event.target.value) / 100;
		document.getElementsByClassName(`upcharge-menu`)[0].style.display =
			"none";
		this.setState({
			upcharge,
			total: this.state.subtotal * (1 + upcharge),
		});
	};

	openClose() {
		let element = document.getElementsByClassName(`upcharge-menu`)[0];
		let display = element.style.display === "flex" ? "none" : "flex";
		element.style.display = display;
		if (display === "flex")
			document.getElementsByClassName("upcharge-select")[0].focus();
	}

	render() {
		const { students, total, subtotal, upcharge } = this.state;
		return (
			<div id="container">
				{this.renderModal()}
				<CustomCalc
					closeModal={this.closeModal}
					modalShow={this.state.modalShow}
					handleChange={this.handleChange}
					calculateCosts={this.calculateCosts}
					lineItems={this.state.lineItems}
					addLineItem={this.addLineItem}
					removeLineItem={this.removeLineItem}
				/>
				<div>
					<div className="totals">
						<div className="total-label">Subtotal</div>
						<input
							className="total-output"
							value={
								isNaN(subtotal)
									? "---"
									: "$" + Number(subtotal).toFixed(2)
							}
							disabled
						/>
					</div>
					<div className="totals">
						<div style={{ border: "none" }} className="total-label">
							<button
								className="ddbutton"
								type="button"
								onClick={this.openClose}
							>
								{`${upcharge * 100}% Upcharge`}
							</button>
							<div tabindex={0} className="upcharge-select">
								<div className="upcharge-menu">
									{this.renderMultipliers}
									<input
										min={1}
										type="number"
										onBlur={this.adjustUpcharge()}
										//onBlur={click}
										placeholder="Custom Percentage"
									/>
								</div>
							</div>
						</div>
						<input
							className="total-output"
							value={
								isNaN(subtotal)
									? "---"
									: `$${(subtotal * upcharge).toFixed(2)}`
							}
							disabled
						/>
					</div>
					<div className="totals">
						<div className="total-label">Total</div>
						<input
							className="total-output"
							value={
								isNaN(total)
									? "---"
									: "$" + Number(total).toFixed(2)
							}
							disabled
						/>
					</div>
					<div className="totals">
						<div className="total-label">Per Student</div>
						<input
							className="total-output"
							value={"$" + (total / students.total).toFixed(2)}
							disabled
						/>
					</div>
				</div>
			</div>
		);
	}
}
