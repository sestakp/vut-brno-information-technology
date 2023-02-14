
library IEEE;
use IEEE.STD_LOGIC_1164.all;

package matrix_pack is


type DIRECTION_T is (DIR_LEFT,DIR_RIGHT);
function GETID (X,Y,ROWS,COLS:integer) return integer;

end matrix_pack;

package body matrix_pack is


	function GETID (X,Y,ROWS,COLS:integer) return integer is
	
	variable col : integer; --col represent parameter X
	variable row : integer; --row represent parameter Y
	
	begin
		col := X;
		row := Y;
		
		--checking for borders of matrix
		if X < 0 then
			col := COLS -1;
			
		elsif X >= COLS then
			col := 0;
		end if;
		
		if Y < 0 then
			row := ROWS -1;
			
		elsif Y >= ROWS then
			row := 0;
		end if;
		
		--return id for 1D arr
		return ROWS*col + row;
	end function; 
end matrix_pack;
