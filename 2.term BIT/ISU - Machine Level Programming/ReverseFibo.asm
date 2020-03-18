%include "io.inc"
%include "rw32-2018.inc"

section .data

    Numbs db 10

section .text
global CMAIN

;Fibonacci recursive function
;expect three arguments on stack
;1st pushed argument count of numbers
;2nd pushed argument first numb
;3rd pushed argument second numb

PrintFIBO:
    push ebp ;save ebp to stack
    mov ebp,esp
    ;here is code
    
    mov eax,[esp+8]    ;3rd argument
    mov ebx,[esp+12]   ;2nd argument
    mov edx,[esp+16]   ;1st argument
    
    add ebx, eax       ;ebx + edx calculate new item of fibo
    dec edx ;decrement counter of numbs
    
    cmp edx,0 ;if its zero print number, else push new numbers to stack and recursive call again 
    jz LAST

ELSE:
    push edx
    push eax
    push ebx
    call PrintFIBO    
LAST:
    mov eax, [esp +8]
    call WriteInt32
    call WriteNewLine
    
END:    
    
    pop ebp
    ret 12  ;clear stack


CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    ;write your code here
    
    mov eax,[Numbs] ;move number of fibonnaci elements you want to print
    push eax ;push numbs to stack
    mov eax,1 ;fibonacci start 1,1,2... push first two elements to stack
    push eax
    push eax
    call PrintFIBO ;call recursive fibonacci function    
    
    xor eax, eax
    pop ebp
    ret