class Admin {
  constructor() {
    this.dailyChartCanvas = document.getElementById('daily-chart');
    this.monthlyChartCanvas = document.getElementById('monthly-chart');
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    this.eventInit(year, month);
    this.getInitData(year, month).then(result => {
      this.drawChart(...result);
    });
  }

  eventInit(year, month) {
    const dailySearchBtn = document.getElementById('daily-search-btn');
    const dailyYearSelect = document.getElementById('daily-year');
    const dailyMonthSelect = document.getElementById('daily-month');
    const monthlySearchBtn = document.getElementById('monthly-search-btn');
    const monthlyYearSelect = document.getElementById('monthly-year');

    monthlyYearSelect.value = year;
    dailyYearSelect.value = year;
    dailyMonthSelect.value = month;

    dailySearchBtn.addEventListener('click', async () => {
      let data = await this.getDailyData(dailyYearSelect.value, dailyMonthSelect.value);
      this.dailyChart.data.labels = data.day;
      this.dailyChart.data.datasets[0].data = data.count;
      this.dailyChart.update();
    });

    monthlySearchBtn.addEventListener('click', async () => {
      let data = await this.getMonthlyData(monthlyYearSelect.value);
      this.monthlyChart.data.labels = data.month;
      this.monthlyChart.data.datasets[0].data = data.count;
      this.monthlyChart.update();
    });
  }

  async getInitData(year, month) {
    let dailyData, monthlyData;
    try {
      dailyData = await ajaxUtil.sendGetAjax(`/api/admin/daily?year=${year}&month=${month}`);
      monthlyData = await ajaxUtil.sendGetAjax(`/api/admin/monthly?year=${year}`);
    } catch (e) {
      console.log(e);
    }

    dailyData = JSON.parse(dailyData);
    monthlyData = JSON.parse(monthlyData);
    return [dailyData, monthlyData];
  }

  async getDailyData(year, month) {
    let dailyData;
    try {
      dailyData = await ajaxUtil.sendGetAjax(`/api/admin/daily?year=${year}&month=${month}`);
    } catch (e) {
      console.log(e);
    }

    return JSON.parse(dailyData);
  }

  async getMonthlyData(year) {
    let monthlyData;
    try {
      monthlyData = await ajaxUtil.sendGetAjax(`/api/admin/monthly?year=${year}`);
    } catch (e) {
      console.log(e);
    }

    return JSON.parse(monthlyData);
  }

  drawChart(dailyData, monthlyData) {
    this.dailyChart = new Chart(this.dailyChartCanvas, {
      type: 'line',
      data: {
        labels: [...dailyData.day],
        datasets: [
          {
            label: 'Daily Visit Count',
            data: [...dailyData.count],
            backgroundColor: backgroundColorUtil.purple,
            borderColor: colorUtil.second,
            borderWidth: 3,
            fillColor: 'rgba(0,0,0,0.2)',
          },
        ],
      },
      options: {
        legend: {
          labels: {
            fontColor: 'black',
            fontSize: 20,
          },
        },
        title: {
          display: true,
          text: '일별 카운트',
          fontSize: 30,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: 'black',
                borderDash: [2, 5],
              },
              scaleLabel: {
                display: true,
                labelString: 'Visit Count',
                fontColor: 'balck',
                fontSize: 20,
              },
            },
          ],
        },
      },
    });

    this.monthlyChart = new Chart(this.monthlyChartCanvas, {
      type: 'line',
      data: {
        labels: [...monthlyData.month],
        datasets: [
          {
            label: 'Monthly Visit Count',
            data: [...monthlyData.count],
            backgroundColor: backgroundColorUtil.white,
            borderColor: colorUtil.fifth,
            borderWidth: 3,
            fillColor: 'rgba(0,0,0,0.2)',
          },
        ],
      },
      options: {
        legend: {
          labels: {
            fontColor: 'black',
            fontSize: 20,
          },
        },
        title: {
          display: true,
          text: '월별 카운트',
          fontSize: 30,
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                color: 'black',
                borderDash: [2, 5],
              },
              scaleLabel: {
                display: true,
                labelString: 'Monthly Count',
                fontColor: 'balck',
                fontSize: 20,
              },
            },
          ],
        },
      },
    });
  }
}

new Admin();
