%include "io.inc"

section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    
    ; swipe numbers ax,dx
    xor eax, eax
    
    ;clean values iun registers
    mov eax, 0
    mov edx, 0
    mov ecx, 0
    
    ;swipe this numbers in registers
    mov al, 95
    mov dl, 120
    
    ;sbw transfer byte to word from ref AL to AX
    cbw
    ;save ax result to dx
    mov cx, ax
    
    mov ax, 0
    ;load dl to al
    mov al, dl
    ;transfer AL to AX
    cbw
    ;move from cx(temp) to dx    
    mov dx, cx
    
    ret