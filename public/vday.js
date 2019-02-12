$(document).ready(() => {

		let sweetNuthings = [
			"I Love You, Beautiful",
			"Mike + Lindsay 4eva",
			"😘🥰😍",
			"Will You Be Mine?",
			"I'm so lucky to be with you 😘",
			"You're the best",
			"My girlfriend, she's the smartest, most beautiful girlfriend"
		]

		function createHeart (bottom = "-150px") {
			let bgColor = (Math.random()*45+330)%360;
			let bgLight = (Math.random()*30+40)+"%";
			let size = (Math.random()*50+50) + "px";
			let rotate = (-Math.random()*45 - 20) + "deg";
			let rotateTo = (-Math.random()*45 - 20) + "deg";
			let newHeart = $("<div class='heart'/>").css({
				left: (Math.random()*1000) + "px",
				backgroundColor: `hsl(${bgColor}, 100%, ${bgLight})`,
				width: size,
				height: size,
				opacity: Math.random()*.8+.2,
				transform: `rotate(${rotate})`,
				zIndex: Math.round(Math.random())*2,
				bottom: bottom
			})
			$('body').append(newHeart)
			$('.heart').animate({
				top: '-200px',
				transform: `rotate(${rotateTo})`
			}, Math.random()*10000+5000, "linear", $(this).remove);
		}

		function switchPicture () {
			$("#img").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src = Math.ceil(Math.random()*7);
				$("#img").attr("src", `./love-bugs/lb${src}.jpg`)
				$("#img").animate({
					opacity: 1
				}, 1000, 'linear')
			})
		}

		function switchSweetNuthin () {
			$("h1").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src = Math.ceil(Math.random()*sweetNuthings.length);
				$("h1").html(sweetNuthings[src])
				$("h1").animate({
					opacity: 1
				}, 1000, 'linear')
			})
		}

		for (let i = 0; i < 25; i++) createHeart(Math.random()*100 + "%")
		setInterval(createHeart, 500);
		setInterval(switchPicture, 5000);
		setInterval(switchSweetNuthin, 7800);
	})