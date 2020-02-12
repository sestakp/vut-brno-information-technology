%include "io.inc"

section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    ;write your code here
    ;code to compare two numbs
    ;reset
    mov eax, 0
    mov ecx, 0
    mov edx, 0
    ;first numb stored in al
    mov al, 22
    ;second numb stored in cl
    mov cl, 15
    ;registrer to store bigger numb
    mov dl, 0
     
    cmp al,cl
    ;jump if greater to label ALGREATER
    JG ALGREATER
    mov dl,cl
    jmp END  
ALGREATER:
    mov dl,al
     
END:
        
    
    
    
    xor eax, eax
    ret