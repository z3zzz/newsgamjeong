function makeNewState() {
    history.pushState({num: isNaN(history.state?.num)? 1 : history.state.num  + 1 }, null, `id_${isNaN(history.state?.num)? 1 : history.state.num + 1}`)
    console.log(history.state.num)
}

function forwardState() {
    history.go(1)
}

function backState () {
    history.go(-1)
}

function addEventToId(_id, callback) {
    document.querySelector(`#${_id}`).addEventListener("click", callback)
}

addEventToId("addNewState", makeNewState)
addEventToId("forwardState", forwardState)
addEventToId("backState", backState)

window.addEventListener("popstate", () => {
    console.log(history.state.num, location.href)
})

console.log(window.location.search)
console.log(location.pathname)
console.log(location)

const place = document.querySelector('#myId3')
new URLSearchParams(location.search).forEach((value, key) => {
    place.append(`name is ${key} and value is ${value}`)
    place.append(document.createElement('br'))
})
