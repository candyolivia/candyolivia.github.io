/*global window, document, console */

(function () {

	var i,
		curHoverIndex = -1,
		curDownIndex = -1,
		downButtonIndex	= -1,
		navOverIcon = document.getElementById("nav-over-icon"),
		navDownIcon = document.getElementById("nav-down-icon"),
		navElement = document.getElementById("nav"),
		pageElement = document.getElementById("page"),
		navLinks = document.getElementsByClassName("nav-link"),
	
		rollOverNav = function (xPos) {
			
			navOverIcon.style.opacity = 1;
			navOverIcon.style.marginTop = "-10px";
			navOverIcon.style.visibility = "visible";
			navOverIcon.style.marginLeft = xPos + "px";
		},
	
		rollOutNav = function () {
		
			navOverIcon.style.marginTop = "0px";
			navOverIcon.style.opacity = 0;
			
			curHoverIndex = -1;
		},
		
		updateNavDownArrow = function () {
		
			var i;

			for (i = 0; i < navLinks.length; i += 1) {
				if (navLinks[i].className.indexOf("nav-down") !== -1) {
					downButtonIndex = i;
					break;
				}
			}

			// If the nav link exists (not all sections make it into the main nav)
			if (navLinks[downButtonIndex] && navLinks[downButtonIndex].firstElementChild) {
				navDownIcon.style.marginLeft = (navLinks[downButtonIndex].firstElementChild.offsetLeft + navLinks[downButtonIndex].firstElementChild.offsetWidth / 2 - pageElement.offsetLeft - navDownIcon.offsetWidth / 2) + "px";
				
				navDownIcon.style.visibility = "visible";
			} else {
				navDownIcon.style.visibility = "hidden";
			}
		},
		
		onMouseDownNavLink = function (e) {
		
			for (i = 0; i < navLinks.length; i += 1) {
				if (navLinks[i] === e.target.parentElement) {
					break;
				}
			}
			curDownIndex = i;

			updateNavDownArrow();
		},
		
		onMouseEnterNavLink = function (e) {
		
			var i, 
				xPos;
		
			navOverIcon.style.visibility = "visible";
			
			xPos = e.target.offsetLeft + e.target.offsetWidth / 2 - pageElement.offsetLeft - navOverIcon.offsetWidth / 2;

			rollOverNav(xPos);
		};
	
	navOverIcon.style.visibility = "hidden";
	
	for (i = 0; i < navLinks.length; i += 1) {
		navLinks[i].addEventListener("mousedown", onMouseDownNavLink);
		navLinks[i].addEventListener("mouseover", onMouseEnterNavLink);
		navLinks[i].addEventListener("mouseout", rollOutNav);
	}
	
	updateNavDownArrow();
	window.addEventListener("resize", updateNavDownArrow);
	
}());

//  Improved version of JavaScript fix for the iOS viewport scaling bug. See http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
// By @mathias, @cheeaun and @jdalton

(function(doc) {

	var addEvent = 'addEventListener',
		type = 'gesturestart',
		qsa = 'querySelectorAll',
		scales = [1, 1],
		meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
	}

	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [0.25, 1.6];
		doc[addEvent](type, fix, true);
	}

}(document));