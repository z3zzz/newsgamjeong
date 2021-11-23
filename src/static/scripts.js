//Chart Example for 감정감정
const dataForPie = {
    labels: ['긍정','부정', '노말'],
    datasets: [{
      label: 'positive-negative',
      data: [12000*0.35, 12000*0.55,12000*0.1],
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

const dataForLine = {
    labels: ['11.1','11.2','11.3','11.4','11.5','11.6','11.7','11.8','11.9', '11.10', '11.11', '11.12', '11.13', '11.14', '11.15', '11.16'],
    datasets: [{
            data: [-220, -110, 20, 50, 210, -250, 200, 101, 415, 300, 250, 200, 180, 210, 250, 260],
            label: "+ 긍정, - 부정",
            borderColor: 'rgb(50, 168, 82)',
            backgroundColor: 'rgb(50, 168, 82)',
        }]
};

let lineChartElem = document.getElementById('positiveNegativeLineChart')
if (lineChartElem) {
    new Chart(lineChartElem,{
        type: 'line',
        data: dataForLine,
        options: {
            // responsive: true,
        }
    })

}


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

// 제안하기 관련 함수들 (add, delete, edit)
const addSuggest = () => {
    let title = document.querySelector('#suggestTitleInput').value
    let content = document.querySelector('#suggestContentInput').value
    let password = document.querySelector('#suggestPasswordInput').value
    let errorMessageSpace = document.querySelector('#errorMessageForSuggest')

    if (title.length < 2) {
        errorMessageSpace.innerText = "제목은 두 글자 이상이 필수입니다 "
        return
    }
    if (content.length < 2) {
        errorMessageSpace.innerText = "상세내용은 두 글자 이상이 필수입니다 "
        return
    }
    if (password.length < 2) {
        errorMessageSpace.innerText = "비밀번호는 두 글자 이상이 필수입니다 "
        return
    }

    data = {
        title: title,
        content: content,
        password: password
    }

    postData('/suggest', data)
        .then (res => {
            if (res !== null) {
                alert(res.result)
                window.location.reload()
            } else {
                alert("Suggest addition has failed.. please ask the site manager for this problem")
                return
            }
        })
}

const deleteSuggest = e => {
    let suggestIdToDelete = e.target.id
    let inputPassword = document.querySelector(`input[name="${suggestIdToDelete}"]`).value

    if (inputPassword.length < 2) {
        alert('비밀번호를 입력해 주세요')
        return
    }

    data = {
        password: inputPassword,
        suggest_id: suggestIdToDelete
    }

    deleteData('/suggest', data)
        .then (res => {
            if (res !== null) {
                alert(res.result)
                window.location.reload()
            } else {
                alert("Deletion has failed.. please ask the site manager for this problem")
                return
            }
        })
}

const editSuggest = e => {
    let suggestIdToEdit = e.target.id
    let inputTitle = document.querySelector(`textarea[name="title${suggestIdToEdit}"]`).value
    let inputContent = document.querySelector(`textarea[name="content${suggestIdToEdit}"]`).value
    let inputPassword = document.querySelector(`input[name="password${suggestIdToEdit}"]`).value

    if (inputTitle.length < 2) {
        alert('제목을 입력해 주세요')
        return
    }

    if (inputContent.length < 2) {
        alert('상세내용을 입력해 주세요')
        return
    }

    if (inputPassword.length < 2) {
        alert('비밀번호를 입력해 주세요')
        return
    }

    data = {
        title: inputTitle,
        content: inputContent,
        password: inputPassword,
        suggest_id: suggestIdToEdit
    }

    patchData('/suggest', data)
        .then (res => {
            if (res !== null) {
                alert(res.result)
                window.location.reload()
            } else {
                alert("Editing has failed.. please ask the site manager for this problem")
                return
            }
        })
}

const toggleSuggestStatus = e => {
    let elem = e.target
    let current_status = elem.dataset.iscompleted
    let suggest_id = elem.id
    let password = document.querySelector(`input[name="managerPassword${suggest_id}"]`).value
    let data = {
        toggleSuggest: "yes",
        isCompleted: current_status,
        suggest_id: suggest_id,
        password: password
    }
    patchData('/suggest', data)
        .then (res => {
            if (res !== null) {
                alert(res.result)
                window.location.reload()
            } else {
                alert("Toggling has failed.. please ask the site manager for this problem")
                return
            }
        })
}



// 이벤트 추가 함수 (elem, elems 각 경우)
const addEventForSingleElem = (type, elem, callback) => {
    if (elem) {
        elem.addEventListener(type, callback)
    }
}

const addEventForMultipleElems = (type, elems, callback) => {
    if (elems) {
        elems.forEach( elem => {
            elem.addEventListener(type, callback)
        })
    }
}

// 실제 이벤트 추가하기
let buttonForAddingSuggest = document.querySelector('#buttonForAddingSuggest')
addEventForSingleElem("click", buttonForAddingSuggest, addSuggest)

let buttonsForDeletingSuggest = document.querySelectorAll('.buttonForDeletingSuggest')
addEventForMultipleElems("click", buttonsForDeletingSuggest, deleteSuggest)

let buttonsForEditingSuggest = document.querySelectorAll('.buttonForEditingSuggest')
addEventForMultipleElems("click", buttonsForEditingSuggest, editSuggest)

let buttonsForTogglingStatus = document.querySelectorAll('.buttonForTogglingStatus')
addEventForMultipleElems("click", buttonsForTogglingStatus, toggleSuggestStatus)

// Suggest 상태에 따른 표의 텍스트, 색상 부여
const provideColorAndTextForSuggest = elem => {
    let suggest_id = elem.id
    let backgroundElem = document.querySelector(`tr[id="suggestTableBackground${suggest_id}"]`)
    let status = elem.dataset.iscompleted
    if (status == "True"){
        backgroundElem.style.backgroundColor = '#4f5059'
        elem.innerText = "완료"
    } else {
        elem.innerText = "미완료"
    }
}

let tdsForSuggestStatus = document.querySelectorAll('.suggest-status')
if (tdsForSuggestStatus) {
    tdsForSuggestStatus.forEach( elem => {
        provideColorAndTextForSuggest(elem)
    })
}

// 날짜 선택 시 이벤트
let selectElementForDate = document.querySelector('#selectForDate')
// 첫 번째 fetch (사이트 로드 시 자동 실행됨)
fetch('/api/statistics_card')
.then(res => res.json())
.then(data => {
    let dates = Object.keys(data)
    for(i=dates.length-1;i>-1;i--){
        let option = document.createElement('option')
        option.innerText = dates[i]
        selectElementForDate.append(option)
    }
})

let infections
fetch('/api/infections_count')
.then(res => res.json())
.then(data => {
    infections = data
})

// 두 번째 fetch (특정 날짜 선택 시 실행됨)
addEventForSingleElem("change", selectElementForDate, async e => {
    selected_date = e.target.value
    response = await fetch('/api/statistics_card')
    data = await response.json()
    if (selected_date in data) {
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
    if (selected_date in infections) {
        document.querySelector('#infectionsCount').innerText = infections[selected_date]
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




