library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use WORK.matrix_pack.all;

-- Uncomment the following library declaration if using
-- arithmetic functions with Signed or Unsigned values
--use IEEE.NUMERIC_STD.ALL;

-- Uncomment the following library declaration if instantiating
-- any Xilinx primitives in this code.
--library UNISIM;
--use UNISIM.VComponents.all;

entity cell is
    Port ( CLK : in  STD_LOGIC;
           RESET : in  STD_LOGIC;
           STATE : out  STD_LOGIC;
           INIT_STATE : in  STD_LOGIC;
           NEIGH_LEFT : in  STD_LOGIC;
           NEIGH_RIGHT : in  STD_LOGIC;
           DIRECTION : in  DIRECTION_T;
           EN : in  STD_LOGIC);
end cell;

architecture Behavioral of cell is

begin
	
	
	process(CLK)
	begin
		if rising_edge(CLK) then
			
			if RESET = '1' then
				STATE <= INIT_STATE;
			else
				
				if EN = '1' then
					
					if DIRECTION = DIR_LEFT then
		
						STATE <= NEIGH_RIGHT;
					else			
						STATE <= NEIGH_LEFT;
					
					end if;
					
				end if;
				
			end if;
			
		end if;
	end process;

end Behavioral;

