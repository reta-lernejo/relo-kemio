---
layout: laborfolio
title: Malkombinado de akvo
chapter: "3.x.x"
js:
  - folio-0b
  - sekcio-0b 
  - mathjax/es5/tex-chtml
  - laboratorio-0d
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
  let hofmanaparato, mezurilo, eksperimento;
  const ALTO = 500;
  const LARĜO = 500;
  const X_HOFMANN = 200;

  function preparo() {
    aparato.enhavo(eksperimento.ml);
    mezurilo.valoro(0);
  }

  lanĉe(()=>{
    lab = new Laboratorio(ĝi("#eksperimento"),"fono",LARĜO,ALTO+10);

    // hofmann-aparato
    aparato = Lab.hofmanaparato("hofman",1); // elfluo = 100ml, t.e. malplena
    // du provtubojp por kapti gason
    ptubo1 = Lab.provtubo("provtubo_1",0,15,80,175);
    ptubo2 = Lab.provtubo("provtubo_2",0,15,80,182);
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
    // kandelo por testo
    kandelo = new LabKandelo("kandelo",40,16);

    lab.metu(drato_minus,{id:'drato_minus',x:0,y:0});
    lab.metu(drato_plus,{id:'drato_minus',x:0,y:0});
    lab.metu(voltmetro,{id: "voltmetro", x:10, y:ALTO-90});
    lab.metu(aparato,{id: "malsupre", x:X_HOFMANN, y:ALTO-20});
    lab.metu(ptubo1,{id: "maldekstre", x:X_HOFMANN, y: -95});
    lab.metu(ptubo2,{id: "dekstre", x:X_HOFMANN+140, y: -95});
    lab.metu(keno,{id: "keno", x:X_HOFMANN+190, y:ALTO-20});
    lab.metu(kandelo,{id: "kandelo", x:X_HOFMANN+230, y:ALTO-20});
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
      .ŝaltilo text {
        fill: #112;
        font-size: 11pt;
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
