/************************************************/
/*                                              */
/*               IZG - Canvas                   */
/*                                              */
/*               Drawing on canvas              */
/*                                              */
/*          Pavel Sestak (xsesta07)             */
/*                                              */
/*              13. 02. 2020                    */
/*                                              */
/*         Computer Graphics Principles         */
/*                                              */
/*              1st year BITP                   */
/*                                              */
/*      VUT Faculty of Information Technology   */
/*                                              */
/************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <malloc.h>

#define ERROR 1
#define SUCCESS 0
#define BORDER_MARK '#'
#define POINT_MARK 'P'
#define LINE_MARK '-'
#define CANVAS_BG ' '


typedef struct
{
    int rows; //Number of canvas rows
    int cols; //NUmber of canvas cols
    int *data; //Pointer to data of canvas
}Tcanvas;


typedef struct
{
    int x;
    int y;
}Tpoint;


//ax + by + c = 0
typedef struct
{
    int a;
    int b;
    int c;
}TLineEqual;

//! Function constructor for canvas
/*!
  \param canvas Pointer to canvas
  \return 0 if return is correct
  \return 1 if canvas cols or rows isn't >= 0 or if malloc failed
  \post dtor_canvas
*/
int ctor_canvas(Tcanvas *canvas)
{
    if(canvas->rows <= 0 || canvas->cols <= 0)
	return ERROR;

    canvas->data = malloc(sizeof(int)*canvas->rows*canvas->cols);

    if(canvas-> data == NULL)
        return ERROR;

    return SUCCESS;
}

//! Function Destructor for canvas
/*!
    \pre ctor_canvas
    \param canvas Pointer to canvas
*/
void dtor_canvas(Tcanvas *canvas)
{
    free(canvas->data);
}

//! Function getting position in canvas
/*!
    \param canvas Pointer to canvas
    \param point Point specified pixel in array
    \return character from array
*/
char get_pos(Tcanvas *canvas, Tpoint point)
{
    return canvas->data[canvas->cols*point.y + point.x];
}

//! Function set point to array
/*!
    \param canvas Pointer to canvas
    \param point specified pixel if array where to draw a char in data
    \param data data to save to array
*/
void draw_point(Tcanvas *canvas, Tpoint point, char data)
{
    canvas->data[canvas->cols*point.y + point.x] = data;
}

//! Initialization of canvas
/*!
    \pre ctor_canvas()
    \param canvas pointer to canvas
*/
int init_canvas(Tcanvas *canvas)
{
    Tpoint point;
    if(canvas->cols <= 0 || canvas->rows <= 0)
        return ERROR;
    for(int i = 0; i < canvas->rows;i++)
    {
        for(int j = 0; j < canvas->cols;j++)
        {
            point.y = i;
            point.x = j;
            draw_point(canvas,point,CANVAS_BG);
        }
    }
    return SUCCESS;
}

//! Draw border around a canvas
/*!
    \pre init_canvas
    \param canvas pointer to Tcanvas
    \post print_canvas
*/
int make_border(Tcanvas *canvas)
{
     Tpoint point;
     for(int i = 0; i < (canvas->cols);i++)
     {
         point.x = i;
         point.y = 0;
         draw_point(canvas,point,BORDER_MARK);

         point.y = canvas->rows-1;
         draw_point(canvas,point,BORDER_MARK);
     }
    for(int i = 1; i < (canvas->rows-1);i++)
    {
        point.x = 0;
        point.y = i;
        draw_point(canvas,point,BORDER_MARK);

        point.x = canvas->cols-1;
        draw_point(canvas,point,BORDER_MARK);
    }
    return SUCCESS;
}

//! Printing canvas to STDOUT
/*!
    \pre con_canvas
    \pre init_canvas
    \pre make_border
*/
void print_canvas(Tcanvas *canvas)
{
    Tpoint point;
    for(int i = 0; i < canvas->rows;i++)
    {
        for(int j = 0; j < canvas->cols;j++)
        {
            point.y = i;
            point.x = j;
            printf("%c",get_pos(canvas,point));
        }
        printf("\n");
    }
}

//! Calculating general equal of line
/*!
    \param le pointer to TLineEqual
    \param A Tpoint point of a line
    \param B Tpoint point of a line
*/
void lineEqualGen(TLineEqual *le,Tpoint A, Tpoint B)
{
    le->a = B.y - A.y;
    le->b = A.x - B.x;
    le->c = le->a*A.x + le->b*A.y;
}

//! Bresenham algoritm for rastorization line
/*!
*    \param canvas pointer to Tcanvas
*    \param A Tpoint point on a line
*    \param B Tpoint point on a line
*/
void lineBres(Tcanvas *canvas, Tpoint A,Tpoint B)
{
    int dx = B.x - A.x;
    int dy = B.y - A.y;
    int predictor = 2*dy - dx;
    int predictorA = 2*dy;
    int predictorB = predictorA -2*dx;
    Tpoint point;
    point.y = A.y;

    for(int x = A.x; x <= B.x;x++)
    {
        point.x = x;
        if(!(((point.x == A.x) && (point.y == A.y)) || ((point.x == B.x) && (point.y == B.y))))
	    draw_point(canvas,point,LINE_MARK);

        if(predictor >= 0)
        {
            predictor += predictorB;
            point.y++;
        }
        else
            predictor += predictorA;
    }
}

int main(int argc, char *argv[])
{
    int x = 30;
    int y = 60;

    Tcanvas canvas;
    canvas.rows = x;
    canvas.cols = y;


    ctor_canvas(&canvas);
    init_canvas(&canvas);
    make_border(&canvas);

    Tpoint A;
    A.x = 4;
    A.y = 7;

    Tpoint B;
    B.x = 30;
    B.y = 25;

    draw_point(&canvas,A,POINT_MARK);
    draw_point(&canvas,B,POINT_MARK);

    lineBres(&canvas,A,B);

    print_canvas(&canvas);
    dtor_canvas(&canvas);
}
