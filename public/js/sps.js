$('document').ready(function () {
	var choicesLeft = {
		0: "far fa-hand-rock flip-left",
		1: "far fa-hand-paper flip-left",
		2: "far fa-hand-scissors flip-left-alt",
		3: "far fa-hand-lizard flip-left-alt",
		4: "far fa-hand-spock flip-left"
	}
	
	var choicesRight = {
		0: "far fa-hand-rock flip-right",
		1: "far fa-hand-paper flip-right",
		2: "far fa-hand-scissors flip-right-alt",
		3: "far fa-hand-lizard flip-right-alt",
		4: "far fa-hand-spock flip-right"
	}
	
	var leftHand, rightHand;
	var playing = false;
	
	function win () {
		const l = "Left Hand";
		const r = "Right Hand";
		if (leftHand === rightHand) return "Tie!";
		switch (leftHand) {
			case (0):
				switch (rightHand) {
					case (1):
						return "Rock is covered by Paper!";
					case (2):
						return "Rock crushes Scissors!";
					case (3):
						return "Rock crushes Lizard!";
					case (4):
						return "Rock is vaporized by Spock!";
				}
			case (1):
				switch (rightHand) {
					case (0):
						return "Paper covers Rock!";
					case (2):
						return "Paper is cut by Scissors!";
					case (3):
						return "Paper is eaten by Lizard!";
					case (4):
						return "Paper disproves Spock!";
				}
			case (2):
				switch (rightHand) {
					case (0):
						return "Scissors are crushed by Rock!";
					case (1):
						return "Scissors cuts Paper!";
					case (3):
						return "Scissors decapitates Lizard!";
					case (4):
						return "Scissors are smashed by Spock!";
				}
			case (3):
				switch (rightHand) {
					case (0):
						return "Lizard is crushed by Rock!";
					case (1):
						return "Lizard eats Paper!";
					case (2):
						return "Lizard is decapitated by Scissors!";
					case (4):
						return "Lizard poisons Spock!";
				}
			case (4):
				switch (rightHand) {
					case (0):
						return "Spock vaporizes Rock!";
					case (1):
						return "Spock is disproven by Paper!";
					case (2):
						return "Spock smashes Scissors!";
					case (3):
						return "Spock is poisoned by Lizard!";
				}
		}
	}
	
	 function rps (id, start, middle, count = 0) {
		 let completeFunction = () => rps(id, middle, start, count+1);
		 if (count > 4) completeFunction = function () {
			 let rando = Math.floor(Math.random() * 5); 
			 if (id === "right") {
				 rightHand = rando;
			} else if (leftHand === undefined) {
				 leftHand = rando;
			}
			let choice = (id === "left") ? choicesLeft[leftHand] : choicesRight[rightHand];
			 document.getElementById("icon-" + id).className = choice;
			 if (rightHand!==undefined && leftHand!==undefined) {
				 var winner = win();
				 document.getElementById("result").innerHTML = winner;
				 var toBe = winner.split(" ")[1];
				 if (toBe === "is" || toBe === "are") {
					 $("#icon-left").css("color", "pink");
					 $("#icon-right").css("color", "lightgreen");
				 } else if (winner === "Tie!") {
					 $("#icon-left").css("color", "white");
					 $("#icon-right").css("color", "white");
				 } else {
					 $("#icon-left").css("color", "lightgreen");
					 $("#icon-right").css("color", "pink");
				 }
				 leftHand = undefined;
				 rightHand = undefined;
				 playing = false;
			 }
		 };
		 $({deg: start}).animate({deg: middle},{
			 duration: 350,
			 step: function (now) {
				 $("#" + id).css({
					 "-webkit-transform": "rotateZ(" + now + "deg)",
					 "-ms-transform": "rotateZ(" + now + "deg)",
					 "-moz-transform": "rotateZ(" + now + "deg)",
					 "-o-transform": "rotateZ(" + now + "deg)",
					 "transform": "rotateZ(" + now + "deg)"
				 })
			 },
			 complete: completeFunction
		 })
	 }

	 function shoot () {
		if (!playing) {
		playing = true;
		rps("left", 0, -45)
		rps("right", 0, 45)
		}
	}

	function choseWeapon (num) {
		leftHand = num;
		shoot();
	}
	
	let buttons = document.getElementsByClassName("hand")
	for (let i = 0; i < buttons.length; i++) {
		$(buttons[i]).click(() => choseWeapon(i))
	}
	$(".row").click(shoot);
})