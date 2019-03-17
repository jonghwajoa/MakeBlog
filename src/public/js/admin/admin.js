class Admin {
  constructor() {
    this.ctx = document.getElementById('myChart');
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    this.eventInit(year, month);
    this.getDateAndDraw(year, month);
  }

  eventInit(year, month) {
    const searchBtn = document.getElementById('search-btn');
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');

    yearSelect.value = year;
    monthSelect.value = month;

    searchBtn.addEventListener('click', () => {
      this.getDateAndDraw(yearSelect.value, monthSelect.value);
    });
  }

  async getDateAndDraw(year, month) {
    let result;
    try {
      result = await ajaxUtil.sendGetAjax(`/api/admin/monthly?year=${year}&month=${month}`);
    } catch (e) {
      console.log(e);
    }
    this.drawChart(JSON.parse(result));
  }

  drawChart(data) {
    this.myChart = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: [...data.day],
        datasets: [
          {
            label: 'day',
            data: [...data.count],
            backgroundColor: backgroundColorUtil.white,
            borderColor: colorUtil.first,
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
          text: 'Monthly Visit Count',
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
