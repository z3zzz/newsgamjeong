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


window.addEventListener('scroll', function () {
    let footer = document.querySelector('footer')
    //console.log(window.innerHeight, window.scrollY, document.body.offsetHeight)
    if ((window.innerHeight + window.scrollY + 10) > document.body.offsetHeight) {
        footer.classList.remove('d-none')
        footer.classList.add('d-block')
    }

    if(window.oldScroll > window.scrollY) {
        footer.classList.remove('d-block')
        footer.classList.add('d-none')

    }

    window.oldScroll = window.scrollY;



});

document.querySelector('#navSourceCode')?.addEventListener("click", () => {
    alert("현재 서비스 준비중입니다 :)")
    return
})
