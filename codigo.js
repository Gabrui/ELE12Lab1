//UTILIZA A BIBLIOTECA math.js para o cálculo com números complexos

/* global math, MathJax, Plotly */

var epsilon = math.pow(10, -8);

/**
 * @function somarSeNegativo Soma um incremento a um número se este for negativo
 * @param {Number} incremento Soma esse incremento ao número
 * @param {Number} numero Número a ser analisado se negativo
 * @returns {Number} Resultado da operação de soma, se numero for negativo
 */
function somarSeNegativo(incremento, numero) {
    if (numero < 0) {
        return numero + incremento;
    }
    return numero;
}


/**
 * @function calcularNovoyToco calcula a admitancia do toco para um valor de frequencia
 * @param {Number} aberto variavel boolena que diz se o toco esta em aberto ou nao
 * @param {Number} l comprimento do tooc
 * @param {Number} f valor de frequencia
 * @param {Number} u valor da permeabilidade magnetica
 * @param {Number} e valor de permissividade eletrica
 * @returns {Number} Retorna o valor da admitancia do toco
 */
function calcularNovoyToco(aberto, l, f, u,e) {
    if (aberto){
        return math.tan(2*math.pi*l*f*math.sqrt(u*e));
    }
    else{
        return -1*math.cot(2*math.pi*l*f*math.sqrt(u*e));
    }
}


/**
 * @function calcularModR Calcula o modulo do coeficiente de reflexao
 * @param {Number} a parte real da admitancia de carga
 * @param {Number} b parte imaginaria da admitancia de carga
 * @param {Number} NyT valor da admitancia do toco
 * @param {Number} x posicao do toco
 * @param {Number} f frequencia
 * @param {Number} u permeabilidade magnetica
 * @param {Number} e permissividade eletrica
 * @returns {Number}
 */
function calcularModR(a,b,NyT,x,f,u,e){
    var t = math.tan(2*math.pi*x*f*math.sqrt(u*e));
    var t2 = t*t;
    var t3 = t2*t;
    var t4 = t2*t2;
    var Rey = (a - a*b*t + t*a*(b+t))/((1-b*t)*(1-b*t)+(t*a)*(t*a));
    var Imy = (-t*a*a+(b+t)*(1-b*t))/((1-b*t)*(1-b*t)+(t*a)*(t*a));
    var ReyLf = (Rey);
    var ImyLf = (-NyT+Imy);
    var num2 = (1-ReyLf)*(1-ReyLf) + (ImyLf)*(ImyLf);
    var dem2 = (1+ReyLf)*(1+ReyLf) + (ImyLf)*(ImyLf);
    return math.sqrt(num2/dem2);
}


/**
 * @function calcularVswr Retorna o VSWR a partir do coeficiente de reflexão
 * @param {Number} R Módulo do coeficiente de Reflexão
 * @returns {Number} VSWR calculado
 */
function calcularVswr(R) {
    return (1+R)/(1-R); 
}


/**
 * 
 * @param {math.complex} zlComplexo A impedância da carga normalizada.
 * @returns {math.complex} O coeficiente de reflexão complexo
 */
function calcularReflexao(zlComplexo) {
    return math.divide(math.subtract(zlComplexo, 1), math.add(1, zlComplexo));
}



/**
 * Gira no sentido horário para o cáculo da diferença de ângulo
 * @param {number} inicio Ângulo inicial entre -pi e pi
 * @param {number} fim Ângulo final entre -pi e pi
 * @returns {number} Distância angular a ser percorrida no sentido horário
 */
function calcDifAngRad(inicio, fim) {
    // Tem que passar pela descontinuidade
    if (inicio < fim) {
        return 2*math.pi - (fim - inicio);
    } else {
        return inicio - fim;
    }
}



