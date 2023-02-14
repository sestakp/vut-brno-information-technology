%include "io.inc"

section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    ;write your code here

    ;seting first numbs of fibonacci
    mov eax, 1
    mov edx, 1
    
    ;set number of loop for counting fibonacci sequence
    mov ecx, 5
FIBO1:
    add eax, edx
    add edx, eax  
    loop FIBO1     
                        
    xor eax, eax
    ret