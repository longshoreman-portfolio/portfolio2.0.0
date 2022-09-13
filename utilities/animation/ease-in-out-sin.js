let easeInOutSin = ( currentTime, startValue, changeInValue, duration) => {
	return -changeInValue * Math.cos( currentTime/duration * (Math.PI/2)) + changeInValue + startValue;
}
