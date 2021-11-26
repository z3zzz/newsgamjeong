// Global처럼 계속 쓸 함수
const addEventToId = async (event, _id, callback) => {
    document.querySelector(`#${_id}`)?.addEventListener(event, callback)
}

let elemForSelectingDate = document.querySelector('#selectDate')
let elemForSelectingKeyword = document.querySelector('#selectKeyword')
let elemForSelectingCompany = document.querySelector('#selectCompany')

const apiOrigin = "https://gamjeong.tk/api/"
const getJsonFromApi = async (apiPathname, reqData) => {
    let res = await fetch(apiOrigin + apiPathname + new URLSearchParams(reqData))
    let responseJson = await res.json()
    return responseJson
}

let selectors
const getSelectors = async () => {
    let res = await fetch('/api/selectors')
    selectors = await res.json()

    selectors.date.forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingDate?.append(option)
    })

    selectors.category.forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingKeyword?.append(option)
    })

    selectors.company.forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingCompany?.append(option)
    })
}

let data
let reponseData
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
    await deleteTempSpinners()
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

const drawPieChart = async () => {
    const dataForPie = {
        labels: ['긍정','부정', '노말'],
        datasets: [{
          label: 'positive-negative',
          data: [data.positive, data.negative, data.normal],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(224, 240, 189)',
          ],
          hoverOffset: 4
        }]
      };

    let pieChartElem = document.getElementById('positiveNegativePieChart')
    if (pieChartElem) {
        new Chart(pieChartElem, {
            type: "pie",
            data: dataForPie,
            options: {
                title: {
                    display: true,
                    text: 'Positive-Negative Chart'
                }
            }
        })
    }

}

const createRankingChartCanvas = async () => {
    return `<canvas id="positiveNegativeRankingChart" class="ranking-chart"></canvas>`
}

const drawRankingChart = async (kind) => {
    let rankings
    let label

    if (kind === 'positive'){
        rankings = responseData.news_ranking.positive_ranking
        label = '긍정 기사 개수 상위 5개사'
    } else if (kind === 'negative') {
        rankings = responseData.news_ranking.negative_ranking
        label = '부정 기사 개수 상위 5개사'
    } else {
        rankings = responseData.news_ranking.normal_ranking
        label = '노말 기사 개수 상위 5개사'
    }

    let rankingChartElem = document.querySelector('#positiveNegativeRankingChart')

    const dataForRanking = {
        labels: [rankings[0][0], rankings[1][0], rankings[2][0], rankings[3][0], rankings[4][0]],
        datasets: [{
            label: label,
            data: [rankings[0][1], rankings[1][1], rankings[2][1], rankings[3][1], rankings[4][1]],
            backgroundColor: [
                '#4A707A', '#7697A0', '#94B0B7', '#C2C8C5', '#DDDDDA'
            ]
        }]

    }
    new Chart(rankingChartElem, {
        type: 'bar',
        data: dataForRanking,
        options: {
            scales: {
                y: {
                    biginAtZero: true
                }
            },
            title: {
                display: true,
                text: label
            }
        }

    })
    document.querySelector('#selectRankingKind').value = kind
    addEventToId("change", "selectRankingKind", makeNewRankingChart)
}

const createSelectBoxForRankingChart = async () => {
    return `
            <select class="selectorForm text-center mb-2" id="selectRankingKind">
              <option value="positive">긍정</option>
              <option value="negative">부정</option>
              <option value="normal">노말</option>
            </select>

    `
}
let newses
const changeNewsChartContent = async reqData => {
    newses = await getJsonFromApi("newses?", reqData)
    let newsChartTbody = document.querySelector('#newsChartTbody')
    newsChartTbody.innerHTML = ""
    newses.slice(0,20).forEach(elem => {
        let trElem = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let a = document.createElement('a')
        let td4 = document.createElement('td')

        td1.innerText = elem.timestring
        td2.innerText = elem.company
        a.href = elem.link
        a.innerText = elem.title
        td3.append(a)
        td4.innerText = elem.label

        label = elem.label

        if (label === '긍정'){
            td4.classList.add('newsPositive')
        } else if (label === "부정") {
            td4.classList.add('newsNegative')
        } else {
            td4.classList.add('newsNormal')
        }

        trElem.append(td1)
        trElem.append(td2)
        trElem.append(td3)
        trElem.append(td4)

        newsChartTbody.append(trElem)
    })
}

