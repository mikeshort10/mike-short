$(document).ready(() => {

		let sweetNuthings = [
			"I Love You, Beautiful",
			"I'm so lucky to be with you",
			"You are the best",
			"I have the smartest, most beautiful girlfriend",
			"You can do anything babe! You're amazing!",
			"I Love You So So Sooooooo Much!",
			"Lindsay Mondragon: Greatest Girlfriend Ever!!!",
			"Hey cutie ;)",
			"Babe! You're the best!"
		]

		function rando () {
			let arr = [...arguments];
			let index = Math.floor(Math.random()*arr.length);
			return arr[index];
		}

		function popHeart () {
			console.log('popHeart')
			let content = rando("😘","🥰","😍","🤗");
			let size = $(this).css("height");
			let offset = $(this).offset();
			let left = offset.left;
			let top = offset.top;
			let zIndex = $(this).css("z-index");
			$(this).remove();
			let emoji = $("<div />").css({
				top, left, zIndex,
				position:'absolute',
				height: size,
				width: size,
				fontSize: size.slice(0,-2)/2 + "px",
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}).html(content);
			$('body').append(emoji);
			setTimeout(2000,$(emoji).fadeOut(2000, $(emoji).remove));
		}

		function createHeart (bottom = "-150px") {
			let bgColor = (Math.random()*45+330)%360;
			let bgLight = (Math.random()*30+40)+"%";
			let size = (Math.random()*50+50) + "px";
			let rotateTo = (-Math.random()*90 - 45);
			let rotate = (-Math.random()*90 );
			let duration = Math.random()*10000+5000;
			let id = Math.random().toString();
			let newHeart = $(`<div id="${id}" class='heart' />`).css({
				left: (Math.random()*2000-100) + "px",
				backgroundColor: `hsl(${bgColor}, 100%, ${bgLight})`,
				width: size,
				height: size,
				opacity: Math.random()*.8+.2,
				zIndex: Math.round(Math.random())*2,
				bottom: bottom
			})
			newHeart.on('click', popHeart)
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
			}, duration, "linear");
			
		}

		function switchPicture () {
			$("#img").animate({
				opacity: .1
			}, 2500, 'linear', () => {
				let src;
				do src = Math.floor(Math.random()*15);
				while (src === 4 || `/love-bugs/lb${src}.jpg` === $("#img").attr("src"))
				$("#img")
				.attr("src", `/love-bugs/lb${src}.jpg`)
				.attr("alt", "looks like this image has a bug...but I still love you!")
				.animate({
					opacity: 1
				}, 2500, 'linear')
			})
		}

		function switchSweetNuthin () {
			$("p").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src;
				do src = Math.floor(Math.random()*sweetNuthings.length);
				while (sweetNuthings[src] === $("p").html())
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