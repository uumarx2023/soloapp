class VisorImage {

    constructor(info) {
        this.path = info.path.replace("\\", "/");
        this.loaded = true;
    }

    render(selector) {
        $(selector).html("<img class='visor-image' src='/images" + this.path + "'>");
    }

}