// Global처럼 계속 쓸 함수
const addEventToId = async (event, _id, callback) => {
    document.querySelector(`#${_id}`)?.addEventListener(event, callback)
}
Chart.register(ChartDataLabels)

let elemForSelectingDate = document.querySelector('#selectDate')
let elemForSelectingKeyword = document.querySelector('#selectKeyword')
let elemForSelectingCompany = document.querySelector('#selectCompany')

const apiOrigin = "https://newsgamjeong.tk/api/"
const getJsonFromApi = async (apiPathname, reqData) => {
    let res = await fetch(apiOrigin + apiPathname + new URLSearchParams(reqData))
    let responseJson = await res.json()
    return responseJson
}

let selectors
const getSelectors = async () => {
    let res = await fetch('/api/selectors')
    selectors = await res.json()

    selectors.dates.sort().forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingDate?.append(option)
    })

    selectors.keywords.sort().forEach(selector => {
        let option = document.createElement('option')
        option.innerText = selector
        elemForSelectingKeyword?.append(option)
    })

    selectors.text_companies.sort().forEach(selector => {
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

    //console.log(data)
    let total = data.total
    let positive =  data.positive
    let negative =  data.negative
    let normal =  data.normal
    let infections = data.infections


    document.querySelector('#statisticsCardTotal').innerText = `${total}개`
    document.querySelector('#infectionsCount').innerText = `${infections}명`
    total === 0 ? total = 1 : total = total
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

let textSpaceForPie = document.querySelector('#rankingOrPieChartText')
let textSpaceForRanking = document.querySelector('#subtitleForRankingChart')
const drawPieChart = async () => {
    const dataForPie = {
        labels: ['긍정','부정', '중립'],
        datasets: [{
          label: 'positive-negative',
          data: [data.positive, data.negative, data.normal],
          backgroundColor: [
            'rgb(54, 162, 235)',
            'rgb(255, 99, 132)',
            'rgb(224, 240, 189)',
          ],
          hoverOffset: 4,
          datalabels: {
            font: {
                size: "18",
                weight: "bold",
            },
            color: "#000000",
            formatter: value => value + '개',
        },
        }]
      };

    let pieChartElem = document.getElementById('positiveNegativePieChart')
    if (pieChartElem) {
        new Chart(pieChartElem, {
            type: "pie",
            data: dataForPie,
            options: {
                plugins: {
                    legend: {
                        display: true,
                    },
                },
                responsive: true,
            },
        })
    }
    textSpaceForPie.innerText = `${company} 사의 긍정, 부정, 중립 기사 수`
    textSpaceForRanking.innerText = ''

}

const createRankingChartCanvas = async () => {
    return `<canvas id="positiveNegativeRankingChart" class="ranking-chart"></canvas>`
}

const drawRankingChart = async (kind) => {
    let rankings
    let label
    let delayed

    if (kind === 'positive'){
        rankings = responseData.news_ranking.positive_ranking
        label = '긍정기사 비율 상위 5개사'
    } else if (kind === 'negative') {
        rankings = responseData.news_ranking.negative_ranking
        label = '부정기사 비율 상위 5개사'
    } else {
        rankings = responseData.news_ranking.normal_ranking
        label = '중립기사 비율 상위 5개사'
    }
    let numberOfNewses = responseData.news_ranking.number_of_newses

    let rankingChartElem = document.querySelector('#positiveNegativeRankingChart')

    const dataForRanking = {
        labels: [rankings[0][0] + ` (전체기사 ${numberOfNewses[rankings[0][0]]}개)`,
            rankings[1][0] + ` (전체기사 ${numberOfNewses[rankings[1][0]]}개)`,
            rankings[2][0] + ` (전체기사 ${numberOfNewses[rankings[2][0]]}개)`,
            rankings[3][0] + ` (전체기사 ${numberOfNewses[rankings[3][0]]}개)`,
            rankings[4][0] + ` (전체기사 ${numberOfNewses[rankings[4][0]]}개)`],
        datasets: [{
            label: label,
            data: [rankings[0][1], rankings[1][1], rankings[2][1], rankings[3][1], rankings[4][1],],
            backgroundColor: [
                '#1fe074', '#00c698', '#00a9b5', '#008ac5', '#0069c0'
            ].reverse(),
            barPercentage: 0.8,
            maxBarThickness: 120,
            datalabels: {
                font: {
                    size: "18",
                    weight: "bold",
                },
                color: "#000000",
                anchor: 'end',
                align: 'end',
                formatter: value => value + '%',
            },
        }]

    }
    new Chart(rankingChartElem, {
        type: 'bar',
        data: dataForRanking,
        options: {
            scales: {
                y: {
                    min: 0,
                    max:100,
                },
            },
            plugins: {
                legend: {
                    display: false,
                },
            },
            animation: {
                onComplete: () => {delayed = true},

                delay: context => {
                   // console.log(context)
                    let delay = 0
                    if (context.type === 'data' && context.mode === 'default' && !delayed) {
                        delay = context.dataIndex * 300 + context.datasetIndex * 100
                    }
                    return delay
                 },
                duration: 1500,
             },
            responsive: true,
        },
    })
    document.querySelector('#selectRankingKind').value = kind
    addEventToId("change", "selectRankingKind", makeNewRankingChart)
    textSpaceForPie.innerText = `${Object.keys(responseData.news_ranking.number_of_newses).length}개 언론사들 중 긍정, 부정, 중립 비율 랭킹`
    textSpaceForRanking.innerText = `(최소 기사 개수 기준: ${responseData.news_ranking.criteria}개 )`
}

const createSelectBoxForRankingChart = async () => {
    return `
            <select class="selectorForm text-center mb-2" id="selectRankingKind">
              <option value="positive">&nbsp;긍정&nbsp;</option>
              <option value="negative">&nbsp;부정&nbsp;</option>
              <option value="normal">&nbsp;중립&nbsp;</option>
            </select>

    `
}

let newses
let currentNewsPage
let currentNewsPageString
let rows = 20
let totalPage
let pageCommentSpace = document.querySelector('#commentForNewsPage')
const changeNewsChartContent = async reqData => {
    let newsChartTbody = document.querySelector('#newsChartTbody')
    if (newses) {
        newsChartTbody.innerHTML = `<td colspan="100%"><div class="mt-4 spinner-grow text-dark temp-spinner mb-2" role="status"></div></td>`
    }
    currentNewsPage = 1
    let start = rows * (currentNewsPage - 1)
    let end = rows * (currentNewsPage)

    newses = await getJsonFromApi("newses?", reqData)

    totalPage = Math.ceil(newses.length / rows)

    newsChartTbody.innerHTML = ""
    newses.slice(start,end).forEach(elem => {
        let trElem = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let a = document.createElement('a')
        let td4 = document.createElement('td')

        td1.innerText = elem.time
        td2.innerText = elem.text_company
        td2.width = "12%"
        a.href = elem.context_url
        a.innerText = elem.text_headline
        td3.append(a)
        td3.width = "60%"

        label = elem.label

        if (label === '긍정'){
            td4.classList.add('newsPositive')
        } else if (label === "부정") {
            td4.classList.add('newsNegative')
        } else {
            td4.classList.add('newsNormal')
            elem.label = "중립"
        }
        td4.innerText = elem.label
        td4.width = "10%"

        trElem.append(td1)
        trElem.append(td2)
        trElem.append(td3)
        trElem.append(td4)

        newsChartTbody.append(trElem)
    })
    addEventToId("mousedown", "buttonForLastPage", changePage)
    addEventToId("mouseup", "buttonForLastPage", changePage)
    addEventToId("mousedown", "buttonForNextPage", changePage)
    addEventToId("mouseup", "buttonForNextPage", changePage)

    currentNewsPageString = `현재 페이지: ${currentNewsPage} |  전체 페이지: ${totalPage}`
    pageCommentSpace.innerText = currentNewsPageString
}


let interval
let timeFunc
let eventForNewsPage
let flagToStop = false
const changePage = (e) => {
    clearTimeout(timeFunc)
    eventForNewsPage = e
    if (eventForNewsPage.type === "mousedown") {
        interval = 1300
        flagToStop = false
        loopFunc()
    }
    if (eventForNewsPage.type === "mouseup") clearTimeout(timeFunc)
}
const loopFunc = () => {
    interval *= 0.85
    interval <= 1? interval = 1 : interval=interval
    changePageForNewses()
    if ( ! flagToStop){
        timeFunc = setTimeout(loopFunc, interval)
    }
}

const changePageForNewses = () => {
    let e = eventForNewsPage
    let requestPage = currentNewsPage + parseInt(e.target.dataset.pagechange)

    if (requestPage > totalPage) {
        clearTimeout(timeFunc)
        flagToStop = true
        alert("더 이상 앞으로 나아갈 수 없습니다 :(")
        return
    }

    let tempPage
    if (requestPage <= 0) {
        tempPage = totalPage + requestPage
    } else {
        tempPage = requestPage
    }

    if (requestPage <=0 && tempPage === 0) {
        clearTimeout(timeFunc)
        flagToStop = true
        alert("더 이상 뒤로 가실 수 없습니다 :(")

        return
    }

    let start = rows * (requestPage - 1)
    let end = rows * (requestPage)

    end === 0 ? end=-1 : end=end

    //console.log(` requestPage ${requestPage}, totalPage ${totalPage}`, start, end)

    let newsChartTbody = document.querySelector('#newsChartTbody')
    newsChartTbody.innerHTML = ""
    newses.slice(start,end).forEach(elem => {
        let trElem = document.createElement('tr')
        let td1 = document.createElement('td')
        let td2 = document.createElement('td')
        let td3 = document.createElement('td')
        let a = document.createElement('a')
        let td4 = document.createElement('td')

        td1.innerText = elem.time
        td2.innerText = elem.text_company
        td2.width = "12%"
        a.href = elem.context_url
        a.innerText = elem.text_headline
        td3.append(a)
        td3.width = "60%"

        label = elem.label

        if (label === '긍정'){
            td4.classList.add('newsPositive')
        } else if (label === "부정") {
            td4.classList.add('newsNegative')
        } else {
            td4.classList.add('newsNormal')
            elem.label = "중립"
        }
        td4.innerText = elem.label
        td4.width = "10%"

        trElem.append(td1)
        trElem.append(td2)
        trElem.append(td3)
        trElem.append(td4)

        newsChartTbody.append(trElem)
    })

    currentNewsPageString = `현재 페이지: ${tempPage} |  전체 페이지: ${totalPage}`
    pageCommentSpace.innerText = currentNewsPageString
    currentNewsPage = requestPage
}

const makeNewRankingChart = async (e) => {
        document.querySelector('#divForPieChart').innerHTML = await createSelectBoxForRankingChart()
        document.querySelector('#divForPieChart').innerHTML += await createRankingChartCanvas()
        document.querySelector('#divForPieChart').style.maxWidth = '900px'
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
    if (requestMonth === 0) {
        alert('2021년 1월부터 자료가 있습니다 :)')
        return
    }
    let response = await getJsonFromApi('line_graph?',{month: requestMonth})
    if (response.result === "fail") {
        alert(`${response.reason}`)
        return
    }
    document.querySelector('#divForLineChart').innerHTML = await createNewLineChart4Canvas()
    await drawLineChart4(response)
}

const drawLineChart = async (month) => {
    let lineChartElem = document.getElementById('lineChart')
    let response = await getJsonFromApi('line_graph?',{month})
    if (response.result === "fail") {
        alert(`${response.reason}`)
        return
    }
    let dates = []
    let values = []
    response.forEach(elem => {
        dates.push(String(elem["date"]).slice(5,10))
        values.push(parseInt(elem[""]))
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

    response_infections.forEach(elem => {
        dates_infections.push(String(elem.date).slice(5,10))
        values_infections.push(parseInt(elem.corona.replace(/,/g,'')))
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
                    },
                    min: 200,
                },
            },
            plugins: {
                datalabels: {
                    display: false,
                },
            },
            responsive: true,
        },
        stacked: false,
    })

    addEventToId("click", "buttonForLastMonthLine", changeMonthForLineChart)
    addEventToId("click", "buttonForNextMonthLine", changeMonthForLineChart)

    if (response.result !== "fail") {
        currentMonth = month
    }
}

