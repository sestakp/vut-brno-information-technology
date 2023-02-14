#include <stdlib.h>
#include <stdio.h>
#include <sys/types.h> //pid_t,
#include <unistd.h> //sleep,
#include <semaphore.h> //need to be compiled with -lpthread
#include <sys/wait.h> //waitpid,
#include <sys/mman.h> //mmap, *
#include <stdbool.h>
#include <time.h>
#include <string.h>
#include <math.h> //need to be compiled with -lm


//Level for function void data_dtor(int level, SyncData_s *syncData, int PI);
#define DTOR_1 1
#define DTOR_2 2
#define DTOR_3 3
#define DTOR_4 4

//semaphore constant for sharing SEM between processes
#define SEM_SHARED 1

//Type of ouput to log file
#define SHORT_MSG 0
#define LONG_MSG 1

//Specified if loging func need to lock or not
#define LOCK 1
#define NO_LOCK 0

#define INITIALIZED_PID 1
#define STRING_MATCH 0


typedef struct{

	//Line counter for log file
	int  recordNumb; 
	
	//Log file
	FILE *logFileFD;  

	//semaphore if judge is inside or not
	sem_t semJudge; 

	//semaphore for queue of imigrants
	sem_t semImigrants; 

	//semaphore for judge when waiting for checks all imigrants
	sem_t semWaitForImm;
	
	//indicating that judge waiting
	bool  judgeWaiting; 

	//array of semaphores for imigrants
	sem_t *semCertificates; 

	//array of bools for imigrants, represent they are checked before judge enter hall and can pick a cert
	bool  *ImigrantsWaiting; 

	//semaphore lock changing values in SyncData_s
	sem_t semWrite;

	//PID of processGenerator
	pid_t processGeneratorPID;

	//PID of judge
	pid_t judgePID; 
	
	//Counter of imigrants in hall, no decision
	int NE;
	
	//Counter of registered imigrants in hall without decision
	int NC;

	//Counter of imigrants in hall
	int NB;

	//counter with total cheched imigrants
	int IC;

	//Exit code for parent
	int EXIT_CODE;

} SyncData_s;

typedef struct{

	//counter of Imigrant process
	int PI;
	
	//time in ms. imigrants will be generate in interval <0;IG)
	//IG is in interval <0;2000>
	int IG;
	
	//time in ms. Judge enter a hall.
	//JG is in interval <0;2000>
	int JG;
	
	//time in ms. simulate taking a certificate by Imigrant
	//IT is in interval <0;2000>
	int IT;
	
	//Time in ms. Simulate time to judge.
	//JT is in interval <0;2000>
	int JT;
} Argument_s;


//! Print help to stderr, its called when its problem with passed arguments
/*!
	\pre Argument check
*/
void PrintHelp()
{
	fprintf(stderr,"Faneuil Hall Problem\n");
	fprintf(stderr,"Launch: ./proj2 PI IG JG IT JT\n");
	fprintf(stderr,"PI\tNumber of process Imigrants\n");
	fprintf(stderr,"IG\tTime between generating new imigrant\n");
	fprintf(stderr,"JG\tInterval for judge comming into hall\n");
	fprintf(stderr,"IT\tTime to simulate picking up a certificate by imigrant\n");
	fprintf(stderr,"JT\tTime to simulate making a decision by judge\n");
	fprintf(stderr,"All times and intervals is in milliseconds, need to be in interval <0;2000>\n");
	fprintf(stderr,"Launch example: ./proj2 5 7 2 4 3\n");
}

//! Check number if its in range <0;2000> its used for arguments
 /*!
   \param numb Current nuber to check in interval
   \return true if its in current interval, else false
*/
bool CheckInputNumb(int numb)
{
	return (numb >= 0 && numb <= 2000);
}


