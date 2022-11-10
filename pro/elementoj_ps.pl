:- use_module(library(http/json)).

pubchem('dat/PubChemElements.json').
al_dos('dat/PSElementoj.json').

kolumnoj([
    'AtomicNumber'=numero,
    'Symbol'=simbolo,
    'Name'=nomo,
    'AtomicMass'=maso,
    'CPKHexColor'=kolorkodo,
    'ElectronConfiguration'=edistribuo,
    'Electronegativity'=enegativeco,
    'AtomicRadius'=radiuso,
    'IonizationEnergy'=jenergio,
    'ElectronAffinity'=eafineco,
    'OxidationStates'=oksidnombroj,
    'StandardState'=normstato,
    'MeltingPoint'=degelpunkto,
    'BoilingPoint'=bolpunkto,
    'Density'=denso,
    'GroupBlock'=grupspeco,
    'YearDiscovered'=malkovro
]).

specoj([
    'Noble gas'='nobla gaso',
    'Halogen'=halogeno,
    'Alkali metal'='alkala metalo',
    'Alkaline earth metal'='teralkala metalo',
    'Nonmetal'=nemetalo,
    'Metalloid'=duonmetalo,
    'Transition metal'=transirmetalo,
    'Post-transition metal'=posttransirmetalo,
    'Lanthanide'=latanido,
    'Actinide'=aktinido
    ]).

nomoj([
'hidrogeno','heliumo','litio','berilio','boro','karbono','azoto','oksigeno','fluoro','neono','natrio',
'magnezio','aluminio','silicio','fosforo','sulfuro','kloro','argono','kalio','kalcio','skandio','titano',
'vanado','kromo','mangano','fero','kobalto','nikelo','kupro','zinko','galiumo','germaniumo','arseno','seleno',
'bromo','kriptono','rubidio','stroncio','itrio','zirkonio','niobo','molibdeno','teknecio','rutenio','rodio',
'paladio','arĝento','kadmio','indio','stano','antimono','teluro','jodo','ksenono','cezio','bario','lantano',
'cerio','prazeodimo','neodimo','prometio','samario','eŭropio','gadolinio','terbio','disprozio','holmio',
'erbio','tulio','iterbio','lutecio','hafnio','tantalo','volframo','renio','osmio',
'iridio','plateno','oro','hidrargo','talio','plumbo','bismuto','polonio','astato','radono','franciumo',
'radiumo','aktiniumo','torio','protaktinio','uranio','neptunio','plutonio','americio','kuriumo','berkelio',
'kaliforniumo','ejnŝtejnio','fermio','mendelevio','nobelio','laŭrencio','ruterfordio','dubnio','seborgio',
'borio','hasio','mejtnerio','darmŝtatio','rentgenio','kopernicio','nihonio','flerovio','moskovio',
'livermorio','teneso','oganesono']).

trf(Json) :-
    pubchem(In),
    open(In,read,JIn),    
    json_read(JIn,Json),
    al_dos(AlDos),
    open(AlDos,write,Al),
    skribu(Al,Json),
    close(Al).

skribu(Al,json(List)) :-
    member('Table'=json(JTab),List),
    % nomoj de kolumnoj kiel listo
    member('Columns'=json(K),JTab),
    member('Column'=Kolj,K),
    % listo de elementoj
    member('Row'=Elmntj,JTab),
    elementoj(Elmntj,Kolj,Trf),!,
    json_write(Al,Trf).

elementoj([],_,[]).
elementoj([json(E)|Elmntj],Kolj,[json(TE)|TElementj]) :-
    member('Cell'=C,E),
    % ni bezonas la ordnumeron de la elemento por transformoj
    C = [O|_], atom_number(O,ON),
    maplist(etrf(ON),C,Kolj,TE),
    %dict_pairs(TE,json,E1),
    %eskrb(E1),
    elementoj(Elmntj,Kolj,TElementj).

% transformas element-atributon de angla al esperanta formo
etrf(ON,Atr,Kol,Ke=Val) :-
    % esperanta nomo de atributo
    kolumnoj(Trd),
    member(Kol=Ke,Trd),
    eval(ON,Ke,Atr,Val).

% tradukas valorojn de element-atributoj
eval(ON,nomo,_,Val) :-
    nomoj(Nj),
    nth1(ON,Nj,Val).

eval(_,grupspeco,Atr,Val) :-
    specoj(GS),
    member(Atr=Val,GS).

eval(_,edistribuo,Atr,Val) :-
    atomic_list_concat(L,' ',Atr),
    member(Suf-Esp,['(predicted)'-'(prognozita)','(calculated)'-'(kalkulita)']),
    append(L1,[Suf],L),
    append(L1,[Esp],L2),
    atomic_list_concat(L2,' ',Val).


eval(_,malkovro,'Ancient','antikva').

eval(_,normstato,'Solid','solida').
eval(_,normstato,'Liquid','likva').
eval(_,normstato,'Gas','gasa').
eval(_,normstato,'Expected to be a Solid','supozeble solida').
eval(_,normstato,'Expected to be a Liquid','supozeble likva').
eval(_,normstato,'Expected to be a Gas','supozeble gasa').

eval(_,_,Val,Val).

% skribas la atributojn de unu elemento
eskrb(Atrj) :-
    dict_pairs(JD,json,Atrj),
    json_write_dict(current_output,JD).
