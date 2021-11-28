

document.querySelector('#abcd').addEventListener("click", (e)=>{
    console.log("aaaa", history.state)

    console.log("bbbb", history.state)
    e.preventDefault()
    history.pushState(history.state+1,null, `id_${history.state}`)
    console.log("eeee", e.state)
    console.log("cccc", history.state)

    console.log("dddd", history.state)
    document.querySelector('#efgh').innerText = history.length

})

window.onpopstate = (e)=>{
    console.log("history.state is: ", history.state)
    console.log("eeee", e.state)
}

let datas

const getStatistics = async () => {
    let res = await fetch('https://gamjeong.tk/api/statistics_card')
    datas = await res.json()
    console.log(datas)

}

const useStatistics = async () => {
    console.log(datas["2020.01.01"])
}

const functionChain = async () => {
    await getStatistics()
    await useStatistics()
    await consoles()
}

const consoles = async () => {
    console.log("This should be consoled at the very last!")
    let datas2 = datas
    console.log(`datas2 === datas ${datas2 === datas}`)
    let res = await fetch('https://gamjeong.tk/api/statistics_card')
    let datas3 = await res.json()
    console.log(`datas2 === datas3 ${datas2 === datas3}`)
    console.log(`datas2 == datas3 ${datas2 == datas3}`)
}

// functionChain()

const outerFunc = (outer) => {
    const innerFunc = (inner) => {
        console.log("It is from inner function!")
        console.log("Inner input: ", inner)
        console.log("Outer input: ", outer)
    }
    return innerFunc
}

const myFunc = outerFunc(1111)
// myFunc(2222)



// let a = 900

// if (a > 50) {
//     console.log('Higher than 50!')
// } else {
//     console.log('Lower than 50!')
// }

// console.log(a > 100 ? 'Higher than 100!' : 'Lower than 100!')


class Person {
    constructor(name, age){
        this.name = name ?? "default name"
        this.age = age ?? "default age"
    }
    print() {
        console.log(`This person name is ${this.name}, and age is ${this.age}`)

    }
}

person1 = new Person("Bob", 19)
person2 = new Person(null, 25)
person3 = new Person("Serah", undefined)
person4 = new Person(undefined, null)
person5 = new Person(undefined, "")

// console.log("person1: ", person1)
// console.log("person2: ", person2)
// console.log("person3: ", person3)
// console.log("person4: ", person4)
// console.log("person5: ", person5)


//console.log(`%cIs it really %cworking? ${person1.name}`, "font-size: 2rem; color: red", "font-size: 3rem; color: blue")
//console.log("%cIs it really %cworking?", "font-size: 2rem; color: red", "font-size: 3rem; color: blue")

const printPerson = person => {
    console.log(person?.name)
    console.log(person?.age)
    console.log(person?.gender?.street)
    person?.print1?.()
    person?.print?.()
}

printPerson(null)

const array1 = [1,2,3,4]
array2 = undefined
console.log(array1?.[2])

let data1 = [1,2,3,4]

dataObject = {data1}
console.log(dataObject)

const bob = {}

bob.name = "Bobb"
bob.age = 20

console.log(bob)

const print = texts => {
    console.log(texts ?? "default text")
}

print("ss")

print.hi = "Kyle"

print.hello = () => {
    console.log("This is print.hello function!")
}

console.dir(print)

const myHello = print.hello
console.dir(myHello)
console.dir(print.hello)

const myFunc2 = () => {
    console.log("%c This is from myFunc2!", "color: green; font-size: 2rem")
}

print.myFunc2 = myFunc2
console.dir(print.myFunc2)
print.myFunc2()

print.myFunc3 = function myFunc55() {
    console.log("%c This is from func 3!", "font-size: 1.5rem; color: blue")
}

console.dir(print.myFunc3)
print.myFunc3()

print.myFunc4 = function myFunc66 () {
    console.log(1)
}

print1 = {
    func1() {
        console.log("%c This is from print 1 func 1!", "color: red;")
    }

}

print1.func1()

print1.func2 = function() {
    console.log("%c This is from print 1 func 2!", "color: red;")
}

console.dir(print1.func2)
console.dir(print1)

const a = [1,2,3]
const b = [5,6,7]

const c = a.concat(b)
console.log(c)

const d = [...a, ...b]
console.log(d)

const e = {name: "bob"}
const f = {age: 29}

const g = {...e, my: "fuck", ...f}

console.log(g)

class Animal {
    constructor(species) {
        this.species = species
    }
    walk(){
        console.log(`${this.species} is walking!`)
    }
    talk(){
        console.log(`${this.species} is talking!`)
    }
}

class Dog extends Animal {
    constructor(species2){
        super("dog")
        this.species2 = species2
    }
    bite(){
        console.log(`${this.species2} from ${this.species} bites!`)
    }
    walk(){
        console.log(`${this.species2} from ${this.species} walks!`)
    }
}

dog1 = new Dog("shephard")

dog1.bite()
dog1.walk()
