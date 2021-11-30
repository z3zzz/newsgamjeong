
let elemForTest = document.querySelector('#test')

const apiOrigin2 = "http://34.64.188.31/"
const getJsonFromApi2 = async (apiPathname, reqData) => {
    let res = await fetch(apiOrigin2 + apiPathname + new URLSearchParams(reqData))
    let responseJson = await res.json()
    return responseJson
}
const testing = async () => {
    let result = await getJsonFromApi2('news/newslist/?', {
        date: "2021.07.01",
        keyword: "코로나",
        press: "조선일보",
    })
    console.log(result)

}

testing()
