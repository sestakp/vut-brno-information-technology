%include "io.inc"

section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    ;write your code here
    
    ;multiple numb by numb
    mov eax, 20 ;first numb
    mov ecx, 0 ;loop counter
    mov edx, 0 ;result
    mov ebx, 17 ;second numb
    
    mov  ecx,ebx ;set counter for loop
    
    
MULTIPLE:
    add edx, eax
    loop MULTIPLE    
    
    xor eax, eax
    ret