const makeNewRankingChart = async (e) => {
        document.querySelector('#divForPieChart').innerHTML = await createSelectBoxForRankingChart()
        document.querySelector('#divForPieChart').innerHTML += await createRankingChartCanvas()
        document.querySelector('#divForPieChart').style.width = '900px'
        if (!e) {
            await drawRankingChart('positive')
        } else {
            await drawRankingChart(e.target.value)
        }
}

const createLineChartCanvas = async () => {
    return `<canvas id="lineChart"></canvas>`
}

const changeMonthForLineChart = async e => {
    let requestMonth = currentMonth + parseInt(e.target.dataset.monthchange)
    let response = await getJsonFromApi('line_graph?',{month: requestMonth})
    if (response.result === "fail") {
        alert(response.reason + ". " )
        return
    }
    document.querySelector('#divForLineChart').innerHTML = await createLineChartCanvas()
    await drawLineChart(requestMonth)
}

const drawLineChart = async (month) => {
    let lineChartElem = document.getElementById('lineChart')
    let response = await getJsonFromApi('line_graph?',{month})
    if (response.result === "fail") {
        alert(response.reason + ". 가장 가까운 월로 보여드릴게요")
    }
    let dates = []
    let values = []
    response.data.forEach(elem => {
        dates.push(String(Object.keys(elem)).slice(5,10))
        values.push(parseInt(Object.values(elem)))
    })
    const dataForLine = {
        type: 'line',
        data: values,
        label: "+긍정 -부정",
        borderColor: 'rgb(50, 168, 82)',
        backgroundColor: 'rgb(50, 168, 82)',
        yAxisID: 'y',
        xAxisID: 'x'
    }

    let response_infections = await getJsonFromApi('infections?', {month})
    let dates_infections = []
    let values_infections = []

    response_infections.data.forEach(elem => {
        dates_infections.push(String(elem[0]).slice(5,10))
        values_infections.push(parseInt(elem[1].replace(/,/g,'')))
    })
    const dataForInfections = {
        type: 'bar',
        data: values_infections,
        label: "감염자수",
        borderColor: '#87ded5',
        backgroundColor: '#87ded5',
        yAxisID: 'y1',
        xAxisID: 'x',
    }

    new Chart(lineChartElem,{
        data: {
            datasets: [dataForLine, dataForInfections],
            labels: dates.sort()
        },
        options: {
            // responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    }
                },
            },
        },
        stacked: false,
    })

    addEventToId("click", "buttonForLastMonth", changeMonthForLineChart)
    addEventToId("click", "buttonForNextMonth", changeMonthForLineChart)

    if (response.result === "success") {
        currentMonth = month
    }
}

let currentMonth = -1
let maxMonth = 5
const getNewData = async () => {
    let date = elemForSelectingDate?.value
    let keyword = elemForSelectingKeyword?.value
    let company = elemForSelectingCompany?.value

    let reqData = {date, keyword, company}

    await changeStatisticsCardValue(reqData)

    if (company === "total"){
        makeNewRankingChart(null)
    } else {
        document.querySelector('#divForPieChart').innerHTML = await createPieChartCanvas()
        document.querySelector('#divForPieChart').style.width = '450px'
        await drawPieChart()
    }

    if (date === "total") {
        requestMonth = maxMonth
    } else {
        requestMonth = parseInt(date.slice(8,10))
    }

    if (requestMonth <= maxMonth && requestMonth !== currentMonth ) {
        document.querySelector('#divForLineChart').innerHTML = await createLineChartCanvas()
        await drawLineChart(requestMonth)
    }

    if (requestMonth > maxMonth && currentMonth !== maxMonth){
        alert("해당 월의 데이터는 없습니다. 가장 가까운 월로 보여드릴게요")
        document.querySelector('#divForLineChart').innerHTML = await createLineChartCanvas()
        await drawLineChart(maxMonth)
    }

    await changeNewsChartContent(reqData)

}

// 꺾은선 4가지 버전 테스트용

const makeLineChart6 = async () => {
    let requestVersion = document.querySelector('#selectTestVersion').value
    let requestMonth = document.querySelector('#selectTestMonth').value
    let divForLineChart6 = document.querySelector('#divForLineChart6')
    let response = await getJsonFromApi('line_graph6?', {month: requestMonth, version: requestVersion})

    if (response.result === "success") {
        divForLineChart6.innerHTML = await createNewLineChart6Canvas()
        await drawLineChart6(response.data)
    }
    if (response?.result !== "success" ) {
        divForLineChart6.innerHTML = `<h2>해당 데이터는 없어요</h2>`
    }
}

