%include "rw32-2018.inc"

section .data
    ; zde budou vase data

    ;concatenate prefix and suffix toggether to copy and print
    prefix dw 'H','e','l','l','o'
    size_pref dd 5
    suffix dd ' ','W','o','r','l','d','!'
    size_suf dd 7

section .bss
    copy resb 13

section .text
CMAIN:
    push ebp
    mov ebp, esp

    ; zde bude vas kod

    ;clean
    mov eax,0
    mov ebx,0
    mov edx, 0
    mov ecx,[size_pref] ;counter for loop

PREFIX:
    ;ebx*2 because prefix is declared like a word
    mov edx,[prefix + ebx*2] ;start copying prefix to copy with stop in register edx
    mov [copy + ebx],edx

    inc ebx; Increment register ebx
    loop PREFIX




    mov ecx,[size_suf] ;set new counter for loop

    mov eax, 0 ;eax used for index suffix because its double word

SUFFIX:
    ;eax *4 because its double word
    mov edx, [suffix + eax*4] ;move from suffix to copy array
    mov [copy + ebx], edx

    inc ebx
    inc eax
    loop SUFFIX



READ:
    mov esi, copy
    inc ebx

    call WriteString

    pop ebp
    ret
