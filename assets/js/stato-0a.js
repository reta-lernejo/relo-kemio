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
     * transiras al nova stato, se koncerna transiro estas difinita kaj la gard-kondiĉo validas
     * @param {*} al - la nova stato
     */
    transiru_al(al) {
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

    /**
     * transiras al iu nova stato, se troviĝas transiro forlasanta la nunan staton, kies gard-kondiĉo validas
     */
    transiru() {
        // trovu la konvenan transiron
        for (t of this.transiroj) {
            if (t[0] == this.stato) {
                const gardo = t[3];
                if (gardo === undefined || gardo()) { // gardo plenumita
                    const ago = t[2];
                    ago();
                    this.stato = t[1];
                    return;
                }
            }
        }
        // neniu konvena celstato troviĝis
        throw Error(`Ne troviĝas transiro el nuna stato '${this.stato}', kies gardo estas valida!`)
    }
}