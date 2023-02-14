/************************************************/
/*                                              */
/*      3rd Project - Data structures           */
/*                                              */
/*               Maze Solver                    */
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
//Included because functions malloc() and free()
#include <stdlib.h>
//Include because strcmp, strcpy
#include <string.h>
//Include because bool type
#include <stdbool.h>
//Include because isprint()
#include <ctype.h>

//Define return values of functions
#define SUCCESS 0
//
#define ERROR -1

//Define sides
#define LEFT 1
#define RIGHT 2
#define THIRD_SIDE 4

//Define arg types
#define LPATH 1
#define RPATH 2
#define HELP 3
#define TEST 4
#define SHORTEST 5

/*! \brief Struct for working with maze.
 *
 *  Struct contains count of rows and cols in map and map data.
 */
typedef struct {
	int rows; /*!< max rows of a map */
	int cols; /*!< max cols of a map */
	unsigned char *cells; /*!< Data of map */
} Map;

//! Read data on position from maze and return if it's valid
/*!
  \param c Char with input data we want to test if its valid data for maze.
  \return True, if data is valid or false if not.
*/
bool ValidData(char c)
{
	return (c >= '0' && c <= '7') ? true : false;
}

//! Constructor for map, allocate memory for maze.
/*!
  \param rows Number of rows in maze.
  \param cols Number of cols in maze.
  \return  Function return map structure.
*/
Map map_ctor(int rows, int cols)
{
	Map map;
	map.rows = rows;
	map.cols = cols;
	map.cells = malloc((rows + 1) * (cols + 1) * sizeof(char));
	return map;
}

//! Function set data on position in maze.
/*!
  \param c Data, which we want to set to maze on current position.
  \param row Row to which we want to set a char c.
  \param col Col to which we want to set a char c.
  \param map Pointer to a struct map.
*/
void set_pos(char c, unsigned row, unsigned col, Map *map)
{
	map->cells[map->cols*(row)+col] = c;
}

//! Function read data on position from maze.
/*!
  \param row Row from we want to read a data.
  \param col Col from we want to read a data.
  \param map Pointer to a struct map.
  \return Char from actual position in map.
*/
char get_pos(unsigned row, unsigned col, Map *map)
{
	return map->cells[map->cols*(row)+col];
}

//! Function read data on position from maze.
/*!
  \param map Pointer to a struct map.
  \param row Row in which we want to chech a border.
  \param col Col in which we want to chech a border.
  \param side Number represent a side.
  \return If is border on side or not
*/
bool isBorder(Map *map, int row, int col, int side)
{
	return (get_pos(row, col, map) & side);
}

//! Function loading map from text file to struct.
/*!
  \param map Pointer to a struct map.
  \param file Pointer to a text file with maze.
  \return -1 if loading was interupted and 0 if loading was succesfully done.
*/
int load_map(Map *map, FILE * file)
{
	char c; /*!< Actual char readen from file */
	int row = 1; /*!< Actual row index */
	int col = 1; /*!< Actual col index */
	while ((c = fgetc(file)) != EOF)
	{
		//Checking if input from file is valid         
		if (ValidData(c) == true)
		{
			//Checking maze overflow
			if (col > map->cols || row > map->rows)
				return ERROR;

			set_pos(c, row, col, map);

			if (col == map->cols)
			{
				row++;
				col = 0;
			}
			col++;
		}
		//If input isn't valid return ERROR
		else if (isprint(c) != 0 && c != '\n' && c != ' ')
			return ERROR;
	}
	return SUCCESS;
}

//! Moving between triangles in maze. Changing index in maze and actaul border.
/*!
  \param row Pointet to integer, actual row in maze.
  \param col Pointet to integer, actual col in maze.
  \param border Pointet to integer, actual border on position in maze.
  \return -1 if maze is invalid and 0 for valid maze.
*/
void move(int *row, int *col, int * border)
{
	if (*border == LEFT)
	{
		(*col)--;
		*border = RIGHT;
	}
	else if (*border == RIGHT)
	{
		(*col)++;
		*border = LEFT;
	}
	else if ((*row + *col + *border) % 2 == 0)
		(*row)--;

	else if ((*row + *col + *border) % 2 == 1)
		(*row)++;
}

