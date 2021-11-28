let data 
getNews = async () => {
    let res = await fetch('https://gamjeong.tk/api/news_list')
    data = await res.json()
    let targetArray = data["2020.01.01"]['연합뉴스']
    const resultArray = await findArray(targetArray)
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
    return setTimeout(() => {arr.find(elem => {
        return elem.label === '노말'
    })}, 5000)
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

const includesArray = arr => {
    return new Promise(resolve => {
        setTimeout(() => {
         resolve(arr.includes(6))
    }, 5000)
})
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

const getNumberOfNews = async (date, company) => {
    const response = await fetch('https://gamjeong.tk/api/news_list',{method: "head"})
    const data = await response.json()
    const newses = data[date][company]
    const newsesLabelAndTitle = newses.map(async news => {
        return [news.label, news.title]
    })
    //return newses.length
    const result = Promise.all(newsesLabelAndTitle)
    return result
}

getNumberOfNews("2020.01.02", "뉴스1").then(console.log)

// function scope

if (3 > 2) {
    var a = 1000
    var b = 2000
} 

console.log(a)
console.log(b)

f1 = () => {
    var c = 3000
    var d = 4000 
}

// block scope

if (4 > 3) {
    let e = 5000
    let f = 6000
    e = 7000
    const g = 8000
    //g = 9000
}

console.log(e)
console.log(f)

addNewNews = () => {
    let store_name = $("input[name='inputStoreName']").val()
    let menu = $("input[name='inputMenu']").val()
    let location = $("input[name='inputLocation']").val()
    let additional_info = $("textarea[name='inputExtraInfo']").val()
    let author = '{{ session["current_user"] }}'

    error_text = document.getElementById('addNewNews')
    if(store_name == ""){
        error_text.textContent = "Please input store name.."
        return;
    }
    if(menu == ""){
        error_text.textContent = "Please input menu.."
        return;
    }

    $.ajax({
        url: '/mypage/foodlist',
        type: 'post',
        data: {
            "store_name": store_name,
            "menu": menu,
            "location": location,
            "additional_info": additional_info,
            "author": author
        },
        success: (res) => {
            console.log(res);
            alert(res["result"]);
            window.location.reload()
        },
        error: (res) => {
            alert(res["result"]);
        }
    })

}

deleteNews = (e) => {
    var food_id = e.currentTarget.id
    $.ajax({
        url: "/mypage/foodlist",
        type: "delete",
        data: {
            "food_id": food_id
        },
        success: (res) => {
            alert(res['result'])
            window.location.reload()
        },
        error: (res) => {
            console.log(res["result"])
            alert("Failed to delete..sorry")
        }
    })
}

addDeleteNews = elem => {
    elem.addEventListener("click",deleteNews)
}

notReadyYet = () => {
    alert("This page or function is not ready yet.. will update soon!");
    return;
}

addNotReadyFunction = elem => {
    elem.addEventListener("click",notReadyYet)
}

togglePrivatePublicStatus = e => {
    let elem = e.target
    let current_status = elem.dataset.food_status
    let food_id = elem.id

    let data = {
        "isPrivate": current_status,
        "food_id": food_id
    }

    $.ajax({
        url: "/mypage/foodlist",
        type: "patch",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (res) => {
            console.log(res["result"])
        },
        error: (res) => {
            console.log(res["result"])
        }
    })

    if(current_status=="True"){
        elem.innerText="Public"
        elem.classList.remove("btn-info")
        elem.classList.add("btn-success")
        elem.dataset.food_status="False"
    }else{
        elem.innerText="Private"
        elem.classList.remove("btn-success")
        elem.classList.add("btn-info")
        elem.dataset.food_status="True"
    }
}

addToggleProperty = elem => {
    if(elem.dataset.food_status=="True"){
        elem.innerText="Private"
        elem.classList.add("btn-info")
    }else{
        elem.innerText="Public"
        elem.classList.add("btn-success")
    }
    elem.addEventListener("click", togglePrivatePublicStatus)
}

addBackgroundForNews = elem => {
    if(elem.dataset.foodlist_author == elem.dataset.current_user){
        elem.classList.add("bg-whitegreen")
    }else{
        elem.classList.add("bg-whiteBlue")
    }
}

let notReadyElements = document.querySelectorAll('.notReadyYet')
notReadyElements.forEach(addNotReadyFunction)

let deleteNews = document.querySelectorAll('.deleteNews')
deleteNews.forEach(addDeleteNews)

let addNews = document.querySelector('#newNews')
if(addNewNews) addNewNews.addEventListener("click", addNewNews)

let toggle_buttons = document.querySelectorAll('.togglePrivatePublic')
toggle_buttons.forEach(addToggleProperty)

let divsForBackground = document.querySelectorAll(".cardBackgroundColor")
divsForBackground.forEach(addBackgroundForNews)
