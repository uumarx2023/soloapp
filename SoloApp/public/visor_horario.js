class VisorHorario {

    constructor(info) {
        
        this.sala = info.sala.split("-")[0];
        this.dades = {};
        
        this.template = "";

        this.loaded = false;

        var infosala = false;
        var template = false;

        ajax_get("/rest/info/horario?sala=" +  this.sala, (res) => {
            this.dades = res;          
            console.log(this.dades);
            infosala = true;
            this.loaded = infosala && template;    
        });

        ajax_get("/template/horario.ejs", (res) => {
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