const createNewLineChart6Canvas = async () => `<canvas id="lineChart6"></canvas>`
const drawLineChart6 = async dataArray => {
    let lineChartElem = document.getElementById('lineChart6')
    let dates = []
    let values_economics = []
    let values_socials = []
    let values_lifes = []
    let values_worlds = []
    let values_opinions = []
    let values_politics = []
    let n = 3 // 반올림 소수점

    dataArray.forEach(elem => {
        dates.push(String(Object.keys(elem)).slice(5,10))
        values_economics.push(parseFloat(Object.values(elem)[0]["경제"]).toFixed(n))
        values_socials.push(parseFloat(Object.values(elem)[0]["사회"]).toFixed(n))
        values_lifes.push(parseFloat(Object.values(elem)[0]["생활문화"]).toFixed(n))
        values_worlds.push(parseFloat(Object.values(elem)[0]["세계"]).toFixed(n))
        values_opinions.push(parseFloat(Object.values(elem)[0]["오피니언"]).toFixed(n))
        values_politics.push(parseFloat(Object.values(elem)[0]["정치"]).toFixed(n))
    })

    const dataForEconomics = {
        type: 'line',
        data: values_economics,
        label: "경제",
        borderColor: '#f5a91b',
        backgroundColor: '#f5a91b',
 //       yAxisID: 'y1',
    }

    const dataForSocials = {
        type: 'line',
        data: values_socials,
        label: "사회",
        borderColor: '#ebcf60',
        backgroundColor: '#ebcf60',
   //     yAxisID: 'y2',
    }

    const dataForLifes = {
        type: 'line',
        data: values_lifes,
        label: "생활문화",
        borderColor: '#5dc97a',
        backgroundColor: '#5dc97a',
     //   yAxisID: 'y3',
    }

    const dataForWorlds = {
        type: 'line',
        data: values_worlds,
        label: "세계",
        borderColor: '#337aa1',
        backgroundColor: '#337aa1',
       // yAxisID: 'y4',
    }

    const dataForOpinions = {
        type: 'line',
        data: values_opinions,
        label: "오피니언",
        borderColor: '#68328c',
        backgroundColor: '#68328c',
//        yAxisID: 'y5',
    }

    const dataForPolitics = {
        type: 'line',
        data: values_politics,
        label: "정치",
        borderColor: '#b54326 ',
        backgroundColor: '#b54326 ',
  //      yAxisID: 'y6',
    }

    let month = parseInt(dates[0].slice(0,2))
    let response_infections = await getJsonFromApi('infections?', {month})
    let values_infections = []

    response_infections.data.forEach(elem => {
        values_infections.push(parseInt(elem[1].replace(/,/g,'')))
    })
    const dataForInfections = {
        type: 'bar',
        data: values_infections,
        label: "감염자수",
        borderColor: '#87ded5',
        backgroundColor: '#87ded5',
        yAxisID: 'y7',
    }


    const lineChart6 = new Chart(lineChartElem,{
        data: {
            datasets: [dataForEconomics, dataForSocials, dataForLifes, dataForWorlds, dataForOpinions, dataForPolitics, dataForInfections],
            labels: dates.sort()
        },
        options: {
            // responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                },
                y7: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    }
                },
            },
            plugins: {
                legend: {
                    onClick: (event, legendItem) => {
                        let labelToDatasetIndex = {
                            "경제": 0,
                            "사회": 1,
                            "생활문화": 2,
                            "세계": 3,
                            "오피니언": 4,
                            "정치": 5,
                            "감염자수": 6,
                        }

                        let index = labelToDatasetIndex[legendItem.text]
                        const currentVisibility = lineChart6.isDatasetVisible(index)

                        if (currentVisibility === true) {
                            lineChart6.hide(index)
                        } else {
                            lineChart6.show(index)
                        }

                    },
                },
            },
        },
        stacked: false,
    })
}

addEventToId("change","selectTestMonth", makeLineChart6)
addEventToId("change","selectTestVersion", makeLineChart6)



const deleteTempSpinners = async () => {
    document.querySelectorAll('.temp-spinner').forEach(elem => {
        elem.style.display = "none"
    })
}

addEventToId("change", "selectDate", getNewData)
addEventToId("change", "selectKeyword", getNewData)
addEventToId("change", "selectCompany", getNewData)
const getFirstData = async () => {
    await getSelectors()
    await getNewData()
    await makeLineChart6() // 테스트용
}

if (location.pathname === "/") getFirstData()

