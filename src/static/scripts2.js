// Global처럼 계속 쓸 함수
const addEventToId = (event, _id, callback) => {
    document.querySelector(`#${_id}`)?.addEventListener(event, callback)
}

let elemForSelectingDate = document.querySelector('#selectDate')
let elemForSelectingKeyword = document.querySelector('#selectKeyword')
let elemForSelectingCompany = document.querySelector('#selectCompany')

const apiOrigin = "https://gamjeong.tk/api/"
const getJsonFromApi = async (apiPathname, data) => {
    let res = await fetch(apiOrigin + apiPathname + new URLSearchParams(data))
    let responseJson = await res.json()
    return responseJson
}

const getSelectors = async () => {
    let res = await fetch('/api/selectors')
    let selectors = await res.json()

    selectors.date.forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingDate.append(option)
    })

    selectors.category.forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingKeyword.append(option)
    })

    selectors.company.forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingCompany.append(option)
    })
}

const changeStatisticsCardValue = async reqData => {
    responseData = await getJsonFromApi("statistics?", reqData)
    if ("statistics" in responseData){
        data = responseData.statistics
    } else {
        data = responseData
    }

    let total = data.total
    let positive =  data.positive
    let negative =  data.negative
    let normal =  data.normal
    let infections = data.infections

    document.querySelector('#statisticsCardTotal').innerText = total
    document.querySelector('#infectionsCount').innerText = infections
    document.querySelector('#statisticsCardPositive').innerText = `${Math.round(positive / total * 100)}%`
    document.querySelector('#statisticsCardNegative').innerText = `${Math.round(negative / total * 100)}%`
    document.querySelector('#statisticsCardNormal').innerText = `${Math.round(normal / total * 100)}%`

    provideRedColorForHighest(positive, negative, normal)
}

const provideRedColorForHighest = (positive, negative, normal) => {
    let highest = Math.max(positive, negative, normal)
    if (positive === highest) {
        document.querySelector('#statisticsCardPositive').style.color = 'red'
        document.querySelector('#statisticsCardNegative').style.color = 'black'
        document.querySelector('#statisticsCardNormal').style.color = 'black'
    } else if (negative === highest) {
        document.querySelector('#statisticsCardPositive').style.color = 'black'
        document.querySelector('#statisticsCardNegative').style.color = 'red'
        document.querySelector('#statisticsCardNormal').style.color = 'black'
    } else {
        document.querySelector('#statisticsCardPositive').style.color = 'black'
        document.querySelector('#statisticsCardNegative').style.color = 'black'
        document.querySelector('#statisticsCardNormal').style.color = 'red'
    }
}

const createPieChartCanvas = async ()  => {
    return `<canvas id="positiveNegativePieChart" ></canvas>`
}

const changeNewsChartContent = async reqData => {
    return
}


const getNewData = async () => {
    let date = elemForSelectingDate.value
    let keyword = elemForSelectingKeyword.value
    let company = elemForSelectingCompany.value

    let data = {date, keyword, company}

    changeStatisticsCardValue(data)

    if (company === "total"){
        document.querySelector('#divForPieChart').innerHTML = ""
    } else {
        document.querySelector('#divForPieChart').innerHTML = await createPieChartCanvas()
        await drawPieChart(data)

    }
    changeNewsChartContent(data)
}

addEventToId("change", "selectDate", getNewData)
addEventToId("change", "selectKeyword", getNewData)
addEventToId("change", "selectCompany", getNewData)

getSelectors()
