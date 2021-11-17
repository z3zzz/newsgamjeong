class Car {
    constructor(color, brand) {
        this.color = color
        this.brand = brand
        this.size = "small"
    }
    getColor() {
        return this.color
    }
    getSize() {
        return this.size
    }
}

car1 = new Car("Red", "Hyundai")
car2 = new Car("Blue", "Martiz")

console.log(car1)
console.log(car1.getColor())
console.log(car2.getSize())

const download = (content, fileName, contentType) => {
    let a = document.createElement('a')
    let file = new Blob([content], {type: contentType})
    console.log(file)
    a.href = URL.createObjectURL(file)
    a.download = fileName
    console.log(a)
    // a.click()
}

fetch('aa.json')
.then(res => res.json())
.then(data => {
    console.log(data)
    var jstring = JSON.stringify(data)   
    download(jstring, "bb.json", "application/json")
})

a = async () => {
    res = await fetch('aa.json')
    data = await res.json()
    console.log(22, data)
}
a()

fetch('aa.png')
.then(res => res.blob())
.then(data => {
    console.log(data)
})


let selectElementForDate = document.querySelector('#selectForDate')
// 첫 번째 fetch (사이트 로드 시 자동 실행됨)
fetch('/api/statistics_card')
.then(res => res.json())
    .then(data => {
        let dates = Object.keys(data)
        for(i=0;i<dates.length;i++){
            let option = document.createElement('option')
            option.innerText = dates[i]
            selectElementForDate.append(option)
        }
    })
// 두 번째 fetch (특정 날짜 선택 시 실행됨)
addEventForSingleElem("change", selectElementForDate, async e => {
    selected_date = e.target.value
    response = await fetch('/api/statistics_card')
    data = await response.json()
    if (selected_date in data) {
        console.log(selected_date, data, data[selected_date])
        let total = data[selected_date].total
        let positive =  data[selected_date].positive
        let negative =  data[selected_date].negative
        let normal =  data[selected_date].normal

        document.querySelector('#statisticsCardTotal').innerText = total
        document.querySelector('#statisticsCardPositive').innerText = `${Math.round(positive / total * 100)}%`
        document.querySelector('#statisticsCardNegative').innerText = `${Math.round(negative / total * 100)}%`
        document.querySelector('#statisticsCardNormal').innerText = `${Math.round(normal / total * 100)}%`

        await provideRedColorForHighest(positive, negative, normal)
    }
})

provideRedColorForHighest = (positive, negative, normal) => {
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
