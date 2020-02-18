%include "io.inc"

section .text

input1 db 24 ;first operand
input2 db 12 ;second operand
operation db 4 ;1 = ADD,2 = SUB, 3 = MUL, 4 = DIV

global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    ;write your code here
    mov eax, 0	;clearing registers
    mov ebx, 0
    mov ecx, 0
    mov edx, 0
    
    mov bl, [input1]
    mov dl, [input2]
    mov cl, [operation]
    
    CMP cl,1
    JE ADD
    
    CMP cl,2
    JE SUB
    
    CMP cl, 3
    JE MUL
    
    CMP cl, 4
    JE DIV
ADD:
    mov al, bl
    cbw
    mov cx, ax
    mov ax,0
    mov al, dl
    cbw
    ADD cx, ax ;result in register cx
    
    JMP END
SUB:
    mov cl, 0
    sub bl, dl
    mov cl,bl
    
MUL:
    mov eax, 0
    
    mov al,bl
    mul dl; result in register ax
DIV:
    mov eax, 0
    
    mov al,bl
    div dl; result in register ax
END:
    xor eax, eax
    ret
