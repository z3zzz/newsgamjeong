
let elemForTest = document.querySelector('#test')

const apiOrigin2 = "https://gamjeongx2api.tk/"
const getJsonFromApi2 = async (apiPathname, reqData) => {
    let res = await fetch(apiOrigin2 + apiPathname + new URLSearchParams(reqData))
    let responseJson = await res.json()
    return responseJson
}
const testing = async () => {
    let result = await getJsonFromApi2('news/case/?', {
        date: "2021.08.25",
    })
    console.log(result)

}

testing()
