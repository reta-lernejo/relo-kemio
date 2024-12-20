// grep -E "class |^\s+[a-z_]+\(.*\)\s*\{" laboratorio-0d.js
// 
// class LabSVG {
//     constructor(svg) {
//     trovu(elektilo) {
//     ŝovu(elm, x, y=0) {
//     simbol_uzo(id,x,y) {
//     difinoj() {
// class LabIlo {
//     constructor(id) {
// class LabUjo extends LabIlo {
//     constructor(id) {
// class LabGlaso extends LabUjo {
//     constructor(id, w=100, h=200) {
//     enhavo(enh,aldone) {
//     surfaco() {
//     enhavlimigo(elektilo = "path.likvo") {
// class LabProvtubo extends LabGlaso {
//     constructor(id, w=25, h=150, klino=0) {
// class LabGutbotelo extends LabUjo {
//     constructor(id,etikedo,pleno=0,klino=0) {
//     pinto() {
// class LabKonusFlakono extends LabUjo {
//     constructor(id,pleno=0,w=100,h=200) {
//     enhavo(ml) {
//     enhavalto(ml) {
//     surfaco() {
//     enfluo(ml) {
// class LabBureto  extends LabUjo {
//     constructor(id,ml=0) {
//     pinto() {
//     krano() {
//     ujo() {
//     enhavo(ml=50) {
//     elfluo(ml=1) {
//     malfermu() {
//     fermu() {
// class LabHofmanAparato  extends LabUjo {
//     constructor(id,ml=0) {
//     pinto(dekstra = false) {
//     krano(dekstra = false) {
//     ujo(dekstra = false) {        
//     enhavo(ml=0, dekstra=false) {
//     etendo(ml=1, dekstra=false) {
//     malfermu() {
//     fermu() {
// class LabFalaĵo {
//     constructor(id,cls="precipito",ero1,ero2,bordo,w=100,h=100) {
// class LabBastono extends LabIlo {
//     constructor(id,w=5,h=200,klino=4) {
// class LabSondilo extends LabIlo {
//     constructor(id,w=5,h=200,klino=4,teksto='') {
//     valoro(val) {
// class LabCiferplato extends LabIlo {
//     constructor(id,w=60,h=30,r=5,teksto='') {
//     valoro(val) {
// class LabMezurilo extends LabIlo {
//     constructor(id,max,unuo='',w=120,h=80,r=5) {
//     valoro(val) {
// class LabPHIndikilo extends LabIlo {
//     constructor(id,r,min=1,max=14) {
//     makulo(pH,nevidebla) {
// class LabDiagramo extends LabIlo {
//     constructor(id,X,Y,w=300,h=200) {
//     xy_pt(x,y) {
//     punkto(x,y,h) {
//     teksto(x,y,t) {
//     viŝu() {
// class Lab {
// class Laboratorio extends LabSVG {
//     constructor(svg,f_id,f_w,f_h) {
//     nova_loko(loko) {
//     nova_ilo(ilo) {
//     butono(teksto,x,y,w,h,r=3) {
//     klak_reago(ilo,reago) {
//     okupita(_loko) {
//     metu(ilo,loko) {
//     movu(ilo,loko_al,nova_ilo) {
//     ero_smb(id,r,cls="ero") {
//     gutoj(gutoj_id,ero_id,n,fonto,celo,fine) {
 

class LabSVG {
    
    constructor(svg) {
        this.svg = svg;
    }

    /**
     * Trovas SVG-elementon per CSS-elektilo
     */
    trovu(elektilo) {
        return this.svg.querySelector(elektilo)
    }

    /** 
     * Ŝovas elementon uzante atributon transform al nova pozicio (dx,dy)
     * KOREKTU: tiu ĉi kaj kelkaj malsupraj ne temas pri la SVGElemento, do eble metu en klason "Lab"
     * kiel "static". Aŭ eble eĉ kunigu ambaŭ klasojn...?
     */
    ŝovu(elm, x, y=0) {
        if (x || y)
            this.atr(elm, {transform: `translate(${x} ${y})`});
    }

    /**
     * desegnu simbolon id ĉe (x,y) 
     */
    /*
    simbol_uzo(id,x,y) {
        const use = this.kreu("use", {
            href: "#"+id,
            x: x,
            y: y
        });
        this.svg.append(use);
    } */   

    /**
     * redonas elementon defs (kreante ĝins se ankoraŭ mankas)
     */
    difinoj() {
        let defs = this.svg.querySelector("defs");
        if (!defs) {
            defs = Lab.e("defs");
            this.svg.prepend(defs);
        }
        return defs;
    }


    /**
     * Kunigas padon el du koordinalistoj xj kaj yj
     * Oni povas ŝovi ĉiun koordinaton je konstanta xp,yp
     * Oni povas doni la opearcion por atingi la unua koordinaton per op (L,M...)
     */
    static xy_pado(xj,yj,op='M',xp=0,yp=0) {
        if (xj.length != yj.length) throw "Nombro de koordinatoj diferencas!";
        let kun = `${op}${xj[0]+xp},${yj[0]+yp}`;
        for (let i=1; i<xj.length; i++) {
            kun += `L${xj[i]+xp},${yj[i]+yp}`
        }
        return kun;
    }

    /**
     * Speguligas la koordinatojn ĉe donita koordinato
     */
    static kspegul(kj,k0) {
        return kj.map(k => k0-(k-k0))
    }
}

class LabIlo {
    constructor(id) {
        this.id = id;
    }
}

class LabUjo extends LabIlo {
    constructor(id) {
        super(id);
    }
}


class LabGlaso extends LabUjo {

    /**
     * Kreas glason sen enhavo
     * @param id {string} unika rekonilo
     * @param w {number} larĝeco, apriore 100
     * @param h {number} alteco, apriore 300
     */
    constructor(id, w=100, h=200) {
        super(id);
        this.larĝo = w;
        this.alto = h;

        const g = Lab.e("g", { id: `_glaso_${id}`, class: "ujo glaso" });
        // komencante en la supra maldekstra angulo kontraŭ horloĝa direkto...
        const bordo = `M${-w/20},${-h} Q0,${-h} 0,${-h+5} L0,${-w/20} Q0,8 ${w/2},8 Q${w},8 ${w},-5 L${w},${-h+5} Q${w},${-h} ${w+w/20},${-h} Z`;

        const ujo = Lab.e("path",{
            d: bordo,
            class: "vitro"
        });
        /*
        const enhavo = Lab.e("rect", {
            x: 0, y: -200, width: 100, height: 200,
            class: "likvo"
        });
        */
        const ombro = Lab.e("ellipse",{
            cx: .6*w, cy: 5, rx: .6*w, ry: 8,
            class: "ombro"
        });
        g.append(ombro,ujo);
        this.g = g;
    }

    /**
     * Aldonas aŭ anstataŭas enhavon.
     * @param {object|number} enh SVG-elemento reprezentanta la enhavon aŭ nombro donante procentaĵon de pleneco 
     * @param {boolean} aldone JEs/ne forigu antaŭan enhavon
     * 
     */
    enhavo(enh,aldone) {
        //const glaso_id = `_glaso_${this.id}`;
        const enh_id = `_glaso_${this.id}_enhavo`;

        let nova_enh = enh;
        if (typeof enh === "number") {
            this.enh_alto = this.alto*enh;
            /*
            nova_enh = Lab.e("rect",{
                width: 100,
                y: -this.enh_alto,
                // rx: "50%", ry: 5,
                height: this.enh_alto,
                class: "likvo"
            });
            */

            //const bordo = `M-5,${-h} Q0,${-h} 0,${-h+5} L0,-5 Q0,0 5,1 Q${w/2},8 ${w-5},1 Q${w},0 ${w},-5 L${w},${-h+5} Q${w},${-h} ${w+5},${-h} Z`;

            const w = this.larĝo;
            const h = this.enh_alto
            nova_enh = Lab.e("path",{
                //d: `M0,${-h} L${w},${-h} L${w},-5 Q${w},0 ${w-5},1 Q${w/2},8 5,1 Q0,0 0,-5 Z`,
                d: `M0,${-h} L0,${-w/20} Q0,8 ${w/2},8 Q${w},8 ${w},${-w/20} L${w},${-h} Z`,
                class: "likvo"
            });
        };

        const c_id = `_clp_glaso_${this.id}`;

        const malnova_enh = this.g.querySelector('#'+enh_id);
        if (malnova_enh && aldone) {
            // aldnou novan al malnova enhavo
            malnova_enh.append(nova_enh);
        // kreu novan enhavon
        } else {
            if (malnova_enh) malnova_enh.remove(); // forigu evtl. malnovan enhavon
            const bordo = this.g.querySelector("path").getAttribute("d");
            const limigo = Lab.limigo(c_id, 
                Lab.e("path", {d: bordo})
            );
            const ge = Lab.e("g", {
                id: enh_id,
                "clip-path": `url(#${c_id})`
            });
    
            ge.append(nova_enh);
            const ujo = this.g.querySelector(".vitro");
            //this.g.prepend(limigo,ge);
            this.g.prepend(limigo);
            this.g.insertBefore(ge,ujo);      
        }
    }

    /** 
     * Redonas mezpunkton de surfaco kiel {id,x,y}
     */
    surfaco() {
        return {
            id: `_glaso_${this.id}_enhavo`,
            x: this.larĝo/2,
            y: -this.enh_alto
        }
    }

    /**
     * Redonas la limigon de la enhavo, kiel ĉe path.d, ekz-e por limigi falaĵon
     * @param {string} elektilo CSS-pad-elektilo por trovi la enhavon (se iel manipulita)
     */
    enhavlimigo(elektilo = "path.likvo") {
        return this.g.querySelector(elektilo).getAttribute("d");
    }
}

class LabProvtubo extends LabGlaso {
    /**
     * Kreas provtubon sen enhavo
     * @param id {string} unika rekonilo
     * @param w {number} larĝeco, apriore 100
     * @param h {number} alteco, apriore 300
     */
    constructor(id, w=25, h=150, klino=0) {
        super(id,w,h);

        // ĉe klinita tubo ni forigas la ombron 
        // kaj devas enmeti la turnitan grupon en alian
        // ni momente ne konsideras enhavon ĉe klino kiel ĉe gutbotelo!
        if (klino) {
            //const a = (klino+360)%360; // tolerante negativajn angulojn
            const g1 = Lab.e("g",{
                transform: `rotate(${klino} ${w/2} ${h})`
            });
            this.g.querySelector(".ombro").remove();
            g1.append(...this.g.children)
            this.g.append(g1)
        }
    }
}

class LabGutbotelo extends LabUjo {

    #pinto;

