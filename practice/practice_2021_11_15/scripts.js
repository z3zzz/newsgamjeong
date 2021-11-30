localStorage.setItem("name", "Bob")
// localStorage.setItem("names", "Serah")
localStorage.removeItem("name")
console.log(localStorage.getItem("name"))


sessionStorage.setItem('name2', 'John')
console.log(sessionStorage.getItem("name2"))


document.cookie = 'name=Kyle; expires=' + new Date(9922,1,2).toUTCString()
document.cookie = 'name2=Kyle2; expires=' + new Date(9922,1,2).toUTCString()
console.log(document.cookie)

let div = document.querySelector('#myId1')
loadText = async fname => {
    let file = await fetch(fname)
    div.innerText = await file.text()
} 

loadText('./aa.txt')

loadImage = async fname => {
    let file = await fetch(fname)
    console.log(file)
    imgElem = document.createElement('img')
    imgElem.style.width = '200px'
    imgElem.style.height = '200px'
    imgElem.style.marginLeft = '300px'
    imgElem.style.marginTop = '100px'
    imgElem.download="aaaa.png"
    temp = await file.blob()
    console.log(temp)
    src1 = URL.createObjectURL(temp)
    imgElem.src = src1
    console.log(src1)
    let a = document.createElement('a')
    a.download = "aaaa.png"
    a.href = src1
    a.innerText = 'wow download!'
    div.append(a) 

    div.append(imgElem)
}
loadImage('aa.png')
showLineGraph = (elem, labels, data, info) => {
    const datas = {
        labels: labels,
        datasets: [{
            label: info,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: data
        }]
    }

    const config = {
        type: 'line',
        data: datas,
    }

    new Chart(elem, config)

}

let div2 = document.querySelector('#myId2')
loadJson = async fname => {
    let file = await fetch(fname)
    let j = await file.json()
    let date_case = j.stats.case_stats
    
    let labels = []
    let data = []
    for(i=0;i<date_case.length;i++){
        labels.push(date_case[i].date)
        data.push(date_case[i].case)
    }
    let elem = document.querySelector('#myChart')
    showLineGraph(elem, labels, data, "Date-Case Line Graph")
}

loadJson('aa.json')

const date_case_data = {
    labels: ["date"]
}

let div3 = document.querySelector('#myId3')
loadJson2 = async fname => {
    let file = await fetch(fname)
    console.log(file)
    let j = await file.blob()
    console.log(j)
    div3.innerText = j
    let a2 = document.createElement('a')
    a2.href = URL.createObjectURL(j)
    a2.download = 'bb.json'
    a2.innerText = "download bb.json!"
    div3.append(a2)
}
loadJson2('aa.json')

const fetchHongdae = async url => {
    const response = await fetch(url)
    console.log("response from Hongdae-tk: ", response)
    console.log(response.ok)
    const responseText = await response.text()
    console.log(responseText)
}

// fetchHongdae("https://www.hongdae.tk")

fetch("https://www.hongdae.tk/")
.then(response => {
    // console.log(response.status)
    // console.log(response.statusText)
    console.log(response.ok)
    console.log(response.headers)
    console.log(response.url)
    return response.json()
})
.then(text1 => console.log(text1))
.catch(error => console.log(error))

new Promise((resolve, reject) => {
    let a = 3;
    if (a==2){
        resolve('yes good!')
    } else {
        reject('oh no!')
    }
})
.then(res => console.log(res))
.catch(res => console.log(res))

fetch("https://www.hongdae.tk/",{
    mode: "no-cors"
})
.then(response => {
    // console.log(response.status)
    // console.log(response.statusText)
    console.log(response.ok)
    console.log(response.headers)
    console.log(response.url)
    return response.text()
}, error => {
    console.log(error)
}).then(data => console.log("wwwww", data))

new Promise((resolve, reject) => {
    let a = 3;
    if (a==2){
        let yes = "yes Good!"
        resolve(yes1)
    } else {
        let no = "oh No!!"
        reject(no)
    }
})
.then(yes => {
    console.log("Wow", yes)
}, no => {
    console.log("Wow", no)
})


const getHongdae = async () => {
    let result = await fetch("aa.txt")
    console.log(111111, result)
    let txt1 = await result.text()
    console.log(22222, txt1)
}
getHongdae()

const date1 = new Date(2021, 10, 15)
console.log(date1.toUTCString())
console.log(typeof date1.toUTCString())

// Fetch API (post, delete, patch)
const postData = async (url, data) => {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        return response.json()
    } else {
        result = await response.json()
        console.log(result)
        return null
    }
}

const deleteData = async (url, data) => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        return response.json()
    } else {
        let result = await response.json()
        console.log(result)
        return null
    }
}

const patchData = async (url, data) => {
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    if (response.ok) {
        return response.json()
    } else {
        let result = await response.json()
        console.log(result)
        return null
    }
}
