/******************************************************************************
 * Laborator 01 - Zaklady pocitacove grafiky - IZG
 * ihulik@fit.vutbr.cz
 *
 * $Id: $
 * 
 * Popis: Hlavicky funkci pro funkce studentu
 *
 * Opravy a modifikace:
 * - ibobak@fit.vutbr.cz, orderedDithering
 */

#include "student.h"
#include "globals.h"

#include <time.h>

const int M[] = {
    0, 204, 51, 255,
    68, 136, 187, 119,
    34, 238, 17, 221,
    170, 102, 153, 85
};

const int M_SIDE = 4;

/******************************************************************************
 ******************************************************************************
 Funkce vraci pixel z pozice x, y. Je nutne hlidat frame_bufferu, pokud 
 je dana souradnice mimo hranice, funkce vraci barvu (0, 0, 0).
 Ukol za 0.25 bodu */
S_RGBA getPixel(int x, int y)
{
    if(x < 0 || y < 0 || x >= width || y >= height)
		return COLOR_BLACK; //vraci barvu (0, 0, 0)    
	return frame_buffer[width*y + x];
}
/******************************************************************************
 ******************************************************************************
 Funkce vlozi pixel na pozici x, y. Je nutne hlidat frame_bufferu, pokud 
 je dana souradnice mimo hranice, funkce neprovadi zadnou zmenu.
 Ukol za 0.25 bodu */
void putPixel(int x, int y, S_RGBA color)
{
   if(!(x < 0 || y < 0 || x >= width || y >= height))
		frame_buffer[width*y + x] = color;	
}
/******************************************************************************
 ******************************************************************************
 Funkce prevadi obrazek na odstiny sedi. Vyuziva funkce GetPixel a PutPixel.
 Ukol za 0.5 bodu */
void grayScale()
{
	S_RGBA pixel;
    for(int x = 0; x < width; x++)
	{
		for(int y = 0; y < height;y++)
		{
			pixel = getPixel(x,y);
			pixel.blue = 0.299*pixel.red + 0.587*pixel.green + 0.114*pixel.blue;
			pixel.green = pixel.red = pixel.blue;
			putPixel(x,y,pixel);
		}
	}
}

/******************************************************************************
 ******************************************************************************
 Funkce prevadi obrazek na cernobily pomoci algoritmu maticoveho rozptyleni.
 Ukol za 1 bod */

void orderedDithering()
{
	grayScale();
	
	S_RGBA pixel;

	int threshold;

    for(int x = 0; x < width; x++)
	{
		for(int y = 0; y < height;y++)
		{
			pixel = getPixel(x,y);

			threshold = M[(y % (M_SIDE))*4 + (x % (M_SIDE))];

			if(pixel.blue > threshold)
				putPixel(x,y,COLOR_WHITE);
			else			
				putPixel(x,y,COLOR_BLACK);
		}
	}
}

void PixelChecker(int x, int y, int error)
{
	S_RGBA pixel = getPixel(x,y);
	
	if((pixel.blue + error) > 255)
		putPixel(x,y,COLOR_WHITE);

	else if((pixel.blue + error) < 0)
		putPixel(x,y,COLOR_BLACK);
	else
	{
		pixel.blue += error;
		putPixel(x,y,pixel);
	}		
}

/******************************************************************************
 ******************************************************************************
 Funkce prevadi obrazek na cernobily pomoci algoritmu distribuce chyby.
 Ukol za 1 bod */
void errorDistribution()
{   
    grayScale();
	
	S_RGBA pixel;

	int threshold = 127;
	int error;

    for(int x = 0; x < width; x++)
	{
		for(int y = 0; y < height;y++)
		{
			pixel = getPixel(x,y);
			
			if(pixel.blue > threshold)
			{
				putPixel(x,y,COLOR_WHITE);
				error = pixel.blue - 255;
			}
			else
			{	
				putPixel(x,y,COLOR_BLACK);
				error = pixel.blue;
			}			
			
			int errorNeighbor = ROUND(error*0.375); 
			int errorDiagonal = ROUND(error*0.25);
			//Error distribution
			PixelChecker(x+1,y,errorNeighbor);
			PixelChecker(x, y+1,errorNeighbor);
			PixelChecker(x+1,y+1,errorDiagonal);
		}
	}
}

/******************************************************************************
 ******************************************************************************
 Funkce prevadi obrazek na cernobily pomoci metody prahovani.
 Demonstracni funkce */
void thresholding(int Threshold)
{
	/* Prevedeme obrazek na grayscale */
	grayScale();
	/* Projdeme vsechny pixely obrazku */
	for (int y = 0; y < height; ++y)
		for (int x = 0; x < width; ++x)
		{
			/* Nacteme soucasnou barvu */
			S_RGBA color = getPixel(x, y);

			/* Porovname hodnotu cervene barevne slozky s prahem.
			   Muzeme vyuzit jakoukoli slozku (R, G, B), protoze
			   obrazek je sedotonovy, takze R=G=B */
			if (color.red > Threshold)
				putPixel(x, y, COLOR_WHITE);
			else
				putPixel(x, y, COLOR_BLACK);
		}
}

/******************************************************************************
 ******************************************************************************
 Funkce prevadi obrazek na cernobily pomoci nahodneho rozptyleni. 
 Vyuziva funkce GetPixel, PutPixel a GrayScale.
 Demonstracni funkce. */
void randomDithering()
{
	/* Prevedeme obrazek na grayscale */
	grayScale();

	/* Inicializace generatoru pseudonahodnych cisel */
	srand((unsigned int)time(NULL));

	/* Projdeme vsechny pixely obrazku */
	for (int y = 0; y < height; ++y)
		for (int x = 0; x < width; ++x)
		{
			/* Nacteme soucasnou barvu */
			S_RGBA color = getPixel(x, y);
			
			/* Porovname hodnotu cervene barevne slozky s nahodnym prahem.
			   Muzeme vyuzit jakoukoli slozku (R, G, B), protoze
			   obrazek je sedotonovy, takze R=G=B */
			if (color.red > rand()%255)
			{
				putPixel(x, y, COLOR_WHITE);
			}
			else
				putPixel(x, y, COLOR_BLACK);
		}
}
/*****************************************************************************/
/*****************************************************************************/