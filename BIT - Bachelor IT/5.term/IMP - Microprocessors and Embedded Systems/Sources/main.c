//       An example for demonstrating basic principles of FITkit3 usage.
//
// It includes GPIO - inputs from button press/release, outputs for LED control,
// timer in output compare mode for generating periodic events (via interrupt
// service routine) and speaker handling (via alternating log. 0/1 through
// GPIO output on a reasonable frequency). Using this as a basis for IMP projects
// as well as for testing basic FITkit3 operation is strongly recommended.
//
//            (c) 2019 Michal Bidlo, BUT FIT, bidlom@fit.vutbr.cz
////////////////////////////////////////////////////////////////////////////
/* Header file with all the essential definitions for a given type of MCU */
#include "MK60D10.h"

/* Macros for bit-level registers manipulation */
#define GPIO_PIN_MASK 0x1Fu
#define GPIO_PIN(x) (((1)<<(x & GPIO_PIN_MASK)))

#define BTN_SW2_RIGHT 0x400     // Port E, bit 10
#define BTN_SW3_DOWN 0x1000    // Port E, bit 12
#define BTN_SW4_LEFT 0x8000000 // Port E, bit 27
#define BTN_SW5_UP 0x4000000 // Port E, bit 26
#define PIEZZO_MASK 0x10 //Port A, bit 4

#define NULL 0

#define COL_0 8
#define COL_1 10
#define COL_2 6
#define COL_3 11

#define ROW_0 26
#define ROW_1 24
#define ROW_2 9
#define ROW_3 25
#define ROW_4 28
#define ROW_5 7
#define ROW_6 27
#define ROW_7 29

#define COLS 16
#define ROWS 8
#define SNAKE_LEN 6

typedef struct{
	int col;
	int row;
} Cell;

typedef enum {
	UP,
    DOWN,
    LEFT,
	RIGHT
} Direction;


/*SECTION GLOBAL VARIABLES*/
unsigned int compare; //Compare value for low power timer
Direction direction; //Represent current direction of snake
char currentCol = 0; //Represent index for column multiplexing
Cell snake[SNAKE_LEN]; //Snake representation
int head; //Index in array of snake head
int gameRun; //indicate if is game, or game over
const unsigned int rows[8] = {ROW_0, ROW_1, ROW_2, ROW_3, ROW_4, ROW_5, ROW_6, ROW_7 }; //Rows on matrix display
const unsigned int cols[4] = {COL_0, COL_1, COL_2, COL_3 }; //Columns on matrix display
const unsigned int buttons[4] = { 10, 12, 27, 26 }; // Buttons to control snake

/*END OF SECTION GLOBAL VARIABLES*/

void updateHeadIndex(){
	head--;
	if(head < 0){
		head = SNAKE_LEN -1;
	}
}

void incrementCol(Cell *cell){
	if(cell != NULL){
		cell->col = (cell->col + 1) % 16;
	}
}

void decrementCol(Cell *cell){
	if(cell != NULL){
		cell->col--;
		if(cell->col < 0){
			cell->col = 15;
		}
	}
}

void incrementRow(Cell *cell){
	if(cell != NULL){
		cell->row = (cell->row + 1) % 8;
	}
}

void decrementRow(Cell *cell){
	if(cell != NULL){
		cell->row--;
		if(cell->row < 0){
			cell->row = 7;
		}
	}
}

/* A delay function */
void delay(long long bound) {
  long long i;
  for(i=0;i<bound;i++){
	  __NOP();
  }
}

void beep() {
    for (uint32_t q=0; q<200; q++) {
        GPIOA_PDOR |=  PIEZZO_MASK;
        delay(200);
        GPIOA_PDOR &= ~PIEZZO_MASK;
        delay(200);
    }
}

/* Initialize the MCU - basic clock settings, turning the watchdog off */
void MCUInit()  {
    MCG_C4 |= ( MCG_C4_DMX32_MASK | MCG_C4_DRST_DRS(0x01) );
    SIM_CLKDIV1 |= SIM_CLKDIV1_OUTDIV1(0x00);
    WDOG_STCTRLH &= ~WDOG_STCTRLH_WDOGEN_MASK;
}

void PortsInit()
{
    /* Turn on all port clocks */
    SIM->SCGC5 = SIM_SCGC5_PORTE_MASK | SIM_SCGC5_PORTA_MASK;

    PORTE->PCR[10] = PORT_PCR_MUX(0x01); // SW2
    PORTE->PCR[12] = PORT_PCR_MUX(0x01); // SW3
    PORTE->PCR[27] = PORT_PCR_MUX(0x01); // SW4
    PORTE->PCR[26] = PORT_PCR_MUX(0x01); // SW5

    for(int i=0; i < 4; i++) {
    		PORTE->PCR[buttons[i]] = ( PORT_PCR_ISF(0x01) /* Nuluj ISF (Interrupt Status Flag) */
    				| PORT_PCR_IRQC(0x0A) /* Interrupt enable on failing edge */
    				| PORT_PCR_MUX(0x01) /* Pin Mux Control to GPIO */
    				| PORT_PCR_PE(0x01) /* Pull resistor enable... */
    				| PORT_PCR_PS(0x01)); /* ...select Pull-Up */
    }

	NVIC_ClearPendingIRQ(PORTE_IRQn); /* clear interrupt flag on port E */
	NVIC_EnableIRQ(PORTE_IRQn);       /* enable interrupt on port  E */

    // START SETUP GPIO PINS

    for(int i = 0; i < 4; i++){
    	PORTA->PCR[cols[i]] = ( 0|PORT_PCR_MUX(0x01) );
    }

    for(int i = 0; i < 8; i++){
    	PORTA->PCR[rows[i]] = ( 0|PORT_PCR_MUX(0x01) );
    }

    PORTA->PCR[4] = ( 0|PORT_PCR_MUX(0x01));  /* Pin Mux Control - GPIO (BZZZZZZ) */

    //END OF SETUP GPIO PINS

    /* Change corresponding PTB port pins as outputs */

    /*SET GPIO PINS TO OUTPUT*/
    PTA->PDDR = GPIO_PDDR_PDD(0x3F000FD0); //set mask 0b00111111000000000000111111010000 (PTA[6..11] and PTA[24..29])
    /*END OF SET GPIO PINS TO OUTPUT*/

}

