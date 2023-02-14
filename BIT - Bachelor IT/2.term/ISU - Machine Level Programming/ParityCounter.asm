%include "rw32-2018.inc"

section .data
    ; zde budou vase data
    var dd 1848945644
    ;0b1101110001101001010101111101100
    ;first 8 bits 11101100 = 5*1
    ;first 16 bits 1010101111101100 = 10*1
    ;first 32 bits 01101110001101001010101111101100 = 18

    system db 8, 16, 32
    tot_sys db 3

section .text
CMAIN:
    push ebp
    mov ebp, esp

    ;reset reg
    mov eax,0
    mov ebx,0
    mov ecx,0
    mov edx,0
        ; zde bude vas kod

    mov bh, [tot_sys] ; counter of systems
    mov ch, 0 ; counter of iterations
     mov esi, system ; address of systems
INIT:
    mov edx, [var]
    mov bl, 0 ; counter of parity
    mov cl, [esi] ; counter for loopsystem
    inc ch
    inc esi; increment address  of esi
LOOPSYSTEM:

    ror edx,1 ;rotate bits to right throw carry
    JC INCCOUNT ; jump if carry

    dec cl ;decrement loop counter
    cmp cl,0 ;compare loop counter to 0
    JNE LOOPSYSTEM ; if not equal jump t next iteration


    JMP TEST ; miss INCCOUNT

INCCOUNT:
    inc bl ;increment counter of parity
    dec cl ;decrement loop counter and test
        cmp cl,0
    JNE LOOPSYSTEM


TEST:
    mov al, bl ;mov counter of parrity to accumulator to print
    call WriteInt8
    call WriteNewLine

    cmp bh, ch ;compare counter opf systems with current itteration
    JNE INIT ; if not equal jump to INIT else END

END:
    pop ebp
    ret
