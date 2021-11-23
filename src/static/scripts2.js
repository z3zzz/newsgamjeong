// Global처럼 계속 쓸 함수
const addEventToId = (event, _id, callback) => {
    document.querySelector(`#${_id}`)?.addEventListener(event, callback)
}
const apiOrigin = "https://gamjeong.tk/api/"
const getJsonFromApi = async (apiPathname, requestData) => {
    let res = await fetch(apiOrigin + apiPathname, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(requestData)
    })
    let responseJson = await res.json()
    return responseJson
}


document.querySelector('#selectForDate').addEventListener("change", () => console.log("changed"))