let currentMonth = -1
let maxMonth = 11
let company
const getNewData = async () => {
    let date = elemForSelectingDate?.value
    let keyword = elemForSelectingKeyword?.value
    company = elemForSelectingCompany?.value

    let reqData = {date, keyword, company}

    await changeStatisticsCardValue(reqData)

    if (company === "total"){
        makeNewRankingChart(null)
    } else {
        document.querySelector('#divForPieChart').innerHTML = await createPieChartCanvas()
        document.querySelector('#divForPieChart').style.maxWidth = '450px'
        await drawPieChart()
    }

    if (date === "total") {
        requestMonth = maxMonth
    } else {
        requestMonth = parseInt(date.slice(5,7))
    }

    if (requestMonth <= maxMonth && requestMonth !== currentMonth ) {
        document.querySelector('#divForLineChart').innerHTML = await createLineChartCanvas()
        await makeLineChart4(requestMonth)

        makeWordCloud(requestMonth)
        makePyLdaChart(requestMonth)
    }

    if (requestMonth > maxMonth && currentMonth !== maxMonth){
        //alert("해당 월의 데이터는 없습니다. 가장 가까운 월로 보여드릴게요")
        document.querySelector('#divForLineChart').innerHTML = await createLineChartCanvas()
        await makeLineChart4(maxMonth)

        makeWordCloud(maxMonth)
        makePyLdaChart(maxMonth)
    }

    await changeNewsChartContent(reqData)
    document.querySelector('#footer').innerHTML = await makeFooterDiv()

}

