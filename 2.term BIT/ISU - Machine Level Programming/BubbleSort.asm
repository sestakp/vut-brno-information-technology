%include '/usr/share/sasm/include/io.inc'
%include '/usr/share/sasm/include/rw32-2018.inc'

section .data
        Array dd 75,14,25,9,15,1,90,50
        Counter db 8
        
section .text
global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    ;write your code here
   
    xor eax,eax
    xor ebx,ebx
    xor ecx,ecx
    xor edx,edx
    
    ;decrement counter
    mov al,[Counter]
    dec al
    mov [Counter], al
 
; C equivalent   
; for(int DL = 0; DL < Counter;DL++)
;   for(int ECX = 0; ECX < (Counter - DL); ECX++)
;       if(Arr[ECX] > Arr[ECX+1])
;       {
;           temp = Arr[ECX];
;           Arr[ECX] = Arr[ECX+1]
;           Arr[ECX+1] = temp           
;       }
       
BUBBLESORT:

    ;inside loop
    mov eax, [Array+ecx*4] ; load first numb to eax
    mov ebx, [Array+ecx*4+4] ; load second numb to ebx
    
    cmp eax,ebx 
    js NSWAP ;if (eax < ebx) jump to NSWAP label
    ;else swap numbers and store to memory
    mov [Array+ecx*4+4], eax 
    mov [Array+ecx*4], ebx
 NSWAP:
    
    mov eax, [Counter] ;counter is in eax
    sub eax,edx ; Counter - DL 
    inc ecx ;increment ECX
    
    cmp ecx, eax 
    js BUBBLESORT ;ECX < (Counter - DL)
    ;end of inside loop
    
    
    xor ecx,ecx ; reset counter for inside loop
    
    inc dl ;increment counter for extern loop counter
    cmp dl, [Counter] ;compare loop counter with 
    js BUBBLESORT


    xor ecx,ecx ;reset ecx
    mov ebx, [Counter]
    inc ebx ;because we dec before we need to 
PRINT:
    
    mov eax, [Array + ecx*4]
    call WriteInt32
    call WriteNewLine
    
    inc ecx
    cmp ecx, ebx
    js PRINT
    xor eax, eax
    ret
