/** @Controller */
export class IndexController {
    constructor(){
    }

    /** @RequestMapping ('/',get) */
    index(req,res,next){
        res.render('index');
    }
}