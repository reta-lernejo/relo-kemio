class Stato {

    /**
     * difinas stato-transirojn
     * @param {*} start - komenca stato
     * @param {*} transiroj - listo transiroj [[de,al,ago,gardo],...]
     */

    constructor(start,transiroj) {
        this.transiroj = transiroj;
        this.stato = start;
    }

    /**
     * transiras al nova stato
     * @param {*} al - la nova stato
     */
    transiru(al) {
        // trovu la konvenan transiron
        for (t of this.transiroj) {
            if (t[0] == this.stato && t[1] == al) {
                const gardo = t[3];
                const ago = t[2];
                if (gardo === undefined || gardo()) { // gardo plenumita
                    ago();
                    this.stato = al;
                } else {
                    throw Error(`gardo ne plenumita por transiro ${this.stato} -> ${al}`)
                }
            }
        }
    }
}