//! Validating file with maze if it's correct. When is border between triangles, border need to be on both triangles.
/*!
  \param map Pointer to a map struct.
  \param file Pointer to a text file with maze.
  \return -1 if maze is invalid and 0 for valid maze.
*/
int MazeValidator(Map * map, FILE * file)
{
	//read first line of file with rows and cols counters
	fscanf(file, "%d %d", &map->rows, &map->cols);

	// map constructor
	*map = map_ctor(map->rows, map->cols);

	//Try to load map data into struct
	if (load_map(map, file) == ERROR)
		return ERROR;

	//Validating maze positions in 2D array
	for (int row = 1; row <= map->rows;row++)
		for (int col = 1; col <= map->cols;col++)
		{
			//char c = get_pos(row,col,map); 
			//RIGHT
			if (col + 1 <= map->cols && isBorder(map, row, col, RIGHT) == true)
				if (isBorder(map, row, col + 1, LEFT) == false)
					return ERROR;
			//THIRD SIDE              
			//Checking upper triangle    
			if (((row + col) % 2 == 0) && ((row - 1) >= 1) && (isBorder(map, row, col, THIRD_SIDE) != isBorder(map, row - 1, col, THIRD_SIDE)))
				return ERROR;

			//Checking lower triangle
			else if ((row + col) % 2 == 1 && row + 1 <= map->rows && isBorder(map, row, col, THIRD_SIDE) == true)
				if (isBorder(map, row + 1, col, THIRD_SIDE) == false)
					return ERROR;
		}
	return SUCCESS;
}

//! Destructor for struct map, because constructor of map allocate memory on heap.
 /*!
   \param map Pointer to a map struct.
 */
void map_dtor(Map *map)
{
	if (map != NULL)
		free(map->cells);
}

//! Function calculate first side in a triangle depends on entry direction to maze, and starting position.
 /*!
   \param map Pointer to a map struct.
   \param row Integer specified starting row position.
   \param col Integer specified starting col position.
   \param leftright Integer represent direction of rule LEFT/RIGHT.
   \return Function return starting border in triangle for actual position. 1 = LEFT; 2 = RIGHT; 4 = THIRD_SIDE
 */
int start_border(Map *map, int row, int col, int leftright)
{
	//Entry to maze from top side
	if (row == 1 && !isBorder(map, row, col, THIRD_SIDE) && ((row + col) % 2 == 0))
		return leftright == RIGHT ? LEFT : RIGHT;

	//Entry to maze from bottom side
	else if (row == map->rows && (row + col) % 2 == 1 && !isBorder(map, row, col, THIRD_SIDE))
		return leftright == RIGHT ? RIGHT : LEFT;

	//Entry to maze from  left odd row 
	else if (row % 2 == 1 && col == 1 && !isBorder(map, row, col, LEFT))
		return leftright == RIGHT ? RIGHT : THIRD_SIDE;

	//Entry to maze from left even row
	else if (row % 2 == 0 && col == 1 && !isBorder(map, row, col, LEFT))
		return leftright == RIGHT ? THIRD_SIDE : RIGHT;

	//Entry to maze from right side if position have upper THIRD SIDE
	else if (col == map->cols && (row + col) % 2 == 0 && !isBorder(map, row, col, RIGHT))
		return leftright == RIGHT ? THIRD_SIDE : LEFT;

	//Entry to maze from right side if position have bottom THIRD SIDE
	else if (col == map->cols && (row + col) % 2 == 1 && !isBorder(map, row, col, RIGHT))
		return leftright == RIGHT ? LEFT : THIRD_SIDE;
	return ERROR;
}

//! Function rotating a side in a triangle depends on actual side and direction of rotating.
/*!
  \param side Integer with actual side which i want to rotate.
  \param leftright Integer represent direction of rule LEFT/RIGHT.
  \param row Integer specified starting row position.
  \param col Integer specified starting col position.
  \return Function return actual side after rotation. 1 = LEFT; 2 = RIGHT; 4 = THIRD_SIDE
*/
int rotate60(int side, int leftright, int row, int col)
{
	if ((leftright + row + col) % 2 == 1)
	{
		//Left -> right -> third
		if (side >= 2)
			return side / 2;
		else
			return THIRD_SIDE;
	}
	else
		//Left -> third -> right
		return (side * 2) % 7;
}

