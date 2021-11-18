let data 
getNews = async () => {
    let res = await fetch('https://gamjeong.tk/api/news_list')
    data = await res.json()
    let targetArray = data["2020.01.01"]['연합뉴스']
    const resultArray = await includesArray(targetArray)
    //resultArray.forEach(elem => addNews(elem))
    console.log("Is it working before or after await?")
    console.log(resultArray)
    //await forEachArray(targetArray)
}

getNews()

// fetch('https://www.gamjeong.tk/api/news_list')
// .then(res => res.json())
// .then(data => console.log(data))

const filterArray = async arr => {
    return await arr.filter(elem => {
        return elem.label === '긍정'
    })
}

const findArray = async arr => {
    return arr.find(elem => {
        return elem.label === '노말'
    })
}


const mapArray = async arr => {
    return await arr.map( elem => {
        return {title: elem.title, link: elem.link}
    })
}

const forEachArray = async arr => {
    return await arr.forEach( elem => {
        console.log(elem.label === '노말', elem.title)
    })
}

const someArray = async arr => {
    return await arr.some( elem => {
        return elem.label === '노말'
    })
}

const everyArray = async arr => {
    return await arr.every( elem => {
        return elem.label === '노말'
    })
}

const reduceArray = async arr => {
    return await arr.reduce((currentTotal, elem) => {

        if (elem.label === '긍정') {
            return currentTotal + 1
        } else {
            return currentTotal
        }
        
    }, 0)
}

const includesArray = async arr => {
    setTimeout(() => {
         return arr.includes(6)
    }, 5000)
}

const addNews = async elem => {
    let newsChartTbody = document.querySelector('#newsChartTbody')
    let trElem = document.createElement('tr')
    let td1 = document.createElement('td')
    let td2 = document.createElement('td')
    let td3 = document.createElement('td')
    let a = document.createElement('a')
    let td4 = document.createElement('td')

    td1.innerText = elem.label
    td2.innerText = elem.company
    a.href = elem.link
    a.innerText = elem.title
    td3.append(a)
    td4.innerText = elem.timestring

    label = elem.label

    if (label === '긍정'){
        td1.classList.add('newsPositive')
    } else if (label === "부정") {
        td1.classList.add('newsNegative')
    } else {
        td1.classList.add('newsNormal')

    }


    trElem.append(td1)
    trElem.append(td2)
    trElem.append(td3)
    trElem.append(td4)

    newsChartTbody.append(trElem)

}


//import User from './user.js'

