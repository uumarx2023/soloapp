class VisorVideo {

    constructor(info) {
        this.path = info.path.replace("\\", "/");
    }

    prepara(selector) {
        $(selector).html("<video class='visor-video'><source src='/videos" + this.path + "' type='video/mp4' preload='auto'>ERR VIDEO</video>");
        this.loaded = true;
    }

    render(selector, callback) {
        $(selector + " .visor-video").get(0).play();
        
        $(selector + " .visor-video").bind("ended", function() {
            callback();
         });
        
    }


}