function calcular() {

    var ReZ0 = document.getElementsByName("ReZ0")[0].value;
    var ImZ0 = 0;//document.getElementsByName("ImZ0")[0].value;
    var Z0 = math.complex(ReZ0, ImZ0);
    var ReZL = document.getElementsByName("ReZL")[0].value;
    var ImZL = document.getElementsByName("ImZL")[0].value;
    var ZL = math.complex(ReZL, ImZL);
    var freq = document.getElementsByName("freq")[0].value * math.pow(10, 6);
    var urel = document.getElementsByName("urel")[0].value;
    var erel = document.getElementsByName("erel")[0].value;
    var bw   = document.getElementsByName("bw")  [0].value * math.pow(10,6);
    
    var u = urel * 4 * math.pi * math.pow(10, -7);
    var e = erel * 8.8541878176 * math.pow(10, -12);
    // Impedância Normalizada da carga
    var ZLNorm = math.divide(ZL, Z0);
    // Admitância Normalizada da carga
    var YLNorm = math.divide(1, ZLNorm);
    // Comprimento de onda
    var lambda = 1/(math.sqrt(u*e)*freq);
    // Coeficiente de reflexão do toco em curto normalizada
    var rTocoCurto = math.complex(-1, 0);
    // Admitância do toco em aberto normalizada
    var rTocoAberto = math.complex(1, 0);
    // Frequência máxima da banda de operação
    var fmax = freq + bw/2;
    // Frequência mínima da banda de operação
    var fmin = freq - bw/2;
    var freqs = [fmin, fmax];

    
    /* CÓDIGO PARA CALCULAR PELA CARTA DE SMITH
    for (var numSol = 1; numSol <=2; numSol++) {
        // Coeficiente de Reflexão da carga, complexo
        var reflexaoCarga = calcularReflexao(ZLNorm);
        // O seu módulo
        var reflexaoCargaModulo = reflexaoCarga.toPolar().r;
        // O coeficiente de reflexão no ponto de parte real da admitância igual
        // a 1. Ele é simétrico com relação a outra solução
        var reflexaoParteReal1 = math.complex.fromPolar(reflexaoCargaModulo,
            math.acos(reflexaoCargaModulo) * ((numSol===1)?1:-1));
        // A admitância desse ponto de reflexão
        var admitanciaParteReal1 = math.divide(math.add(1, reflexaoParteReal1), 
            math.subtract(1, reflexaoParteReal1));
        // Um coeficiente de reflexão associada à admitância da carta de smith
        var reflexaoAdmitancia = calcularReflexao(YLNorm);
        // A distância elétrica
        var xEletrico = calcDifAngRad(reflexaoAdmitancia.toPolar().phi,
                       reflexaoParteReal1.toPolar().phi)*0.5/(2*math.pi);
        // A distância real
        var x = xEletrico * lambda;
        // Comprimento do Toco em curto
        var compTocoCurto = calcDifAngRad(rTocoCurto.toPolar().phi,
            -reflexaoParteReal1.toPolar().phi)*lambda*0.5/(2*math.pi);
        // Comprimento do Toco em aberto
        var compTocoAberto = calcDifAngRad(rTocoAberto.toPolar().phi,
            -reflexaoParteReal1.toPolar().phi)*lambda*0.5/(2*math.pi);
        
        // Descasamento de 
        for (var tam = freqs.length - 1; tam >= 0; tam--) {
            
        }
    }*/
    
    var a = YLNorm.re;
    var b = YLNorm.im;
    

    var A = a*a + b*b - a;
    var B = -2*b;
    var C = 1 - a;
    var delta = B*B - 4*A*C;
    if (math.abs(A) < epsilon) {
        var t2 = -C/B;

        var x1 = lambda/4;
        var x2 = somarSeNegativo(lambda/2, lambda * math.atan(t2)/(2*math.pi));

        var Imy1 =  ZLNorm.im;
        var Imy2 = -ZLNorm.im;
    } else {
        var t1 = (-B + math.sqrt(delta))/(2*A);
        var t2 = (-B - math.sqrt(delta))/(2*A);
        
        var x1 = somarSeNegativo(lambda/2, lambda * math.atan(t1)/(2*math.pi));
        var x2 = somarSeNegativo(lambda/2, lambda * math.atan(t2)/(2*math.pi));

        var Imy1 = ((b+t1)*(1-b*t1)-t1*a*a)/((1-b*t1)*(1-b*t1)+(t1*a)*(t1*a));
        var Imy2 = ((b+t2)*(1-b*t2)-t2*a*a)/((1-b*t2)*(1-b*t2)+(t2*a)*(t2*a));
    }


    var comp1aberto = somarSeNegativo(lambda/2, math.atan(Imy1)*lambda/(2*math.pi));
    var comp1curto = somarSeNegativo(lambda/2, math.atan(-1/Imy1)*lambda/(2*math.pi));
    var comp2aberto = somarSeNegativo(lambda/2, math.atan(Imy2)*lambda/(2*math.pi));
    var comp2curto = somarSeNegativo(lambda/2, math.atan(-1/Imy2)*lambda/(2*math.pi));
    
    
    var f = fmin;
    var quantIter = 50;
    var df = bw/quantIter;
    var xGrafico = [];
    var Vswr1aberto = [];
    var Vswr2aberto = [];
    var Vswr1curto = [];
    var Vswr2curto = [];
    for (var quant = 0; quant <= quantIter; quant++, f+=df) {
        var NyTaberto1 = calcularNovoyToco(true,comp1aberto,f,u,e);
        var NyTaberto2 = calcularNovoyToco(true,comp2aberto,f,u,e);
        var NyTcurto1 = calcularNovoyToco(false,comp1curto,f,u,e);
        var NyTcurto2 = calcularNovoyToco(false,comp2curto,f,u,e);

        var R1aberto = calcularModR(a,b,NyTaberto1,x1,f,u,e);
        var R2aberto = calcularModR(a,b,NyTaberto2,x2,f,u,e);

        var R1curto = calcularModR(a,b,NyTcurto1,x1,f,u,e);
        var R2curto = calcularModR(a,b,NyTcurto2,x2,f,u,e);

        xGrafico[quant] = f;
        Vswr1aberto[quant] = calcularVswr(R1aberto);
        Vswr2aberto[quant] = calcularVswr(R2aberto);
        Vswr1curto[quant] = calcularVswr(R1curto);
        Vswr2curto[quant] = calcularVswr(R2curto);
    }
    
    var texto = "";
    var carta1 = new CartaSmith(649, 649, 1196-648, "desenho", "fundo");
    
    texto += "<table>";
    texto += "<caption>Primeira Solução</caption>";
    texto += "<tr><td>$\\text{Comprimento de Onda: }$</td><td>$" + lambda.toFixed(4) + "\\;m $</td></tr>";
    texto += "<tr><td>$\\text{Impedância Normalizada: }$</td><td>$" + ZLNorm.re.toFixed(4) +" + j\\;" + ZLNorm.im.toFixed(4) + "$</td></tr>";
    carta1.desenharRetaZNorm(ZLNorm);
    carta1.desenharPontoZNorm(ZLNorm, "zL");
    texto += "<tr><td>$\\text{Admitância Normalizada: }$</td><td>$" + YLNorm.re.toFixed(4) +" + j\\;" + YLNorm.im.toFixed(4) + "$</td></tr>";
    carta1.setCor("#008888");
    carta1.desenharRetaZNorm(YLNorm);
    carta1.desenharPontoZNorm(YLNorm, "yL");
    carta1.setCor("#FF0000");
    carta1.curvaRConst(calcularReflexao(YLNorm), calcularReflexao(math.complex(1, Imy1)));
    carta1.setFonte("1em");
    carta1.desenharPontoZNorm(math.complex(1, Imy1), "Parte Real 1");
    carta1.setCor("#FF33FF");
    carta1.interpolarZ(math.complex(1, Imy1), math.complex(1, 0));
    texto += "<tr><td>$\\text{Distância do Toco à carga: }$</td><td>$" + x1.toFixed(4) +"\\;m $</td></tr>";
    texto += "<tr><td>$\\text{Comprimento do Toco em aberto: }$</td><td>$" + comp1aberto.toFixed(4) +"\\;m $</td></tr>";
    texto += "<tr><td>$\\text{Comprimento do Toco em curto: }$</td><td>$" + comp1curto.toFixed(4) +"\\;m $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em aberto para frequencia máxima: }$</td><td>$"+Vswr1aberto[quantIter].toFixed(4)+"\\;\\; $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em aberto para frequencia mínima: }$</td><td>$"+Vswr1aberto[0].toFixed(4)+"\\;\\; $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em curto para frequencia máxima: }$</td><td>$"+Vswr1curto[quantIter].toFixed(4)+"\\;\\; $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em curto para frequencia mínima: }$</td><td>$"+Vswr1curto[0].toFixed(4)+"\\;\\; $</td></tr>";
    texto += "</table>";
    
    
    document.getElementById("respostas").innerHTML = texto;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"respostas"]);
    
    
    var texto2 = "";
    var carta2 = new CartaSmith(649, 649, 1196-648, "desenho2", "fundo");
    texto2 += "<table>";
    texto2 += "<caption>Segunda Solução</caption>";
    texto2 += "<tr><td>$\\text{Comprimento de Onda: }$</td><td>$" + lambda.toFixed(4) + "\\;m $</td></tr>";
    texto2 += "<tr><td>$\\text{Impedância Normalizada: }$</td><td>$" + ZLNorm.re.toFixed(4) +" + j\\;" + ZLNorm.im.toFixed(4) + "$</td></tr>";
    carta2.desenharRetaZNorm(ZLNorm);
    carta2.desenharPontoZNorm(ZLNorm, "zL");
    texto2 += "<tr><td>$\\text{Admitância Normalizada: }$</td><td>$" + YLNorm.re.toFixed(4) +" + j\\;" + YLNorm.im.toFixed(4) + "$</td></tr>";
    carta2.setCor("#008888");
    carta2.desenharRetaZNorm(YLNorm);
    carta2.desenharPontoZNorm(YLNorm, "yL");
    carta2.setCor("#FF0000");
    carta2.curvaRConst(calcularReflexao(YLNorm), calcularReflexao(math.complex(1, Imy2)));
    carta2.setFonte("1em");
    carta2.desenharPontoZNorm(math.complex(1, Imy2), "Parte Real 1");
    carta2.setCor("#FF33FF");
    carta2.interpolarZ(math.complex(1, Imy2), math.complex(1, 0));
    texto2 += "<tr><td>$\\text{Distância do Toco à carga: }$</td><td>$" + x2.toFixed(4) +"\\;m $</td></tr>";
    texto2 += "<tr><td>$\\text{Comprimento do Toco em aberto: }$</td><td>$" + comp2aberto.toFixed(4) +"\\;m $</td></tr>";
    texto2 += "<tr><td>$\\text{Comprimento do Toco em curto: }$</td><td>$" + comp2curto.toFixed(4) +"\\;m $</td></tr>";
    texto2 +="<tr><td>$V_{swr} \\text{ em aberto para frequencia máxima: }$</td><td>$"+Vswr2aberto[quantIter].toFixed(4)+"\\;\\; $</td></tr>";
    texto2 +="<tr><td>$V_{swr} \\text{ em aberto para frequencia mínima: }$</td><td>$"+Vswr2aberto[0].toFixed(4)+"\\;\\; $</td></tr>";
    texto2 +="<tr><td>$V_{swr} \\text{ em curto para frequencia máxima: }$</td><td>$"+Vswr2curto[quantIter].toFixed(4)+"\\;\\; $</td></tr>";
    texto2 +="<tr><td>$V_{swr} \\text{ em curto para frequencia mínima: }$</td><td>$"+Vswr2curto[0].toFixed(4)+"\\;\\; $</td></tr>";
    texto2 += "</table>";
    
    
    document.getElementById("respostas2").innerHTML = texto2;
    MathJax.Hub.Queue(["Typeset",MathJax.Hub,"respostas2"]);

    
    /*
     *     texto += "<table>";
    texto += "<caption>Primeira Solução</caption>";
    texto += "<tr><td>$\\text{Impedância Normalizada: }$</td><td>$" + ZLNorm.re +" + j\\;" + ZLNorm.im + "$</td></tr>";
    texto += "<tr><td>$\\text{Distância do Toco à carga: }$</td><td>$" + x1.toFixed(4) +"\\;m\\;\\; \\text{ou} \\;\\;" + x2.toFixed(4) + "\\;m $</td></tr>";
    texto += "<tr><td>$\\text{Comprimento do Toco em aberto: }$</td><td>$" + comp1aberto.toFixed(4) +"\\;m\\;\\; \\text{ou}\\;\\; " + comp2aberto.toFixed(4) + "\\;m $</td></tr>";
    texto += "<tr><td>$\\text{Comprimento do Toco em curto: }$</td><td>$" + comp1curto.toFixed(4) +"\\;m\\;\\; \\text{ou} \\;\\;" + comp2curto.toFixed(4) + "\\;m $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em aberto para frequencia máxima: }$</td><td>$"+Vswr1abertomax.toFixed(4)+"\\;\\;\\; \\text{ou} \\;\\;"+Vswr2abertomax.toFixed(4) + "\\; $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em aberto para frequencia mínima: }$</td><td>$"+Vswr1abertomin.toFixed(4)+"\\;\\;\\; \\text{ou} \\;\\;"+Vswr2abertomin.toFixed(4) + "\\; $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em curto para frequencia máxima: }$</td><td>$"+Vswr1curtomax.toFixed(4)+"\\;\\;\\; \\text{ou} \\;\\;"+Vswr2curtomax.toFixed(4) + "\\; $</td></tr>";
    texto +="<tr><td>$V_{swr} \\text{ em curto para frequencia mínima: }$</td><td>$"+Vswr1curtomin.toFixed(4)+"\\;\\;\\; \\text{ou} \\;\\;"+Vswr2curtomin.toFixed(4) + "\\; $</td></tr>";
    texto += "</table>";
    
     */
    
    var dadosVswr1a = {
        x: xGrafico,
        y: Vswr1aberto,
        mode: 'lines',
        name: 'Solução 1 Toco Aberto',
        line: {shape: 'spline'},
        type: 'scatter'
    };
    var dadosVswr2a = {
        x: xGrafico,
        y: Vswr2aberto,
        mode: 'lines',
        name: 'Solução 2 Toco Aberto',
        line: {shape: 'spline'},
        type: 'scatter'
    };
    var dadosVswr1c = {
        x: xGrafico,
        y: Vswr1curto,
        mode: 'lines',
        name: 'Solução 1 Toco em Curto',
        line: {shape: 'spline'},
        type: 'scatter'
    };
    var dadosVswr2c = {
        x: xGrafico,
        y: Vswr2curto,
        mode: 'lines',
        name: 'Solução 2 Toco em Curto',
        line: {shape: 'spline'},
        type: 'scatter'
    };

    var dados = [dadosVswr1a, dadosVswr1c, dadosVswr2a, dadosVswr2c];

    var estilo = {
        legend: {
            y: 0.5,
            font: {size: 16},
            yref: 'paper'
        },
        title: 'Análise de Largura de faixa',
        xaxis: {
            title: 'Frequência (Hz)'
        },
        yaxis: {
            title: 'SWR'
        }
    };

    Plotly.newPlot('swr', dados, estilo);

    
}

