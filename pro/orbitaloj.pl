
% : atommodelo
% https://de.wikipedia.org/wiki/Elektronenkonfiguration
% https://www.chemiezauber.de/inhalt/q1/aufbau-der-materie/atommodelle/orbitaltheorie/elektronenkonfiguration-der-elemente/422-kaestchenschreibweise.html
% https://de.wikipedia.org/wiki/Aufbauprinzip
%
% https://www.seilnacht.com/Lexikon/psval.htm

%! Redonas nomon de orbitalo el ĉefkvantumnombro N (ŝelo) 
% kaj kromkvantumnombro L (subŝelo) kaj magneta kvantumnombro M
% vd https://en.wikipedia.org/wiki/Atomic_orbital
orbitalo(N,L,M,O) :-
    %%% reguloj pri la intervaloj de kvantumnombroj N, L, M
    % N estas natura nombro kaj reprezentas la elektronŝelon
    between(1,8,N), 
    % M estas nombro inter 0 kaj N-1 kaj reprezentas la subŝelon
    Lmax is N - 1,
    between(0,Lmax,L), 
    % M varias inter -L kaj L kaj reprezentas la orbitalon en la subŝelo
    (
        L=0, M=0
        ;
        L>0, L_ is -L, between(L_,L,M)
    ),
    %%% kunmetita nomo de la orbitalo
    subshelo(L,Ln),
    mkvantumo(L,M,Mn),
    format(atom(O),'~d~w~w',[N,Ln,Mn]).


%! subschelo(?L,?Nomo) is nondet.
subshelo(0,s).
subshelo(1,p).
subshelo(2,d).
subshelo(3,f).
subshelo(4,g).
subshelo(5,h).
subshelo(6,i).
subshelo(7,j).

% la nombro de orbitaloj en subŝelo
% respondas al la eblaj valoroj de magneta kvantumnombro m = -l..l
n_orb(L,K) :- K is (2*L+1).

%! mkvantumo(+L,+M,-Mn) is det.
mkvantumo(0,_,'').
mkvantumo(L,M,'0') :- L>0, M=0.
mkvantumo(L,M,Mn) :- L>0, M>0, format(atom(Mn),'+~d',[M]).
mkvantumo(L,M,Mn) :- L>0, M<0, format(atom(Mn),'~d',[M]).

% energiskemo laŭ Madelung / Klechkowski / Moeller  
subshelo(N,L,S,O) :-
  % la orbitaloj estas okupitaj laŭ
  % kreskantaj energiniveloj n+l
  between(1,8,X),
  between(1,7,N),
  % l: 0..n-1
  Lmax is N - 1,
  between(0,Lmax,L), 
  L is X - N,
  n_orb(L,O),
  % la orbitalo nomiĝas laŭ shelo + subshelo
  subshelo(L,Ss),
  atom_concat(N,Ss,S).

% https://de.wikipedia.org/wiki/Pauling-Schreibweise
pauling(S) :-
    subshelo(_,_,S,O),
    length(L,O),
    maplist(p_orb_,L,P),!,
    writeln(P).

p_orb_(_,'..').

%! Kreas modelon de orbitaloj el kvantumnombro N kaj kromkvantumnombro L
%orbitaloj(N,L,O) :-
