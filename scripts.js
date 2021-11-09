// Pie chart Example for 감정감정
const dataForPie = {
    labels: ['긍정','부정', '노말'],
    datasets: [{
      label: 'positive-negative',
      data: [550, 1300,300],
      backgroundColor: [
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(224, 240, 189)',
      ],
      hoverOffset: 4
    }]
  };

new Chart(document.getElementById('positiveNegativePieChart'), {
    type: "pie",
    data: dataForPie,
    options: {
        title: {
            display: true,
            text: 'Positive-Negative Chart'
        }
    }
})

const dataForLine = {
    labels: ['11.1','11.2','11.3','11.4','11.5','11.6','11.7','11.8','11.9'],
    datasets: [{
            data: [-220, -110, 20, 50, 210, -250, 200, 101, 415],
            label: "+ 긍정, - 부정",
            borderColor: 'rgb(50, 168, 82)',
            backgroundColor: 'rgb(50, 168, 82)',
        }]
};

new Chart(document.getElementById('positiveNegativeLineChart'),{
    type: 'line',
    data: dataForLine,
    options: {
        // responsive: true,
    }
})