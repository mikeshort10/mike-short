$(document).ready(() => {
	function slide (id, next) {
		$( "#animated-text" + id ).animate({
			left: "+=150%",
		    opacity: .9
		  }, 2500, next);
	}

	slide(1, () => slide(2, () => slide(3)));
})