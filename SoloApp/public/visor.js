class Visor {

    constructor() {
        this.paused = false;
        this.selector = "#pantalla0";
        this.selectorNext = "#pantalla1";

        $(this.selectorNext).removeClass("visible");
        $(this.selector).removeClass("visible");
    }

    setup(callback){

        ajax_get("/rest/info" + document.location.search, (config) => {

            console.log(config.info);

            this.pantalles=[]; 
            this.iPantalla=0; 
            this.id_timeOut=0; 
        
            for (let info of config.info) {
    
                if (info.duracion > 0) {
                    var pantalla = null;
    
                    if (info.tipo=='Imagen') {
                        pantalla = new VisorImage(info);
                    } else if (info.tipo=='Video') {
                        pantalla = new VisorVideo(info);
                    } else if (info.tipo=='Proxima') {
                        pantalla = new VisorProxima(info);
                    } else if (info.tipo=='Horario') {
                        pantalla = new VisorHorario(info);
                    } else {
                        pantalla = new VisorHtml(info);
                    }
                
                    if (pantalla) {
                        pantalla.info = info;
                        this.pantalles.push(pantalla);
                    }
                }
            }

            if (callback) callback();
            
        });
    }

    play(selector) {
        if (this.pantalles.length>0) {
            //this.iPantalla=0;
            this.renderNext(selector);        
        }        
    }

    pausa() {
        this.paused = !this.paused;
        this.renderNext();
    }

    renderNext() {

        clearTimeout(this.id_timeOut);
        $(this.selector).off();

        if (this.paused) return 0;

        var pantalla = this.pantalles[this.iPantalla];

        if (pantalla.loaded) {

            var selector = this.selectorNext;
            this.selectorNext = this.selector;
            this.selector = selector;

            var temps = pantalla.info.duracion * 1000;

            pantalla.render(selector, ()=> {
                this.renderNext();
            });

            $(this.selectorNext).removeClass("visible");
            $(this.selector).addClass("visible");

            if (temps>0) {

                this.id_timeOut = setTimeout(()=>{
                    this.renderNext();
                }, temps);
            }

            this.iPantalla++;

            if (this.iPantalla>=this.pantalles.length) {
                this.setup(() => {
                    var pantalla = this.pantalles[this.iPantalla];
                    if (pantalla.prepara) pantalla.prepara(this.selectorNext);
                });                
            } else {
                var pantalla = this.pantalles[this.iPantalla];
                if (pantalla.prepara) pantalla.prepara(this.selectorNext);
            }
            
        } else {

            this.id_timeOut = setTimeout(()=>{
                this.renderNext(selector);
            }, 1000);

        }

        $(selector).off().on("click", ()=>{
           this.renderNext(selector);
        });

    }

}

