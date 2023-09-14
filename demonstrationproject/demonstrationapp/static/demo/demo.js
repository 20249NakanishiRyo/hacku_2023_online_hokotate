demo = {
  initPickColor: function() {
    $('.pick-class-label').click(function() {
      var new_class = $(this).attr('new-class');
      var old_class = $('#display-buttons').attr('data-class');
      var display_div = $('#display-buttons');
      if (display_div.length) {
        var display_buttons = display_div.find('.btn');
        display_buttons.removeClass(old_class);
        display_buttons.addClass(new_class);
        display_div.attr('data-class', new_class);
      }
    });
  },

  candlechart:async function(array) {
    await google.charts.load('current', {'packages':['corechart']});
    var chartData = await new google.visualization.DataTable();
    //日付ようにString型のカラムを一つ、チャート描画用に数値型のカラムを７つ作成
    chartData.addColumn('string');
    for(var x = 0;x < 7; x++){
        chartData.addColumn('number');
    }
    //いちいち書くのが面倒なので、取得した情報の長さを配列に入れる
    var length = array.length;
    //描画用のデータを一時的に入れる
    var insertingData = new Array(length);
    //平均を出すための割り算の分母
    var divide = 0;
    //二次元配列aveに、平均線の日数と平均値を入れる
    var ave = new Array();
    //５日平均線用
    ave[0] = new Array();
    //25日平均線用
    ave[1] = new Array();
    //50日平均線用
    ave[2] = new Array();
    //平均線の計算に用いる
    var temp = 0;
    //５日移動平均線の算出
    //基準日より５日前までのデータを足し合わせ、平均値を出す
    for(var m = 0; m < length - 4; m++){
        for(var n = 0; n < 5; n++){
            if(array[m+n].close != ''){
                temp = temp + parseFloat(array[m+n].close);
                divide++;
            }
        }
        ave[0][m] = temp / divide;
        temp = 0;
        divide = 0;
    }
    //2５日移動平均線の算出
    //上と同様の処理
    for(var m = 0; m < length - 24; m++){
        for(var n = 0; n < 25; n++){
            if(array[m+n].close != ''){
                temp = temp + parseFloat(array[m+n].close);
                divide++
            }
        }
        ave[1][m] = temp / divide;
        temp = 0;
        divide = 0;
    }
    //５0日移動平均線の算出
    //上と同様の処理
    for(var m = 0; m < length - 49; m++){
        for(var n = 0; n < 49; n++){
            if(array[m+n].close != ''){
                temp = temp + parseFloat(array[m+n].close);
                divide++
            }
        }
        ave[2][m] = temp / divide;
        temp = 0;
        divide = 0;
    }
    //for文をまとめるため、出来高棒グラフの処理もここで行う
    //出来高を保持する配列
    var volume = new Array();
    //チャートの日付を保持する配列
    var dates = new Array();
    for(var s = 0; s < length; s++){
        if(array[s].volume != ''){
            volume[s] = array[s].volume;
        }
        dates[s] = String(array[s].date);
    }
    //配列insertingDataの中に、[安値、始値、高値、終値、５日移動平均線、２５日移動平均線、５０日移動平均線]の形で値を入れ込む
    for(var a = 0; a < length; a++){
        insertingData[a] = [dates[a],parseFloat(array[a].low),parseFloat(array[a].open),parseFloat(array[a].close),parseFloat(array[a].high),ave[0][a],ave[1][a],ave[2][a]]
    }
    console.log(insertingData[0])
    //チャート描画用の配列の中に、insertingDataの値を入れ込む
    //最古の50日分のデータまでは移動平均線のデータが揃っていないので、取り除く
    for (var i = insertingData.length - 50; i > 0; i--){
        chartData.addRow(insertingData[i]);
    }
    console.log(chartData)
    //チャートの見た目に関する記述、詳細は公式ドキュメントをご覧になってください
    var options = {
        chartArea:{left:80,top:10,right:80,bottom:10},
        colors: ['#003A76'],
        legend: {
            position: 'none',
        },
        vAxis:{
            viewWindowMode:'maximized'
        },
        hAxis: {
            format: 'yy/MM/dd',
            direction: -1,
        },
        bar: { 
            groupWidth: '100%' 
        },
        width: 1200,
        height: 400,
        lineWidth: 2,
        curveType: 'function',
        //チャートのタイプとして、ローソク足を指定
        seriesType: "candlesticks",  
        //ローソク足だでなく、線グラフも三種類表示することを記述
        series: {
            1:{
                type: "line",
                color: 'green',
            },
            2:{
                type: "line",
                color: 'red',                
            },
            3:{
                type: "line",
                color: 'orange',                
            },
        } 
    };
    //描画の処理
    var chart = new google.visualization.ComboChart(document.getElementById('bigDashboardChart'));
    chart.draw(chartData, options);
    console.log(chart)
  },

  initDocChart: function() {
    chartColor = "#FFFFFF";

    // General configuration for the charts with Line gradientStroke
    gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    ctx = document.getElementById('lineChartExample').getContext("2d");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          label: "Active Users",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: [542, 480, 430, 550, 530, 453, 380, 434, 568, 610, 700, 630]
        }]
      },
      options: gradientChartOptionsConfiguration
    });
  },

  initDashboardPageCharts: function(array_data) {

    chartColor = "#FFFFFF";

    // General configuration for the charts with Line gradientStroke
    gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    gradientChartOptionsConfigurationWithNumbersAndGrid = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          gridLines: 0,
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    var ctx = document.getElementById('bigDashboardChart').getContext("2d");
    // ctx.canvas.width = 1000;
    // ctx.canvas.height = 250;

    var gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    var gradientFill = ctx.createLinearGradient(0, 200, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(255, 255, 255, 0.24)");

    var labels_day = []
    var labels_day_data = []
    var data = []

    for(var i=0; i < array_data.length; i++){
      if(i === 0){
        i = array_data.length - 40;
      }
      else{
        var lux_date = new Date(array_data[i].date)
        data[i - (array_data.length - 39)] = {
          x: luxon.DateTime.fromMillis(Number(lux_date)).valueOf(),
          o: array_data[i].open,
          h: array_data[i].high,
          l: array_data[i].low,
          c: array_data[i].close
        }
      }
    }

    var myChart = new Chart(ctx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: "USD/JPY",
          borderColor: chartColor,
          pointBorderColor: chartColor,
          pointBackgroundColor: "#1e3d60",
          pointHoverBackgroundColor: "#1e3d60",
          pointHoverBorderColor: chartColor,
          pointBorderWidth: 1,
          pointHoverRadius: 7,
          pointHoverBorderWidth: 2,
          pointRadius: 5,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: data
        }]
      },
      options: {
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 0,
            bottom: 0
          }
        },
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: '#fff',
          titleFontColor: '#333',
          bodyFontColor: '#666',
          bodySpacing: 4,
          xPadding: 12,
          mode: "nearest",
          intersect: 0,
          position: "nearest"
        },
        legend: {
          position: "bottom",
          fillStyle: "#FFF",
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "rgba(255,255,255,0.4)",
              fontStyle: "bold",
              maxTicksLimit: 5,
              padding: 10
            },
            gridLines: {
              drawTicks: true,
              drawBorder: false,
              display: true,
              color: "rgba(255,255,255,0.1)",
              zeroLineColor: "transparent"
            }

          }],
          xAxes: [{
            gridLines: {
              zeroLineColor: "transparent",
              display: false,

            },
            ticks: {
              padding: 10,
              fontColor: "rgba(255,255,255,0.4)",
              fontStyle: "bold"
            }
          }]
        }
      }
    });

    var cardStatsMiniLineColor = "#fff",
      cardStatsMiniDotColor = "#fff";

    ctx = document.getElementById('lineChartExample').getContext("2d");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    var labels_day = []
    var labels_day_data = []
    var data = []
    var j = 0;
    var pre_month = 100;

    for(var i=0; i < array_data.length; i++){
      if(i === 0){
        i = array_data.length - 300;
      }
      else{
        var lux_date = new Date(array_data[i].date)
        if(lux_date.getMonth() !== pre_month){
          labels_day[j] = (lux_date.getFullYear() + "-" + (lux_date.getMonth() + 1) + "-" + lux_date.getDate())
          data[j] = array_data[i].close;
          j += 1;
          pre_month = lux_date.getMonth();
        }
      }
    }

    myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: labels_day,
        datasets: [{
          label: "Close",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: data
        }]
      },
      options: gradientChartOptionsConfiguration
    });


    ctx = document.getElementById('lineChartExampleWithNumbersAndGrid').getContext("2d");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#18ce0f');
    gradientStroke.addColorStop(1, chartColor);

    gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, hexToRGB('#18ce0f', 0.4));

    myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: ["12pm,", "3pm", "6pm", "9pm", "12am", "3am", "6am", "9am"],
        datasets: [{
          label: "Email Stats",
          borderColor: "#18ce0f",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#18ce0f",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: [40, 500, 650, 700, 1200, 1250, 1300, 1900]
        }]
      },
      options: gradientChartOptionsConfigurationWithNumbersAndGrid
    });

    // var e = document.getElementById("barChartSimpleGradientsNumbers").getContext("2d");

    // gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    // gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    // gradientFill.addColorStop(1, hexToRGB('#2CA8FF', 0.6));

    // var a = {
    //   type: "bar",
    //   data: {
    //     labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    //     datasets: [{
    //       label: "Active Countries",
    //       backgroundColor: gradientFill,
    //       borderColor: "#2CA8FF",
    //       pointBorderColor: "#FFF",
    //       pointBackgroundColor: "#2CA8FF",
    //       pointBorderWidth: 2,
    //       pointHoverRadius: 4,
    //       pointHoverBorderWidth: 1,
    //       pointRadius: 4,
    //       fill: true,
    //       borderWidth: 1,
    //       data: [80, 99, 86, 96, 123, 85, 100, 75, 88, 90, 123, 155]
    //     }]
    //   },
    //   options: {
    //     maintainAspectRatio: false,
    //     legend: {
    //       display: false
    //     },
    //     tooltips: {
    //       bodySpacing: 4,
    //       mode: "nearest",
    //       intersect: 0,
    //       position: "nearest",
    //       xPadding: 10,
    //       yPadding: 10,
    //       caretPadding: 10
    //     },
    //     responsive: 1,
    //     scales: {
    //       yAxes: [{
    //         gridLines: 0,
    //         gridLines: {
    //           zeroLineColor: "transparent",
    //           drawBorder: false
    //         }
    //       }],
    //       xAxes: [{
    //         display: 0,
    //         gridLines: 0,
    //         ticks: {
    //           display: false
    //         },
    //         gridLines: {
    //           zeroLineColor: "transparent",
    //           drawTicks: false,
    //           display: false,
    //           drawBorder: false
    //         }
    //       }]
    //     },
    //     layout: {
    //       padding: {
    //         left: 0,
    //         right: 0,
    //         top: 15,
    //         bottom: 15
    //       }
    //     }
    //   }
    // };

    // var viewsChart = new Chart(e, a);
  },

  PredictionCharts: async function(array_data) {
    const start_date = "2012-01-01"
    const resp = await fetch("../predict_chart/", {
      method: "POST",
      body: `start=${start_date}`,
      headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      },
    });
    const result = await resp.json()
    let res_json = JSON.parse(result)
    console.log(res_json)

    gradientChartOptionsConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          gridLines: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    };

    ctx = document.getElementById('barChartSimpleGradientsNumbers').getContext("2d");

    gradientStroke = ctx.createLinearGradient(500, 0, 100, 0);
    gradientStroke.addColorStop(0, '#80b6f4');
    gradientStroke.addColorStop(1, chartColor);

    gradientFill = ctx.createLinearGradient(0, 170, 0, 50);
    gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    gradientFill.addColorStop(1, "rgba(249, 99, 59, 0.40)");

    var labels_day = []
    var data = []

    for(var i=0; i < array_data.length; i++){
      if(i === 0){
        i = array_data.length - 7;
      }
      else{
        var lux_date = new Date(array_data[i].date)
        labels_day[i - (array_data.length - 6)] = (lux_date.getFullYear() + "-" + (lux_date.getMonth() + 1) + "-" + lux_date.getDate())
        data[i - (array_data.length - 6)] = array_data[i].close;
      }
    }
    var lux_date = new Date(res_json[0].date)
    console.log((lux_date.getFullYear() + "-" + (lux_date.getMonth() + 1) + "-" + lux_date.getDate()))
    labels_day[labels_day.length] = (lux_date.getFullYear() + "-" + (lux_date.getMonth() + 1) + "-" + lux_date.getDate())
    data[data.length] = res_json[0].close
    console.log(labels_day)

    myChart = new Chart(ctx, {
      type: 'line',
      responsive: true,
      data: {
        labels: labels_day,
        datasets: [{
          label: "Close",
          borderColor: "#f96332",
          pointBorderColor: "#FFF",
          pointBackgroundColor: "#f96332",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          backgroundColor: gradientFill,
          borderWidth: 2,
          data: data
        }]
      },
      options: gradientChartOptionsConfiguration
    });
  },

  initGoogleMaps: function() {
    var myLatlng = new google.maps.LatLng(40.748817, -73.985428);
    var mapOptions = {
      zoom: 13,
      center: myLatlng,
      scrollwheel: false, //we disable de scroll over the map, it is a really annoing when you scroll through page
      styles: [{
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{
          "color": "#e9e9e9"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [{
          "color": "#f5f5f5"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#ffffff"
        }, {
          "lightness": 17
        }]
      }, {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#ffffff"
        }, {
          "lightness": 29
        }, {
          "weight": 0.2
        }]
      }, {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [{
          "color": "#ffffff"
        }, {
          "lightness": 18
        }]
      }, {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [{
          "color": "#ffffff"
        }, {
          "lightness": 16
        }]
      }, {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [{
          "color": "#f5f5f5"
        }, {
          "lightness": 21
        }]
      }, {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [{
          "color": "#dedede"
        }, {
          "lightness": 21
        }]
      }, {
        "elementType": "labels.text.stroke",
        "stylers": [{
          "visibility": "on"
        }, {
          "color": "#ffffff"
        }, {
          "lightness": 16
        }]
      }, {
        "elementType": "labels.text.fill",
        "stylers": [{
          "saturation": 36
        }, {
          "color": "#333333"
        }, {
          "lightness": 40
        }]
      }, {
        "elementType": "labels.icon",
        "stylers": [{
          "visibility": "off"
        }]
      }, {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [{
          "color": "#f2f2f2"
        }, {
          "lightness": 19
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [{
          "color": "#fefefe"
        }, {
          "lightness": 20
        }]
      }, {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [{
          "color": "#fefefe"
        }, {
          "lightness": 17
        }, {
          "weight": 1.2
        }]
      }]
    };

    var map = new google.maps.Map(document.getElementById("map"), mapOptions);

    var marker = new google.maps.Marker({
      position: myLatlng,
      title: "Hello World!"
    });

    // To add the marker to the map, call setMap();
    marker.setMap(map);
  }
};