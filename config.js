function setOptions(){
    appData.options = {
        por_hora_do_dia:newChart().setId('por_hora_do_dia').setType('area')
            .setTitle('Consumo Médio por Horário').setX().setY('Consumo (kW/h)')
            .setTooltipStacked().setPlotOptions().setStackedSeries(),
        por_dia_da_semana:newChart().setId('por_dia_da_semana').setType('pie')
            .setTitle('Consumo Total Semanal').setX()
            .setTooltipPercentage().setPlotOptions().setSeries('device').setDrilldown(),
        por_mes:newChart().setId('por_mes').setType('column')
            .setTitle('Consumo Total Mensal').setX().setY('Consumo (kW/h)')
            .setTooltipStacked().setPlotOptions().setStackedSeries(),
        por_device:newChart().setId('por_device').setType('bar')
            .setTitle('Consumo Total por Aparelho').setX().setY('Consumo (kW/h)')
            .setTooltipStacked().setPlotOptions().setStackedSeries()
    };
}

function appDataInit(){
    appData.url = "https://pedrovgo91-iot.herokuapp.com/dashboard/" + getFullYear();
    appData.dictionary = {
        por_hora_do_dia: {
            dimension:'hora',
            fact:'valor', 
            grouping:groupAvg, 
            sorting:dimensionAscComparer,
            stack:{
                device: appData.device ? appData.device : []
            },
            data:{
                categories:[],
                data:[]
            },
            stackedData:[]
        },
        por_dia_da_semana: {
            dimension:'dia',
            fact:'valor', 
            grouping:groupSum, 
            sorting:factAscComparer,
            data:{
                categories:[],
                data:[],
                pie:[]
            },
            drilldown:'device',
            drilldownData:[]
        },
        por_mes: {
            dimension:'mes',
            fact:'valor', 
            grouping:groupSum, 
            sorting:dimensionAscComparer,
            stack:{
                device: appData.device ? appData.device : []
            },
            data:{
                categories:[],
                data:[]
            },
            stackedData:[]
        },
        por_device: {
            dimension:'device',
            fact:'valor', 
            grouping:groupSum, 
            sorting:dimensionAscComparer,
            stack:{
                dia: appData.dia ? appData.dia : []
            },
            data:{
                categories:[],
                data:[]
            },
            stackedData:[]
        },
        consumo_total: {
            dimension:undefined,
            fact:'valor', 
            grouping:groupSum, 
            sorting:undefined,
            data:{
                categories:[],
                data:[]
            }
        }
    };
    appData.filters = {
        data:[],
        mes:[],
        dia:[],
        hora:[],
        device:[]
    };
}

function loopDevices() {
    $.ajax({
        url: "https://pedrovgo91-iot.herokuapp.com/",
        type: "GET",
        beforeSend: function(xhr){xhr.setRequestHeader('Authorization', localStorage.getItem('token'));},
        success: function(data) {
            var div = $('#device-list');

            div.children().remove();

            var p = $('<p>');
            p.append('Aparelhos');
            div.append(p);

            if(data) {
                for(var d of data){
                    p = $('<p style="cursor:pointer">');
                    p.append(`${d.name} - ${d.estado > 0 ? 
                        '<span style="color:green">ON</span>' : 
                        '<span style="color:red">OFF</span>'}`);
                    p.click(function () {
                        $.ajax({
                            type: "POST",
                            beforeSend: function(xhr){xhr.setRequestHeader('Authorization', localStorage.getItem('token'));},
                            url: `https://pedrovgo91-iot.herokuapp.com/${d.estado > 0 ? 'desligar' : 'ligar'}/${d.codigo}`,
                            headers:{"Content-Type":"application/json"},
                            success: function(data, textStatus, request){

                            },
                            error: function(error) {
                                
                            },
                            dataType: "json"
                        });
                    });
                    div.append(p);
                }
            }
        }
     });
}