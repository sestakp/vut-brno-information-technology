%include "/usr/share/sasm/include/rw32-2018.inc"

section .data
    number dw 1967 ; number to transfer

    systems db 2,8,16 ;bases of systems
    sys_count db 3 ;count of systems

section .bss
    data resb 40 ;reserved 40bytes in memory to reverse numb

section .text
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp

    ;data registers clearing
    mov edx, 0
    mov eax, 0
    mov ecx, 0
    mov ebx, 0

;initialize before starting transfer number between bases
INIT:
     mov esi, data ;move address of data to esi
     mov ax, [number] ;set number to ax
     mov bl, [systems+ecx] ;set current base of system for div
     mov edx, 0 ;clear because div use it and used it for test
     inc ecx ;counter of array with systems
     
;part with transfer to different base
DIVIDE:
    div bx ; div ax = dx:ax/bx
    mov [esi], dl ; dl is rest, mov rest after div to data
    mov dx, 0 ;clear rest after div
    inc esi ;increment data position

    cmp ax, 0
    jnz DIVIDE ;jump if not zero

;reading transfered number reversed
READ:
    dec esi ;decrement address of esi and move in stored data
    mov al, [esi] ;store byte from data to reg al
    call WriteInt8 ;Calling writing 8b int to stdout
    cmp esi, data ;compare address of esi and data to check if we read all numbs
    JNZ READ ;if esi != data jump to label READ
    call WriteNewLine ;Calling function to make newline on stdout

TEST:
    mov al, [sys_count] ;mov dereferenced address counter of systems to al
    mov dl, [systems+eax-1] ; to dl dereferenced address transfer systems + system_counter - 1
    cmp bl, dl ;compare last system from systems with actual transfered system
    JNZ INIT ;if its not equal jump to init of loop

END:
    pop ebp
    ret
