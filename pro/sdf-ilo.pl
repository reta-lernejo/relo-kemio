:- use_module(library(dcg/basics)).

% https://tutorials.technology/cheatsheets/mol_format.html
% https://en.wikipedia.org/wiki/Chemical_table_file#SDF
% https://en.wikipedia.org/wiki/Chemical_table_file#Molfile

test_file('../reta-lernejo.github.io/_biokemio/inc/alanino_CID_5950.sdf').
test :- test_file(F), parseSDF(F,SDF), write(SDF).

parseSDF(File,SDF) :- phrase_from_file(sdf(SDF),File),!.

sdf(sdf{id:Id,opt:Opt,atoms:AtomList,bonds:BondList,mlist:MList}) -->
    headerLine(Id),
    optionLine(Opt),
    whites, eol, % malplena linio
    % PLIBONIGU: ni momente ne subtenas plurajn atom-listojn (ALists>1)
    countsLine(Atoms,Bonds),
    atomLines(Atoms,AtomList),
    bondLines(Bonds,BondList),
    mLines(0,MList),
    mEnd,rest.

headerLine(Id) --> integer(Id), eol.
optionLine(Opt)  --> whites, string_without("\n",Opt), eol.

countsLine(Atoms,Bonds) --> 
    whites, integer(Atoms), whites, integer(Bonds),     
    whites, integer(0), whites, integer(1), whites,   string_without("\n",_), eol.  
    % specifo devias de aktuala dosiero el PubChem!
    %/*
    %whites, integer(ALists), whites, 
    %notUsed, whites, integer(Chirality), whites, integer(STextNo), whites, 
    %integer(MNo), whites, integer(_), whites, integer(_), whites, 
    %"0999", whites, "V", integer(FVersion), whites
    %*/

atomLines(0,[]) --> [].
atomLines(N,[Atom|AList]) -->
    {N>0, N_1 is N-1},
    atomLine(Atom),
    atomLines(N_1,AList).

atomLine(atom{x:X,y:Y,z:Z,symbol:ASymbol,massdiff:MassDiff,
    charge:Charge,parity:Parity,hno:HNo,stereobox:StereoBox,valence:Valence}) --> 
    whites, float(X), whites, float(Y), whites, float(Z), whites, 
    nonblanks(ASymbol), whites, integer(MassDiff), whites,
    integer(Charge), whites, integer(Parity), whites, 
    integer(HNo), whites, integer(StereoBox), whites, integer(Valence), whites, 
    string_without("\n",_),eol.

bondLines(0,[]) --> [].
bondLines(N,[Bond|BList]) -->
    {N>0, N_1 is N-1},
    bondLine(Bond),    
    bondLines(N_1,BList).

bondLine(bond{a1:A1,a2:A2,type:BondType,stereo:BondStereo,topo:BondTopo,rcenter:ReactCenter}) --> 
    whites, integer(A1), whites, integer(A2), whites, integer(BondType), whites, 
    integer(BondStereo), whites, notUsed, whites, integer(BondTopo), whites, 
    integer(ReactCenter), whites, eol.

mLines(0,[]) --> [].
mLines(N,[M|MList]) -->
    {N>0, N_1 is N-1},
    mLine(M),    
    mLines(N_1,MList).
mLine(M) --> "M", string_without("\n",M).

notUsed --> [].
notUsed --> "0".

mEnd --> "M", whites, "END", eol.
rest --> string_without("ä",_).