    /**
     * Kreas gutbotelon 
     * @param {string} etikedo
     * @param {number} pleno enhavpleneco 0..100
     * @param {number} klino angulo, je kiu la botelo estu klinita
     * 
     */    
    constructor(id,etikedo,pleno=0,klino=0) {
        super(id);
        const g = Lab.e("g", { class: "ujo gutbotelo" });

        // bordo de la vitrujo (kaj do ankaŭ limo de enhavo)
        const bordo = "M0,-100 L0,-4 Q0,0 4,0 Q20,3 36,0 Q40,0 40,-4 L40,-100 Z";
        let tf = '';
        const a = (klino+360)%360; // tolerante negativajn angulojn
        if (a == 0) {
            const ombro = Lab.e("ellipse",{
                cx: 25, rx: 25, ry: 5,
                class: "ombro"
            });
            g.append(ombro);
        } else if (a<90) {
            const tx = 40-40*pleno/100;
            tf = `rotate(${a} ${tx} ${-pleno})`;
        } else if (a<180) {
            const tx = 40-40*pleno/100;
            tf = `rotate(${a} ${tx} ${-pleno}) translate(0 ${100-2*pleno})`;
        } else if (a<270) {
            const tx = 40*pleno/100;
            tf = `rotate(${a} ${tx} ${-pleno}) translate(0 ${100-2*pleno})`;
        } else {
            const tx = 40*pleno/100;
            tf = `rotate(${a} ${tx} ${-pleno})`;
        }

        // konstruu la ujon
        const ujo = Lab.e("path",{
            d: bordo,
            class: "vitro"
        });
        // kovrilo, ni aldonas strekon por pinto, por
        // poste (post ĉiaj transformoj...) scii kie aperu gutoj
        const kovrilo = Lab.e("polyline",{
            points: "-2,-100 -2,-105 10,-108 18,-130 22,-130 30,-108 42,-105 42,-100 30,-99.5 20,-99.3 10,-99.5 -2,-100",
            class: "plasto"
        });
        const pinto = Lab.e("line",{
            id: `_gutbotelo_${id}_pinto`,
            x1: 18, x2: 22, y1: -130, y2: -130
        });
        // surskribo
        const surskribo = Lab.e("text", {
            x: 20, y: -90,
            "text-anchor": "middle",
            }
        );
        for (const t of etikedo.split(/\n/)) {
            surskribo.append(Lab.e("tspan",{
                x: 20, dy: 10
            },t))
        }
        const papero = //Lab.rkrekt(36,24,3,1,2,-90);
            Lab.e("rect", {
                width: 36,
                height: 24,
                y: -90,
                x: 2,
                rx: "50%",
                ry: 1,
                class: "etikedo"
            });
        //Lab.a(papero,{class: "etikedo"});

        g.append(ujo,pinto,kovrilo,papero,surskribo);
        if (tf) Lab.a(g,{transform: tf});

        // aldonu enhavon        
        let enhavo = '', limigo;
        if (pleno) {
            const c_id = `_clp_${id}`;
            limigo = Lab.limigo(c_id, 
                Lab.e("path",{
                    d: bordo,
                    transform: tf
                })
            );

            // likva enhavo, ĝi ne ekzakte respondas
            // al la volumeno de cilindro, aparte por
            // oblikvaj anguloj, sed proksimumo eble sufiĉas
            // aliokaze oni devus ekzakte elkalkuli la
            // altecon de la likvaĵo en la botelo depende
            // de klino, kio estus sufiĉe ambicia entrepreno :-)
            enhavo = Lab.e("path",
            {
                d: `M-110,80 L-110,${-pleno} L110,${-pleno} L110,80 Z`,
                //d: `M-10,10 L-10,${-pleno} L110,${-pleno} L110,10 Z`,
                "clip-path": `url(#${c_id})`,
                class: "likvo"
            });
        }
        //g.append(clip,cenh,ujo,kovrilo,surskribo);
        const u = Lab.e("g", {id: `_gutbotelo_${id}`}); u.append(limigo,enhavo,g);

        this.g = u;
        this.pleno = pleno;
        this.klino = a;
    }

    /**
     * Redonas la element-rekonilon (id) kaj la relativajn koordinatojn de la pinto
     */
    pinto() {
        // alternative ni povus transdoni la ujo-grupon forlasante la pinto-elementon, 
        // la ujo momente ne havas .id
        return {
            id: `_gutbotelo_${this.id}_pinto`,
            x:20,
            y:-130
        };
    }
}

class LabKonusFlakono extends LabUjo {

    /**
     * Kreas konusan flakonon (Erlenmeyer)
     * @param {string} id unika nomo
     * @param {number} ml enhavo en ml (0..150)
     * @param {number} w larĝo
     * @param {number} h alteco
     */
    constructor(id,pleno=0,w=100,h=200) {
        super(id);
        this.ml = pleno;

        this.g = Lab.e("g",{
            class: "ujo konusflakono",
            id: id
        });

        // ujo
        const kol = 20;
        const bordo = `M${w/2-kol},${-h} L${w/2-kol},${-h+2*kol} L0,-12 Q-1,5 ${w/2},5 `
            + `Q${w+1},5 ${w},-12 L${w/2+kol},${-h+2*kol} L${w/2+kol},${-h} Z`
        const ujo = Lab.e("path",{
            d: bordo,
            class: "vitro"
        });

        // skalo
        const streko = "q5,2 30,2"
        const skalo = Lab.e("path", {
            d: `M14,${-this.enhavalto(25)}q5,1 15,1 `
             + `M12,${-this.enhavalto(50)}q5,1 25,1 `
             + `M16,${-this.enhavalto(75)}q5,1 15,1 `
             + `M14.5,${-this.enhavalto(100)}q5,1 30,1`,
            fill: "none"
        }) 

        // enhavo
        if (pleno>-1) {
            const c_id = `_clp_${id}`;
            const limigo = Lab.limigo(c_id, 
                Lab.e("path",{
                    d: bordo
                })
            );

            const eh = this.enhavalto(pleno);
            const enhavo = Lab.e("rect",{        
                y: -eh, height: eh+8, width: w,
                ry: 1, rx: "50%",
                "clip-path": `url(#${c_id})`,
                class: "likvo"
            });

            this.g.append(limigo,enhavo);
        }

        this.g.append(ujo,skalo);
    }

    /**
     * Metas la enhavon al ml
     */
    enhavo(ml) {
        this.ml = 0;
        this.enfluo(ml);
    }

    /**
     * Redonas la altecon de enhavo depende de volumeno 
     * Ni provizore ne komplikas per la konusstumpa volumeno-formulo, sed uzas tre simpligitan
     */    
    enhavalto(ml) {
        return 11/15*ml;
    }

    /**
     * Redonas mezpunktion de la surfaco en relativaj koordinatoj
     */
    surfaco() {
        const enh = this.g.querySelector(".likvo");
        return ({
            id: this.id,
            x: enh.getAttribute("x")+enh.getAttribute("width")/2, 
            y: enh.getAttribute("y")
        });
    }

    /**
     * Aldonas volumenon en ml al la enhavo
     * @param {number} ml 
     */
    enfluo(ml) {
        //console.log(`flakono ${this.id}: ${this.ml} + ${ml}`);

        this.ml += ml;
        const eh = this.enhavalto(this.ml);
        const enh = this.g.querySelector(".likvo");
        Lab.a(enh,{ 
            y: -eh, height: eh+8
        });
    }
}

class LabKrano {
    constructor(reago, fermita = true) {
        // krano malfermita kaj fermita
        this.fermita = fermita;
        this.krano_fermita = `M10,-50 L30,-50 L32,-48 L40,-48 L40,-42 L32,-42 L30,-40 L10,-40 Z`;
        this.krano_malfermita = `M10,-50 L30,-50 L32,-48 L34,-48 L36,-55 L39,-55 L40,-45 `
            + `L39,-35 L36,-35 L34,-42 L32,-42 L30,-40 L10,-40 Z`;

        this.krano = Lab.e("path",{
            class: "krano",
            d: fermita? this.krano_fermita : this.krano_malfermita
        });

        if (reago) this.krano.addEventListener("click",reago);
    }

    /**
     * Malfermu kranon
     */
    malfermu() {
        Lab.a(this.krano,{
            d: this.krano_malfermita
        });
        this.fermita = false;
    }

    /**
     * Fermu kranon
     */
    fermu() {
        Lab.a(this.krano,{
            d: this.krano_fermita
        });
        this.fermita = true;
    }
}

class LabBureto  extends LabUjo {

    /**
     * Kreas bureton
     * @param {string} id unika il-nomo
     * @param {number} ml volumeno elfluita en ml, 0 estas la plej supra streko, 50 la plej malsupra, -1 malplena
     */
    constructor(id,ml=0) {
        const h=300;
        super(id);
        this.ml = ml;
        this.nulo = h-20; // y-pozicio de skalo=0 mezurite de ellaso

        // ujo    
        const bordo = //`M0,${-h} L0,-50 L40,-50 L40,${-h} Z`
                // maldekstra flanko de 8,-h al 20,0
            `M8,${-h} L8,-75 L15,-60 L15,-50 L14,-50 L14,-40 L15,-40 L15,-20 L18,-5 L18,0 L22,0`
                // dekstra flanko de 20,0 al 32,-h
            + `L22,-5 L25,-20 L25,-40 L26,-40 L26,-50 L25,-50 L25,-60 L32,-75 L32,${-h} Z`
        
        this.g = Lab.e("g",{
            id: id,
            class: "ujo bureto"
        });
        const ujo = Lab.e("path",{
            d: bordo,
            class: "vitro"
        });

        // skalo
        /*
        let strekoj = '';
        for (let i = 0; i<=50; i++) {
            const y = -h+20 + 4*i;
            const l = 20 - 5*Math.sign(i%5) - 5*Math.sign(i%10);
            strekoj += `M8,${y} l${l},0`;
        }
        const skalo = Lab.e("path",{
            d: strekoj,
            class: "skalo"
        });*/
        const skalo = Lab.skalo("bureto_ml",0,50,4,1,5,10,10);
        Lab.a(skalo, {
            transform: `translate(0,${20-h})`
        });

        // krano malfermita kaj fermita
        this.krano = new LabKrano();
        /*
        this.fermita = true;
        this.krano_fermita = `M10,-50 L30,-50 L32,-48 L40,-48 L40,-42 L32,-42 L30,-40 L10,-40 Z`;
        this.krano_malfermita = `M10,-50 L30,-50 L32,-48 L34,-48 L36,-55 L39,-55 L40,-45 `
            + `L39,-35 L36,-35 L34,-42 L32,-42 L30,-40 L10,-40 Z`;

        const krano = Lab.e("path",{
            class: "krano",
            d: this.krano_fermita
        });
        */

        // enhavo
        if (ml>=0) {           
            const c_id = `_clp_${id}`;
            const limigo = Lab.limigo(c_id, 
                Lab.e("path",{
                    d: bordo
                })
            );

            // likva enhavo, ĝi ne ekzakte respondas
            // al la volumeno de cilindro, aparte por
            // oblikvaj anguloj, sed proksimumo eble sufiĉas
            // aliokaze oni devus ekzakte elkalkuli la
            // altecon de la likvaĵo en la botelo depende
            // de klino, kio estus sufiĉe ambicia entrepreno :-)
            const enhavo = Lab.e("rect",
            {
                x: 8,
                y: -this.nulo + 4*ml,
                width: 24,
                height: this.nulo -4*ml, // 0-streko - elfluitaj ml
                class: "likvo",
                "clip-path": `url(#${c_id})`,
            });
            this.g.append(limigo,enhavo);
        }

        this.g.append(krano.krano,ujo,skalo);
    }

    /**
     * Redonas la element-rekonilon (id) kaj la relativajn koordinatojn de la pinto
     */
    pinto() {
        // alternative ni povus transdoni la ujo-grupon forlasante la pinto-elementon, 
        // la ujo momente ne havas .id
        return {
            id: this.id,
            x:20,
            y:0
        };
    }

    /**
     * Redonas la kranon kiel SVGElement
     */
    krano() {
        return this.krano.krano;
    }

    /**
     * Redonas la ujon kiel SVGElement
     */
    ujo() {
        return this.g.querySelector(".vitro");
    }

    /**
     * Metas/remetas la enhavon al ml, 50ml = 0-linio
     */
    enhavo(ml=50) {
        if (ml<50) throw "Programeraro, enhavmeto alia ol 50ml ne jam realigita!"
        // metu al 0-linio (50ml)
        this.ml = -1;
        this.elfluo(1);
    }

