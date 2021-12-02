//for pyLDA, wordCLoud

const makeWordCloud = async (reqMonthOrEvent) => {
    let month
    let keyword
    if (reqMonthOrEvent.target != null) {
        month = document.querySelector('#selectDateWordCloud').value
        keyword = document.querySelector('#selectKeywordWordCloud').value
    } else {
        month = reqMonthOrEvent
        keyword = "total"
        document.querySelector('#selectDateWordCloud').value = month
    }

    let datas = await getJsonFromApi('wordcloud?',{month, keyword})
    let words = Object.keys(datas.wordcloud_data)
    let dataForWordCloud = []

    words.forEach(word => {
        dataForWordCloud.push({"x":word, "value": parseInt(datas.wordcloud_data[word])})
  })
    document.querySelector('#divForWordCloud').innerHTML = ""

    const wordCloudChart = anychart.tagCloud(dataForWordCloud)
    wordCloudChart.angles([0])
    wordCloudChart.fontFamily('Jua')

    wordCloudChart.tooltip().enabled(false);

    wordCloudChart.container('divForWordCloud')
    wordCloudChart.draw()



}

addEventToId('change', 'selectDateWordCloud', makeWordCloud)
addEventToId('change', 'selectKeywordWordCloud', makeWordCloud)
