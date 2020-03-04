%include "rw32-2018.inc"

section .data
    ; zde budou vase data

section .text
CMAIN:
    push ebp
    mov ebp, esp
    
    ; zde bude vas kod
    
    ;clear registers
    mov eax,0
    mov ebx,0
    mov ecx,0
    mov edx,0
    
    mov bx, 1234 ;first numb
    mov cx, 5678 ;second numb
    
    ;store to 16bits numbers to one 32 bits reg
    ;store this to EAX = BX:CX
    
    mov ax,bx ;mov bx to ax
    shl eax,16 ; shift eax to left by 16
    mov ax,cx ; store cx to lower 16 bits of eax
    
    ;clear bx,cx
    mov bx,0
    mov cx,0
    
    ;store ax to cx
    mov cx,ax
    shr eax,16 ; shift back
    mov bx,ax    ;store
    
    ;print
    mov ax,bx
    call WriteInt16
    call WriteNewLine
    
    mov ax,cx
    call WriteInt16
    call WriteNewLine
    
    
    pop ebp
    ret