    /**
     * Reduktas la enhavon
     * @param {number} ml tiom da ml la enhavo reduktiĝas
     */
    elfluo(ml=1) {
        if (this.ml<60) {
            //console.log(`bureto ${this.id}: ${this.ml} - ${ml}`);
            this.ml += ml; // sume elfluinta volumeno en ml

            const enh = this.g.querySelector(".likvo");
            Lab.a(enh, {
                y: -this.nulo + 4*this.ml,
                height: this.nulo -4*this.ml
            });
        }
    }

    /**
     * Malfermu kranon
     */
    malfermu() {
        this.krano.malfermu();
    }

    /**
     * Fermu kranon
     */
    fermu() {
        this.krano.fermu();
    }

    fermita() {
        return this.krano.fermita;
    }
}

class LabHofmanAparato  extends LabUjo {
    static tubdistanco = 100;

    /**
     * Kreas bureton
     * @param {string} id unika il-nomo
     */
    constructor(id,kranreago_O2,kranreago_H2) {
        const h = 300;
        super(id);
        this.ml_H2 = 0;
        this.ml_O2 = 0;
        this.nulo = h+30; // y-pozicio de maksimuma pleniĝo de dekstra/maldekstra tubo (skala 0 estas ĉe h)
        this.rnulo = h+90; // y-pozicio de maksimua pleniĝo de la meza rezervujo

        // ujo el du tuboj kaj interligo
        // x-koordinatoj komencantaj ĉe la interligo de la maldekstra tubo   
        const xj = [
            // de la ligtubo ĝis la pinto
            32,32,25,25, // tubo ĝis la krano
            26,26,25,25,22,22, // de la krano ĝis la pinto
            // de la pinto ĝis la malsupra globo
            18,18,15,15,14,14, // de la pinto ĝis la krano (maldekstre)
            15,15,8,8, // de la krano ĝis la globo
            0,8,8, // ĝis la interpeco ĉe la elektrodo
            // de la malsupro reen ĝis la ligtubo
            32,32,40,32,32
        ];
        const yj = [
            // de la ligtubo ĝis la pinto
            -80,-h,-h-15,-h-25, // tubo ĝis krano
            -h-25,-h-35,-h-35,-h-55,-h-70,-h-75, // krano ĝis pinto
            -h-75,-h-70,-h-55,-h-35,-h-35,-h-25, // de pinto ĝis krano (maldekstre)
            -h-25,-h-15, -h, -50, // de la krano ĝis la globo
            -30,-10, 0, //B ĝis la interpeco ĉe la elektrodo
            0,-10,-30,-50,-60 // ĝis la ligtubo
        ];

        // const bordo = (LabSVG.xy_pado(xj,yj)
        //     + `L${xj[0]+LabHofmanAparato.tubdistanco},${yj[yj.length-1]}`
        //     + LabSVG.xy_pado(LabSVG.kspegul(xj.reverse(),LabHofmanAparato.tubdistanco),yj.reverse(),"L")                
        //     + 'Z')
        //     // iom artifika enŝovo de la globkurbo
        //     .replace('L0,-30L8,-10','Q0,-30 8,-10') 
        //     .replace('L40,-30L32,-50L32','Q40,-30 32,-50L32') 
        //     .replace('L120,-30L128,-10','Q120,-30 128,-10')
        //     .replace('L160,-30L152,-50','Q160,-30 152,-50');
        const bordo_1 = (LabSVG.xy_pado(xj,yj)+'Q35,-70 32,-80Z')
            // iom artifika enŝovo de globkurboj
            .replace('L0,-30L8,-10','Q3,-30 8,-10') 
            .replace('L40,-30L32,-50L32','Q37,-30 32,-50L32'); 

        const bordo_2 = (LabSVG.xy_pado(LabSVG.kspegul(xj.reverse(),20),yj.reverse())+'Q12,-70 8,-60Z')
            // iom artifika enŝovo de globkurboj
            .replace('L0,-30L8,-10','Q3,-30 8,-10') 
            .replace('L40,-30L32,-50L32','Q37,-30 32,-50L32'); 

        const bordo_rezervujo = 
            `M10,${-h-90}L12,${-h-70}Q-6,${-h-70} -6,${-h-65}L-6,${-h-5}Q-6,${-h} 10,${-h}L10,-80`
          + `Q20,-74 30,-80L30,${-h}Q46,${-h} 46,${-h-5}L46,${-h-65}Q46,${-h-70} 28,${-h-70}L30,${-h-90}Z`;

        // helpfunkcio por krei enhavon dekstre/maldekstre
        this.enh = function(ujo="1",ml=0) {
            const c_id = `_clp${ujo}_${id}`;
            const bordo = ujo=="1"? bordo_1: bordo_2;

            // kreu limigon por la enhavo
            const le = Lab.e("path",{
                d: bordo
            });
            if (ujo=="2") {
                Lab.a(le, {
                    transform: `translate(${LabHofmanAparato.tubdistanco+22},0)`
                });
            }
            const limigo = Lab.limigo(c_id, le);

            // likva enhavo, ĝi ne ekzakte respondas
            // al la volumeno de cilindro, aparte por
            // oblikvaj anguloj, sed proksimumo eble sufiĉas
            // aliokaze oni devus ekzakte elkalkuli 
            const enh_id = `enhavo_${ujo}_hofman`;
            const x =  ujo=="1"? 8 : LabHofmanAparato.tubdistanco+30;

            const ge = Lab.e("g", {
                id: enh_id,
                "clip-path": `url(#${c_id})`
            });
            const enhavo = Lab.e("rect",
            {
                x: x,
                y: -this.nulo + 4*ml,
                width: 24,
                height: this.nulo -4*ml, // gasa enhavo en ml sub la krano
                class: `likvo likvo_${ujo}`
            });
            ge.append(enhavo);
            this.g.append(limigo,ge);
        }.bind(this);

        // la ĉefa grupo de la aparato
        this.g = Lab.e("g",{
            id: id,
            class: "ujo hofmanaparato"
        });
        // maldekstra kaj dekstra ujoj
        const ujo_1 = Lab.e("path",{
            d: bordo_1,
            class: "vitro ujo_1"
        });
        const ujo_2 = Lab.e("path",{
            d: bordo_2,
            class: "vitro ujo_2",
            transform: `translate(${LabHofmanAparato.tubdistanco+22},0)`
        });
        // horizontala ligtubo
        const lt2 = LabHofmanAparato.tubdistanco/2;
        const ligtubo = Lab.e("path",{
            d: `M30,-60q-5,-10 0,-20l${lt2-10},0q10,5 20,0l${lt2-10},0q5,10 0,20Z`,
            class: "ligtubo",
        });
        // meza rezevujo
        const rezervujo = Lab.e("path",{
            d: bordo_rezervujo,
            class: "vitro",
            transform: `translate(${lt2+11},0)`
        })

        // skalo
        /*
        let strekoj = '';
        for (let i = 0; i<=50; i++) {
            const y = -h+20 + 4*i;
            const l = 20 - 5*Math.sign(i%5) - 5*Math.sign(i%10);
            strekoj += `M8,${y} l${l},0`;
        }
        const skalo = Lab.e("path",{
            d: strekoj,
            class: "skalo"
        });*/
        const skalo_1 = Lab.skalo("haparato_ml",0,50,4,1,5,10,10);
        const skalo_2 = Lab.skalo("haparato_ml",0,50,4,1,5,10,10);
        Lab.a(skalo_1, {
            transform: `translate(0,${-h})`
        });
        // ŝovu la duan skalon je larĝeco (40) + tubdistanco
        Lab.a(skalo_2, {
            transform: `translate(${LabHofmanAparato.tubdistanco+22},${-h})`
        });

        /*
        // krano malfermita kaj fermita

        this.fermita = true;
        this.krano_fermita = `M10,-50 L30,-50 L32,-48 L40,-48 L40,-42 L32,-42 L30,-40 L10,-40 Z`;
        this.krano_malfermita = `M10,-50 L30,-50 L32,-48 L34,-48 L36,-55 L39,-55 L40,-45 `
            + `L39,-35 L36,-35 L34,-42 L32,-42 L30,-40 L10,-40 Z`;
*/

        this.krano_1 = new LabKrano(kranreago_O2);
        Lab.a(this.krano_1.krano, {
            transform: `translate(0,${15-h})`
        });
        /*
        Lab.e("path",{
            class: "krano krano_1",
            d: this.krano_fermita,
            transform: `translate(0,${15-h})`
        });
        */
        this.krano_2 = new LabKrano(kranreago_H2);
        Lab.a(this.krano_2.krano, {
            transform: `translate(${LabHofmanAparato.tubdistanco+22},${15-h})`
        });     
        /*
        Lab.e("path",{
            class: "krano krano_2",
            d: this.krano_fermita,
            transform: `translate(${LabHofmanAparato.tubdistanco+22},${15-h})`
        });
        */

        // elektrodoj
        const ebordo = `M0,0L10,0L10,40L0,40Z`;
        const elektrodo_plus = Lab.e("path",{
            class: "elektrodo",
            d: ebordo,
            transform: `translate(15,-40)`
        });
        const elektrodo_minus = Lab.e("path",{
            class: "elektrodo",
            d: ebordo,
            transform: `translate(${LabHofmanAparato.tubdistanco+37},-40)`
        });
        // fiksiloj de elektrodoj
        const fbordo = `M5,0L35,0L35,20L5,20Z`;
        const fiksilo_plus = Lab.e("path",{
            class: "fiksilo_plus",
            d: fbordo
            //transform: `translate(0,-20)`
        });
        const fiksilo_minus = Lab.e("path",{
            class: "fiksilo_minus",
            d: fbordo,
            transform: `translate(${LabHofmanAparato.tubdistanco+22},0)`
        });

        // enhavo
        this.enh("1",this.ml_O2);
        this.enh("2",this.ml_H2);

        // enhavo de horizontala ligtubo
        const enhavo_l = Lab.e("rect",
        {
            x: 32,
            y: -80,
            width: LabHofmanAparato.tubdistanco,
            height: 20, // 0-streko - gasa enhavo en ml
            class: "likvo likvo_l"
        });              
    
        // enhavo de meza rezervujo
        const c_id_r = `_clpr_${id}`;
        const limigo_r = Lab.limigo(c_id_r, 
            Lab.e("path",{
                d: bordo_rezervujo,
                transform: `translate(${lt2+11},0)`
            })
        );
        const enhavo_r = Lab.e("rect",
        {
            id: "enhavo_r_hofman",
            x: lt2+5,
            y: -this.rnulo + 10, //4*ml,
            width: 52,
            height: this.rnulo, //-75-4*ml, // 0-streko - gasa enhavo en ml
            class: "likvo likvo_r",
            "clip-path": `url(#${c_id_r})`,
        });              
        this.g.append(limigo_r,enhavo_r,enhavo_l);

        this.g.append(this.krano_1.krano,this.krano_2.krano,elektrodo_plus,elektrodo_minus,
            ujo_1,ujo_2,ligtubo,rezervujo,skalo_1,skalo_2,
            fiksilo_plus,fiksilo_minus);
    }

    /**
     * Redonas la element-rekonilon (id) kaj la relativajn koordinatojn de la pinto
     */
    pinto(dekstra = false) {
        // alternative ni povus transdoni la ujo-grupon forlasante la pinto-elementon, 
        // la ujo momente ne havas .id
        return {
            id: this.id,
            x: 20 + (dekstra? LabHofmanAparato.tubdistanco+22 : 0),
            y: -h-75
        };
    }

    /**
     * Redonas kranon kiel SVGElement
     */
    krano(dekstra = false) {
        if (!dekstra)
            return this.krano_1.krano;
        else
            return this.krano_2.krano;
    }

    /**
     * Redonas la maldekstran aŭ dekstran ujon kiel SVGElement
     */
    ujo(dekstra = false) {        
        if (!dekstra)
            return this.g.querySelector(".ujo_1");
        else
            return this.g.querySelector(".ujo_2");
    }