//! Printing statuses of imigrants and judge to log file and increment values in struct syncData, can lock Writesem
 /*!
   \pre mmaped syncData and semaphores
   \param syncData pointer to a struct with synchronized data
   \param MessageType specified by macro SHORT_MSG || LONG_MSG and specified type of output to file
   \param Person specified person who say report can be JUDGE || IMM %d
   \param Status Current message about status
   \param lock specified by macro LOCK || NO_LOCK, can control semaphore semWrite
   \post dealloc semaphores and shared memory
*/
void updateLog(SyncData_s *syncData,int MessageType,char* Person, char* Status, int lock)
{	
	if(lock == LOCK)
		sem_wait(&syncData->semWrite);
	
	if(strcmp(Person,"JUDGE") != STRING_MATCH)
	{
		if(strcmp(Status,"enters") == STRING_MATCH)
		{
			syncData->NE++;
			syncData->NB++;
		}
		else if(strcmp(Status,"checks") == STRING_MATCH)
		{
			syncData->NC++;
		}
		else if(strcmp(Status,"leaves") == STRING_MATCH)
		{
			syncData->NB--;
		}
	}


	if(MessageType == SHORT_MSG)
	{
		fprintf(syncData->logFileFD,"%d \t\t : %s \t\t : %s \n",++syncData->recordNumb,Person,Status);
	}
	else if(MessageType == LONG_MSG)
	{
		if(strlen(Status) > 10) //solving problem with aligning a table
			fprintf(syncData->logFileFD,"%d \t\t : %s \t\t : %s \t : %d \t\t : %d \t\t : %d \n",++syncData->recordNumb,Person, Status, syncData->NE,syncData->NC,syncData->NB);
		else
			fprintf(syncData->logFileFD,"%d \t\t : %s \t\t : %s \t\t : %d \t\t : %d \t\t : %d \n",++syncData->recordNumb,Person, Status, syncData->NE,syncData->NC,syncData->NB);
		
	}

	fflush(syncData->logFileFD);
	
	if(lock == LOCK)
		sem_post(&syncData->semWrite);
}

//! This function create process for judge and store hiw PID to syncData->judgePID
 /*!
   \pre mmaped syncData and semaphores
   \param syncData pointer to a struct with synchronized data
   \param arguments struct of arguments
   \param parentPID pid_t of parent process
   \post parent need to wait to judgePID
   \post dealloc semaphores and shared memory
*/
int JudgeProcess(SyncData_s *syncData,Argument_s arguments, pid_t parentPID)
{	
	syncData->judgePID = INITIALIZED_PID;

	if(parentPID == getpid())
	{
		syncData->judgePID = fork();
	}
	if(syncData->judgePID < 0)
	{
		fprintf(stderr,"Error while creating judge process \n");
		return EXIT_FAILURE;
	}
	else if (syncData->judgePID == 0)
	{
		//While allowed imigrants < total imigrants
		while(syncData->IC < arguments.PI)
		{
			//rand in range
			// rand() % (max_number + 1 - minimum_number) + minimum_number
			usleep(rand() % (arguments.JG+1)*1000);
			
			updateLog(syncData,SHORT_MSG,"JUDGE","wants to enter",LOCK);

			sem_wait(&syncData->semJudge);
				
				updateLog(syncData,LONG_MSG,"JUDGE","enters",LOCK);
				//registrations
				//waiting for imigrants
				sem_wait(&syncData->semWrite);
				if(syncData->NE != syncData->NC)
				{
					updateLog(syncData,LONG_MSG,"JUDGE","waits for imm",NO_LOCK);
					
					syncData->judgeWaiting = true;
					sem_post(&syncData->semWrite);
					//waiting for checking
					//need to open semWrite for imigrant
					sem_wait(&syncData->semWaitForImm);
					
					sem_wait(&syncData->semWrite);
				}			

					updateLog(syncData,LONG_MSG,"JUDGE","starts confirmation",NO_LOCK);
				sem_post(&syncData->semWrite);
				
				usleep(rand() % (arguments.JT+1)*1000);				
				
				sem_wait(&syncData->semWrite);
					syncData->NE = 0;
					syncData->NC = 0;	

				updateLog(syncData,LONG_MSG,"JUDGE","ends confirmation",NO_LOCK);

				//check all imigrants with status Imigrant waiting == true, than unlocked them certificate
				for(int i = 1; i <= arguments.PI; i++)
				{
					if(syncData->ImigrantsWaiting[i] == true)
					{
						syncData->ImigrantsWaiting[i] = false;
						syncData->IC++; //Increase counter with allowed imigrants
						sem_post(&syncData->semCertificates[i]);	
					}
				}
				sem_post(&syncData->semWrite);

				usleep(rand() % (arguments.JT+1)*1000);

				updateLog(syncData,LONG_MSG,"JUDGE","leaves",LOCK);

			sem_post(&syncData->semJudge);
		}

		updateLog(syncData,SHORT_MSG,"JUDGE","finishes",LOCK);
	}
	return EXIT_SUCCESS;
}


