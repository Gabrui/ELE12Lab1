//UTILIZA A BIBLIOTECA math.js para o cálculo com números complexos

/* global math, carta */

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
 * 
 * @param {Number} aberto
 * @param {Number} l
 * @param {Number} f
 * @param {Number} u
 * @param {Number} e
 * @returns {Number}
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
 * 
 * @param {Number} a
 * @param {Number} b
 * @param {Number} NyT
 * @param {Number} x
 * @param {Number} f
 * @param {Number} u
 * @param {Number} e
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
 * @param {math.complex} zlComplexo O
 * @returns {math.complex} O coeficiente de reflexão complexo
 */
function calcularReflexao(zlComplexo) {
    return math.divide(math.add(1, zlComplexo), math.subtract(1, zlComplexo));
}


function calcular() {
    var u0 = 4 * math.pi * math.pow(10, -7);
    var e0 = 8.8541878176 * math.pow(10, -12);
    
    var ReZ0 = document.getElementsByName("ReZ0")[0].value;
    var ImZ0 = 0;//document.getElementsByName("ImZ0")[0].value;
    var Z0 = math.complex(ReZ0, ImZ0);
    var ReZL = document.getElementsByName("ReZL")[0].value;
    var ImZL = document.getElementsByName("ImZL")[0].value;
    var ZL = math.complex(ReZL, ImZL);
    var freq = document.getElementsByName("freq")[0].value * math.pow(10, 6);
    var urel = document.getElementsByName("urel")[0].value;
    var bw   = document.getElementsByName("bw")  [0].value * math.pow(10,6);
    
    var ZLNorm = math.divide(ZL, Z0);
    var YLNorm = math.divide(1, ZLNorm);
    
    var a = YLNorm.re;
    var b = YLNorm.im;
    
    var A = a*a + b*b - a;
    var B = -2*b;
    var C = 1 - a;
    var delta = B*B - 4*A*C;
    var t1 = (-B + math.sqrt(delta))/(2*A);
    var t2 = (-B - math.sqrt(delta))/(2*A);
    var lambda = 1/(math.sqrt(urel*u0*e0)*freq);
    var x1 = somarSeNegativo(lambda/2, lambda * math.atan(t1)/(2*math.pi));
    var x2 = somarSeNegativo(lambda/2, lambda * math.atan(t2)/(2*math.pi));
    
    
    var Imy1 = ((b+t1)*(1-b*t1)-t1*a*a)/((1-b*t1)*(1-b*t1)+(t1*a)*(t1*a));
    var Imy2 = ((b+t2)*(1-b*t2)-t2*a*a)/((1-b*t2)*(1-b*t2)+(t2*a)*(t2*a));
    
    var comp1aberto = somarSeNegativo(lambda/2, math.atan(Imy1)*lambda/(2*math.pi));
    var comp1curto = somarSeNegativo(lambda/2, math.atan(-1/Imy1)*lambda/(2*math.pi));
    var comp2aberto = somarSeNegativo(lambda/2, math.atan(Imy2)*lambda/(2*math.pi));
    var comp2curto = somarSeNegativo(lambda/2, math.atan(-1/Imy2)*lambda/(2*math.pi));
    
    var fmax = freq + bw;
    var fmin = freq - bw;
    var NyTaberto1max = calcularNovoyToco(true,comp1aberto,fmax,u0,e0);
    var NyTaberto2max = calcularNovoyToco(true,comp2aberto,fmax,u0,e0);
    var NyTcurto1max = calcularNovoyToco(false,comp1curto,fmax,u0,e0);
    var NyTcurto2max = calcularNovoyToco(false,comp2curto,fmax,u0,e0);
    var NyTaberto1min = calcularNovoyToco(true,comp1aberto,fmin,u0,e0);
    var NyTaberto2min = calcularNovoyToco(true,comp2aberto,fmin,u0,e0);
    var NyTcurto1min = calcularNovoyToco(false,comp1curto,fmin,u0,e0);
    var NyTcurto2min = calcularNovoyToco(false,comp2curto,fmin,u0,e0);
    
    var R1abertomax = calcularModR(a,b,NyTaberto1max,x1,fmax,u0,e0);
    var R2abertomax = calcularModR(a,b,NyTaberto2max,x2,fmax,u0,e0);
    var R1abertomin = calcularModR(a,b,NyTaberto1min,x1,fmin,u0,e0);
    var R2abertomin = calcularModR(a,b,NyTaberto2min,x2,fmin,u0,e0);
    
    var R1curtomax = calcularModR(a,b,NyTcurto1max,x1,fmax,u0,e0);
    var R2curtomax = calcularModR(a,b,NyTcurto2max,x2,fmax,u0,e0);
    var R1curtomin = calcularModR(a,b,NyTcurto1min,x1,fmin,u0,e0);
    var R2curtomin = calcularModR(a,b,NyTcurto2min,x2,fmin,u0,e0);
    
    var Vswr1abertomax = calcularVswr(R1abertomax);
    var Vswr2abertomax = calcularVswr(R2abertomax);
    var Vswr1abertomin = calcularVswr(R1abertomin);
    var Vswr2abertomin = calcularVswr(R2abertomin);
    
    var Vswr1curtomax = calcularVswr(R1curtomax);
    var Vswr2curtomax = calcularVswr(R2curtomax);
    var Vswr1curtomin = calcularVswr(R1curtomin);
    var Vswr2curtomin = calcularVswr(R2curtomin);
    
    var texto = "";
    
    texto += "<table>";
    texto += "<tr><td>Impedância Normalizada</td><td>" + ZLNorm.re +" + j * " + ZLNorm.im + "</td></tr>";
    texto += "<tr><td>Distância do Toco à carga</td><td>" + x1.toExponential(4) +" m ou " + x2.toExponential(4) + " m </td></tr>";
    texto += "<tr><td>Comprimento do Toco em aberto</td><td>" + comp1aberto.toExponential(4) +" m ou " + comp2aberto.toExponential(4) + "</td></tr>";
    texto += "<tr><td>Comprimento do Toco em curto</td><td>" + comp1curto.toExponential(4) +" m ou " + comp2curto.toExponential(4) + "</td></tr>";
    texto +="<tr><td>Vswr em aberto para frequencia maxima</td><td>"+Vswr1abertomax.toExponential(4)+" m ou "+Vswr2abertomax.toExponential(4) + "</td></tr>";
    texto +="<tr><td>Vswr em aberto para frequencia minima</td><td>"+Vswr1abertomin.toExponential(4)+" m ou "+Vswr2abertomin.toExponential(4) + "</td></tr>";
    texto +="<tr><td>Vswr em curto para frequencia maxima</td><td>"+Vswr1curtomax.toExponential(4)+" m ou "+Vswr2curtomax.toExponential(4) + "</td></tr>";
    texto +="<tr><td>Vswr em curto para frequencia minima</td><td>"+Vswr1curtomin.toExponential(4)+" m ou "+Vswr2curtomin.toExponential(4) + "</td></tr>";
    texto += "</table>";
    document.getElementById("respostas").innerHTML = texto;
    
    carta.iniciar(648, 649, 1196-648, "desenho", "fundo");
    carta.desenharPontozNorm(ZLNorm, "ZL");
}

