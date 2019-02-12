$(document).ready(() => {

		let sweetNuthings = [
			"I Love You, <br/> Beautiful",
			"Mike + Lindsay<br/>4eva",
			"😘🥰😍",
			"Will You Be Mine?",
			"I'm so lucky to<br/>be with you 😘",
			"You are the best",
			"I have the smartest,<br/>most beautiful girlfriend",
			"You can do anything babe!<br/>You're amazing!"
		]

		function createHeart (bottom = "-150px") {
			let bgColor = (Math.random()*45+330)%360;
			let bgLight = (Math.random()*30+40)+"%";
			let size = (Math.random()*50+50) + "px";
			let rotateTo = (-Math.random()*90 - 45);
			let rotate = (-Math.random()*90 );
			let duration = Math.random()*10000+5000;
			let id = Math.random().toString();
			let newHeart = $(`<div id="${id}" class='heart'/>`).css({
				left: (Math.random()*100) + "%",
				backgroundColor: `hsl(${bgColor}, 100%, ${bgLight})`,
				width: size,
				height: size,
				opacity: Math.random()*.8+.2,
				zIndex: Math.round(Math.random())*2,
				bottom: bottom
			})
			$('body').append(newHeart)
			$({deg: rotate}).animate({deg: rotateTo},{
				duration: duration,
				step: (now) => {
					$(newHeart).css({
					 "-webkit-transform": "rotate(" + now + "deg)",
					 "-ms-transform": "rotate(" + now + "deg)",
					 "-moz-transform": "rotate(" + now + "deg)",
					 "-o-transform": "rotate(" + now + "deg)",
					 "transform": "rotate(" + now + "deg)"
				 })
				},
				complete: () => $(newHeart).remove()
			})
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
			$("p").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src;
				do src = Math.floor(Math.random()*sweetNuthings.length);
				while (sweetNuthings[src] === $("h1").html())
				$("p").html(sweetNuthings[src])
				$("p").animate({
					opacity: 1
				}, 1000, 'linear')
			})
		}

		for (let i = 0; i < 50; i++) createHeart((Math.random()*700) + "px")
		setInterval(createHeart, 200);
		setInterval(switchPicture, 5000);
		setInterval(switchSweetNuthin, 7800);
	})