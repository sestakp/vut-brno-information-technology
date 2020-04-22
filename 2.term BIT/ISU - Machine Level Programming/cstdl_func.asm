%include '/usr/share/sasm/include/io.inc'
%include '/usr/share/sasm/include/rw32-2020.inc'

section .data
    ;zde je misto na vase data
    
    a dq 25.0
    const dd 0.000000001
    
    ;int16_t *data, uint8_t size
    data dw 17,20,14,1,11
    size db 5
    
section .bss
    ;misto pro dynamicka data
    
section .text
;newton method
;double MYSQRT(double a)
;param is in st0


;double MYSQRT(double a){
;	double xn, x;
;	xn = a;
;	x = 0;
;	while(abs(x-xn) > 0.000 000 001){
;		x = xn;
;		xn = (1/2) * (x + a/xn);	
;	}
;	return xn;
;}

MYSQRT:
    push ebp
    mov ebp,esp

    ;push A to FPU              ;st0        st1      st2      st3       st4
    fld qword [esp+8]           ; a
    fld st0                     ; xn         a
    fldz                        ; x          xn        a
    
.COND:
    fsub st0,st1                ;x-xn         xn      a
    fabs                        ;abs(x-xn)    xn      a
    fld dword [const]           ;const       abs(x-xn)   xn      a  
    fcomip                      ;const       abs(x-xn)  xn        a
    jnc MYSQRT.END_WHILE
     
.WHILE:
    fcomp
    ;x =xn
    fld st0                     ;x           xn        a
    ;xn = (1/2) * (x + a/xn)
    fld st2                     ;a            x          xn        a
    fdiv st2                    ;a/xn         x           xn       a    
    fadd                        ;x+a/xn       xn          a
    fld1                        ;1            x+a/xn      xn       a
    fld1                        ;1            1         x+a/xn     xn        a
    fadd st1                    ;2            1         x+a/xn     xn        a
    fdiv                        ;1/2         x+a/xn      xn        a
    fmul                        ;xn(new)      xn         a
    fxch                        ;x            xn         a  
    JMP MYSQRT.COND

.END_WHILE:
    fcomp
    pop ebp
    ret


;float AVG(int16_t *data, uint8_t size){
;	float sum = 0;
;	for(int i = 0; i < size; i++){
;		sum += data[i];
;	}
;	return sum / size;
;}

;returned to EAX, like cstdl convence for float
AVG:
    push ebp
    mov ebp,esp
    sub esp,4 ;creating local variable
    
    mov esi, [ebp+8] ;data
    mov ecx, [ebp+12] ;size
    finit
    fldz ;load zero
.FORLOOP:

    dec ecx ;decrement counter
    fild word [esi+ecx*2] ;load init to FPU
    fadd ;add two numbers and acumulate it, its represent SUMA
    
    cmp ecx,0 ; condition for loop
    jne AVG.FORLOOP
    
    fild word [ebp+12];load size
    fdiv ;st0 = suma/size

    fst dword [esp-4] ;store result to local variable    
    mov eax,[esp-4] ;local variable store to EAX
    
    mov esp,ebp ;cleaning local variable
    pop ebp
    ret


global CMAIN
CMAIN:
    mov ebp, esp; for correct debugging
    push ebp
    mov ebp, esp
    ;write your code here
    
    ;send upper bits
    push dword [a+4] ;we need to send qword separately by 4bytes
    
    ;send lower bits of a
    push dword [a]
    
    call MYSQRT
    add esp, 8
    call WriteDouble  ;returned in st(0), gcc compiler returning floating point numbers in st register too
    
    call WriteNewLine
    
    ;float AVG(int16_t *data, uint8_t size);
    push dword [size]
    push dword data
    call AVG
    add esp,8
    call WriteFloat
    
    
    pop ebp    
    ret