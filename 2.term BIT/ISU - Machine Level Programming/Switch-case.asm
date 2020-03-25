%include "/usr/share/sasm/include/io.inc"
%include "/usr/share/sasm/include/rw32-2018.inc"

section .data
        Text_0 db "Vitej na svete",0
        Text_7 db "Huraaa do skoly",0
        Text_15 db "Dostanes svou obcanku",0
        Text_18 db "Dosazeno plnoletosti",0
        Text_21 db "Moznost ridicaku na kamion",0
        Text_25 db "Uz jsi s nami ctvrt stoleti",0
        Text_65 db "Konecne muzes do duchodu",0
        Text_default db "Jsi uz zase o rok starsi",0
        
        value db 17
section .bss


section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    xor eax, eax
    xor edx,edx
    ;write your code here    
    mov dl,[value]
    
    CMP dl, 0
    JE CASE_0
    CMP dl, 7
    JE CASE_7
    CMP dl, 15
    JE CASE_15
    CMP dl, 18
    JE CASE_18
    CMP dl, 21
    JE CASE_21
    CMP dl, 25
    JE CASE_25
    CMP dl, 65
    JE CASE_65
    JMP CASE_DEFAULT
    
    
CASE_0:
    mov esi, Text_0
    JMP CASE_END

CASE_7:
    mov esi, Text_7
    JMP CASE_END

CASE_15:
    mov esi, Text_15
    JMP CASE_END

CASE_18:
    mov esi, Text_18
    JMP CASE_END

CASE_21:
    mov esi, Text_21
    JMP CASE_END

CASE_25:
    mov esi, Text_25
    JMP CASE_END

CASE_65:
    mov esi,Text_65
    JMP CASE_END
CASE_DEFAULT:
    mov esi, Text_default
CASE_END:
    
    call WriteString
    call WriteNewLine
    
    pop ebp
    ret