Enviroments
---------

Ubuntu 64bit
Windows 64bit

Authors
------

Team name: Out of memory
- xsesta07 Pavel Sestak
- xkulis03 Vojtech Kulisek
- xpleva07 Lukas Plevac
- xkolar77 Marie Kolarikova

License
-------

This program is distributed under GPL-3.0 License.

Icon of application source: flaticon.com/free-icon/calculator_2374370
Distributed under GPL licence

# Run project

cd src && make run

In makefile are specifed tests, coverage tests, build, doc.


# Lexical analysis
T_ADD = { + }
T_SUB = { - }
T_MUL = { * }
T_DIV = { / }
T_POW = { ^ }
T_NUMB = /\d+/
T_BRK_L = { ( }
T_BRK_R = { ) }
T_FACT = { ! }
T_ROOT = { √ }
T_MOD = { % }
# Formal gramatik

G = (N, $\Sigma$, P, E)

N = { <E\> }

$\Sigma$ = { T_ADD, T_SUB, T_MUL, T_DIV, T_POW, T_NUMB, T_BRK_L, T_BRK_R, T_FACT, T_ROOT, T_MOD }

P = {

    1) <E\> = T_NUMB,

    2) <E\> = <E\> T_ADD <E\>,

    3) <E\> = <E\> T_SUB <E\>,

    4) <E\> = <E\> T_MUL <E\>,

    5) <E\> = <E\> T_DIV <E\>,

    6) <E\> = <E\> T_POW <E\>,

    7) <E\> = <E\> T_MOD <E\>,
    
    8) <E\> = <E\> T_ROOT <E\>,

    9) <E\> = T_BRK_L <E\> T_BRK_R,

    10) <E\> = <E\> T_FACT,

    11) <E\> = T_ROOT <E\>

}

E = { <E\> }


# Precedent analysis
Precedent analysis solve problem of operators priorities.
For that reason was designed gramatik.

|         | T_ADD | T_SUB | T_MUL | T_DIV | T_POW | T_NUMB | T_BRK_L | T_BRK_R | T_FACT | T_ROOT | T_MOD | $   |
| ------- | ----- | ----- | ----- | ----- | ----- | ------ | ------- | ------- | ------ | ------ | ----- | --- |
| T_ADD   | >     | >     | <     | <     | <     | <      | <       | >       | <      | <      | <     | >   |
| T_SUB   | >     | >     | <     | <     | <     | <      | <       | >       | <      | <      | <     | >   |
| T_MUL   | >     | >     | >     | >     | <     | <      | <       | >       | <      | <      | >     | >   |
| T_DIV   | >     | >     | >     | >     | <     | <      | <       | >       | <      | <      | >     | >   |
| T_POW   | >     | >     | >     | >     | <     | <      | <       | >       | <      | <      | >     | >   |
| T_NUMB  | >     | >     | >     | >     | >     | _      | _       | >       | >      | >      | >     | >   |
| T_BRK_L | <     | <     | <     | <     | <     | <      | <       | =       | <      | <      | <     | _   |
| T_BRK_R | >     | >     | >     | >     | >     | _      | _       | >       | >      | >      | >     | >   |
| T_FACT  | >     | >     | >     | >     | >     | _      | <       | >       | >      | >      | >     | >   |
| T_ROOT  | >     | >     | >     | >     | <     | <      | <       | >       | <      | <      | >     | >   |
| T_MOD   | >     | >     | >     | >     | <     | <      | <       | >       | <      | <      | >     | >   |
| $       | <     | <     | <     | <     | <     | <      | <       | <       | <      | <      | <     | <   |