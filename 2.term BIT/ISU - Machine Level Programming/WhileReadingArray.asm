%include "/usr/share/sasm/include/io.inc"
%include "/usr/share/sasm/include/rw32-2018.inc"

section .data
    Array db 5,14,28,15,10,0 ;Array must end with 0
    
section .bss


section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    xor eax, eax
    ;write your code here    
    
xor ecx,ecx

;While part

WHILE:
 mov al, [Array+ecx]
 cmp al, 0
 jz WHILE_END
 inc ecx
 
 call WriteInt8
 call WriteNewLine         
      
 JMP WHILE
WHILE_END:    
    
call WriteNewLine    
    
    
 ;Section with DO WHile   
    
    
xor ecx,ecx

mov al, [Array+ecx]
cmp al, 0
jz DO_WHILE_END
    
DO_WHILE:    
 call WriteInt8   
 call WriteNewLine     
 inc ecx
 mov al, [Array+ecx]
cmp al, 0
jnz DO_WHILE     

DO_WHILE_END:    
    pop ebp
    ret