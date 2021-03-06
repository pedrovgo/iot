var showSidebar = false;

var appData = {
    url:"",
    size:10000,
    total:0,
    array:[],
    filtered:[],
    filters:{},
    dictionary: {}
};

const distinct = (value, index, self) => {
    return self.indexOf(value) === index;
}

function build(){
    for(var x in appData.dictionary){
        
        var data = appData.dictionary[x]
            .grouping(appData.filtered, appData.dictionary[x].dimension, appData.dictionary[x].fact)
            .sort(appData.dictionary[x].sorting);

        if(appData.dictionary[x].top != undefined){
            if(data.length > appData.dictionary[x].top){
                data = data.slice(0,appData.dictionary[x].top);
            }
        }

        appData.dictionary[x].data.categories = data.map(d => d[0]);
        appData.dictionary[x].data.data = data.map(d => d[1]);

        if(appData.dictionary[x].data.pie != undefined){
            appData.dictionary[x].data.pie = [];
            
            for(var y=0; y < data.length; y++){
                appData.dictionary[x].data.pie.push({
                    name: data[y][0],
                    y: data[y][1],
                    drilldown:data[y][0]
                });
            }
        }

        if(appData.dictionary[x].stack != undefined){
            appData.dictionary[x].stackedData = [];
            
            for(var s in appData.dictionary[x].stack){
                appData.dictionary[x].stack[s].forEach(function (item, index){
                    var serie = {
                        name:item,
                        data:[]
                    };

                    for(var z=0; z < appData.dictionary[x].data.categories.length; z++){
                        var category = appData.dictionary[x].data.categories[z];
                        var dataFiltered = appData.filtered
                            .filter(d => d[appData.dictionary[x].dimension] == category && d[s] == item);
                        var value = 0;
                        for(var d=0; d < dataFiltered.length; d++){
                            if(appData.dictionary[x].grouping == groupSum){
                                value += Number(dataFiltered[d][appData.dictionary[x].fact]);
                            } else {
                                value++;
                            }
                        }
                        serie.data.push(value);
                    }
                    appData.dictionary[x].stackedData.push(serie);
                });
            }
        }

        if(appData.dictionary[x].drilldown != undefined){
            appData.dictionary[x].drilldownData = [];

            var drilldownArray = appData.filtered.map(f => f[appData.dictionary[x].drilldown]).filter(distinct).sort();
            var drill = appData.dictionary[x].drilldown;
            
            for(var z=0; z < appData.dictionary[x].data.categories.length; z++){
                var category = appData.dictionary[x].data.categories[z];
                var serie = {
                    name:category,
                    id:category,
                    data:[]
                };

                for(var w=0; w < drilldownArray.length; w++){
                    var item = drilldownArray[w];
                    var dataFiltered = appData.filtered
                        .filter(d => d[appData.dictionary[x].dimension] == category && d[drill] == item);
                    var value = 0;
                    for(var d=0; d < dataFiltered.length; d++){
                        if(appData.dictionary[x].grouping == groupSum){
                            value += Number(dataFiltered[d][appData.dictionary[x].fact]);
                        } else {
                            value++;
                        }
                    }
                    if(value > 0){
                        serie.data.push([item,value]);
                    }
                }
                appData.dictionary[x].drilldownData.push(serie);
            }
        }
    }
}

function groupSum(array, dimension, fact) {
    return groupIncrement(array, dimension, fact, 'SUM');
}

function groupCount(array, dimension, fact) {
    return groupIncrement(array, dimension, fact, 'COUNT');
}

function groupIncrement(array, dimension, fact, type) {
    var dic = {};
    var ret = [];

    for(var i=0; i < array.length; i++){

        var dim = dimension != undefined ? array[i][dimension] : 'total';

        if(dic[dim] == undefined){
            dic[dim] = 0;
        }
        if(type == 'SUM'){
            dic[dim] += Number(array[i][fact]);
        } else {
            dic[dim]++;
        }
    }
    for(var property in dic){
        ret.push([property,dic[property]]);
    }

    return ret;
}

function factDescComparer(a, b) {
    if (a[1] > b[1]) {
        return -1;
    }
    if (b[1] > a[1]) {
        return 1;
    }
    return 0;
}

function factAscComparer(a, b) {
    if (a[1] > b[1]) {
        return 1;
    }
    if (b[1] > a[1]) {
        return -1;
    }
    return 0;
}

function dimensionDescComparer(a, b) {
    if (a[0] > b[0]) {
        return -1;
    }
    if (b[0] > a[0]) {
        return 1;
    }
    return 0;
}

function dimensionAscComparer(a, b) {
    if (a[0] > b[0]) {
        return 1;
    }
    if (b[0] > a[0]) {
        return -1;
    }
    return 0;
}

function descComparer(a, b) {
    if (a > b) {
        return -1;
    }
    if (b > a) {
        return 1;
    }
    return 0;
}

function dayOfWeekAscComparer(a, b) {
    var x1 = dayOfWeekToNumber(a[0]);
    var x2 = dayOfWeekToNumber(b[0]);
    if (x1 > x2) {
        return 1;
    }
    if (x2 > x1) {
        return -1;
    }
    return 0;
}

function dayOfWeekToNumber(dayOfWeek){
    var number;
    switch(dayOfWeek){
        case 'dom':
            number = '01';
            break;
        case 'seg':
            number = '02';
            break;
        case 'ter':
            number = '03';
            break;
        case 'qua':
            number = '04';
            break;
        case 'qui':
            number = '05';
            break;
        case 'sex':
            number = '06';
            break;
        case 'sáb':
            number = '07';
            break;
    }
    return number;
}

