$(function() {
    appDataInit();
    getData(0);
    
    
    var height = window.screen.height;
    var usedHeight = (52+36+30)*2;
    
    // $('#total_por_promotora').css('height',height - usedHeight);
    $('#desempenho_mensal').css('height',(height - usedHeight)*0.4);
    // $('#desempenho_semanal').css('height',(height - usedHeight)*0.4);
    // $('#top_4_lojas').css('height',(height - usedHeight)*0.6);
    // $('#top_5_produtos').css('height',(height - usedHeight)*0.6);
    // $('#totais').css('height',(height - usedHeight)*0.2);
    // $('#distribuicao_por_linha').css('height',(height - usedHeight)*0.4);
});

function chartCustomRender(){

    //appData.charts['distribuicao_por_linha'] = Highcharts.chart('distribuicao_por_linha', appData.options['distribuicao_por_linha']);

    //$( "#total_vendas" ).text(undefinedToEmpty(appData.dictionary['total_vendas'].data.data[0]));
    //$( "#total_comissoes" ).text(toMoney(appData.dictionary['total_comissoes'].data.data[0]));
}