$(document).ready(() => {

		let sweetNuthings = [
			"I Love You, Beautiful",
			"Mike + Lindsay 4eva",
			"😘🥰😍",
			"Will You Be Mine?",
			"I'm so lucky to be with you 😘",
			"You are the best",
			"I have the smartest, most beautiful girlfriend",
			"You can do anything babe! You're amazing!"
		]

		function createHeart (bottom = "-150px") {
			let bgColor = (Math.random()*45+330)%360;
			let bgLight = (Math.random()*30+40)+"%";
			let size = (Math.random()*50+50) + "px";
			let rotate = (-Math.random()*45 - 20) + "deg";
			let rotateTo = (-Math.random()*45 - 20) + "deg";
			let duration = Math.random()*10000+5000;
			let id = Math.random();
			let newHeart = $(`<div id=${id} class='heart'/>`).css({
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
				top: '-150px',
				//transform: `rotate(${rotateTo})`
			}, duration, "linear");
		}

		function switchPicture () {
			$("#img").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src;
				do src = Math.ceil(Math.random()*7);
				while (`/love-bugs/lb${src}.jpg` === $("#img").attr("src"))
				$("#img").attr("src", `/love-bugs/lb${src}.jpg`)
				$("#img").animate({
					opacity: 1
				}, 1000, 'linear')
			})
		}

		function switchSweetNuthin () {
			$("h1").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src;
				do src = Math.floor(Math.random()*sweetNuthings.length);
				while (sweetNuthings[src] === $("h1").html())
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