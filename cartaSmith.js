//UTILIZA FUNÇÕES DO ARQUIVO codigo.js

/**
 * @class Representação gráfica da Carta de Smith
 * @returns {CartaSmith} Um objeto do tipo carta de smith
 */
CartaSmith = function () {
    
    /**
     * 
     * @param {Number} cx A coordenada x do centro da carta de smith da imagem
     * @param {Number} cy A coordenada y do centro da carta de smith da imagem
     * @param {Number} r O raio da carta de smith da imagem
     * @param {string} desenho O ID do canvas no html
     * @param {string} fundo O ID da imagem de fundo do html
     */
    this.iniciar = function(cx, cy, r, desenho, fundo) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.desenho = document.getElementById(desenho).getContext("2d");
        this.fundo = document.getElementById(fundo);
        this.apagar();
    };
    
    
    /**
     * @function apagar Apaga que foi desenhado
     */
    this.apagar = function() {
        this.desenho.drawImage(this.fundo, 0, 0);
    };
    
    
    /**
     * @function desenharPontoZNorm Desenha um ponto de impedância normalizada
     * na carta de smith.
     * @param {math.complex} zComplexo Impedância normalizada
     * @param {string} texto Comentário sobre o ponto
     */
    this.desenharPontoZNorm = function(zComplexo, texto) {
        desenharR(calcularReflexao(zComplexo));
        //IMPLEMENTAR CÓDIGO QUE ESCREVE O TEXTO SOBRE O PONTO
    };
    
    
    /**
     * @function desenharR Desenha um ponto na carta de Smith referente a o
     * coeficiente de reflexão dado
     * @param {math.complex} reflexaoComplexo Coeficiente de reflexão
     */
    this.desenharR = function(reflexaoComplexo) {
        var formaPolar = reflexaoComplexo.toPolar();
        var raio = formaPolar.r;
        var phi = formaPolar.phi;
        //IMPLEMENTAR O RESTO
    };
    
    
    /**
     * @function desenharRetaR Desenha uma reta que liga o centro da carta de 
     * smith até o ponto de coeficiente de reflexão especificado.
     * @param {math.complex} reflexaoComplexo Coeficiente de reflexão
     */
    this.desenharRetaR = function(reflexaoComplexo) {
        //IMPLEMENTAR
    };
    
    
    /**
     * 
     * @param {math.complex} rInicial Coeficiente de Reflexão que marca o início
     * da interpolação
     * @param {math.complex} rFinal Coeficiente de Reflexão que marca o final
     * da interpolação
     */
    this.interpolarR = function(rInicial, rFinal) {
        //IMPLEMENTAR
        //Pensei em colocar um for que usa o desenharR, ou pelo menos aproveita 
        //parte dele, utilizando um passo fixo
    };
    
    this.reiniciar();
};


carta = new CartaSmith();