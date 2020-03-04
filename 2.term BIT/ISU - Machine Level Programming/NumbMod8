%include "rw32-2018.inc"

section .data
    ; zde budou vase data

section .text
CMAIN:
    push ebp
    mov ebp, esp

    ; zde bude vas kod


    ;clear registers
    mov eax, 0
    mov ebx, 0
    mov ecx, 0
    mov edx, 0


   ;application return all numbers <0,60> mod 8 == 0
ITERATION:
    ;test == undestructive &&
    test cl,7 ; bit mask
    JNZ ADD

    mov al,cl ;just for print :-) to STDOUT
    call WriteInt8
    call WriteNewLine
    JMP ADD

ADD:
    inc cl
    cmp cl,60
    JNE ITERATION

    pop ebp
    ret
