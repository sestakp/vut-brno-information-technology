    /************************************************/
    /*                                              */		
    /*      1st Project - Working with text         */
    /*                                              */
    /*          Pavel Sestak (xsesta07)             */
    /*                                              */
    /*              7. 10. 2019                     */
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
//its unnecesary for using functions like strlen
#include <string.h>
//its necessary for using data type bool
#include <stdbool.h>
//Its neccesary for function tolower()
#include <ctype.h>

//defined constant is for function search
#define INTERUPTED 1
#define UNINTERUPTED 2

//defined constant for returning values from functions
#define ERROR -1
#define SUCCESS 0
#define NOTSPEC 1

//define max length of line
#define MAX_LENGTH 100

typedef struct con{
	char name[MAX_LENGTH];
	char nameNumbRepre[MAX_LENGTH];
    char number[MAX_LENGTH];
    char numberRepre[MAX_LENGTH];
}contact_t;
 
/*
 * Function: ReturnContact
 * ----------------------------
 *	Returning string with contact in format (contact_name, phone_number). This function expected contact list in stdin.
 *  Maximal expected length of line is 100 chars.
 *
 *	Parameters:
 * 		line - char array, this array will be OVERWRITED with result of this function
 *	
 *	returns: 
 *		i - Returning length of array if everything is correct.
 * 	       -1 - When length of line is greater then 100 or getchar return EOF.
 */
int ReturnContact(contact_t *contact)
{
	int c; // working with actual character from stdin, because witch char its possible to overflow it.
	bool contactEnd = false; //logical switch if its contact or name line breaker
	int i = 0; //counter of letters in line
	while((c = getchar()) != EOF)
	{		
		if(i == MAX_LENGTH)
		{
			fprintf(stderr,"Maximal length of contact is %d chars.\n",MAX_LENGTH);
			return ERROR;
		}	

		if(c == '\n' && contactEnd)
			break;

		else if(c == '\n')
		{
			contactEnd = true;
			i=0;		
		}
		else if (contactEnd)
			contact->number[i++] = c;
		else
			contact->name[i++] = c;
	}
	if(c == EOF)
		return ERROR;
	else
		return i;
}

/* 
 * Function: MobKeyboardTrans
 *	Transfer text to numbers like on old mobile phones for example letter a,b,c will be represent by digit 2
 *
 *	Parameters:
 * 		*contact - pointer to a struct contact
 * 	
 *	returns: 
 *		0 - input is number and can be convert to integer  
 * 	       -1 - Input isn't number
 */
int MobKeyboardTrans(contact_t *contact)
{
    char nameChar; //one char in name, used actual in loop
    int l = 0;//Current possition in numb representing name, need to separate because space in name will be removed
    int i = 0;//Current position in name
    char pads[10][5] = { //Two dimensional array repressenting keyboard on old mobile phones
	{"0+"},
    {'1'},
    {"2abc"}, 
    {"3def"},
    {"4ghi"},
    {"5jkl"},
    {"6mno"},
    {"7pqrs"},
    {"8tuv"},	
    {"9wxyz"}     
    };
	
    //editing contact name
    while(contact->name[i] != '\0')
    {
        nameChar = tolower(contact->name[i]);
        //Looping in pads, finding letter in pads and replace with represent number
	    for( int j = 0; j < 10;j++)
            for(unsigned int k = 0; k <= 5;k++)
            {
                if(nameChar == pads[j][k])
                {
                    contact->nameNumbRepre[l++] = j + '0';
                    //Interupting a loops
                    k = 6;
                    j = 10;
                }
            }
        i++;
    }
    i = 0;
    
    //editing contact number
    while(contact->number[i] != '\0')
    {
        if(contact->number[i] == '+')
		    contact->numberRepre[i] = '0';
        else
            contact->numberRepre[i] = contact->number[i];
        i++;
    }
    return 0;
}


/* 
 * Function: Search
 *	Searching in numb and finding a match
 *
 *	Parameters:
 * 		data - the string for which we want to examine whether it is a number
 * 	    searchtext - 
 *      type - Declare type of searching
 *              1 - sequention can be interupted, but every letter need to be in data
 *              2 - uninterupred sequention of match in string  
 * 
 *	returns: 
 *		0 - searching expression was found  
 * 	   -1 - searching expression wasn't found
 */
int Search(char *data, char* searchtext, int type)
{
    if(type == UNINTERUPTED)
    {
        if(strstr(data,searchtext) != NULL)
            return SUCCESS;
    }
    else if(type == INTERUPTED)
    {
        int i = 0;
        unsigned int pos = 0;
        while(data[i] != '\0')
        {   
            if(data[i] == searchtext[pos])
                pos++;
            if (pos == strlen(searchtext))
                return SUCCESS;
            i++;
        }
    }
    return ERROR;
}

/* 
 * Function: IsNumb
 *	Checking if input string is number or not. String is number, when all letters in string are digits
 *
 *	Parameters:
 *              numb - the string for which we want to examine whether it is a number
 * 	
 *	returns: 
 *              0 - input is number and can be convert to integer  
 *             -1 - Input isn't number
 */
int IsNumb(char *numb)
{
	int length = strlen(numb);
	for(int i = 0;i < length;i++)
		if(!(numb[i] >= '0' && numb[i] <= '9'))
			return ERROR;	
	return SUCCESS;
}

/*
 * Function: ArgcCheck
 * ----------------------------
 *	Checking app arguments. Checking if was specified searching string
 *
 *	Parameters:
 * 		argc - Argument counter
 * 		argv - Array of arguments
 *	returns:
		1 - Argument wasn't specified
 *		0 - If arguments are ok, and second argument was assigned to searchtext  
 * 	   -1 - If first argument isn't number
 */
int ArgcCheck(int argc,char *argv[])
{
	if(argc == 1)
		return NOTSPEC;
	if(IsNumb(argv[1]) == ERROR)
	{
		fprintf(stderr,"Prvni argument musi byt cele cislo\n");
		return ERROR;
	}
	return SUCCESS;
}

int main(int argc,char *argv[])
{	
	bool found = false; //Variable checking if some contact was found, if not, print message before main is ended.
	bool Searching = true; //Variable checking if searchtext was specified, if isn't application just print contact list
	char *searchtext; //Store searching text
	switch(ArgcCheck(argc,argv))
    {
    case ERROR:
        return ERROR;
        break;
    case NOTSPEC:
        Searching = false;
        break;
    case SUCCESS:
        searchtext = argv[1];
        break;
    }

	contact_t contact = {{'\0'},{'\0'},{'\0'},{'\0'}};

    while((ReturnContact(&contact)) != ERROR)
    {
        if(Searching)
        {
            MobKeyboardTrans(&contact);
            if((Search(contact.nameNumbRepre,searchtext,UNINTERUPTED) == SUCCESS) || (Search(contact.numberRepre,searchtext,UNINTERUPTED) == SUCCESS))
            {
                found = true;
                printf("%s, ",contact.name);
                printf("%s\n",contact.number);
            }
        }
        else
        {
            printf("%s, ",contact.name);
            printf("%s\n",contact.number);
        }
        
        for(unsigned int i = 0; i < MAX_LENGTH;i++)
	    {
                contact.name[i] = '\0';
                contact.nameNumbRepre[i] = '\0';
                contact.number[i] = '\0';
        }   
    }
    
	if(Searching && found == false)
		fprintf(stderr,"Not found\n");
	return 0;
}