$(function() {

    var tid;
    var tidData;

    appDataInit();

    if(localStorage.getItem('token') == null) {
        
        var login = prompt("Informe seu login.");
        var senha;

        if(login)
            senha = prompt("Informe sua senha.");

        if(senha)
            $.ajax({
                type: "POST",
                url: "https://pedrovgo91-iot.herokuapp.com/login",
                data: JSON.stringify({login:login, senha:senha}),
                headers:{"Content-Type":"application/json"},
                success: function(data, textStatus, request){
                    //console.log('data', data);
                },
                error: function(error) {
                    localStorage.setItem('token', error.getResponseHeader('Authorization'));
                    getData();
                    tidData = setInterval(getData, 60000);
                    tid = setInterval(loopDevices, 2500);
                },
                dataType: "json"
            });

    } else {
        getData();
        tidData = setInterval(getData, 60000);
        tid = setInterval(loopDevices, 2750);
    }
    
    var height = window.screen.height;
    var usedHeight = (52+36+30)*2;
    
    $('#por_mes').css('height',(height - usedHeight)*0.4);
    $('#por_device').css('height',(height - usedHeight)*0.4);

    $('#por_hora_do_dia').css('height',(height - usedHeight)*0.5);
    $('#por_dia_da_semana').css('height',(height - usedHeight)*0.5);
});

function chartCustomRender(){

    appData.charts['por_dia_da_semana'] = Highcharts.chart('por_dia_da_semana', appData.options['por_dia_da_semana']);

    $( "#consumo_total" ).text(undefinedToEmpty(appData.dictionary['consumo_total'].data.data[0]));
}

function getFullYear() {
    return new Date().getFullYear();
}