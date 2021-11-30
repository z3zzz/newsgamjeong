let person = {
    name: "Bob",
    age: 18,
    friends: ["Serah", "Brian", "Kim"],
    skills: {
        programming:["Python", "Java"],
        sports: ["Basketball", "Football"],
        cooking: {
            japanese: ["rice", "noodle"],
            korean: ["rice", "jjigae"]
        }
    },
    isAdult: false,
    extra: null,
    sayHi() {
        console.log("Hi! ", this.name)
    },
    "if": "ppppp",
    getNameAndAge: function() {
        return this.name + ` ${this.age}`
    },
    getNameAndAge2: () => {
        return this.name + `${this.age}`
    }
}

// console.log(person.getNameAndAge2())
// person.sayHi()

let person1 = {
    constructor(a,b){
        this.name = a
        this.age = b
    }

}

class person2 {
    constructor(a,b){
        this.name = a
        this.age = b
    }

    getName() {
        return this.name
    }

    getName2() {
        return () => {
            return this.name
        }
    }
}

let div = document.querySelector('#myId1')
loadText = async fname => {
    let file = await fetch(fname)
    div.innerText = await file.text()
} 

loadText('./aa.txt')

loadImage = async fname => {
    let file = await fetch(fname)
    imgElem = document.createElement('img')
    imgElem.src = URL.createObjectURL(await file.blob())
    div.append(imgElem)
}

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