//! This function create process for Creating imigrants, and imigrants processes
 /*!
   \pre mmaped syncData and semaphores
   \param syncData pointer to a struct with synchronized data
   \param arguments struct of arguments
   \post parent need to wait to processGeneratorPID
   \post dealloc semaphores and shared memory
*/
int processGenerator(SyncData_s *syncData,Argument_s arguments)
{
	syncData->processGeneratorPID = fork();
	//Error while creating process
	if(syncData->processGeneratorPID < 0)
	{
		fprintf(stderr,">>>ERROR: Process for generating imigrants wasn't created sucesfully\n");
		syncData->IC = arguments.PI; //If creating process failed we need to increment IC to imigrant counter for correctly finish of judger
		return EXIT_FAILURE;
	}
	else if(syncData->processGeneratorPID == 0)
	{
		//log10(n) + 1 return number of digits
		int STRING_LENGTH = log10(arguments.PI)+1+5; 
		//Generating PI imigrants
		for(int i = 1; i <= arguments.PI; i++)
		{
			//Generating random sleep between generating next imigrant
			//IG is in milis but sleep expect second. need div by 1000	
			usleep((rand() % (arguments.IG+1)*1000));
			
			pid_t imigrant = fork();
			if(imigrant < 0)
			{
				fprintf(stderr,">>>ERROR: Error while creating process for imigrant\n");
				syncData->IC = arguments.PI; //If creating process failed we need to increment IC to imigrant counter for correctly finish of judger
				return EXIT_FAILURE;
			}
			else if (imigrant == 0)
			{
				//CODE OF IMIGRANT

				//Making string with number
				char IMIGRANT_NAME[STRING_LENGTH];
				snprintf(IMIGRANT_NAME, sizeof(IMIGRANT_NAME),"IMM %d",i);

				updateLog(syncData,SHORT_MSG,IMIGRANT_NAME,"starts",LOCK);

				sem_wait(&syncData->semJudge);
					updateLog(syncData,LONG_MSG,IMIGRANT_NAME,"enters",LOCK);
				sem_post(&syncData->semJudge);

				sem_wait(&syncData->semImigrants);	
					sem_wait(&syncData->semWrite);
						
						updateLog(syncData,LONG_MSG,IMIGRANT_NAME,"checks",NO_LOCK);
						
						//signalize to judge Im checked succesfully
						syncData->ImigrantsWaiting[i] = true;

						//Check if judge waiting to check imigrants
						if(syncData->judgeWaiting && (syncData->NE == syncData->NC))
						{
							syncData->judgeWaiting = false;
							sem_post(&syncData->semWaitForImm);
						}

					sem_post(&syncData->semWrite);
				sem_post(&syncData->semImigrants);

				sem_wait(&syncData->semCertificates[i]);

					updateLog(syncData,LONG_MSG,IMIGRANT_NAME,"wants certificate",LOCK);

					usleep(rand() % (arguments.IT+1)*1000);

					updateLog(syncData,LONG_MSG,IMIGRANT_NAME,"got certificate",LOCK);

				sem_wait(&syncData->semJudge);

					updateLog(syncData,LONG_MSG,IMIGRANT_NAME,"leaves",LOCK);

				sem_post(&syncData->semJudge);
				return EXIT_SUCCESS;
			}		
		}
		//waiting for all exit codes from childs
		for(int i = 1; i <= arguments.PI;i++)
		{
			//waiting for imigrants processes, i do not need to store return values, imigrant can't finish with EXIT_FAILURE
			wait(NULL);
		}
	}
	return EXIT_SUCCESS;
}


//! This function destroy semaphores and unalocated shared memory
 /*!
   \pre mmaped syncData and semaphores
   \param level integer represent level for dealocating. ITs defined by macros DTOR_1 - DTOR_4
   \param syncData pointer to a struct with synchronized data
   \param PI part of struct arguments, PI number of imigratns to dealloc semaphores for certificates
*/
void data_dtor(int level, SyncData_s *syncData, int PI)
{
	if(level >= DTOR_4)
		fclose(syncData->logFileFD);
	
	if(level >= DTOR_3)
	{
		for(int i=1; i<= PI;i++)
			sem_destroy(&syncData->semCertificates[i]);

		sem_destroy(&syncData->semJudge);
		sem_destroy(&syncData->semImigrants);
		sem_destroy(&syncData->semWaitForImm);
		sem_destroy(&syncData->semWrite);
		munmap(syncData->ImigrantsWaiting,sizeof(bool)*(PI+1));
	}

	if(level >= DTOR_2)
		munmap(syncData->semCertificates,sizeof(sem_t)*(PI+1));

	if(level >= DTOR_1)
		munmap(syncData,sizeof(SyncData_s));
}


