%include "rw32-2018.inc"

section .data
    ; zde budou vase data
    prefix dw 0,1,2,3,4,5,6,7,8 ;items of arr
    size dd 9 ; size of arr
section .bss ;section for our data for arrays

    copy resb 9
section .text
CMAIN:
    push ebp
    mov ebp, esp

    ; zde bude vas kod

    ;clearing
    mov eax, 0
    mov esi, prefix ; load prefix to esi

    mov ecx, [size] ;load size to ecx like a counter

    mov ebx,0

SUM:
    add al, [esi + ebx] ; start address + ebx
    mov [copy + ebx],al

    add ebx,2 ; adding 2 beucase its word
    loop SUM

    mov ecx, [size] ;load size to ecx like a counter

    mov ebx,[size] ; ebx = size
    add ebx,[size] ; ebx = size *2 ;word

WRITE:
    mov al,[copy + ebx-2]
    ;calls declared in lib rw32-2018.inc
    call WriteInt8 ; write 8bit int to output
    call WriteNewLine ; write new line to output

    sub ebx, 2

    loop WRITE

    pop ebp
    ret