const makeFooterDiv = async () => {
    return `
    <div class="text-center px-3 margin-top-many3" style="background-color: rgba(0, 0, 0, 0.2);">
      <div>
        제작팀: Yeardream Team2 감정감정
      </div>
      <div>
        Gitlab:  <a href="https://yeardream-gitlab.elice.io/yeardream-project/project-2">Yeardream Project 2팀</a>
      </div>
      <div>
        뉴스 출처: <a href="https://news.naver.com/">Naver 뉴스</a>
      </div>
      <div>
        &#169; 2021 Copyright
      </div>
    </div>

    `
}


const makeLineChart4 = async (request_month) => {
    let requestInterval = document.querySelector('#selectInterval').value
    let divForLineChart4 = document.querySelector('#divForLineChart')

    if (requestInterval === "year") {
        await makeLineChart4Year()
        return
    }

    let response = await getJsonFromApi('line_graph?', {month: requestMonth})

    if (response.result !== "fail") {
        divForLineChart4.innerHTML = await createNewLineChart4Canvas()
        await drawLineChart4(response)
    }

    if (response.result === "fail" ) {
        divForLineChart4.innerHTML = `<h2>해당 데이터는 없어요</h2>`
    }
}

const createNewLineChart4Canvas = async () => `<canvas id="lineChart4"></canvas>`
const drawLineChart4 = async dataArray => {
    let lineChartElem = document.getElementById('lineChart4')
    let dates = []
    let values_economics = []
    let values_socials = []
    let values_lifes = []
    let values_politics = []
    let n = 3 // 반올림 소수점

    dataArray.forEach(elem => {
        dates.push(String(elem["date"]).slice(5,10))
        values_economics.push(parseFloat(elem["economics"]).toFixed(n))
        values_socials.push(parseFloat(elem["social"]).toFixed(n))
        values_lifes.push(parseFloat(elem["life"]).toFixed(n))
        values_politics.push(parseFloat(elem["politics"]).toFixed(n))
    })

    const dataForEconomics = {
        type: 'line',
        data: values_economics,
        label: "경제",
        borderColor: '#f5a91b',
        backgroundColor: '#f5a91b',
        hidden: true,
    }

    const dataForSocials = {
        type: 'line',
        data: values_socials,
        label: "사회",
        borderColor: '#ebcf60',
        backgroundColor: '#ebcf60',
        hidden: true,
    }

    const dataForLifes = {
        type: 'line',
        data: values_lifes,
        label: "생활문화",
        borderColor: '#5dc97a',
        backgroundColor: '#5dc97a',
        hidden: true,
    }

    const dataForPolitics = {
        type: 'line',
        data: values_politics,
        label: "정치",
        borderColor: '#b54326 ',
        backgroundColor: '#b54326 ',
        hidden: true,
    }

    let month = parseInt(dates[0].slice(0,2))
    let response_infections = await getJsonFromApi('infections?', {month})
    let values_infections = []

    response_infections.forEach(elem => {
        values_infections.push(parseInt(elem["corona"].replace(/,/g,'')))
    })
    const dataForInfections = {
        type: 'bar',
        data: values_infections,
        label: "감염자수",
        borderColor: '#87ded5',
        backgroundColor: '#87ded5',
        yAxisID: 'y7',
    }


    const lineChart4 = new Chart(lineChartElem,{
        data: {
            datasets: [dataForEconomics, dataForSocials, dataForLifes, dataForPolitics, dataForInfections],
            labels: dates.sort()
        },
        options: {
            responsive: true,
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
                    },
                    min: 200,
                },
            },
            plugins: {
                legend: {
                    onClick: (event, legendItem) => {
                        let labelToDatasetIndex = {
                            "경제": 0,
                            "사회": 1,
                            "생활문화": 2,
                            "정치": 3,
                            "감염자수": 4,
                        }

                        let index = labelToDatasetIndex[legendItem.text]
                        const currentVisibility = lineChart4.isDatasetVisible(index)

                        if (currentVisibility === true) {
                            lineChart4.hide(index)
                        } else {
                            lineChart4.show(index)
                        }

                    },
                },
                datalabels: {
                    display: false,
                },
            },
        },
        stacked: false,
    })
    document.querySelector('#selectInterval').value = "month"
    addEventToId("click", "buttonForLastMonthLine", changeMonthForLineChart)
    addEventToId("click", "buttonForNextMonthLine", changeMonthForLineChart)
    currentMonth = month
}