int main(int argc, char*argv[])
{

	SyncData_s *syncData;
	Argument_s arguments;
	pid_t parentPID = getpid();	

	//ArgcCheck
	if(argc != 6)
	{
		PrintHelp();
		return EXIT_FAILURE;
	}
		
	arguments.PI = atoi(argv[1]); 
	arguments.IG = atoi(argv[2]);
	arguments.JG = atoi(argv[3]);
	arguments.IT = atoi(argv[4]);
	arguments.JT = atoi(argv[5]);
	
	if(!CheckInputNumb(arguments.IG) || !CheckInputNumb(arguments.JG) || !CheckInputNumb(arguments.IT) || !CheckInputNumb(arguments.JT) || arguments.PI < 1)
	{
		PrintHelp();
		return EXIT_FAILURE;
	}	

	//Creating shared memory
	syncData = (SyncData_s * ) mmap(NULL,sizeof(SyncData_s),PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
	if (syncData == MAP_FAILED)
	{
		fprintf(stderr,">>>ERROR: Creating shared variable failed\n");
		return EXIT_FAILURE;
	}


	syncData->EXIT_CODE = EXIT_SUCCESS;
	syncData->processGeneratorPID = getpid();

	syncData->semCertificates = (sem_t *) mmap(NULL,sizeof(sem_t)*(arguments.PI+1),PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
	if (syncData->semCertificates == MAP_FAILED)
	{
		fprintf(stderr,">>>ERROR: Creating shared variable failed\n");
		data_dtor(DTOR_1, syncData, arguments.PI);
		return EXIT_FAILURE;
	}

	syncData->ImigrantsWaiting = (bool *) mmap(NULL,sizeof(bool)*(arguments.PI+1),PROT_READ | PROT_WRITE, MAP_SHARED | MAP_ANONYMOUS, -1, 0);
	if (syncData == MAP_FAILED)
	{
		fprintf(stderr,">>>ERROR: Creating shared variable failed\n");
		data_dtor(DTOR_2, syncData, arguments.PI);
		return EXIT_FAILURE;
	}

	//Init semaphores
	for(int i=1; i<= arguments.PI;i++)
	{
		sem_init(&syncData->semCertificates[i],SEM_SHARED,0);
		syncData->ImigrantsWaiting[i] = false; 
	}

	//parameters: pointer to sem_t, 1 = shared, value of S	
	sem_init(&syncData->semJudge,SEM_SHARED,1);

	sem_init(&syncData->semImigrants,SEM_SHARED,1);
	
	sem_init(&syncData->semWaitForImm,SEM_SHARED,0);

	sem_init(&syncData->semWrite,SEM_SHARED,1);

	syncData->logFileFD = fopen("./proj2.out","w");
   	
	if(syncData->logFileFD == NULL)
	{	
		fprintf(stderr,">>>ERROR: Creating file failed\n");
		data_dtor(DTOR_3,syncData,arguments.PI);
		return EXIT_FAILURE;
	}

	//Process generator
	if(processGenerator(syncData,arguments) == EXIT_FAILURE)
	{
		data_dtor(DTOR_4,syncData,arguments.PI);
		return EXIT_FAILURE;	
	}	

	//Judge
	if(JudgeProcess(syncData,arguments,parentPID) == EXIT_FAILURE)
	{	
		data_dtor(DTOR_4,syncData,arguments.PI);
		return EXIT_FAILURE;	
	}	
	int status;
	//waiting for finishing created process	
	if(parentPID == getpid())
	{
		//exit code is stored in status, and its ORed with exitcode		
		waitpid(syncData->judgePID,&status,0);
		syncData->EXIT_CODE |= status;
		waitpid(syncData->processGeneratorPID,&status,0);
		syncData->EXIT_CODE |= status;
	}
	
	status = syncData->EXIT_CODE;
	data_dtor(DTOR_4,syncData,arguments.PI);

	return status;
}