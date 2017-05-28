/* global math */

//UTILIZA FUNÇÕES DO ARQUIVO codigo.js

/**
 * @class Representação gráfica da Carta de Smith
 * @param {Number} cx A coordenada x do centro da carta de smith da imagem
 * @param {Number} cy A coordenada y do centro da carta de smith da imagem
 * @param {Number} r O raio da carta de smith da imagem
 * @param {string} desenho O ID do canvas no html
 * @param {string} fundo O ID da imagem de fundo do html
 * @returns {CartaSmith} Um objeto do tipo carta de smith
 */
CartaSmith = function (cx, cy, r, desenho, fundo) {
    
    /**
     * 
     * @param {Number} cx A coordenada x do centro da carta de smith da imagem
     * @param {Number} cy A coordenada y do centro da carta de smith da imagem
     * @param {Number} r O raio da carta de smith da imagem
     * @param {string} desenho O ID do canvas no html
     * @param {string} fundo O ID da imagem de fundo do html
     */
    this.iniciar = function(cx, cy, r, desenho, fundo) {
        this.cx = cx; ///< Posição x do centro da figura
        this.cy = cy; ///< Posição y do centro da figura
        this.r = r;   ///< Raio da carta de smith da figura
        this.canvas = document.getElementById(desenho);
        this.desenho = this.canvas.getContext("2d");
        this.fundo = document.getElementById(fundo);
        this.desenho.restore();
        this.apagar();
        this.desenho.moveTo(0, 0);
        this.setCor("#008800");
        this.desenho.lineWidth = 2;
        this.fonte = "'Open Sans', sans-serif";
        this.desenho.font = "bold 3em 'Open Sans', sans-serif";
    };
    
    /**
     * Muda a cor de desenho dos pontos e retas da carta
     * @param {string} cor A representação hexadecimal ou de nome da cor
     */
    this.setCor = function(cor) {
        this.desenho.fillStyle = cor;
        this.desenho.strokeStyle = cor;
    };
    
    
    /**
     * Muda a fonte
     * @param {type} fonte A representação da fonte
     */
    this.setFonte = function(fonte) {
        this.desenho.font = "bold " + fonte + this.fonte;
    };
    
    
    /**
     * @function apagar Apaga que foi desenhado
     */
    this.apagar = function() {
        this.desenho.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.desenho.drawImage(this.fundo, 0, 0);
    };
    
    
    /**
     * @function desenharPontoZNorm Desenha um ponto de impedância normalizada
     * na carta de smith.
     * @param {math.complex} zNormComplexo Impedância normalizada
     * @param {string} texto Comentário sobre o ponto
     */
    this.desenharPontoZNorm = function(zNormComplexo, texto) {
        this.desenharR(calcularReflexao(zNormComplexo), texto);
    };
    
    
    /**
     * @function desenharRetaR Desenha uma reta que liga o centro da carta de 
     * smith até o ponto que representa uma impedância normalizada.
     * @param {math.complex} zNormComplexo Impedância normalizada
     */
    this.desenharRetaZNorm = function(zNormComplexo) {
        this.desenharRetaR(calcularReflexao(zNormComplexo));
    };
    
    
    /**
     * @function desenharR Desenha um ponto na carta de Smith referente a o
     * coeficiente de reflexão dado
     * @param {math.complex} reflexaoComplexo Coeficiente de reflexão
     * @param {string} texto Texto a ser legenda do ponto
     */
    this.desenharR = function(reflexaoComplexo, texto) {
        var x =  reflexaoComplexo.re*this.r + this.cx; // Posição x na figura
        var y = -reflexaoComplexo.im*this.r + this.cy; // Posição y na figura
        this.desenho.beginPath();
        this.desenho.arc(x, y, this.r/100, 0, 2*Math.PI);
        this.desenho.fill();
        if (texto) {
            this.desenho.fillText(texto, x + 10, y - 10); 
        }
    };
    
    
    /**
     * @function desenharRetaR Desenha uma reta que liga o centro da carta de 
     * smith até o ponto de coeficiente de reflexão especificado.
     * @param {math.complex} reflexaoComplexo Coeficiente de reflexão
     */
    this.desenharRetaR = function(reflexaoComplexo) {
        var x =  reflexaoComplexo.re*this.r + this.cx; // Posição x na figura
        var y = -reflexaoComplexo.im*this.r + this.cy; // Posição y na figura
        this.desenho.beginPath();
        this.desenho.moveTo(this.cx, this.cy);
        this.desenho.lineTo(x, y);
        this.desenho.stroke(); 
    };
    
    
    /**
     * 
     * @param {math.complex} zNormInicial Z Normalizado inicial
     * @param {math.complex} zNormFinal Z Normalizado final
     */
    this.interpolarZ = function(zNormInicial, zNormFinal) {
        var i = 0;
        var iteracoes = 100;
        var delta = math.divide(math.subtract(zNormFinal, zNormInicial), iteracoes);
        var temp = zNormInicial.clone();
        var rTemp = calcularReflexao(temp);
        var x =  rTemp.re*this.r + this.cx; // Posição x na figura
        var y = -rTemp.im*this.r + this.cy; // Posição y na figura
        this.desenho.beginPath();
        this.desenho.moveTo(x, y);
        for(i = 0; i<iteracoes; i++) {
            temp = math.add(temp, delta);
            rTemp = calcularReflexao(temp);
            x =  rTemp.re*this.r + this.cx; // Posição x na figura
            y = -rTemp.im*this.r + this.cy; // Posição y na figura
            this.desenho.lineTo(x, y);
        }
        this.desenho.stroke();
    };
    
    
    /**
     * Desenha uma curva, segmento de circunferência de Coeficiente de Reflexão
     * constante.
     * @param {math.complex} rInicial Marca o ponto de início, é o seu raio que
     * é utilizado
     * @param {math.complex} rFinal Marca o ponto de final
     */
    this.curvaRConst = function(rInicial, rFinal) {
        this.desenho.beginPath();
        this.desenho.arc(this.cx, this.cy, rInicial.toPolar().r * this.r, 
            -rInicial.toPolar().phi, -rFinal.toPolar().phi);
        this.desenho.stroke();
    };
    
    this.iniciar(cx, cy, r, desenho, fundo);
};