$(document).ready(() => {

		var take = 0;
		var give = 0;
		var pageWidth = Math.min(
			    document.body.scrollWidth,
			    document.documentElement.scrollWidth,
			    document.body.offsetWidth,
			    document.documentElement.offsetWidth,
			    document.documentElement.clientWidth
			 );

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

		function gamePlay () {
			let lovers = [{
				title: "Taker",
				description: "You are a selfish lover. You take a lot of lovin, \
				but you very rarely, if ever, return the favor. Of course, with \
				the right partner, that's not necessarily a bad thing 😈"
			},
			{
				title: "Little Spoon",
				description: "While you're not the most selfish lover, you still \
				don't mind stuffing your partner's mouth with hair and throwing \
				their comfort to the wind...and we all know what kind of wind I mean 💨"
			},
			{
				title: "Great Hugger",
				description: "You like a perfectly balanced relationship. You're \
				happy giving everything to your partner that they need, but you don't \
				really care to do more than they do. This can lead to a healthly \
				relationship, but be careful that it doesn't become transactional."
			},{
				title: "Big Spoon",
				description: "You might wake up with a dead arm and possibly lost \
				the tug-of-war for the blanket, but you did it to make your partner \
				happy. Well, mostly...Let's not pretend it was completely selfless 😉"
			},{
				title: "Giver",
				description: "You're someone who will express their love 1000 times, even \
				if they never hear it back! Someone who can't, nay, refuses to take a \
				hint! You win at love! Does it feel good? Maybe take it down a notch, pal..."
			},]
			if (give < 25) return lovers[0];
			else if (give < 50) return lovers[1];
			else if (give < 75) return lovers[2];
			else if (give < 100) return lovers[3];
			else return lovers[4];
		}

		function popHeart () {
			let content = rando("😘","🥰","😍","🤗");
			let size = $(this).css("height");
			let offset = $(this).offset();
			let left = offset.left;
			let top = offset.top;
			let zIndex = $(this).css("z-index");
			$(this).stop().remove();
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
			give++;
			setTimeout(2000,$(emoji).fadeOut(2000, () => {
				$(emoji).remove();
			}));
		}

		function createHeart (bottom = "-150px") {
			let bgColor = (Math.random()*45+330)%360;
			let bgLight = (Math.random()*30+40)+"%";
			let size = (Math.random()*50+50) + "px";
			let rotateTo = (-Math.random()*90 - 45);
			let rotate = (-Math.random()*90 );
			let duration = Math.random()*10000+3000;
			let id = Math.random().toString();
			let newHeart = $(`<div id="${id}" class='heart' />`).css({
				left: (Math.random()*pageWidth) + "px",
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
			$(newHeart).animate({
				top: '-150px',
			}, duration, "linear", () => {
				if (give > 0) {
					take++;
					let lover;
					if (take >= 50) {
						lover = gamePlay();
						$("#modalTitle").html(`You're a ${lover.title}`);
						$("#modalBody").html(lover.description);
						$("#myModal").modal('show');
						$('#myModal').on('shown.bs.modal', () => {
							console.log('modal');
							give = 0;
							take = 0;
						})
					}
				}
			});
			
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
				.attr("alt", `looks like image #${src} has a bug...but I still love you!`)
				.animate({
					opacity: 1
				}, 2500, 'linear')
			})
		}

		function switchSweetNuthin () {
			$("#sweetNuthin").animate({
				opacity: .1
			}, 1000, 'linear', () => {
				let src;
				do src = Math.floor(Math.random()*sweetNuthings.length);
				while (sweetNuthings[src] === $("#sweetNuthin").html())
				$("#sweetNuthin").html(sweetNuthings[src])
				$("#sweetNuthin").animate({
					opacity: 1
				}, 1000, 'linear')
			})
		}

		for (let i = 0; i < Math.ceil(pageWidth/30); i++) 
			createHeart((Math.random()*98) + "%")
		setInterval(createHeart, pageWidth);
		setInterval(switchPicture, 5000);
		setInterval(switchSweetNuthin, 7800);
	})