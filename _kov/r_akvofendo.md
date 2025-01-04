---
layout: laborfolio
title: Malkombinado de akvo
chapter: "3.x.x"
js:
  - folio-0b
  - sekcio-0b 
  - mathjax/es5/tex-chtml
  - laboratorio-0d
  - stato-0a
css:
  - laboratorio-0d
---

paĝo en preparo...

<!--

https://de.wikipedia.org/wiki/Hofmannscher_Wasserzersetzungsapparat
https://www.3bscientific.de/product-manual/U14332_DE.pdf
http://dodo.fb06.fh-muenchen.de/lab_didaktik/pdf/web-elektrolyse.pdf

-->


## Malkombino de akvo
{: .sekcio}

<script>

  const eksperimentoj = {
  }

  let lab; // la laboratorio kaj iloj
  let aparato, voltmetro, eksperimento, provtubo1, provtubo2;
  const ALTO = 500;
  const LARĜO = 500;
  const X_HOFMANN = 200;

  function elektro() {
    //aparato.enhavo(eksperimento.ml);
    //mezurilo.valoro(0);
    const ŝaltilo = ĝi("#_plato_voltmetro .ŝaltilo");
    if (voltmetro.val <= 0) {
      // ŝaltu...
      ŝaltilo.classList.add("ŝaltita");
      voltmetro.valoro(19.8);
      vezikoj();
    } else {
      // malŝaltu
      ŝaltilo.classList.remove("ŝaltita");
      voltmetro.valoro(0);
      vezikoj_haltu();
    }
  }

  function vezikoj_haltu() {
    // ŝanĝu repeatCount al 1 (lasta)
    for (const am of ĉiuj("#vezikoj_H2 animateMotion, #vezikoj_O2 animateMotion")) {
      Lab.a(am,{
        repeatCount: "1"
      });
      am.beginElement();
    }

    // haltigu gasiĝon
    purigu_prokrastojn();

    // forigu vezikojn fine
    prokrastu(() => {
      forigu("#vezikoj_H2");
      forigu("#vezikoj_O2");
    }, 2000);
  }

  function vezikoj() {
    const h_alto = 300; // alto de aparataj tuboj
    // ni uzas "falaĵo"-n por leviĝantaj vezikoj, tial supro estu 0 kaj faldistanco negativa!
    // la vezikoj ekas ĉe la elektrodo en alto (0,40)
    // kaj atingu ĝis la supro de la enhavo. Kiam la akvinivelo sinkas
    // ni devos poste adapti faldistancon (negativa, ĉar ili ja leviĝas)
    const v1 = { id: "veziko_O2", klasoj: "", n: 6, daŭro: 2, supro: 0, alto: -40, faldistanco: -h_alto, falaĵalto: 0, videblo: 1.0 };
    const v2 = { id: "veziko_O2", klasoj: "", n: 5, daŭro: 5, aperdaŭro: 3, supro: 0, alto: -40, faldistanco: -h_alto, falaĵalto: 0, videblo: 1.0 };

    const limigo_O2 = aparato.enhavlimigo("1");
    const limigo_H2 = aparato.enhavlimigo("2");
    veziketoj_O2 = Lab.falaĵo("vezikoj_O2","vezikoj",
        v1, v2, limigo_O2, 25, h_alto);
    veziketoj_H2 = Lab.falaĵo("vezikoj_H2","vezikoj",
        {...v1,...{id: "veziko_H2",n: 12}},
        {...v2, ...{id: "veziko_H2",n: 10}},
        limigo_H2, 25, h_alto);
    aparato.vezikoj(veziketoj_O2,"1");  // aldonu vezikojn al jama likvo
    aparato.vezikoj(veziketoj_H2,"2");  // aldonu vezikojn al jama likvo

    for (const a of ĉiuj("#vezikoj_H2 animate, #vezikoj_O2 animate")) {
      a.beginElement();
    }
    for (const am of ĉiuj("#vezikoj_H2 animateMotion, #vezikoj_O2 animateMotion")) {
      Lab.a(am,{
        repeatCount: "indefinite",
        fill: "remove"
      });
      am.beginElement();
    }

    // regula adaptu la akvonivelon (t.e. gaskvanton)
    gasiĝo();
  }

  function gasiĝo() {
    const ms = 600;
    const ml = 1; //0.1; // triono estas O2 kaj du trionoj H2

    if (aparato.ml_H2<57 && aparato.ml_O2<57) {
      // aparato.enhavo(...ml))
      aparato.gasiĝo(ml);

      // revoku nin post kelkaj ms
      prokrastu(() => gasiĝo(ml), ms);
    } else {
      // haltigu la aparaton
      elektro();
    }
  }

  function O2_ellaso() {
    aparato.krano_1.malfermu();
    // ellasu 10ml el la O2
    aparato.ellaso("1",10,() => {
      aparato.krano_1.fermu();
      provtubo1.ŝtopu();
      lab.metu(provtubo1,{id: "p1_fermita", x: 150, y: -50});
    });
  }

  function H2_ellaso() {
    aparato.krano_2.malfermu();
    // forigu 10ml el la O2
    aparato.ellaso("2",10,() => {
      aparato.krano_2.fermu();
      provtubo2.ŝtopu();
      lab.metu(provtubo2,{id: "p2_fermita", x: 400, y: -50});
    });
  }

  lanĉe(()=>{
    lab = new Laboratorio(ĝi("#eksperimento"),"fono",LARĜO,ALTO+10);

    // difinu vezikojn
    lab.difinoj().append(
      Lab.e("circle",{
        id: "veziko_H2",
        class: "veziko",
        r: 1.6
      }),
      Lab.e("circle",{
        id: "veziko_O2",
        class: "veziko",
        r: 2 // duoble volumeno: r_O2 = 1,25*r_H2
      })
    );

    // hofmann-aparato
    aparato = Lab.hofmanaparato("hofman",O2_ellaso,H2_ellaso); // elfluo = 100ml, t.e. malplena
    // du provtubojp por kapti gason
    provtubo1 = Lab.provtubo("provtubo_1",0,15,80,175);
    provtubo2 = Lab.provtubo("provtubo_2",0,15,80,182);
    // tensimezurilo
    voltmetro = new LabMezurilo("voltmetro",30,"V");

    // dratoj por kunligi la elekjtrodojn kun la voltmetro
    const drato_plus = new LabIlo("drato_plus");
    drato_plus.g = Lab.e("g",{id: "drato_plus"});
    drato_plus.g.append(
      Lab.e("path",{
            d: `M${10+120},${ALTO-90+20+1}Q160,${ALTO-90+20+2} 170,${ALTO-35}Q170,${ALTO-10} ${X_HOFMANN+8},${ALTO-10}`,
            class: "drato_plus"
        })
    );

    const drato_minus = new LabIlo("drato_minus");
    drato_minus.g = Lab.e("g",{id: "drato_minus"});
    drato_minus.g.append(
      Lab.e("path",{
            d: `M${10+120},${ALTO-90+60+2}Q180,${ALTO-90+60} 270,${ALTO-20}L${X_HOFMANN+130},${ALTO-10}`,
            class: "drato_minus"
        })
    );

    // keno por testo
    keno = new LabKeno("keno",4,150,5);
    kenstato = new Stato("nebrula",[
      ["nebrula","brula",keno.ardigu.bind(keno)],
      ["brula","nebrula",keno.estingu.bind(keno)]
    ]);
    // kandelo por testo
    kandelo = new LabKandelo("kandelo",40,16);
    kandelstato = new Stato("nebrula",[
      ["nebrula","brula",kandelo.flamigu.bind(kandelo)],
      ["brula","nebrula",kandelo.estingu.bind(kandelo)]
    ]);

    lab.metu(drato_minus,{id:'drato_minus',x:0,y:0});
    lab.metu(drato_plus,{id:'drato_minus',x:0,y:0});
    lab.metu(voltmetro,{id: "voltmetro", x:10, y:ALTO-90});
    lab.metu(aparato,{id: "malsupre", x:X_HOFMANN, y:ALTO-20});
    lab.metu(provtubo1,{id: "maldekstre", x:X_HOFMANN, y: -95});
    lab.metu(provtubo2,{id: "dekstre", x:X_HOFMANN+140, y: -95});

    //lab.metu(kandelo,{id: "kandelo", x:80, y:ALTO-91});
    lab.metu(kandelo,{id: "kandelo", x:420, y:ALTO});
    /* PROVIZORE ŝparu kalkultempon por la animacio: */
    lab.metu(keno,{id: "keno", x:X_HOFMANN+190, y:ALTO-20});

    // ŝaltilo por la elektro
    const ŝaltilo = ĝi("#_plato_voltmetro .ŝaltilo");
    lab.klak_reago(ŝaltilo,(btn) => {
      elektro();
    });
    // bruligi/estingi kandelon
    lab.klak_reago(kandelo,(k) => {
      kandelstato.transiru();
    });
    // bruligi/estingi kenon
    lab.klak_reago(keno,(k) => {
      kenstato.transiru();
    });

  });
