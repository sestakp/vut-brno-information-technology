LIBRARY ieee;
USE ieee.std_logic_1164.ALL;
use IEEE.NUMERIC_STD.ALL;
use work.matrix_pack.all;
 
ENTITY SPI_NEWS_TB IS
END SPI_NEWS_TB;


 
ARCHITECTURE behavior OF SPI_NEWS_TB IS 

    -- Component Declaration for the Unit Under Test (UUT)
 
    COMPONENT SPI_NEWS
    PORT(
         CLK : IN  std_logic;
         RESET : IN  std_logic;
         SPI_IN : IN  std_logic;
         SPI_EN : IN  std_logic;
         SPI_OUT : OUT  std_logic
        );
    END COMPONENT;
    
	   --Inputs
   signal CLK : std_logic := '0';
   signal RESET : std_logic := '0';
   signal SPI_IN : std_logic := '0';
   signal SPI_EN : std_logic := '0';

 	--Outputs
   signal SPI_OUT : std_logic;

   -- Clock period definitions
   constant CLK_period : time := 10 ps;
	
	--Counter intervals
	constant C1K_period : time := 1000 * CLK_period;
	constant C2K_period : time := 500 * CLK_period;
	constant C5K_period : time := 200 * CLK_period;
	constant READING_MATRIX_TIME : time := 272*CLK_period;
			
	PROCEDURE SendCommand(CMD : in STD_LOGIC_VECTOR(7 downto 0);
								 signal SPI_IN : out STD_LOGIC) is
	begin
			for i in 0 to 7 loop
				SPI_IN <= CMD(i);
				wait for CLK_PERIOD;
			end loop;
			SPI_IN <= '0';
	END PROCEDURE; 
	
	PROCEDURE ReadMatrix( signal SPI_IN : out STD_LOGIC; signal SPI_OUT : in STD_LOGIC; signal SPI_EN : out STD_LOGIC) is
		variable states : std_logic_vector(0 to 127);
		variable counter : positive := 0;
	begin
		report "Reading matrix";

		for i in 0 to 15 loop
		SPI_EN <= '1';
		--Print("1110"&std_logic_vector(to_unsigned(i,4))); --print current command
		
		SendCommand( "1110" & std_logic_vector(to_unsigned(i,4)) ,SPI_IN);
		
		for i in 0 to 7 loop
				states(counter) := SPI_OUT;
				counter := counter + 1;
				wait for CLK_PERIOD;
		end loop;
		SPI_EN <= '0';
		wait for CLK_period;
		
		end loop;
		
		--print states
		for i in 0 to 7 loop
			report std_logic'image(states(i))      & std_logic'image(states(i+8))    & std_logic'image(states(i+8*2))  & std_logic'image(states(i+8*3)) & 
					 std_logic'image(states(i+8*4))  & std_logic'image(states(i+8*5))  & std_logic'image(states(i+8*6))  & std_logic'image(states(i+8*7)) & 
					 std_logic'image(states(i+8*8))  & std_logic'image(states(i+8*9))  & std_logic'image(states(i+8*10)) & std_logic'image(states(i+8*11))& 
					 std_logic'image(states(i+8*12)) & std_logic'image(states(i+8*13)) & std_logic'image(states(i+8*14)) & std_logic'image(states(i+8*15));
		end loop;
		
	END PROCEDURE;
	
BEGIN
 
	-- Instantiate the Unit Under Test (UUT)
   uut: SPI_NEWS PORT MAP (
          CLK => CLK,
          RESET => RESET,
          SPI_IN => SPI_IN,
          SPI_EN => SPI_EN,
          SPI_OUT => SPI_OUT
        );

   -- Clock process definitions
   CLK_process :process
   begin
		CLK <= '0';
		wait for CLK_period/2;
		CLK <= '1';
		wait for CLK_period/2;
   end process;

   -- Stimulus process
   stim_proc: process
   begin		
      -- hold reset state for 100 ns.
      wait for 1 ns;	

      wait for CLK_period*10;
		-- insert stimulus here
		
		
		--reset to applicate init_state_01
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		--setting INIT STATE 01
		report "setting init_state_01 with text TECH";
		SPI_EN <= '1';
		SendCommand("10000001",SPI_IN);
		SPI_EN <= '0';
		wait for CLK_period;
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		--setting INIT STATE 11
		report "setting init_state_11 with text JPN";
		SPI_EN <= '1';
		SendCommand("10000011",SPI_IN);
		SPI_EN <= '0';
		wait for CLK_period;
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		--setting INIT STATE 10
		report "setting init_state_10 with text FPGA";
		SPI_EN <= '1';
		SendCommand("10000010",SPI_IN);
		SPI_EN <= '0';
		wait for CLK_period;
			
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);	
		
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		wait for CLK_period;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		--setting speed
		wait for CLK_period;
		report "setting speed to 00";
		SPI_EN <= '1';
			SendCommand("11000000",SPI_IN);
		SPI_EN <= '0';
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C1K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C1K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C1K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		--reset to applicate init_state_01
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		--setting speed
		wait for CLK_period;
		report "setting speed to 01";
		SPI_EN <= '1';
			SendCommand("11000001",SPI_IN);
		SPI_EN <= '0';
		
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C2K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C2K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C2K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		--reset to applicate init_state_01
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		
		--setting speed
		wait for CLK_period;
		report "setting speed to 10";
		SPI_EN <= '1';
			SendCommand("11000010",SPI_IN);
		SPI_EN <= '0';
		
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		--I dont need to wait because reading matrix is 272 clocks and C5K period is 200, its cannot be simulated well.
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		--I dont need to wait because reading matrix is 272 clocks and C5K period is 200, its cannot be simulated well.
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		--setting direction
		wait for CLK_period;
		report "setting Direction to RIGHT";
		SPI_EN <= '1';
		SendCommand("01000001",SPI_IN);
		SPI_EN <= '0';
		wait for CLK_period;
		
		--setting speed
		wait for CLK_period;
		report "setting speed to 00";
		SPI_EN <= '1';
			SendCommand("11000000",SPI_IN);
		SPI_EN <= '0';
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C1K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C1K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C1K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		--setting direction
		wait for CLK_period;
		report "setting Direction to RIGHT";
		SPI_EN <= '1';
		SendCommand("01000001",SPI_IN);
		SPI_EN <= '0';
		wait for CLK_period;

		
		--setting speed
		wait for CLK_period;
		report "setting speed to 01";
		SPI_EN <= '1';
			SendCommand("11000001",SPI_IN);
		SPI_EN <= '0';
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C2K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C2K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		wait for C2K_period - READING_MATRIX_TIME;
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		
		RESET <= '1';
		wait for CLK_period;
		RESET <= '0';
		wait for CLK_period;
		
		--setting direction
		wait for CLK_period;
		report "setting Direction to RIGHT";
		SPI_EN <= '1';
		SendCommand("01000001",SPI_IN);
		SPI_EN <= '0';
		wait for CLK_period;
		
		
		--setting speed
		wait for CLK_period;
		report "setting speed to 10";
		SPI_EN <= '1';
			SendCommand("11000010",SPI_IN);
		SPI_EN <= '0';
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		--I dont need to wait because reading matrix is 272 clocks and C5K period is 200, its cannot be simulated well.
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
		
		ReadMatrix(SPI_IN,SPI_OUT,SPI_EN);
		
      wait;
   end process;
END;