    /**
     * Metas/remetas la gasenhavon al (0) ml
     * @param {string} ujo - 1 = maldekstra, 2 = dekstra, r = meza ujo
     */
    enhavo(ml=0, ujo="1") {
        if (ml<0) {
            console.error("Programeraro, enhavmeto sub 0 ml ne permesita!");
            // metu al 0-linio (50ml)
            /*
            this.ml = -1;
            this.etendo(1);
            */
            return;
        }

        if (ujo == "1")
            this.ml_O2 = ml;
        else
            this.ml_H2 = ml;
        
        const h = (ujo == "r"? this.rnulo : this.nulo) - 4*ml;
        const enh = this.g.querySelector(`#enhavo_${ujo}_hofman`);
        Lab.a(enh, {
            height: h,
            y: -h
        });
    }

    /**
     * Aldonas vezikojn al la enhavo de unu el la du tuboj
     * @param {*} vezikoj vezikoj (Lab.falaĵo)
     * @param {*} ujo  1 = maldekstra, 2 = dekstra ujo
     */
    vezikoj(vezikoj, ujo="1") {
        const enh = this.g.querySelector(`#enhavo_${ujo}_hofman`);
        const x =  ujo=="1"? 8 : LabHofmanAparato.tubdistanco+30;
        Lab.a(vezikoj,{
            transform: `translate(${x},0)`
        });
        const malnov = ĝi(vezikoj.id);
        if (malnov) malnov.remove();
        enh.append(vezikoj);
    }

    /**
     * Redonas la limigon de la enhavo, kiel ĉe path.d, ekz-e por limigi falaĵon
     * @param {string} ujo - 1 = maldekstra, 2 = dekstra, r = meza ujo
     */
    enhavlimigo(ujo="1") {
        const elektilo = `#_clp${ujo}_hofman path`;
        const clp = this.g.querySelector(elektilo);
        if (clp) return clp.getAttribute("d");
    }    

    /**
     * Etendas la gasan enhavon supre de la tuboj
     * @param {number} ml tiom da ml la gasa enhavo estiĝas
     */
    gasiĝo(ml=1) {
        if (this.krano_1.fermita) {
            this.ml_O2 += 1/3*ml;

            // adaptu la enhavon
            const enh1 = this.g.querySelector("#enhavo_1_hofman rect");
            const h1 = this.nulo - 4*this.ml_O2;
            Lab.a(enh1, {
                height: h1,
                y: -h1
            });
            //console.debug("O2: "+this.ml_O2+" h1: "+h1);
            // ŝanĝu ankaŭ la altecon de la vezikanimacio
            // ĉe problemoj kun animacio
            // eble vd. https://stackoverflow.com/questions/6507009/dynamically-change-svg-animation-values-while-using-fill-freeze)
            for (const am of ĉiuj("#vezikoj_O2 animateMotion")) {
                const p = am.parentElement;
                const py = parseInt(p.getAttribute("y"));
                Lab.a(am,{        
                    path: `M0,0 L0,${-h1-py}`
                });
                //am.beginElement();
            }
        }
        if (this.krano_2.fermita) {
            this.ml_H2 += 2/3*ml;

            // adaptu la enhavon
            const enh2 = this.g.querySelector("#enhavo_2_hofman rect");
            const h2 = this.nulo - 4*this.ml_H2;
            Lab.a(enh2, {
                height: h2,
                y: -h2
            });
            //console.debug("H2: "+this.ml_H2+" h2: "+h2);

            for (const am of ĉiuj("#vezikoj_H2 animateMotion")) {
                const p = am.parentElement;
                const py = parseInt(p.getAttribute("y"));
                Lab.a(am,{        
                    path: `M0,0 L0,${-h2-py}`
                });
                //am.beginElement();
            }
        }
    }

    ellaso(ujo="1",ml) {
        const enh = this.g.querySelector(`#enhavo_${ujo}_hofman rect`);
        const rez = this.g.querySelector("#enhavo_r_hofman");

        const y = parseFloat(enh.getAttribute("y"));
        const h = parseFloat(enh.getAttribute("height"));
        const ah = Lab.e("animate",{
            attributeName: "height",
            from: h,
            to: h - ml*4,
            dur: "3s",
            repeatCount: "1",
            fill: "freeze"
        });
        const ay = Lab.e("animate",{
            attributeName: "y",
            from: y,
            to: y - ml*4,
            dur: "3s",
            repeatCount: "1",
            fill: "freeze"
        });
          
        const ry = parseFloat(rez.getAttribute("y"));
        const rh = parseFloat(rez.getAttribute("height"));
        const arh = Lab.e("animate",{
            attributeName: "height",
            from: rh,
            to: rh - ml,
            dur: "3s",
            repeatCount: "1",
            fill: "freeze"
        });
        const ary = Lab.e("animate",{
            attributeName: "y",
            from: ry,
            to: ry + ml,
            dur: "3s",
            repeatCount: "1",
            fill: "freeze"
        });  

        Lab.ido(enh,ah,`redukto_${ujo}_h`);
        Lab.ido(enh,ay,`redukto_${ujo}_y`);
        Lab.ido(rez,arh,"altigho_h");
        Lab.ido(rez,ary,"altigho_y");
        ah.beginElement();
        ay.beginElement();
        arh.beginElement();
        ary.beginElement();
    }

    /**
     * Malfermu kranon
     */
    malfermu(ujo="1") {
        if (ujo == "1") {
            this.krano_1.malfermu();
        } else {
            this.krano_2.malfermu();
        }
    }

    /**
     * Fermu kranon
     */
    fermu() {
        if (ujo == "1") {
            this.krano_1.fermu();
        } else {
            this.krano_2.fermu();
        }
    }
}

class LabFalaĵo {
    /**
     * Kreas falaĵon (gutoj, precipito ks). Erojn de falaĵo transdonu kiel objekto 
     * {id: referencilo, n: nombro, daŭro: mezdaŭro, aperdaŭro, x0, supro: komenca supro, alto: komenca alteco, 
     * faldistanco, falaĵalto, fine, klasoj, videblo, poste: finreago},
     *   x0: komenca x-koordinato (ekz-e por gutoj)
     *   alto: alteco de distribuo mezurite de la supro
     *   faldistanco: faldistanco, se ne donita ĝisgrunde
     *   falaĵalto: vario/alteco de falaĵo surgrunde
     *   fine: fina stato (freeze|remove)
     * Por precipito donu pezajn malgrandajn erojn unue, due la pli grandajn nubecajn!
     * La referencilo devas montri al antaŭe difinita objekto, kreita ekz-e
     * per lab.difinoj().append(Lab.e("circle",...
     * aŭ per ero_smb()
     * @param {string} id unika rekonilo referencanta eron en <defs>
     * @param {string} cls klasnomo de falaĵo, ekz-e por doni koloron, travideblecon ks
     * @param {string} ero1 ero speco unu
     * @param {string} ero2 ero speco du
     * @param {string} bordo pado por limigo (alternative al rektangulo w x h)
     * @param {number} w larĝeco, apriore 100
     * @param {number} h alteco, apriore 100
     */
    constructor(id,cls="precipito",ero1,ero2,bordo,w=100,h=100) {
        const c_id = `_clp_${id}`;

        const e = Lab.e("g", {
            id: id
        });
        const g = Lab.e("g",{
            class: cls
        });

        // limigu enhavon se estas donita aŭ bordo aŭ w+h
        let lim;
        if (bordo) {
            lim = Lab.limigo(c_id, Lab.e("path", {d: bordo}))
        } else if (w&&h) {
            lim = Lab.limigo(c_id, Lab.e("rect",{y: -h, width: w, height: h}));
        }
        if (lim) {
            Lab.a(g,{
                "clip-path": `url(#${c_id})`
            });    
            e.append(lim);    
        }

        function eroj(e_) {   
            for (let e=0; e<e_.n; e++) {
                const y = -(e_.supro - Math.random()*e_.alto);
                const x = (e_.x0||0) + e/e_.n*w + Math.random()*w/ero1.n;
                const videbl = !("v" in e_)? 1.0 : e_.videblo; // videbla, se ne alie difinita
                const u = Lab.e("use",{
                    href: `#${e_.id}`,
                    x: x, y: y,
                    "fill-opacity": videbl,
                    class: e_.klasoj
                });
                if (e_.falaĵalto || e_.faldistanco) {
                    const f_alto = (!("faldistanco" in e_)? -y : e_.faldistanco) - (Math.random()*e_.falaĵalto||0);
                    // kreu falanimacion
                    const daŭro = e_.daŭro || 0.1;
                    const aperdaŭro = e_.aperdaŭro || 0.1;

                    const f = Lab.falo(f_alto,0,0,
                        daŭro/2 + Math.random()*daŭro, 1,
                        //fina stato
                        e_.fine, e_.poste);
                    const a = Lab.apero(aperdaŭro);
                    u.append(a,f); // aldonu animaciojn de apero kaj falo 
                }
                // arbitre aldonu komence aŭ fine por eviti
                // ordon de maldekstre dekstren
                Math.random()<0.5? g.prepend(u) : g.append(u);
            }      
        }

        // pli bone ne aŭtomate aldonu likvaĵon, sed
        // kreu aparte laŭbezone! NEcesas anstatŭe transdoni
        // objekton por likvo aŭ g, al kiu aldoni...
        //if (w&&h) g.append(Lab.likvo("likvo",w,h));
        eroj(ero1);
        if (ero2) eroj(ero2);

        e.append(g);
        this.g = e;
    }
}

class LabBastono extends LabIlo {

    /**
     * Kreas vitran bastonon
     * @param {string} id identigilo (nomo) de la bastono
     * @param {number} w larĝo
     * @param {number} h alto
     * @param {number} klino klinangulo
     */
    constructor(id,w=5,h=200,klino=4) {
        super(id);
        this.g = Lab.e("g", {
            id: id,
            class: "vitro"});
            
        const r = Lab.e("rect",{
            width: w,
            height: h,
            y: -h,
            rx: w/2
        });
        if (klino) {
            Lab.a(r,{
                transform: `rotate(${klino})`
            });
        };
        this.g.append(r);
    }
}

class LabKeno extends LabIlo {
    // ardo: https://stackoverflow.com/questions/54112231/is-it-possible-to-create-a-glow-effect-in-svg
    // https://vanseodesign.com/web-design/svg-filter-element/
    // ?? https://stackoverflow.com/questions/71681854/svg-filters-outside-of-a-bounding-box-clip-path-shape
    // ligno: https://www.youtube.com/watch?v=ta27MvP1AE8

