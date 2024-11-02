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

    // bureto supre
    aparato = Lab.hofmanaparato("hofman",100); // elfluo = 100ml, t.e. malplena
    lab.metu(aparato,{id: "supre", x:X_HOFMANN, y:ALTO-20});
    voltmetro = new LabMezurilo("voltmetro",30,"V");
    lab.metu(voltmetro,{id: "voltmetro", x:10, y:ALTO-90})

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
