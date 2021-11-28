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