    /**
     * Kreas lignostangeton kun ardo - por testo je oksigeno
     * @param {string} id identigilo (nomo) de la keno
     * @param {number} w larĝo
     * @param {number} h alto
     * @param {number} klino klinangulo
     */
    constructor(id,w=4,h=200,klino=4) {
        super(id);
        this.g = Lab.e("g", {
            id: id
        });
            
        // ena grupo
        const g1 = Lab.e("g",{});

        // bastono 
        const b = Lab.e("rect",{
            y: -h,
            width: w,
            height: h,
            fill: "url(#ligno)"
        });

        // arda pinto
        const e1 = Lab.e("ellipse",{
            cx: 5/8*w,
            cy: -h,
            rx: 1/2*w,
            ry: 7/4*w,
            fill: "black",
            filter: "url(#svago)"
        });
        const e2 = Lab.e("ellipse",{
            cx: 19/40*w,
            cy: -h,
            rx: 18/40*w,
            ry: 1*w,
            fill: "red",
            filter: "url(#svago)"
        });
        const e3 = Lab.e("ellipse",{
            cx: 1/2*w,
            cy: -h+1,
            rx: 17/40*w,
            ry: 7/8*w,
            fill: "#ffffcf",
            filter: "url(#svago)"
        });

        // ardbrilo
        const a = Lab.e("ellipse",{
            cx: 1/2*w,
            cy: -h+5,
            rx: 10,
            ry: 12,
            fill: "rgba(255,190,3,33%)",
            filter: "url(#ardo)"
        });

        const a1 = Lab.e("animate",{
            id: "kresko",
            //attributeType: "XML",
            attributeName: "ry",
            from: "12",
            to: "20",
            dur: "1s",
            begin: "0s; malkresko.end",
            fill: "freeze",
        });

        const a2 = Lab.e("animate",{
            id: "malkresko",
            //attributeType: "XML",
            attributeName: "ry",
            from: "20",
            to: "12",
            dur: "2s",
            begin: "kresko.end",
            fill: "freeze",
        });  
        
        // kunigu ĉiujn elementojn
        a.append(a1,a2);
        g1.append(b,e1,e2,e3,a);

        // aldonu klinon
        if (klino) {
            Lab.a(g1,{
                transform: `rotate(${klino})`
            });
        };
        this.g.append(g1);
    }
}

class LabKandelo extends LabIlo {
    // por kandelo... (poste)
    // flamo: https://stackoverflow.com/questions/34022783/understanding-how-a-candle-flame-is-created-in-a-simple-svg

    /**
     * Kreas lignostangeton kun ardo - por testo je oksigeno
     * @param {string} id identigilo (nomo) de la keno
     * @param {number} w larĝo
     * @param {number} h alto
     */
    constructor(id,w=14,h=100) {
        super(id);
        this.g = Lab.e("g", {
            id: id
        });
            
        // ena grupo
        const g1 = Lab.e("g",{});

        // vakso 
        const v = Lab.e("rect",{
            y: -h,
            width: w,
            height: h,
            fill: "url(#vakso)"
        });
  
        // meĉo 
        const m = Lab.e("path", {
            d: `M${w/2},${-h} Q${w/2},${-h-7} ${w/2-2},${-h-5}`,
            "stroke-width": 1.2,
            stroke: "black",
            fill: "none"
        });

        // flamo 
        const p1 = `M${w/2-3},${-h-2} Q${w/2-3},${-h-22} ${w/2},${-h-25} Q${w/2+5},${-h-22} ${w/2+3},${-h-2}`;
        const p2 = `M${w/2-3},${-h-2} Q${w/2-2},${-h-20} ${w/2+2},${-h-23} Q${w/2+8},${-h-20} ${w/2+3},${-h-2}`;
        const f = Lab.e("path", {
            d: p1,
            fill: "url(#flamo)",
            filter: "url(#svago2)"
        });
        const fa1 = Lab.e("animate", {
            id: "blovo",
            attributeName: "d",
            from: p1,
            to: p2,
            dur: "1s",
            begin: "0s; ree.end",
            fill: "freeze"
        });
        const fa2 = Lab.e("animate", {
            id: "ree",
            attributeName: "d",
            from: p2,
            to: p1,
            dur: "12s",
            begin: "blovo.end",
            fill: "freeze"
        });
        f.append(fa1,fa2);
  
        // brilo 
        const b = Lab.e("ellipse",{
            cx: w/2+2,
            cy: -h-15,
            rx: 10,
            ry: 35,
            fill: "rgba(255,229,103,33%)",
            filter: "url(#ardo)"
        });
        const ba1 = Lab.e("animate", {
            id: "kresko",
            attributeName: "ry",
            from: "12",
            to: "18",
            dur: "1s",
            begin: "0s; malkresko.end",
            fill: "freeze"
        });
        const ba2 = Lab.e("animate", {
            id: "malkresko",
            attributeName: "ry",
            from: "18",
            to: "12",
            dur: "2s",
            begin: "kresko.end",
            fill: "freeze"
        });
        b.append(ba1,ba2);

        // kunigu ĉion
        g1.append(v,m,f,b);

        this.g.append(g1);
    }
}


class LabSondilo extends LabIlo {

    /**
     * Kreas bastonon kun pinto por mezuri ion (temperaturo, pH...)
     * @param {string} id identigilo (nomo) de la bastono
     * @param {number} w larĝo
     * @param {number} h alto
     * @param {number} klino klinangulo
     */
    constructor(id,w=5,h=200,klino=4,teksto='') {
        super(id);
        this.g = Lab.e("g", {
            id: id,
            class: "sondilo"});

        const g1 = Lab.e("g");
          
        // mezurbastono
        const r = Lab.e("rect",{
            class: "bastono",
            width: w,
            height: h,
            y: -h,
            rx: w/2
        });

        // monitoreto
        this.ciferplato = new LabCiferplato("ciferplato");
        Lab.a(this.ciferplato,{transform: `translate(-57 ${-h+5})`})
        /*
        const mon = Lab.e("g",{
            transform: `translate(-57 ${-h+5})`,
            class: "monitoro"
        });
        const kadro = Lab.e("rect",{
            width: 60, height: 30,
            rx: 5
        });
        const tx = Lab.e("text",{
            x: 5, y: 15,
            class: "valoro"
        },teksto);
        mon.append(kadro,tx);
        */

        g1.append(r,this.ciferplato);
        if (klino) {
            Lab.a(g1,{
                transform: `rotate(${klino})`
            });
        };
        this.g.append(g1);
    }

    /**
     * Aktualigas la montritan valoron en la monitoro
     */
    valoro(val) {
        this.ciferplato.valoro(val);
        /*
        const tx = this.g.querySelector("text");
        tx.textContent = val;
        */
    }
}

class LabCiferplato extends LabIlo {

    /**
     * Kreas simplan ciferplaton
     * @param {*} id 
     * @param {*} w larĝo
     * @param {*} h alto
     * @param {*} r rando (angulrondo)
     * @param {*} teksto 
     */
    constructor(id,w=60,h=30,r=5,teksto='') {
        super(id);
        const cplato = Lab.e("g",{
            id: `_plato_${id}`,
            class: "ciferplato"
        });
        const kadro = Lab.e("rect",{
            width: w, height: h,
            rx: r
        });
        const tx = Lab.e("text",{
            x: w/12, y: h/2,
            class: "valoro"
        },teksto);
        cplato.append(kadro,tx);
        this.g = cplato;
    }

    /**
     * Aktualigas la montritan valoron en la monitoro
     */
    valoro(val) {
        const tx = this.g.querySelector("text");
        tx.textContent = val;
    }
}

class LabMezurilo extends LabIlo {

    /**
     * Kreas mezurilon kun ronda skalo
     * kaj montrilo
     * @param {*} id 
     * @param {number} max - maksimuma valoro de la skalo
     * @param {string} unuo - fizika unuo (V, W k.s.)
     * @param {*} w larĝo
     * @param {*} h alto
     * @param {*} r rando
     */
    constructor(id,max,unuo='',w=120,h=80,r=5) {
        super(id);

        const rmin = h/2;
        const lstrek = w/16;

        this.val = 0;
        this.max = max;
        this.O = [w/2,rmin+lstrek+20];

        const cplato = Lab.e("g",{
            id: `_plato_${id}`,
            class: "ciferplato"
        });
        const kadro = Lab.e("rect",{
            width: w, height: h,
            rx: r
        });
        const skalo = Lab.rskalo(id+"_skalo",0,max,4,1,5,10,lstrek,rmin); //30*4° = 120°
        Lab.a(skalo,{
            transform: `translate(${this.O[0]} ${this.O[1]}) rotate(${-150})`
        });
        cplato.append(kadro,skalo);
        // nombroj ĉe la skalo
        for (let t=0; t<=max/10; t++) {
            const vt = Lab.e("text",{
                x: this.O[0], y:12,
                transform: `rotate(${-60+t*10*120/max} ${this.O[0]} ${this.O[1]})`,
                class: "nombro"
            },""+t*10);
            cplato.append(vt);
        }
        const tx = Lab.e("text",{
            x: w/2, y: h*2/3,
            class: "unuo"
        },unuo);
        const montrilo = Lab.e("path",{
            d: `M${this.O[0]},${this.O[1]}l0,${-rmin-lstrek/2}`,
            transform: `rotate(-60 ${this.O[0]} ${this.O[1]})`,
            //transform: `rotate(-30 ${O[0]} ${O[1]})`,
            class: "montrilo"
        });
        const ŝaltilo = Lab.butono('⏻',w-24,h-24,20,20,8);
        Lab.a(ŝaltilo,{class: "ŝaltilo butono"});
        const klemo1 = Lab.e("path",{
            d: `M${w},${h/4}l4,0l0,5l-4,0z`,
            class: "klemo klemo_1"
        });
        const klemo2 = Lab.e("path",{
            d: `M${w},${h*3/4}l4,0l0,5l-4,0z`,
            class: "klemo klemo_2"
        });
        cplato.append(tx,montrilo,ŝaltilo,klemo1,klemo2);
        this.g = cplato;
    }

    /**
     * Aktualigas la montritan valoron en la monitoro
     */
    valoro(val) {
        const montrilo = this.g.querySelector(".montrilo");
        const a0 = -60+this.val*120/this.max
        // ... kalkulu novan angulon laŭ valoro kaj rotaciu la montrilon akorde      
        const a1 = -60+val*120/this.max
        this.val = val;
        const tf = Lab.e("animateTransform", {
            attributeName: "transform",
            attributeType: "XML",
            type: "rotate",
            //from: `${a0} 60 70`,
            //to: `${a1} 60 70`,
            dur: "4s",
            values: `${a0} 60 70;${a1+2} 60 70;${a1} 60 70`,
            //keyTimes: "0;0.75;1",
            calcMode: "paced",
            repeatCount: 1,
            fill: "freeze"  
        });
        const at = montrilo.querySelector("animateTransform");
        // forigu malnovan animacion
        if (at) {
            Lab.a(montrilo, {
                transform: `rotate(${a0} ${this.O[0]} ${this.O[1]})`,
            })
            at.remove();    
        };
        montrilo.append(tf);
        tf.beginElement();
    }
}


class LabPHIndikilo extends LabIlo {
    /** 
     * Kreas indikilon pri pH-valoro ks 
     * @param {string} id identigilo (nomo) de la indikilo
     * @param {number} r radiuso de la ronda indikilo
     * @param {number} min minimuma malgranda pH-valoro 
     * @param {number} max maksimuma malgranda pH-valoro 
     */
    constructor(id,r,min=1,max=14) {
        super(id);
        this.g = Lab.e("g", {id: id, class: "indikilo"});
        const c = Lab.e("circle",{r: r});

        const angulo = 360/(max-min+1);
        const r2 = r/2;
        const alpha = angulo/180 * Math.PI; // angulo de sektoro
        const phi = (angulo-90)/180 * Math.PI; // desktrea angulo de unua sektoro, 
                                            // -90°, ĉar 0° ĉe ni estu supre kaj ne dekstre!
        const x1 = r * Math.cos(phi);
        const y1 = r * Math.sin(phi);
        const x2 = r2 * Math.cos(phi);
        const y2 = r2 * Math.sin(phi);
        const td = r2 + (r-r2)/2;

        function sektoro(val,n) {
            const h = LabPHIndikilo.pH_koloro(val);
            return Lab.e("path", {
                d: `M0,${-r} A${r} ${r} 0 0 1 ${x1} ${y1} L${x2},${y2} A${r2} ${r2} 0 0 0 0 ${-r2} Z`,
                //style: `fill: ${v.koloro}`,
                fill: `hsl(${h} 70% 50%)`,
                transform: `rotate(${n*angulo})`
            });
        }

        function teksto(val,n) {
            return Lab.e("text", {
                x: td * Math.cos(phi - alpha/2 + n*alpha),
                y: td * Math.sin(phi - alpha/2 + n*alpha)
            }, val);
        }

        const papero = Lab.e("path", {
            class: "papero",
            // M0,50 C50,50 20,55 100,55 L95,52 L96,51 L91,50 L90,48 C30,50 50,45 0,50
            d: `M-5,${r} C${r},${r} ${r*2/5},${11/10*r} ${2*r},${11/10*r} L${.95*2*r},${r+2} L${2*r-4},${r+1} L${.91*2*r},${r} L${.9*2*r},${r-2} C${r*3/5},${r} ${r},${.9*r} -5,${r}`
        });

        const makulo = Lab.e("ellipse",{
            class: "makulo",
            cx: .8*2*r, cy: r+1.5,  
            rx: r/5, ry: 3,
            fill: "none"
        });

        const surskribo = Lab.e("text",{class: "etikedo"},"pH");

        const vj = Array.from(Array(max-min+1).keys());
        const sektoroj =  vj.map((n) => sektoro(min+n,n));
        const tekstoj = vj.map((n) => teksto(min+n,n));
        
        this.g.append(papero,makulo,c,...sektoroj,...tekstoj,surskribo);
    }