//! Function Solving a maze by algorithm right/left hand on wall.
 /*!
   \param map Pointet to a struct map.
   \param row Integer specified starting row position.
   \param col Integer specified starting col position.
   \return Return -1 if is problem to solve maze or 0 if its ok
 */
int Solve_Maze(Map *map, int row, int col, int leftright)
{
	int border;
	if ((border = start_border(map, row, col, leftright)) == ERROR)
		return ERROR;
	bool End = false;

	while (!End)
	{
		if (isBorder(map, row, col, border) == false)
		{
			printf("%d, %d\n", row, col);
			move(&row, &col, &border);
		}
		border = rotate60(border, leftright, row, col);

		if (row == 0 || row > map->rows || col == 0 || col > map->cols)
			End = true;
	}
	return SUCCESS;
}

//! Function Printing help for launch application
void printHelp()
{
	printf("###MAZE SOLVER###\n");
	printf("switches: \n");
	printf("--help = show help \n");
	printf("--test file.txt = test if file.txt is valid maze file\n");
	printf("--rpath ROW COL file.txt = solving maze by right hand rule, need to specify start location and maze file\n");
	printf("--lpath ROW COL file.txt = solving maze by left hand rule, need to specify start location and maze file\n");
}

//! Function checking app arguments. Checking if was specified searching string, return negative number if is error or numb bigger than zero with type of arg.
 /*!
   \param argc Argument counter.
   \param argv Two dimensional array of chars.
   \param row Pointer to Integer, return value of row from arguments, if specified.
   \param col Pointer to Integer, return value of col from arguments, if specified.
   \return -1 = argument wasn't specified; 1 = lpath; 2 = rpath; 3 = help; 4 = test; 5 = shortest;
 */
int ArgcCheck(int argc, char * argv[], int * row, int * col, char *filename)
{
	switch (argc)
	{
	case 2:
		if (strcmp(argv[1], "--help") == 0)
			printHelp();
		break;

	case 3:
		if (strcmp(argv[1], "--test") == 0)
		{
			strcpy(filename, argv[2]);
			return TEST;
		}
		break;

	case 5:
		*row = atoi(argv[2]);
		*col = atoi(argv[3]);
		strcpy(filename, argv[4]);
		if (strcmp(argv[1], "--rpath") == 0)
			return RPATH;

		else if (strcmp(argv[1], "--lpath") == 0)
			return LPATH;

		else if (strcmp(argv[1], "--shortest") == 0)
			return SHORTEST;
	}
	return ERROR;
}

int main(int argc, char *argv[])
{
	char filename[100]; /*!< Name of file with maze. */
	int row; /*!< Row from argument. */
	int col; /*!< Col from argument. */
	int argType; /*!< Return type of launch. */

	if ((argType = ArgcCheck(argc, argv, &row, &col, filename)) == ERROR)
	{
		fprintf(stderr, "error: invalid arguments\n");
		return ERROR;
	}

	//Open File
	FILE *file = fopen(filename, "r");
	if (file == NULL)
		return EXIT_FAILURE;

	Map map;

	if (MazeValidator(&map, file) == ERROR)
	{
		fprintf(stderr, "Invalid\n");
		return EXIT_FAILURE;
	}
	else if (argType == TEST)
		printf("Valid\n");

	//Solve maze
	if (argc == 5)
	{
		//Checking if row and col is in map
		if ((row != 1 && row != map.rows) && (col != 1 && col != map.cols))
		{
			map_dtor(&map);
			fclose(file);
			fprintf(stderr, "Insert position is not in map or is not a border of a map, your maze is %d x %d\n", map.rows, map.cols);
			return EXIT_FAILURE;
		}

		//Checking if arg LPATH or RPATH was applicated.
		if (argType <= 2)
			if ((Solve_Maze(&map, row, col, argType)) == ERROR)
				fprintf(stderr, "Problem with solving a maze, check arguments\n");
	}

	map_dtor(&map);
	fclose(file);
	return EXIT_SUCCESS;
}