function cleanFilter(){
    appData.filtered = [].concat(appData.array);
    
    var checkboxes = $( ":checkbox:checked" );
    for(var x=0; x < checkboxes.length; x++){
        checkboxes[x].checked = false;
    }

    for(var filter in appData.filters){
        appData.filters[filter] = [];
    }
    
    chartRender();
}

function configFilter(filters){
    for(var x in filters){
        var div = $('<div>',{class:'filter-section'});
        
        for(var y=0; y < filters[x].length; y++){
            var p = $('<p>');
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.alt = x+';'+filters[x][y];
            checkbox.style.cursor = 'pointer';
            checkbox.onchange = function(event){
                var alt = event.target.alt.split(';');
                var dimension = alt[0];
                var value = alt[1];

                if(appData.filters[dimension] == undefined){
                    appData.filters[dimension] = [];
                }

                if(event.target.checked){
                    appData.filters[dimension].push(value);
                } else {
                    appData.filters[dimension].splice(appData.filters[dimension].indexOf(value), 1);
                }

                appData.filtered = appData.array.filter(z => {
                    var flags = [];
                    for(var dim in appData.filters){
                        flags.push(appData.filters[dim].indexOf(z[dim]) >= 0 || appData.filters[dim].length == 0);
                    }
                    return flags.filter(f => f == false).length == 0;
                });

                chartRender();
            };

            p.append(checkbox);
            p.append(' ' + filters[x][y]);

            div.append(p);
        }
        
        var h3 = document.createElement('h3');
        h3.innerText = x;
        $( "#filters" ).append(h3).append(div);

    }
}

function getData(from){ 
    //$('.someBlock').preloader();
    var body = {
        "from" : from, "size" : appData.size,
        "query" : {
            "match_all": {}
        }
    };
    
    $.get(appData.url, null, function( data ) {
        appData.total = data.length;
        // for(var i=0; i < data.hits.hits.length; i++){
            appData.array = data;
        // }
        // if( (from + appData.size) < appData.total) {
        //     getData(from + appData.size);
        
        // } else {
            appData.filtered = appData.filtered.concat(appData.array);

            var filters = {};
            for(var filter in appData.filters){
                filters[filter] = appData.array.map(z=>z[filter]).filter(distinct).sort();
            }

            configFilter(filters);
            chartRender();
            $( "#filters" ).accordion();
        // }
    });
}

function chartRender() {
    build();

    if(appData.options == undefined){
        setOptions();
        appData.charts = {};
        for(var x in appData.options){
            appData.charts[x] = Highcharts.chart(x, appData.options[x]);
        }
    } else {
        setOptions();
        for(var x in appData.options){
            appData.charts[x].update(appData.options[x]);
        }
    }
    
    chartCustomRender();
}

function toggleSidebar(){
    var sidebar = document.getElementById('sidebar');
    showSidebar = !showSidebar;
    if(showSidebar){
        sidebar.style.opacity = '1';
        sidebar.style['z-index'] = '1000';
    } else {
        sidebar.style.opacity = '0';
        sidebar.style['z-index'] = '-1000';
    }
}

function toMoney(num){
    if(num != undefined){
        var index = num.toString().indexOf('.');
        if(index > 0){
            num = num.toPrecision(index+2).replace('.',',');
        } else {
            num += ',00'
        }
        return num;
    }
    return '';
}

function undefinedToEmpty(value){
    if(value == undefined){
        return '';
    }
    return value;
}

function newChart(){
    var myChart = {};
    myChart = {
        yAxis:{},
        setId: function (id){
            myChart.id = id;
            return myChart;
        },
        setType: function (type){
            myChart.chart = {type:type};
            return myChart;
        },
        setTitle: function (title){
            myChart.title = {text:title};
            return myChart;
        },
        setX: function (){
            myChart.xAxis = {categories:appData.dictionary[myChart.id].data.categories};
            return myChart;
        },
        setTooltipStacked: function (){
            myChart.tooltip = {
                headerFormat:'<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            };
            return myChart;
        },
        setTooltipPercentage: function (){
            myChart.tooltip = { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' };
            return myChart;
        },
        setPlotOptions: function (){
            switch(myChart.chart.type){
                case 'pie':
                    myChart.plotOptions = {
                        series: {
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    };
                    break;
            }
            return myChart;
        },
        setStackedSeries: function (){
            switch(myChart.chart.type){
                case 'bar':
                case 'column':
                    myChart.plotOptions = {
                        series: {
                            stacking: 'normal'
                        }
                    };
                    break;
                case 'area':
                    myChart.plotOptions = {
                        area: {
                            stacking: 'normal'
                        }
                    };
                    break;
            }
            myChart.yAxis.stackLabels = { enabled:true};
            myChart.series = appData.dictionary[myChart.id].stackedData;
            return myChart;
        },
        setY: function (text){
            switch(myChart.chart.type){
                case 'bar':
                case 'column':
                case 'area':
                    myChart.yAxis.title = { text: text };
                    break;
            }
            return myChart;
        },
        setSeries: function (name){
            switch(myChart.chart.type){
                case 'pie':
                    myChart.series = [{
                        name: name,
                        colorByPoint: true,
                        data: appData.dictionary[myChart.id].data.pie
                    }];
                    break;
                default:
                    myChart.series = [{
                        name: name,
                        data: appData.dictionary[myChart.id].data.data
                    }];
            }
            return myChart;
        },
        setDrilldown: function (){
            myChart.drilldown = {
                series:appData.dictionary[myChart.id].drilldownData
            };
            return myChart;
        }
    };
    return myChart;
}