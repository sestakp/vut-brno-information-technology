library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;
use IEEE.numeric_std.ALL;
use WORK.matrix_pack.ALL;


entity spi_ctrl is
Port (
		--for controll
		CLK : in STD_LOGIC;
		RESET : in STD_LOGIC;
		
		--for SPI
		SPI_IN : in STD_LOGIC;
		SPI_EN : in STD_LOGIC;
		SPI_OUT : out STD_LOGIC := '0';
		
		--for project interface
		DIRECTION : out DIRECTION_T;
		INIT_STATE : out STD_LOGIC_VECTOR(1 downto 0);
		CELL_RESET : out STD_LOGIC := '0';
		SPEED : out STD_LOGIC_VECTOR(1 downto 0);
		STATES : in STD_LOGIC_VECTOR(127 downto 0)
	);
end spi_ctrl;

architecture Behavioral of spi_ctrl is

	signal SHIFT_REGISTER : STD_LOGIC_VECTOR(7 downto 0) := (others => '0');
	signal ANSWER : STD_LOGIC := '0';
	signal CNT : STD_LOGIC_VECTOR(2 downto 0) := "000";
	signal FINISHED : STD_LOGIC := '0';

begin


	process (CLK)
	variable SHIFT_REGISTER_loc : std_logic_vector(7 downto 0);
	begin
		if rising_edge(CLK) then
			
			CELL_RESET <= '0';
			SPI_OUT <= '0';
			--if reset is enabled
			if RESET = '1' then
				
				DIRECTION <= DIR_LEFT;
				SPEED <= "00";
				INIT_STATE <= "00";
				CELL_RESET <= '1';
				SPI_OUT <= '0';
				--inter signals
				CNT <= (others => '0');
				ANSWER <= '0';
			
			elsif SPI_EN = '1' and FINISHED = '0' then
				
				--more than one clock answer
				if ANSWER = '1' then
					--Answering
						if SHIFT_REGISTER(7 downto 5) = "111" then
							SPI_OUT <= STATES( to_integer(unsigned(SHIFT_REGISTER( 3 downto 0)))*8 + to_integer(unsigned(CNT)));
							
							CNT <= CNT + '1';
							
							if conv_integer(CNT) = 7 then
							ANSWER <= '0';
							CNT <= (others => '0');
							FINISHED <= '1';
							end if;
							
						end if;
				--reading and one clock answer
				else
					--reading SPI
					
					--shifting register, add value of SPI_IN to right and left value pop
					
					SHIFT_REGISTER_loc := SPI_IN & SHIFT_REGISTER(7 downto 1);
					SHIFT_REGISTER <= SHIFT_REGISTER_loc;
					CNT <= CNT + '1';
					
					--answer
					if conv_integer(CNT) = 7 then
					--report "Actual SHIFT_REGISTER_loc: " & integer'image(conv_integer(SHIFT_REGISTER_loc)) severity note;
						
						CNT <= (others => '0');
						--setting DIRECTION = DIR_LEFT
						if SHIFT_REGISTER_loc = "01000000" then
							DIRECTION <= DIR_LEFT;
							FINISHED <= '1';
						--setting DIRECTION = DIR_RIGHT
						elsif SHIFT_REGISTER_loc = "01000001" then
							DIRECTION <= DIR_RIGHT;
							FINISHED <= '1';
						end if;
						
						--SETTING SPEED
						if SHIFT_REGISTER_loc(7 downto 5) = "110" then
						
							SPEED <= SHIFT_REGISTER_loc(1 downto 0);
							FINISHED <= '1';
						end if;
						
						--SETTING INIT_STATE
						if SHIFT_REGISTER_loc(7 downto 5) = "100" then
								
							INIT_STATE <= SHIFT_REGISTER_loc(1 downto 0);
							CELL_RESET <= '1';
							FINISHED <= '1';
						end if;
					
						--Answering
						if SHIFT_REGISTER_loc(7 downto 5) = "111" then
							ANSWER <= '1';
						end if;
						
								
					end if;
				
				end if;
			else
			CNT <= (others => '0');
			ANSWER <= '0';
			SPI_OUT <= '0';
			FINISHED <= '0';
			end if;		
		
		end if;
	
	end process;

end Behavioral;