//Timer handler
void LPTMR0_IRQHandler(void)
{
	//Speed up snake
	compare *= 0.99;
	if(compare < 0x20){
		compare = 0x20;
	}
    LPTMR0_CMR = compare;                // !! the CMR reg. may only be changed while TCF == 1
    LPTMR0_CSR |=  LPTMR_CSR_TCF_MASK;   // writing 1 to TCF tclear the flag

	Cell currHead = snake[head];

	updateHeadIndex();

    switch(direction){
		case UP:
			decrementCol(&currHead);
			break;
		case DOWN:
			incrementCol(&currHead);
			break;
		case LEFT:
			incrementRow(&currHead);
			break;
		case RIGHT:
			decrementRow(&currHead);
			break;
    }


    for(int i = 0; i < SNAKE_LEN; i++){

    	//GameOVER
    	if(snake[i].col == currHead.col && snake[i].row == currHead.row){
    		gameRun = 0;
    		beep();
    	}
    }
	snake[head] = currHead;

}

void PORTE_IRQHandler(void) {

	delay(1000); //Kontrola zakmytu pri pousteni
	if((PORTE->ISFR & BTN_SW2_RIGHT) != 0){

		if((GPIOE->PDIR & BTN_SW2_RIGHT) != 0){
			PORTE->ISFR |= BTN_SW2_RIGHT;
			return;
		}
		direction = RIGHT;
	}

	if((PORTE->ISFR & BTN_SW3_DOWN) != 0){
		if((GPIOE->PDIR & BTN_SW3_DOWN) != 0){
			PORTE->ISFR |= BTN_SW3_DOWN;
			return;
		}
		direction = DOWN;
	}

	if((PORTE->ISFR & BTN_SW4_LEFT) != 0){
		if((GPIOE->PDIR & BTN_SW4_LEFT) != 0){
			PORTE->ISFR |= BTN_SW4_LEFT;
			return;
		}
		direction = LEFT;
	}

	if((PORTE->ISFR & BTN_SW5_UP) != 0){

		if((GPIOE->PDIR & BTN_SW5_UP) != 0){
			PORTE->ISFR |= BTN_SW5_UP;
			return;
		}
		direction = UP;
	}

	delay(1000); //Kontrola zakmytu pri pousteni

	//Clear interupt flags, to handle interupt just one
	PORTE->ISFR |= BTN_SW2_RIGHT;
	PORTE->ISFR |= BTN_SW3_DOWN;
	PORTE->ISFR |= BTN_SW4_LEFT;
	PORTE->ISFR |= BTN_SW5_UP;
}

void LPTMR0Init(int count)
{
    SIM_SCGC5 |= SIM_SCGC5_LPTIMER_MASK; // Enable clock to LPTMR
    LPTMR0_CSR &= ~LPTMR_CSR_TEN_MASK;   // Turn OFF LPTMR to perform setup
    LPTMR0_PSR = ( LPTMR_PSR_PRESCALE(0) // 0000 is div 2
                 | LPTMR_PSR_PBYP_MASK   // LPO feeds directly to LPT
                 | LPTMR_PSR_PCS(1)) ;   // use the choice of clock
    LPTMR0_CMR = count;                  // Set compare value
    LPTMR0_CSR =(  LPTMR_CSR_TCF_MASK    // Clear any pending interrupt (now)
                 | LPTMR_CSR_TIE_MASK    // LPT interrupt enabled
                );
    NVIC_EnableIRQ(LPTMR0_IRQn);         // enable interrupts from LPTMR0
    LPTMR0_CSR |= LPTMR_CSR_TEN_MASK;    // Turn ON LPTMR0 and start counting
}

void rotateDisplay(){

	//Clear columns and rows
	GPIOA_PDOR &= 0b11000000111111111111000000111111;

	for(int r = 0; r < 8; r++){
		for (int j = 0; j < SNAKE_LEN; j++){
			if(snake[j].col == currentCol && snake[j].row == r){
				GPIOA_PDOR |= 1 << rows[r];
			}
		}
	}

	//Set new column value
	for(int i = 0; i < 4; i++){
		GPIOA_PDOR |= (currentCol & ( 1 << i )) >> i << cols[i];
	}

	//Increment column counter
	currentCol = (currentCol + 1) % 16;
	delay(4250);
}


int main(void){
     MCUInit();
    PortsInit();

    LPTMR0Init(compare);

    while(1){
    	beep();
        for(int i = 0; i < SNAKE_LEN; i++){
        	snake[SNAKE_LEN - i - 1].col = 2 + i;
        	snake[SNAKE_LEN - i - 1].row = 2;
        }
        gameRun = 1;
        head = 0;
        GPIOA_PDOR = 0;

        compare = 0x200;
        direction = DOWN;


        while (gameRun) {

        	rotateDisplay();
        }
    }

    return 0;
}

////////////////////////////////////////////////////////////////////////////////
// EOF
////////////////////////////////////////////////////////////////////////////////
