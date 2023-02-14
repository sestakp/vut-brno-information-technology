%include '/usr/share/sasm/include/io.inc'
%include '/usr/share/sasm/include/rw32-2018.inc'

section .data
    ;zde je misto na vase data
    a dw 2
    b dw -4
    c dw 15
    d dw -2
    e dw 10
    f dw 2
    
section .bss
    ;misto pro dynamicka data
    
section .text
global CMAIN


;function to calculate int
;((a+b)*(c+d)-e)/f
;((a+b)*(c+d)-e)%f
;
;
; result is in eax
; int Function(int a, int b, int c, ind d, int e, int f)
; result is stored in EAX... result after div in upper 16 bits and rest on lower 16 bits 
Function_CDECL:
    push ebp
    mov ebp,esp
    sub esp,4 ;local variable
    
    mov ax, [ebp + 8] ;reading A
    mov bx, [ebp + 12] ;reading B
    add ax, bx ; (a+b)
    mov [ebp-4], ax ; store ax to local variable
    mov ax, [ebp + 16] ; reading C
    mov bx, [ebp + 20] ; reading D
    add ax,bx ; AX =(c+d)
    mov bx, [ebp-4]; BX = (a+b)
    
    IMUL bx ;(c+d)*(a+b) = DX:AX
    mov bx, ax ; save ax to bx
    
    ;store DX:AX to EAX
    mov ax,dx ;store DX(upper 16 bits) to AX
    shl ax,16 ;SHIFT DX by 16 to left
    mov ax,bx ; STORE BX to lower 16 bits
        
    mov bx,[ebp + 24] ;reading e
    sub ax,bx ;(c+d)*(a+b)-e
    
    cwd
    
    mov bx, [ebp + 28]
    
    idiv bx
    
    mov esp,ebp
    pop ebp
    ret

CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    ;write your code here
    
    mov ax, -4
    cwd
    mov cx, 2
    idiv  cx
    
    
    mov eax, [f]
    push eax
    mov eax,[e]
    push eax
    mov eax,[d]
    push eax
    mov eax,[c]
    push eax
    mov eax,[b]
    push eax
    mov eax,[a]
    push eax
    
    call Function_CDECL
    add esp, 24 ;clearing stack
    
    
    pop ebp    
    ret