    /**
     * Redonas kolorvaloron por pH-valoro. Tiu kolorvaloro estu uzata kiel unua argumento h de hsl(h,s,l)
     */
    static pH_koloro(pH) {
        return (pH <= 7?
            Math.round((320 + pH*20) % 360):
            Math.round((140 + (pH-7)*20) % 360));
    }

    /**
     * Kreas etendiĝantan makulon laŭ koloro de certa pH-valoro
     */
    makulo(pH,nevidebla) {
        const h = LabPHIndikilo.pH_koloro(pH);
        const makulo = this.g.querySelector("ellipse.makulo");
        Lab.a(makulo,{  
            fill: `hsl(${h},70%,50%)`,
            "fill-opacity": 0
        });
        // lanĉu la animacion de apero...
        let apero = makulo.querySelector("animate");
        if (apero) apero.remove();
        if (!nevidebla) {
            apero = Lab.apero(5,0.7); 
            makulo.append(apero);
                /*
            Lab.a(apero,{
                values: "0;.7"
            });*/
            apero.beginElement();    
        } /*else {
            //apero.remove();
            
            Lab.a(apero,{
                values: "0;0",
                begin: "indefinite",
            });
            
        }*/
    }
}

class LabDiagramo extends LabIlo {

    /**
     * Kreas 2D-diagramonon por montri mezurvalorojn.
     * Parametroj por la aksoj estas donitaj kiel objekto {nomo: aksonomo, mrg: marĝeno, min, max, 
     *  i1, i2, i3: skalintervaloj, log}
     * intervalo: 1 por ĉiu x unu streko, 5 por ĉiu kvina ktp. (provizore ignorata)
     * 
     * @param {string} id unika nomo
     * @param {object} X parametroj por x-akso
     * @param {object} Y parametroj por y-akso
     * @param {number} w larĝo
     * @param {number} h alto
     */
    constructor(id,X,Y,w=300,h=200) {
        super(id);
        this.g = Lab.e("g",{
            id: id,
            class: "diagramo"
        });
        const r = Lab.e("rect",{
            class: "fono",
            width: w,
            height: h,
            y: -h,
            rx: 2
        });

        // skaloj
        this.X = X;
        this.Y = Y;
        this.h = h;
        this.w = w;

        const l = 5; // plia ŝovo pro longeco de strekoj
        const xi = (w - 2*X.mrg)/(X.max-X.min);
        const yi = (h - 2*Y.mrg)/(Y.max-Y.min);
        const x = Lab.skalo(`${id}_x`,X.min,X.max,xi,X.i1,X.i2,X.i3);
        const y = Lab.skalo(`${id}_y`,Y.min,Y.max,yi,Y.i1,Y.i2,Y.i3);
        Lab.a(x,{
            transform: `translate(${X.mrg} ${-Y.mrg-l}) rotate(-90) scale(-1 1)`
        });
        Lab.a(y,{
            transform: `translate(${X.mrg+l} ${-Y.mrg}) scale(-1 -1)`
        });

        // nomo de la aksoj
        const xe = Lab.e("text",{
            class: "etikedo x",
            x: this.w - X.mrg/2,
            y: -Y.mrg
        }, X.nomo);
        const ye = Lab.e("text",{
            class: "etikedo y",
            x: X.mrg/2,
            y: -h + Y.mrg/2
        }, Y.nomo);

        this.g.append(r,x,y,xe,ye);
    }

    /**
     * Kalkulas koordinaton de punkto en la folio de la diagramo 
     * el koordinatoj donitaj laŭ la skaloj
     * @param {number} x 
     * @param {number} y 
     * @returns {object}
     */
    xy_pt(x,y) {
        // unuo
        const xi = (this.w-2*this.X.mrg)/(this.X.max-this.X.min);
        const yi = (this.h-2*this.Y.mrg)/(this.Y.max-this.Y.min);

        // punkt-koordinatoj en la diagramo
        return ({
            x: this.X.mrg + (x-this.X.min)*xi,
            y: -(this.Y.mrg + (y-this.Y.min)*yi)
        });
    }

    /**
     * Aldonas punkton ĉe koordinatoj (x,y) de la mezurspaco
     * @param {number} x x-koordinato
     * @param {number} y y-koordinato
     * @param {number} h kolorvaloro por hsl-funckio
     */
    punkto(x,y,h) {
        // punkto ekster la diagramspaco?
        if (x<this.X.min || x>this.X.max || y<this.Y.min || y>this.Y.max) return;

        let punktoj = this.g.querySelector(".punktoj");
        if (! punktoj) {
            punktoj = Lab.e("g",{
                class: "punktoj"
            });
            this.g.append(punktoj);
        }

        const p = this.xy_pt(x,y);
        const pt = Lab.e("rect",{
            class: "punkto",
            x: p.x,
            y: p.y,
            width: 3,
            height: 3,
            rx: .5
        });
        if (h !== undefined) {
            Lab.a(pt,{
                fill: `hsl(${h} 70% 50%)`
            })
        }
        punktoj.append(pt);
        return pt;
    }

    /**
     * Aldonas tekston ĉe koordinatoj (x,y) de la mezurspaco
     * @param {number} x x-koordinato
     * @param {number} y y-koordinato
     * @param {string} t teksto
     */
    teksto(x,y,t) {
        // punkto ekster la diagramspaco?
        if (x<this.X.min || x>this.X.max || y<this.Y.min || y>this.Y.max) return;

        let tekstoj = this.g.querySelector(".tekstoj");
        if (! tekstoj) {
            tekstoj = Lab.e("g",{
                class: "tekstoj"
            });
            this.g.append(tekstoj);
        }

        const p = this.xy_pt(x,y);
        const t_ = Lab.e("text",{
            class: "teksto",
            x: p.x,
            y: p.y
        },t);
        tekstoj.append(t_);
        return t_;
    }

    /**
     * Forigas la antaŭe aldonitajn punktojn el la diagramo
     */
    viŝu() {
        const punktoj = this.g.querySelector(".punktoj");
        if (punktoj) punktoj.remove();
    }
}

class Lab {

    /** Kreas SVG-elementon kun atributoj
     * @param nomo elementnomo, ekz-e 'div'
     * @param atributoj objekto kies kampoj estas la atributnomoj kaj ties valoroj
     */
    static e(nomo, atributoj, teksto) {
        const ns = "http://www.w3.org/2000/svg";
        const el = document.createElementNS(ns, nomo);
        if (atributoj) {
            for (const [atr,val] of Object.entries(atributoj)) {
                el.setAttribute(atr,val);
            }
        };
        if (teksto) el.textContent = teksto;
        return el;
    }

    /**
     * Aldonas aŭ ŝanĝas atributojn de SVG-DOM-elemento
     * 
     * @param elemento la DOM-elemento 
     * @param atributoj objekto kies kampoj estas la atributnomoj kaj ties valoroj
     * @returns 
     */
    static a(elemento, atributoj) {
        if (atributoj) {
            for (const [atr,val] of Object.entries(atributoj)) {
                elemento.setAttribute(atr,val);
            }
        };
        return elemento;
    }


    /**
     * Aldonas idon al SVG-elemento. Se jam ekzistas tia kun
     * la donita nomo, tion ni forigos unue
     * @param {*} elm 
     * @param {*} id 
     * @param {*} nom 
     */
    static ido(elm, id, nom) {
        const malnov = document.getElementById(nom);
        if (malnov) malnov.remove();

        id.setAttribute("id",nom);
        elm.append(id);
    }


    /** 
     * Desegnas rektangulon kun rondigitaj anguloj kaj kurbaj flankoj
     * @param {number} w larĝo
     * @param {number} h alteco
     * @param {number} a angulgrandeco
     * @param {number} d kurba devio de flankoj
     * @param {number} x x-koordinato (maldekstre)
     * @param {number} y y-koordinato (supre)
     */
    /*
     static rkrekt(w,h,a,d,x=0,y=0) {
        return Lab.e("path",{
            d: `M${x+a},${y} Q${x+w/2},${y-d} ${x+w-a},${y} Q${x+w},${y} ${x+w},${y+a} ` // supra linio
             + `L${x+w},${y+h-a} Q${x+w},${y+h} ${x+w-a},${y+h}`  // dekstra linio
             + `Q${x+w/2},${y+h+d} ${x+a},${y+h} Q${x},${y+h} ${x},${y+h-a}`  // malsupra linio
             + `L${x},${y+a} Q${x},${y} ${x+a},${y}` // maldekstra linio
        });
    }
    */
    

    /** 
     * Desegnas nur malsupre rondigitan rektangulon
     * @param {number} w larĝo
     * @param {number} h alteco
     * @param {number} a angulgrandeco
     * @param {number} x x-koordinato (maldekstre)
     * @param {number} y y-koordinato (supre)
     */
    /*
     static r_rekt(w,h,a,x=0,y=0) {
        return Lab.e("path",{
            d: `M${x},${y} L${x+w},${y} ` // supra linio
             + `L${x+w},${y+h-a} Q${x+w},${y+h} ${x+w-a},${y+h}`  // dekstra linio
             + `L${x+a},${y+h} Q${x},${y+h} ${x},${y+h-a}`  // malsupra linio
             + `L${x},${y+a} Z` // maldekstra linio
        });
    }
    */

    /** 
     * Desegnas rektangulon rondigitan malsupre konvekse kaj supre konkave
     * @param {number} w larĝo
     * @param {number} h alteco
     * @param {number} a angulgrandeco malsupre
     * @param {number} u angulgrandeco supre
     * @param {number} x x-koordinato (maldekstre)
     * @param {number} y y-koordinato (supre)
     */
    /*
    static rurekt(w,h,a,u,x=0,y=0) {
        return Lab.e("path",{
            d: `M${x},${y-u} Q${x},${y} ${x+u},${y} L${x+w-u},${y} Q${x+w},${y} ${x+w},${y-u}` // supra linio
             + `L${x+w},${y+h-a} Q${x+w},${y+h} ${x+w-a},${y+h}`  // dekstra linio
             + `L${x+a},${y+h} Q${x},${y+h} ${x},${y+h-a}`  // malsupra linio
             + `L${x},${y+a} Z` // maldekstra linio
        });
    }
    */

    /**
     * Kreas kaj redonas clipPath-elementon
     */
    static limigo(c_id,limFiguro) {
        const clip = Lab.e("clipPath",{
            id: c_id,
            clipPathUnits: "userSpaceOnUse"
        });
        clip.append(limFiguro);
        return clip;
    }

