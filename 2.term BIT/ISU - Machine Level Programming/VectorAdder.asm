%include "/usr/share/sasm/include/io.inc"
%include "/usr/share/sasm/include/rw32-2018.inc"

section .data
    
    vec1 dw 8,4,5,12
    
    vec2 dw 29,18,19,18
    
    len db 4

section .bss
    result resw 4

section .text
global CMAIN

;first argument on stack address of vec1 WORD
;second argument on stack address of vec2 WORD
;third argument on stack length of vectors BYTE
;return vector in edx
VectorAdder:
    push ebp
    mov ebp, esp
    xor eax,eax
    mov ecx, [esp + 8] ;address of third argument
    mov edx, [esp + 12] ;address of second argument
    mov ebx, [esp + 16] ;address of first argument
   
SUM:
    dec ecx ;decrerment loop counter
    
    mov ax, [ebx+ecx*2] ;store value on current index from first vector
    add ax, [edx+ecx*2] ;add value on current index from second vector to first vector
    push ax ;push result to stack
    cmp ecx,0 
    jnz SUM
    
    
    xor ecx,ecx
REVERSE: 
    
    pop ax ;get result from stack in reverse 
    mov [edx+ecx*2],ax ;move result to edx
    inc ecx
    cmp ecx,[esp + 8]
    
    jnz REVERSE
    
    pop ebp
    ret 12 ;call + store ebp + three arguments need to be cleared from stack
    
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    xor eax, eax
    ;write your code here    
    
    ;adding arguments to stack for function Vector Adder
    mov eax,vec1
    push eax 
    mov eax,vec2
    push eax
    mov eax,[len]
    push eax
    
    call VectorAdder

    xor ecx,ecx
PRINT:
    mov ax,[edx+ecx*2]
    inc ecx
    call WriteInt16
    mov al, ';'
    call WriteChar
    cmp ecx,[len]
    jnz PRINT    
    
    pop ebp
    ret