%include "/usr/share/sasm/include/io.inc"
%include "/usr/share/sasm/include/rw32-2018.inc"

section .data
    notodd_msg db "Not odd: ",0
    
    odd_msg db "Odd: ",0
    
    number db 1
    
    Arr dw 15,4,7,12,0,1
    
    size db 6

section .text
FUNC_ODD_cstdl:
    push ebp
    mov ebp, esp
    
    mov eax, [esp + 8]
    test eax, 1
    jz NOT_ODD
    
    mov esi,odd_msg
    
    JMP exit
NOT_ODD:
    mov esi,notodd_msg

exit:
    call WriteString
    call WriteInt32
    call WriteNewLine
    
    mov esp, ebp
    pop ebp
    ret

global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    xor eax, eax
    ;write your code here    
    
    xor edx,edx 
    xor ecx,ecx ; clear loop counter
    xor ebx,ebx ; we need to clear upper 24 bits
    mov bl, [size] ; size is byte
FOR_LOOP:    
    
    
    mov dx,[Arr + ecx*2]
    push edx
    call FUNC_ODD_cstdl
    add esp, 4 
    
    inc ecx
    
    cmp ecx,ebx ;compare with size of arr
    jne FOR_LOOP
    
    pop ebp
    ret