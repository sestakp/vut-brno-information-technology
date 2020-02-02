/************************************************/
/*                                              */
/*      2nd Project - Iteration calculations    */
/*                                              */
/*               Bisection method               */
/*                                              */
/*          Pavel Sestak (xsesta07)             */
/*                                              */
/*              19. 11. 2019                    */
/*                                              */
/*      Introduction to Programming Systems     */
/*                                              */
/*              1st year BITP                   */
/*                                              */
/*      VUT Faculty of Information Technology   */
/*                                              */
/************************************************/

//Library for basic input and output
#include <stdio.h>
//Included because function atof()
#include <stdlib.h>
//Include because function exp()
#include <math.h>

//Define return values of functions
#define SUCCESS 0
#define ERROR -1

//Return types of diode_wp
#define EPS 0
#define Ip 1

//Saturating electric current for diode
const double I_0 = 1E-12;

//product of emission coefficient, temperature and Boltzmann constant for diode
const double U_T = 0.0258563;

/*
 * Function: ArgcCheck
 * ----------------------------
 *	Checking app arguments. Checking if was specified searching string
 *
 *	Parameters:
 * 		argc - Argument counter
 *
 *	returns:
 *		1 - Argument wasn't specified
 *		0 - If arguments are ok, and second argument was assigned to searchtext
 * 	       -1 - If first argument isn't number
 */
int ArgcCheck(int argc, char * argv[])
{
	switch (argc)
	{
	case 4:
		if (strtod(argv[1], NULL) <= 0)
		{
			fprintf(stderr, "error: invalid arguments\n");
			//fprintf(stderr,"This application can't calculate diode in reverse mode, please insert input voltage > 0\n");
			return ERROR;
		}
		else if (strtod(argv[2], NULL) <= 0)
		{
			fprintf(stderr, "error: invalid arguments\n");
			//fprintf(stderr,"The resistence must be greater then 0!\n");
			return ERROR;
		}
		//eps must be in R+
		else if ((strtod(argv[3], NULL) <= 0))
		{
			fprintf(stderr, "error: invalid arguments\n");
			//fprintf(stderr,"The EPS must be greater than 0!\n");
			return ERROR;
		}
		else
			return SUCCESS;

	default:
		fprintf(stderr, "error: invalid arguments\n");
		/*
		fprintf(stderr,"Bad arguments\n\n");
		fprintf(stderr,"Launch app: ./proj2 U0 R EPS\n\n");
		fprintf(stderr,"U0 is the input voltage value in Volts\n");
		fprintf(stderr,"R is the resistance of the resistor in Ohms\n");
		fprintf(stderr,"EPS is absolute error / precision / deviation (epsilon)\n");
		*/
		return ERROR;
	}
}

/*

					  R             D
				âââââââââââââ       |\ |
	U	âââââââââ¤           ââââââââ| >|âââââââââââââ  0
				âââââââââââââ       |/ |

*/

/*
 * Function: diode
 * ----------------------------
 *	Function return variance between electric current on diode and resistor
 *      It's used for searching working point of diode
 *      It's based on Shockey diode equation
 *
 *	Parameters:
 * 		double U - Current Voltage
 *      double R - Resistor size
 *      doublo U_O - Maximal U in electric circuit
 *      double type - define return value
 *             0- return EPS between Ip and Ir
 *             1- return Ip
 *
 *	returns:
 *              variance between electric current on diode and resistor, type double or Ip
 *              return -1 if type is incorrect
 */
double diode_wp(double U, double R, double U_0, int type)
{
	//Graphic solving
	//https://www.desmos.com/calculator/mtryeziywk?fbclid=IwAR0DixvKOKPo6Rhm_oUUc0IhHwLQltQhbcwjlY7cAzfXnymLg6B12CHk82s

	if (type == EPS)
		return ((I_0*(exp(U / U_T) - 1)) - ((U_0 - U) / R));
	else if (type == Ip)
		return (I_0*(exp(U / U_T) - 1));
	else return -1;
}

/*
 * Function: bisection
 * ----------------------------
 *	bisection method, for searching working point of diode
 *
 *	Parameters:
 * 		double U_0 - Current Voltage
 *      double R - resistor size
 *      doublo eps - define variance in equals, if you want match to three digits behind floating point = 0.0001
 *
 *	returns:
 *      middle value of U with current eps match
 */
double diode(double U_0, double R, double eps)
{
	//setting borders of interval
	double a = 0;
	double b = U_0;

	//calculating middle value for bisection method
	double middle = (a + b) / 2;
	double lastMiddle = -1;

	//calculate function for this middle value
	double fmid = diode_wp(middle, R, U_0, EPS);

	//recode to do while
	//Checking if eviation is 
	while ((b - a) > eps)
	{
		//Checking if working point is on right or left from middle. Second part without working point is dropped. setting new border of interval
		if (diode_wp(a, R, U_0, EPS)*fmid < 0)
			b = middle;
		else
			a = middle;

		//Catching if middle isn't out of interval
		if (middle < a || middle > b)
			break;

		//If current variance isn't succesfully met recalculate it for better approximation
		if ((b - a) > eps)
		{
			//calculating middle of new interval (every next interval is 2x smaller)
			middle = (a + b) / 2;

			if (lastMiddle == middle)
				break;

			lastMiddle = middle;
			fmid = diode_wp(middle, R, U_0, EPS);
		}
	}
	return middle;
}

int main(int argc, char *argv[])
{
	double U_0;
	double R;
	double eps;

	if (ArgcCheck(argc, argv) == SUCCESS)
	{
		U_0 = strtod(argv[1], NULL);
		R = strtod(argv[2], NULL);
		eps = strtod(argv[3], NULL);
	}
	else
		return ERROR;

	//Calculating the approximate result to the specified accuracy
	double up = diode(U_0, R, eps);
	printf("Up=%g V\n", up);


	double ip = I_0 * (exp(up / U_T) - 1);
	ip = diode_wp(up, R, U_0, Ip);
	printf("Ip=%g A\n", ip);

	return 0;
}