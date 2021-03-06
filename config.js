function setOptions(){
    appData.options = {
       desempenho_mensal:newChart().setId('desempenho_mensal').setType('area')
            .setTitle('Desempenho Mensal').setX().setY('Número de Vendas')
            .setTooltipStacked().setPlotOptions().setStackedSeries()
    };
}

function appDataInit(){
    appData.url = "https://pedrovgo91-iot.herokuapp.com/2021/0";
    appData.dictionary = {
        desempenho_mensal: {
            dimension:'timestamp',
            fact:'valor', 
            grouping:groupSum, 
            sorting:dimensionAscComparer,
            stack:{
                deviceNome:['Ventilador']
            },
            data:{
                categories:[],
                data:[]
            },
            stackedData:[]
        }
    };
    appData.filters = {
        ano:[],
        mes:[],
        promotora:[],
        marca:[],
        linha:[],
        produto:[],
        medida:[],
        tipo:[],
        loja:[],
        turno:[]
    };
}