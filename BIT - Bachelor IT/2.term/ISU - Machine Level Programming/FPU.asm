%include '/usr/share/sasm/include/io.inc'
%include '/usr/share/sasm/include/rw32-2020.inc'

section .data
    ;zde je misto na vase data
    r dd 7
    string db "Obsah kruhu o polomeru ",0
    string2 db " je "
section .bss
    ;misto pro dynamicka data

section .text

; void CIRCLE_AREA_cstdl(int r){
; float c = pi * r *r;
; printf("%f",c);}
CIRCLE_AREA_cstdl:
    push ebp
    mov ebp,esp
    
    
    ;start working with FPU
    finit                   ;st0    st1     st2     st3     st4
    fldpi                   ;pi
    fild dword [esp+8]      ;r      pi
    fld st0                 ;r       r       pi
    fmul
    fmul
    
    mov eax,[esp+8]
    
    mov esi,string
    call WriteString
    call WriteInt32
    
    mov esi,string2
    call WriteString
    
    call WriteDouble
    
    
    pop ebp
    ret 4


global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    ;write your code here
    
    xor eax,eax
    mov eax, dword [r]
    push eax
    call CIRCLE_AREA_cstdl
    
    pop ebp    
    ret
