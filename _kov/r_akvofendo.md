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
    e1: {nomo: "titri HCl (kun NaOH)", 
      acido: 1, s: "HCl", ml: 25, c: 0.1,
      s_b: "NaOH", ml_b: 50, c_b: 0.1},
    e2: {nomo: "titri CH₃COOH (kun NaOH)", 
      acido: 1, s: "CH3COOH", ml: 25, c: 0.1, 
      s_b: "NaOH", ml_b: 50, c_b: 0.1},
    e3: {nomo: "titri H₃PO₄ (kun NaOH)", 
      acido: 3, s: "H3PO4", ml: 17, c: 0.5, 
      s_b: "NaOH", ml_b: 50, c_b: 0.5},
    e4: {nomo: "titri NH₃ (kun HCl)", 
      acido: 0, s: "NH3", ml: 25, c: 0.1, 
      s_b: "HCl", ml_b: 50, c_b: 0.1}
  }

  let lab; // la laboratorio kaj iloj
  let hofmanaparato, flakono, sondilo, diagramo, eksperimento;
  const ALTO = 500;
  const LARĜO = 500;
  const X_HOFMANN = 200;


  function preparo() {
    flakono.enhavo(eksperimento.ml);
    bureto.fermu();
    bureto.enhavo(eksperimento.ml_b);
    diagramo.viŝu();
    // komenca valoro
    pH_mezuro();
  }

  function pH_mezuro() {
    // substanco en la flakono
    const s = eksperimento.s == "NaOH"? "OH-" : eksperimento.s;
    // substanco en la bureto
    const s_b = eksperimento.s_b == "NaOH"? "OH-" : eksperimento.s_b;

    // titrado de acido kun forta bazo diferencas de titradod e bazo kun forta acido
    let pH;
    if (eksperimento.acido == 1) {
      pH = AB.pH2_acido(
        { a: s, 
          c: eksperimento.c, 
          v: eksperimento.ml/1000 },
        { b: s_b, 
          c: eksperimento.c_b, 
          v: bureto.ml/1000 }
      );
    } else if (eksperimento.acido > 1) {
      valj = AB.acidtitrado_plurprotona(
        { a: s, 
          c: eksperimento.c, 
          v: eksperimento.ml/1000 },[bureto.ml/1000]);
      pH = valj[0];
    } else {
      pH = AB.pH2_bazo(
        { b: s, 
          c: eksperimento.c, 
          v: eksperimento.ml/1000 },
        { a: s_b, 
          c: eksperimento.c_b, 
          v: bureto.ml/1000 }
      );
    }

    if (pH > -10 && pH < 16) {
      sondilo.valoro(`pH ${pH.toFixed(1)}`);
      diagramo.punkto(bureto.ml,pH,LabPHIndikilo.pH_koloro(pH));
    } else {
      // evitu montri aparte vortojn NaN aŭ Infinity...
      sondilo.valoro('pH --');
    }
  }


  lanĉe(()=>{
    lab = new Laboratorio(ĝi("#eksperimento"),"fono",LARĜO,ALTO+10);
    // difinu gutojn
    lab.ero_smb("guto",3);

    // bureto supre
    aparato = Lab.hofmanaparato("hofman",100); // elfluo = 100ml, t.e. malplena
    lab.metu(aparato,{id: "supre", x:X_HOFMANN, y:ALTO-20});

    function fluo(fermu) {
      if (bureto.ml>=60) return; // bureto malplenigita!
      if (bureto.fermita) return; // bureto estas (ĵus) fermita

      // por verŝgutoj ni bezonas la pinton de la bureto kaj la surfacon de la flakonenhavo
      const pinto = bureto.pinto();
      const surfaco = flakono.surfaco()
      lab.gutoj("gutoj","guto",7,pinto,surfaco,() => {
        const ms = 600;
        const ml = 0.5;

        // fluigu 1ml el la bureto
        bureto.elfluo(ml);
        if (fermu) {
          bureto.fermu();
        } else {
          prokrastu(() => fluo(false), ms);
        }

        // aldonu 1ml al flakonlikvo
        flakono.enfluo(ml);
        pH_mezuro();
      });
    }

    // klako al bureto elgutigu 1 ml
    lab.klak_reago(bureto.ujo(), () => {
      bureto.malfermu();
      fluo(true);
    });

    // klako sur krano malfermu aŭ fermu ĝin!
    lab.klak_reago(bureto.krano(), () => {
      if (bureto.fermita) {
        bureto.malfermu();
        prokrastu(() => fluo(false), 500);
      } else {
        bureto.fermu();
        purigu_prokrastojn();
      }
    });

    //pH_mezuro();

    // butonoj por elekti eksperimenton
    const btn_w = 130, btn_h = 16;
    let btn_y = 10;

    for (eksp in eksperimentoj)
    {
      const nomo = eksperimentoj[eksp].nomo;
      const btn = lab.butono(nomo,-10,btn_y,btn_w,btn_h);
      btn.id = eksp;
      btn_y += 20;

      lab.klak_reago({g: btn},(btn) => {
        // forigu klason .premita de antaŭa butono...
        for (const b of ĉiuj("#eksperimento .butono")) {
          b.classList.remove("premita");
        }
        // montru nun elektitan substancon kaj butonon
        btn.g.classList.add("premita");
        // const subst = btn.g.textContent;
        eksperimento = eksperimentoj[btn.g.id];
        preparo();
      });
    }
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
    ]]>
  </style>
</svg>


## fontoj
{: .fontoj}

[^sx1]: [Eigendissoziation des Wassers entschlüsselt](https://www.scinexx.de/news/technik/eigendissoziation-des-wassers-entschluesselt/)
[^cu1]: [Säuren, Basen, Salze](https://www.chemieunterricht.de/dc2/wsu-grund/kap_14.htm)