// 1년단위로 나오는 꺾은선막대그래프
const makeLineChart4Year = async () => {
    let divForLineChart4 = document.querySelector('#divForLineChart')
    let requestInterval = document.querySelector('#selectInterval').value
    if (requestInterval === "month") {
        await makeLineChart4()
        return
    }

    divForLineChart4.innerHTML = await createNewLineChart4Canvas()

    let lineDataRaw = await getJsonFromApi('line_graph_year?', {})
    let infectionsDataTemp = await fetch('/api/infections_year')
    let infectionsDataRaw = await infectionsDataTemp.json()

    let lineChartElem = document.getElementById('lineChart4')
    let dates = []
    let values_economics = []
    let values_socials = []
    let values_lifes = []
    let values_politics = []
    let n = 3 // 반올림 소수점

    lineDataRaw.forEach(elem => {
        dates.push(String(elem["date"]).slice(5,10))
        values_economics.push(parseFloat(elem["economics"]).toFixed(n))
        values_socials.push(parseFloat(elem["social"]).toFixed(n))
        values_lifes.push(parseFloat(elem["life"]).toFixed(n))
        values_politics.push(parseFloat(elem["politics"]).toFixed(n))
    })

    const dataForEconomics = {
        type: 'line',
        data: values_economics,
        label: "경제",
        borderColor: '#f5a91b',
        backgroundColor: '#f5a91b',
        hidden: true,
    }

    const dataForSocials = {
        type: 'line',
        data: values_socials,
        label: "사회",
        borderColor: '#ebcf60',
        backgroundColor: '#ebcf60',
        hidden: true,
    }

    const dataForLifes = {
        type: 'line',
        data: values_lifes,
        label: "생활문화",
        borderColor: '#5dc97a',
        backgroundColor: '#5dc97a',
        hidden: true,
    }

    const dataForPolitics = {
        type: 'line',
        data: values_politics,
        label: "정치",
        borderColor: '#b54326 ',
        backgroundColor: '#b54326 ',
        hidden: true,
    }

    let values_infections = []

    //console.log(infectionsDataRaw)
    infectionsDataRaw.forEach(elem => {
        values_infections.push(parseInt(elem["corona"].replace(/,/g,'')))
    })
    //console.log(values_infections)
    const dataForInfections = {
        type: 'bar',
        data: values_infections,
        label: "감염자수",
        borderColor: '#87ded5',
        backgroundColor: '#87ded5',
        yAxisID: 'y7',
    }


    const lineChart4 = new Chart(lineChartElem,{
        data: {
            datasets: [dataForEconomics, dataForSocials, dataForLifes, dataForPolitics, dataForInfections],
            labels: dates.sort()
        },
        options: {
            responsive: true,
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
                    },
                    min: 200,
                    max: 5500,
                },
            },
            plugins: {
                legend: {
                    onClick: (event, legendItem) => {
                        let labelToDatasetIndex = {
                            "경제": 0,
                            "사회": 1,
                            "생활문화": 2,
                            "정치": 3,
                            "감염자수": 4,
                        }

                        let index = labelToDatasetIndex[legendItem.text]
                        const currentVisibility = lineChart4.isDatasetVisible(index)

                        if (currentVisibility === true) {
                            lineChart4.hide(index)
                        } else {
                            lineChart4.show(index)
                        }

                    },
                },
                datalabels: {
                    display: false,
                },
            },
        },
        stacked: false,
    })
    document.querySelector('#selectInterval').value = "year"
}

addEventToId("change","selectTestMonth", makeLineChart4)
addEventToId("change","selectInterval", makeLineChart4Year)


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
}

if (location.pathname === "/") getFirstData()

