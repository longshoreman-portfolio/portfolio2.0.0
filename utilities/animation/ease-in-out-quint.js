let easeInOutQuint = (currentTime, startValue, changeInValue, duration) => {
    currentTime /= duration/2
    if (currentTime < 1) return changeInValue/2*currentTime**5 + startValue
    currentTime -= 2
    return changeInValue/2*(currentTime**5 + 2) + startValue
}

export default easeInOutQuint