</script>

<svg id="eksperimento"
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" viewBox="-10 -10 520 520">
 <style type="text/css">
    <![CDATA[
      .butono.premita rect {
        fill: #004b4b;
      }
      .likvo {
        fill: hsla(236, 14%, 75%, 0.4);
      }
      .vakso {
        stroke: black;
        stroke-width: 1.0;
      }
      .veziko {
        fill: url(#vitro);
        stroke: black;
        stroke-width: 0.2;
      }
      .klemo_1 {
        fill: url(#klemo_plus);
      }
      .klemo_2 {
        fill: url(#klemo_minus);
      }
      .drato_plus {
        fill: none;
        stroke-width: 2;
        stroke: crimson;
      }
      .drato_minus {
        fill: none;
        stroke-width: 2;
        stroke: #223;
      }
      .ŝaltilo rect {
        stroke: #ccc;
        fill: #ddf;
      }
      .ŝaltilo.ŝaltita rect {
        fill: #668;
      }
      .ŝaltilo text {
        fill: #112;
        font-size: 11pt;
      }
      .ŝaltilo.ŝaltita text {
        fill: #811;
      }
    ]]>
  </style>

  <defs>
    <linearGradient id="ligno">
      <stop offset="0%" stop-color="#d0be8e" />
      <stop offset="40%" stop-color="#f5e7c0"/>
      <stop offset="100%" stop-color="#524a35" />
    </linearGradient>


    <linearGradient id="vakso">
      <stop offset="0%" stop-color="#8e8c81" />
      <stop offset="45%" stop-color="#fffcf6"/>
      <stop offset="100%" stop-color="#6b6a61" />
    </linearGradient>
        
    <radialGradient id="flamo" cx="50%" cy="110%" r="105%">
      <stop offset="0%" stop-color="red" stop-opacity="0%"/>
      <stop offset="35%" stop-color="#cdb2f9" stop-opacity="30%"/>
      <stop offset="40%" stop-color="red" stop-opacity="40%"/>
      <stop offset="95%" stop-color="gold" stop-opacity="60%"/>
      <stop offset="100%" stop-color="#cdb2f9" stop-opacity="10%"/>
    </radialGradient>
    
    <filter id="svago" x="-20%" y="-20%" width="140%" height="140%">    
      <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
    </filter>
   
    <filter id="svago2" x="-20%" y="-20%" width="140%" height="140%">    
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.2" />
    </filter>    

    <filter id="ardo" x="-100%" y="-100%" width="300%" height="300%">    
      <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
    </filter>
  </defs>  
</svg>


## fontoj
{: .fontoj}

[^sx1]: [Eigendissoziation des Wassers entschlüsselt](https://www.scinexx.de/news/technik/eigendissoziation-des-wassers-entschluesselt/)
[^cu1]: [Säuren, Basen, Salze](https://www.chemieunterricht.de/dc2/wsu-grund/kap_14.htm)