    /** 
     * Kreas movanimacion por falo de falaĵoj ks
     * @param {number} dy vojo de falo vertikale
     * @param {number} dx horizontala komponento de falo
     * @param {number} vx vario de horizontala pozicio
     * @param {number} d daŭro en sekundoj
     * @param {number} rp maksimuma ripetoj (kun hazardo)
     * @param {string} fn konduto ĉe fino (freeze|remove)
     */
    static falo(dy, dx=0, vx=0, d=10, rp=1, fn="freeze", poste) {
        // KOREKTU: dy estu reduktita se la elira alteco jam devias de la nul-linio
        // por tio necesas koni la patran elementon en kiun enŝovi la elementon animateMotion
        const f = Lab.e("animateMotion", {
            dur: d+'s',
            repeatCount: rp>1?Math.floor(Math.random()*rp):1,
            fill: fn,
            begin: "indefinite", // voku poste beginelement() por lanĉi!
            path: `M0,0 L${dx},${dy}`, // momente ni ignoras vx
            // per keyTimes, keyPoint ni povas ekz-e ankoraŭ akceli!
           //onend: (ev)=>poste(ev)
        });
        if (poste) f.addEventListener("endEvent",poste);
        return f;
    }

    /** 
     * Kreas iom-post-ioman aperon per kresko de fill-opacity 
     * @param {number} d daŭro en sekundoj
     * @param {number} max maksimuma opakeco
     */
    static apero(d,max=1.0) {
        const a = Lab.e("animate", {
            attributeName: "fill-opacity",
            values: `0.0;${max}`,
            dur: d+"s",
            repeatCount: 1,
            fill: "freeze"
        });
        return a;
    }

    /**
     * Kreas likvan enhavon, aldonebla en glason...
     */
    static likvo(cls="likvo",w=100,h=100) {
        return Lab.e("rect",{
            width: 100,
            y: -h,
            height: h,
            class: cls
        });
    }

    /**
     * Kreas falaĵon (gutoj, precipito ks). Erojn de precipito transdonu kiel objekto 
     * {id: referencilo, klasoj, n: nombro, s: supro, a: alteco, fd: faldistanco, af: falaĵalteco}, 
     * a: alteco de distribuo mezurite de la supro
     * fd: faldistanco, se ne donita ĝisgrunde
     * af: vario de falaĵo surgrunde
     * ĉe precipito donu pezajn malgrandajn erojn unue, due la pli grandajn nubecajn!
     * La referencilo devas montri al antaŭe difinita objekto, kreita ekz-e
     * per lab.difinoj().append(Lab.e("circle",...
     * aŭ per ero_smb()
     * @param {string} id unika rekonilo
     * @param {string} cls klasnomo de falaĵo, ekz-e por doni koloron, travideblecon ks
     * @param {string} ero1 ero speco unu
     * @param {string} ero2 ero speco du
     * @param {string} bordo pado por limigo (alternative al rektangulo w x h)
     * @param {number} w larĝeco, apriore 100
     * @param {number} h alteco, apriore 100
     */
    static falaĵo(id,cls="precipito",ero1,ero2,bordo,w=100,h=100) {
        return new LabFalaĵo(id,cls,ero1,ero2,bordo,w,h).g;
    }

    /**
     * Kreas glason kun enhavo
     * @param id {string} unika rekonilo
     * @param w {number} larĝeco, apriore 100
     * @param h {number} alteco, apriore 300
     * @param enhavo {object} aŭ nombro donate procentaĵon de pleneco aŭ SVG-objekto reprezentanta la enhavon
     */
    static glaso(id="glaso", enhavo, w=100, h=200) {
        const glaso = new LabGlaso(id, w, h);
        if (enhavo) glaso.enhavo(enhavo);
        return glaso;
    }


    /**
     * Kreas provtubon kun enhavo
     * @param id {string} unika rekonilo
     * @param w {number} larĝeco, apriore 100
     * @param h {number} alteco, apriore 300
     * @param enhavo {object} aŭ nombro donate procentaĵon de pleneco aŭ SVG-objekto reprezentanta la enhavon
     */
    static provtubo(id="glaso", enhavo, w=25, h=150, klino=0) {
        const tubo = new LabProvtubo(id, w, h, klino);
        if (enhavo) tubo.enhavo(enhavo);
        return tubo;
    }

    /**
     * Kreas gutbotelon 
     * @param {string} etikedo
     * @param {number} pleno enhavpleneco 0..100
     * @param {number} angulo angulo, je kiu la botelo estu turnita
     * 
     */
    static gutbotelo(id,etikedo,pleno=0,angulo=0) {
        return new LabGutbotelo(id,etikedo,pleno,angulo);
    }

    /**
     * Kreas bureton
     * @param {string} id unika nomo
     * @param {number} ml volumeno elfluita en ml, 0 estas la plej supra streko, 50 la plej malsupra, -1 malplena
     */
    static bureto(id,ml=0) {
        return new LabBureto(id,ml);
    }

     /**
     * Kreas konusan flakonon (Erlenmeyer)
     * @param {string} id unika nomo
     * @param {number} ml enhavo en ml (0..150)
     * @param {number} w larĝo
     * @param {number} h alteco
     */
    static konusflakono(id,pleno=0,w=100,h=200) {
        return new LabKonusFlakono(id,pleno,w,h);
    }


    /**
     * Kreas hofmanan aparaton
     * @param {string} id unika nomo
     * @param {number} ml volumeno elfluita en ml, 0 estas la plej supra streko, 50 la plej malsupra, -1 malplena
     */
    static hofmanaparato(id,kranreago_O2,kranreago_H2) {
        return new LabHofmanAparato(id,kranreago_O2,kranreago_H2);
    }

    /** 
     * Kreas pH-indikilon 
     * @param {string} id identigilo (nomo) de la indikilo
     * @param {number} r radiuso de la ronda indikilo
     * @param {number} min minimuma malgranda pH-valoro 
     * @param {number} max maksimuma malgranda pH-valoro 
     */
    static indikilo(id="indikilo",r=50,min=1,max=14) {
        return new LabPHIndikilo(id,r,min,max); 
    }

     /**
     * Kreas vitran bastonon
     * @param {string} id identigilo (nomo) de la bastono
     * @param {number} w larĝo
     * @param {number} h alto
     */
    static bastono(id,w=5,h=200) {
        return new LabBastono(id,w,h);
    }

     /**
     * Kreas sondilon
     * @param {string} id identigilo (nomo) de la sondilo
     * @param {number} w larĝo
     * @param {number} h alto
     * @param {number} klino klinangulo
     * @param {string} teksto la unuo + valoro monrenda sur la monitoreto
     */
    static sondilo(id,w=5,h=200,klino=0,teksto='') {
        return new LabSondilo(id,w,h,klino,teksto);
    }

    /**
     * Kreas 2D-diagramonon por montri mezurvalorojn.
     * Parametroj por la aksoj estas donitaj kiel objekto {id,min,max,int:intervalo,log}
     * intervalo: 1 por ĉiu x unu streko, 5 por ĉiu kvina ktp. (provizore ignorata)
     * 
     * @param {string} id unika nomo
     * @param {object} x_akso parametroj por x-akso
     * @param {object} y_akso parametroj por y-akso
     * @param {number} w larĝo
     * @param {number} h alto
     */
    static diagramo(id,x_akso,y_akso,w=300,h=200) {
        return new LabDiagramo(id,x_akso,y_akso,w,h);
    }

    /** 
     * Desegnas butonon
     */
    static butono(teksto,x,y,w,h,r=3) {
        const g= Lab.e("g", {
            class: "butono"
        });
        const c = Lab.e("rect", {
            x:x, y:y, width: w, height: h,
            rx: r
        });
        const t = Lab.e("text",{
            x: x+3, y: y+h/2
        },teksto);
        g.append(c,t);
        return g;
    }

    /**
     * Kreas gradienton
     * @param {object} ecoj la ecoj de la gradiento mem (konforme kun SVG linearGradient aŭ raidalGradient) 
     * @param {array} haltoj listo de haltoj en la formo {klaso,procento,opako,koloro}
     */
    static gradiento(ecoj,etapoj,ronda=false) {
        let grd;
        if (ronda) grd = Lab.e("radialGradient",ecoj)
        else grd = Lab.e("linearGradient",ecoj);
        const etpj = etapoj.map((e) => {
            const stp = Lab.e("stop",{
                offset: e.procento,
                "stop-opacity": e.opako
            });
            if (e.klaso) Lab.a(stp,{"class": e.klaso});
            if (e.koloro) Lab.a(stp,{"stop-color": e.koloro});
            return stp;
        });
        grd.append(...etpj);
        return grd;
    }

    /**
     * Kreas vertikalan skalon (por horizontala poste rotaciu je 90°)
     * @param {string} id 
     * @param {number} min minimuma valoro
     * @param {number} max maksimuma valoro
     * @param {number} di distanco inter du apudaj valoroj (x, x+i1)
     * @param {number} i1 plej malgranda paŝintervalo (mallongaj strekoj)
     * @param {number} i2 intervalo por mezlongaj strekoj
     * @param {number} i3 intervalo por longaj strekoj
     * @param {number} len longeco de streketo, kvinoj 1.5*len, dekoj: 2*len
     * @param {number} log bazo de la logritma skalo (momente ignorata): 1 = lineara, 2 = log2, Math.E = ln, 10 = log10
     */
    static skalo(id,min,max,di,i1=1,i2=5,i3=10,len=4,log=1) {
        // strekoj de la skalo
        let strekoj = '';
        for (let i = 0; i<=(max-min); i+=i1) {
            const y = di*i;
            const l = 2*len - ((min+i)%i2? len/2:0) - ((min+i)%i3? len/2:0);
            strekoj += `M8,${y} l${l},0`;
        }
        return Lab.e("path",{
            id: id,
            d: strekoj,
            class: "skalo"
        });
    }

    /**
     * Kreas rondan skalon
     * @param {string} id 
     * @param {number} min minimuma valoro
     * @param {number} max maksimuma valoro
     * @param {number} da anguldistanco inter du apudaj valoroj i, i+i1
     * @param {number} i1 plej malgranda paŝintervalo (mallongaj strekoj)
     * @param {number} i2 intervalo por mezlongaj strekoj
     * @param {number} i3 intervalo por longaj strekoj
     * @param {number} len longeco de streketo, kvinoj 1.5*len, dekoj: 2*len
     * @param {number} r ena radiuso, ĉe kiu komenciĝas ĉiu streko
     */
    static rskalo(id,min,max,da,i1=1,i2=5,i3=10,len=4,r=1) {
        // strekoj de la skalo
        let strekoj = '';
        const di = da/360*2*Math.PI;
        for (let i = 0; i<=(max-min); i+=i1) {
            const x1 = Math.round(r * Math.cos(i*di)*10)/10;
            const y1 = Math.round(r * Math.sin(i*di)*10)/10;
            const l = 2*len - ((min+i)%i2? len/2:0) - ((min+i)%i3? len/2:0);
            const x2 = Math.round((r+l) * Math.cos(i*di)*10)/10;
            const y2 = Math.round((r+l) * Math.sin(i*di)*10)/10;

            strekoj += `M${x1},${y1}L${x2},${y2}`;
        }
        return Lab.e("path",{
            id: id,
            d: strekoj,
            class: "skalo"
        });
    }    

}


