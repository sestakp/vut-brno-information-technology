%include "io.inc"
%include "rw32-2018.inc"

section .data
    
    values db 10, 20, 5, 8, 9, 9, 7, 15 

    length db 8
    
section .text

global CMAIN

;function calculate average integer value
;1st argument length of array
;2nd argument pointer to array of byte
AVERAGE:
    push ebp
    mov ebp,esp
    
    
    xor eax,eax
    
    mov ecx, [esp+8] ;length
    mov esi, [esp+12] ;address of array
    
    mov edx,ecx ;store value of ecx to eax
CALC:
    mov ebx, [esi+ecx];calculate position in array
    add al,bl ;sum is stored in dl
    
    loop CALC    
    
    mov ecx,edx ;restore ecx from eax
    xor dx,dx ;clearign edx because div calculate with DX
    div cx ;AX:=DX:AX / Op
    
    call WriteInt16 ;print average value
          
    pop ebp
    ret 8


CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    ;write your code here
    
    mov ebx,values ;store pointer to values and push to stack
    push ebx
    mov eax,[length] ;store length and push it to stack
    push eax
    
    call AVERAGE
    
    xor eax, eax
    pop ebp
    ret