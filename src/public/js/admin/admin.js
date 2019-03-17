class Admin {
  constructor() {
    this.dailyChartCanvas = document.getElementById('daily-chart');
    this.monthlyChartCanvas = document.getElementById('monthly-chart');
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    this.eventInit(year, month);
    this.getDateAndDraw(year, month);
  }

  eventInit(year, month) {
    const monthlySearchBtn = document.getElementById('monthly-search-btn');
    const monthlyYearSelect = document.getElementById('monthly-year');
    const monthlyMonthSelect = document.getElementById('monthly-month');
    const yearlySearchBtn = document.getElementById('yearly-search-btn');
    const yearlyYearSelect = document.getElementById('yearly-year');

    yearlyYearSelect.value = year;
    monthlyYearSelect.value = year;
    monthlyMonthSelect.value = month;

    monthlySearchBtn.addEventListener('click', () => {
      this.getDateAndDraw(monthlyYearSelect.value, monthlyMonthSelect.value);
    });

    yearlySearchBtn.addEventListener('click', () => {
      console.log('dsadas');
    });
  }

  async getDateAndDraw(year, month) {
    let dailyData, yearlyData;
    try {
      dailyData = await ajaxUtil.sendGetAjax(`/api/admin/daily?year=${year}&month=${month}`);
      yearlyData = await ajaxUtil.sendGetAjax(`/api/admin/monthly?year=${year}`);
    } catch (e) {
      console.log(e);
    }

    dailyData = JSON.parse(dailyData);
    yearlyData = JSON.parse(yearlyData);

    this.dailyChart = ChartFactory.createChart(
      'line',
      dailyData.day,
      dailyData.count,
      this.dailyChartCanvas,
      'Monthly Visit Count',
      '일별 카운트',
    );

    this.monthlyChart = ChartFactory.createChart(
      'line',
      yearlyData.month,
      yearlyData.count,
      this.monthlyChartCanvas,
      'Yearly Visit Count',
      '월별 카운트',
    );
  }
}

class ChartFactory {
  static createChart(type, labels, data, canvas, text, label) {
    return new Chart(canvas, {
      type: type,
      data: {
        labels: [...labels],
        datasets: [
          {
            label,
            data: [...data],
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
          text,
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
  }
}

new Admin();
