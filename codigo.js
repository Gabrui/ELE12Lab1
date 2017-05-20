/* global math */
function somarSeNegativo(incremento, numero) {
    if (numero < 0) {
        return numero + incremento;
    }
    return numero;
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
    var bw   = document.getElementsByName("bw")  [0].value;
    
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
    var x1 = somarSeNegativo(lambda/2, lambda * math.atan(t1/(2*math.pi)));
    var x2 = somarSeNegativo(lambda/2, lambda * math.atan(t2/(2*math.pi)));
    
    
    var Imy1 = ((b+t1)*(1-b*t1)-t1*a*a)/((1-b*t1)*(1-b*t1)+(t1*a)*(t1*a));
    var Imy2 = ((b+t2)*(1-b*t2)-t2*a*a)/((1-b*t2)*(1-b*t2)+(t2*a)*(t2*a));
    
    var comp1aberto = somarSeNegativo(lambda/2, math.atan(Imy1)*lambda/(2*math.pi));
    var comp1curto = somarSeNegativo(lambda/2, math.atan(-1/Imy1)*lambda/(2*math.pi));
    var comp2aberto = somarSeNegativo(lambda/2, math.atan(Imy2)*lambda/(2*math.pi));
    var comp2curto = somarSeNegativo(lambda/2, math.atan(-1/Imy2)*lambda/(2*math.pi));
        
    var texto = "";
    
    texto += "<table>";
    texto += "<tr><td>Impedância Normalizada</td><td>" + ZLNorm.re +" + j * " + ZLNorm.im + "</td></tr>";
    texto += "<tr><td>Distância do Toco à carga</td><td>" + x1.toExponential(4) +" m ou " + x2.toExponential(4) + " m </td></tr>";
    texto += "<tr><td>Comprimento do Toco em aberto</td><td>" + comp1aberto.toExponential(4) +" m ou " + comp2aberto.toExponential(4) + "</td></tr>";
    texto += "<tr><td>Comprimento do Toco em curto</td><td>" + comp1curto.toExponential(4) +" m ou " + comp2curto.toExponential(4) + "</td></tr>";
    texto += "</table>";
    document.getElementById("respostas").innerHTML = texto;
}