class Laboratorio extends LabSVG {
    constructor(svg,f_id,f_w,f_h) {
        super(svg);
        this.aranĝo = Lab.e("g", {
            id: "lab_aranĝo"
        });

        if (f_id) {
            const fono = Lab.e("rect", {
                class: "lab_fono",
                width: f_w,
                height: f_h,
                rx: 4,
                id: f_id
            });
            //Lab.rrekt(f_w,f_h,4);
            //fono.id = f_id;
            this.aranĝo.append(fono);
        }

        this.svg.append(this.aranĝo);
        
        // vitro
        this.difinoj().append(
            Lab.gradiento(
            { id: "vitro", x1: "1.5%", x2: "98.5%"},
            [
                {procento:  "0%", koloro: "#00A", opako: ".5"},
                {procento:  "7%", koloro: "#09F", opako: ".2"},
                {procento:  "8%", koloro: "#fff", opako: ".5"},
                {procento: "55%", koloro: "#222", opako: "0.2"},
                //{procento: "60%", koloro: "#111", opako: "0"},
                {procento: "93%", koloro: "#000", opako: ".4"},
                {procento: "94%", koloro: "#114", opako: ".2"}
            ])
        )

        // vitro konusa
        this.difinoj().append(
            Lab.gradiento(
            { id: "vitro_konusa", gradientTransform: "skewX(5)" },
            [
                {procento:  "0%", koloro: "#fff", opako: ".5"},
                {procento: "55%", koloro: "#222", opako: "0.2"},
                //{procento: "60%", koloro: "#111", opako: "0"},
                {procento: "100%", koloro: "#000", opako: ".4"},
            ]),
            Lab.gradiento(
            { id: "vitro_horizontala", gradientTransform: "rotate(90)" },
            [
                    {procento:  "0%", koloro: "#334", opako: ".6"}, //5
                    {procento: "15%", koloro: "#eef", opako: "0.7"}, //6
                    {procento: "60%", koloro: "#112", opako: "0.3"}, //2
                    {procento: "90%", koloro: "#223", opako: ".6"}, //5
                    {procento: "100%", koloro: "#ccd", opako: ".9"}, //8
                    // test
                    // {procento:  "0%", koloro: "#f00", opako: ".9"},
                    // {procento: "100%", koloro: "#00f", opako: "0.9"},
            ]),
            Lab.gradiento(
            { id: "klemo_plus"},
            [
                    {procento:  "0%", koloro: "crimson"},
                    {procento: "100%", koloro: "#200"}
            ]),
            Lab.gradiento(
            { id: "klemo_minus"},
            [
                    {procento:  "0%", koloro: "#223"},
                    {procento: "100%", koloro: "#000"}
            ])        
        )

        // ombroj
        this.difinoj().append(
            Lab.gradiento(
            {
                id: "r_gradiento_ombro",
                fx: "60%",
                fy: "10%"
            },
            [
                {procento: "0%", koloro: "#000", opako: ".25"},
                {procento: "60%", koloro: "#000", opako: ".6"},
                {procento: "100%", koloro: "#000", opako: "0"}
            ], true)
        );

        this.lokoj = {};
        this.iloj = {};
    }

    /**
     * Redonas la rekonilon 'id' de io. Se ne estas objekto estas supozeble jam tiu id
     */
    #id(io) {
        if ((typeof io === 'object') && ('id' in io)) return io.id
        else if (typeof io === 'string' || typeof io === 'number') return io;
        throw ('Donita varariablo estas nek ilo/loko kun .id nek identigilo mem!');
    }

    /**
     * Registru novan lokon
     * @param {*} loko 
     */
    nova_loko(loko) {
        this.lokoj[loko.id] = loko;
        return loko.id;
    }

    /**
     * Registru novan ilon
     * @param {*} ilo 
     */
    nova_ilo(ilo) {
        this.iloj[ilo.id] = ilo;
        // aldonu al desegno
        this.aranĝo.append(ilo.g);        
        return ilo.id;
    }

    /**
     * Kreas butonon
     */
    butono(teksto,x,y,w,h,r=3) {
        const btn = Lab.butono(teksto,x,y,w,h,r);
        this.aranĝo.append(btn);
        return btn;
    }


    /**
     * Okupas lokon per ilo, plendante se jam estas okupita
     * @param {string} _loko 
     * @param {string} _ilo 
     */
    #okupu(_loko,_ilo) {
        if (this.okupita(_loko)) {
            throw "Loko ${_loko} jam estas okupita!"
        } else {
            this.lokoj[_loko]._ilo = _ilo;
            this.iloj[_ilo]._loko = _loko;

            // ŝovu la ilon al tiu loko
            const l = this.lokoj[_loko];
            const i = this.iloj[_ilo];
            const X = l.x||0;
            const Y = l.y||0;
            Lab.a(i.g, {
                transform: `translate(${X} ${Y})`
            });
        }
    }

    /**
     * Forigas ilon de loko (sen aktualigi la desegnon, por ŝovi ilon al nova loko poste voku #okupu!)
     * @param {*} _loko 
     * @param {*} _ilo 
     */
    #malokupu(_loko,_ilo) {
        this.lokoj[_loko]._ilo = undefined
    }

    /**
     * Difinas reagon de ilo al klako
     * @param {*} ilo - SVG elemento aŭ la registrita nomo de la objekto (vd lab.metu)
     * @param {function} reago 
     */
    klak_reago(ilo,reago) {
        const i = (typeof ilo === "object")? ilo : this.iloj[_ilo];
        const e = i instanceof SVGElement? i : i.g;
        e.addEventListener("click", (event) =>
        {
            reago(i,event);
        });
        e.classList.add("tuŝebla");
    }

    /**
     * Kontrolas, ĉu iu loko estas jam okupita
     */
    okupita(_loko) {
        return (typeof this.lokoj[_loko]._ilo !== 'undefined');
    }

    /** Metas novajn ilon en la aranĝon de la laboratorio,
     * @param {object} ilo la ilo, kreita per ujo() k.s.
     * @param {number} x x-koordinato (0=malsdesktre)
     * @param {number} y y-koordinato (0=supre)
     */
    metu(ilo,loko) {
        // ĉu loko estas nomo aŭ objekto?
        // se objekto ni registras ĝin nun
        let _loko = loko;
        if (typeof loko === "object") _loko = this.nova_loko(loko);

        // ĉu ilo estas nomo aŭ objekto?
        // se objekto ni registras ĝin nun
        let _ilo = ilo;
        if (typeof ilo === "object") _ilo = this.nova_ilo(ilo);

        this.#okupu(_loko,_ilo);
    }

    /**
     * Movas ilon de unu al alia loko.
     * Ni forigas kaj rekreas la objekton
     * per nova ilo,se donita (necesa ekz. se ni klinas, malplenigas botelon k.s.)
     * @param {*} ilo
     * @param {string} loko_al
     * @param {object} nova_ilo
     */
    movu(ilo,loko_al,nova_ilo) {
        // ni povas okupi nur malplenan lokon
        if (this.okupita(loko_al)) {
            throw `Loko ${loko_al} estas jam okupita!`;
        }

        let _ilo = this.#id(ilo);
        const loko_de = this.iloj[_ilo]._loko;

        if (nova_ilo) {
            // forigu malnovan ilon de la desegno
            this.iloj[_ilo].g.remove();
            _ilo = this.nova_ilo(nova_ilo);
        };

        this.#malokupu(loko_de,_ilo);
        this.#okupu(loko_al,_ilo);
    }

     /**
     * Kreas eron kiel simbolo uzebla poste, ekz-e kiel falaĵo (guto, precipitero...)
     */
    ero_smb(id,r,cls="ero") {
        const dif = this.difinoj();

        // aldonu aprioran gradienton por blankaj eroj, se mankas ankoraŭ
        // PLIBONIGU: tiel ni povas ŝanĝi koloron nur per ŝanĝo de la klaso
        // alternative permesu krei individuajn gradientojn por unuopaj eroj!
        if (! dif.querySelector("#gradiento_precipito")) {
            dif.append(
            Lab.gradiento(
                {id: "gradiento_precipito"},
                [
                    { klaso: "p_blanka", procento: "20%", opako: "0.6"},
                    { klaso: "p_blanka", procento: "100%", opako: "0"}
                ],
                true)
            );
        }

        dif.append(Lab.e("circle",{
          id: id,
          r: r,
          class: cls,
          fill: "url(#gradiento_precipito)"
        }));
    }

    /**
     * Kreas gutojn de antaŭdifinita speco inter du punktoj
     * @param {string} gutoj_id unika nomo por la gutoj
     * @param {string} ero_id gutspeco antaŭe difinita per ero_smb()
     * @param {number} n nombro da gutoj
     * @param {object} fonto koordiatoj de fonto {id,x,y}, komparu pinto() de kelkaj objektoj
     * @param {object} celo koordinatoj de celo {id,x,y}, komparu surfaco() de kelkaj objektoj
     * @param {function} fine funkcio vokenda en la fino
     */
    gutoj(gutoj_id,ero_id,n,fonto,celo,fine) {
          // por verŝgutoj ni bezonas la pinton de la bureto kaj la surfacon de la flakonenhavo
      // PLIUBONIGU:
      // aldonu tiun logikon en Laboratorio donante al ĝi du objektojn resp. la
      // rezultojn de .pinto() kaj .surfaco()
      const fnt_g = this.iloj[fonto.id].g;
      const fnt = this.svgKoord(fnt_g,fonto.x,fonto.y);
      const cel_g = this.iloj[celo.id].g;
      const cel = this.svgKoord(cel_g,celo.x,celo.y);

      const verŝo = Lab.falaĵo(gutoj_id,"guto",
        // ero 1
        {
          id: ero_id, n: n,
          alto: 3, falaĵalto: 2,
          x0: fnt.x,
          supro: -fnt.y, // KOREKTU -y -> +y?
          daŭro: 1,  // daŭro: 1s
          faldistanco: cel.y - fnt.y, // vertikala falo!
          poste: (ev) => {
            const gutoj = document.getElementById(gutoj_id);
            if (gutoj) { // povas okazi ĉe paraleleco, ke la evento okazas pluroble
                // sed ni certigas per tiu ekzistotesto, ke ni vokas nur unfoje la fin-agon!
              gutoj.remove();
              if (fine) fine(ev);
            }
          }
        },
        // nulaj ceteraj parametroj de falaĵo!
        null,null,0,0);

      this.aranĝo.append(verŝo);
      for (const a of verŝo.querySelectorAll("animateMotion")) {
            a.beginElement();
      };
    }


    /**
     * Redonu transformmatricon por certa elemento en la aranĝo
     * @param {*} elemento 
     * @returns 
     */
    CTM(elemento) {    
        // vd. https://stackoverflow.com/questions/72738584/svg-getctm-not-returning-expected-x-y-values
        const ma = document.getElementById('lab_aranĝo').getCTM();
        const me = elemento.getCTM();
        return ma.inverse().multiply(me);
    }
    
    /**
     * Redonu SVG-koordinatojn de punkto ene de SVG-elemento kiel absolutaj koordinatoj en la aranĝo
     * t.e. apliku ĉujn transfromojn, de tiu elemento kaj ĉiaj gepatroj ĝis #lab_aranĝo
     * @param {*} elemento
     * @param {number} x 
     * @param {number} y 
     * @returns 
     */
    svgKoord(elemento,x, y) {
        // vd. komplikaĵojn, specifajn informojn kaj alternativojn en
        // https://stackoverflow.com/questions/10623809/get-bounding-box-of-element-accounting-for-its-transform
        // https://www.w3.org/TR/SVG11/coords.html
        // https://stackoverflow.com/questions/17817790/how-do-i-get-the-global-coordinates-of-a-grouped-svg-element
        // https://www.sitepoint.com/how-to-translate-from-dom-to-svg-coordinates-and-back-again/
        const pt = new DOMPointReadOnly(x,y);       
        const ctm = this.CTM(elemento);
        return pt.matrixTransform(ctm);        
    }

}