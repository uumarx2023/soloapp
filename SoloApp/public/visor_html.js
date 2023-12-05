class VisorHtml {

    constructor(info) {
        
        this.sala = info.sala.split("-")[0];
        this.tipo = info.tipo;

        this.dades = {};
        
        this.template = "";

        this.loaded = false;

        var infosala = false;
        var template = false;

        ajax_get("/rest/info/html?tipo=" + this.tipo + "&sala=" +  this.sala, (res) => {
            this.dades = res;
            console.log(this.dades);
            infosala = true;
            this.loaded = infosala && template;    
        });

        ajax_get("/pantallas/" + this.tipo + ".html", (res) => {
            this.template = res;
            template = true;
            this.loaded = infosala && template;    
        });
            
    }

    render(selector) {
        if (this.loaded) {
            
            var html = "";
            
            try {
                html = ejs.render(this.template, this.dades)
            } catch(err) { 

            }
            
            $(selector).html(html);
        }
    }

}