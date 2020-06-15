library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
use WORK.matrix_pack.ALL;

-- Uncomment the following library declaration if using
-- arithmetic functions with Signed or Unsigned values
--use IEEE.NUMERIC_STD.ALL;s

-- Uncomment the following library declaration if instantiating
-- any Xilinx primitives in this code.
--library UNISIM;
--use UNISIM.VComponents.all;

entity SPI_NEWS is
	Port (
		CLK : in STD_LOGIC;
		RESET : in STD_LOGIC;
		
		--for SPI
		SPI_IN : in STD_LOGIC;
		SPI_EN : in STD_LOGIC;
		SPI_OUT : out STD_LOGIC
	);
end SPI_NEWS;

architecture Behavioral of SPI_NEWS is
	
	--SPI SIGNALS
		signal DIRECTION : DIRECTION_T;
		signal INIT_STATE : STD_LOGIC_VECTOR(1 downto 0);
		signal CELL_RESET : STD_LOGIC;
		signal SPEED : STD_LOGIC_VECTOR(1 downto 0);
		signal STATES : STD_LOGIC_VECTOR(127 downto 0) := (others => '0');
	
	--Counter signals
		signal EN   : STD_LOGIC := '0';
		signal EN1K : STD_LOGIC := '0';
		signal EN2K : STD_LOGIC := '0';
		signal EN5K : STD_LOGIC := '0';
		
		--counter constants
		constant CLK_FREQ   : positive := 1000000;
		constant OUT_FREQ1k : positive := 1000;
		constant OUT_FREQ2k : positive := 2000;
		constant OUT_FREQ5k : positive := 5000;

		--init state constants
		signal INIT_STATE_CELL : STD_LOGIC_VECTOR(0 to 127) := (others => '0');
		
		--TEXT: FIT																initialized cols separed
		signal INIT_STATE_00   : STD_LOGIC_VECTOR(0 to 127) := "00000000"&"00000000"&"01111100"&"01010000"&"01010000"&"00000000"&"01111100"&"00000000"&"01000000"&"01111100"&"01000000"&"00000000"&"00000000"&"00000000"&"00000000"&"00000000";
		
		--TEXT: TECH
		signal INIT_STATE_01   : STD_LOGIC_VECTOR(0 to 127) := "01000000"&"01111100"&"01000000"&"00000000"&"01111100"&"01010100"&"01000100"&"00000000"&"01111100"&"01000100"&"01000100"&"00000000"&"01111100"&"00010000"&"01111100"&"00000000";
		
		--TEXT: FPGA
		signal INIT_STATE_10   : STD_LOGIC_VECTOR(0 to 127) := "01111100"&"01010000"&"01010000"&"00000000"&"01111100"&"01010000"&"01110000"&"00000000"&"01111100"&"01000100"&"01010100"&"01011100"&"00000000"&"01111100"&"01010000"&"01111100";
		
		--TEXT: JPN
		signal INIT_STATE_11   : STD_LOGIC_VECTOR(0 to 127) := "01001100"&"01000100"&"01111100"&"00000000"&"01111100"&"01010000"&"01110000"&"00000000"&"01111100"&"00100000"&"00010000"&"00001000"&"01111100"&"00000000"&"00000000"&"00000000";
		
		constant COLS : integer := 16;
		constant ROWS : integer := 8;
		
--code here
begin
	--Instantiate SPI CONTROLER
	SPI: entity WORK.spi_ctrl(Behavioral) port map(
														CLK => CLK, 
														RESET => RESET, 
														SPI_IN => SPI_IN, 
														SPI_EN => SPI_EN,
														SPI_OUT => SPI_OUT,
														DIRECTION => DIRECTION, 
														INIT_STATE => INIT_STATE, 
														CELL_RESET => CELL_RESET, 
														SPEED => SPEED, 
														STATES => STATES);
	
	counter1K : entity WORK.counter(Behavioral) generic map (
															  CLK_FREQ => CLK_FREQ,
															  OUT_FREQ => OUT_FREQ1k)
															  
															  port map(
															  CLK => CLK, 
															  RESET => RESET, 
															  EN => EN1K);
	
	
	counter2K : entity WORK.counter(Behavioral) generic map (
															  CLK_FREQ => CLK_FREQ,
															  OUT_FREQ => OUT_FREQ2k)
															  
															  port map(
															  CLK => CLK, 
															  RESET => RESET, 
															  EN => EN2K);
	
	counter5K : entity WORK.counter(Behavioral) generic map (
															  CLK_FREQ => CLK_FREQ,
															  OUT_FREQ => OUT_FREQ5k)
															  
															  port map(
															  CLK => CLK, 
															  RESET => RESET, 
															  EN => EN5K);
	
	--Multiplexor for INIT_STATE
	INIT_STATE_p: process(INIT_STATE)
	begin
		--if rising_edge(CLK) then
			case INIT_STATE is
				when "00" =>
								INIT_STATE_CELL <= INIT_STATE_00;
				when "01" =>
								INIT_STATE_CELL <= INIT_STATE_01;
				when "10" => 
								INIT_STATE_CELL <= INIT_STATE_10;
				when "11" => 
								INIT_STATE_CELL <= INIT_STATE_11;
				when others => 
								INIT_STATE_CELL <= INIT_STATE_CELL;
			end case;
		--end if;
	end process;
	
	--Multiplexor for speed
	SPEED_p: process(CLK)
	begin
		if rising_edge(CLK) then
			case SPEED is
				when "00" =>
								EN <= EN1k;
				when "01" =>
								EN <= EN2k;
				when "10" => 
								EN <= EN5k;
				when others => 
								EN <= EN;
			end case;
		end if;
	end process;
	--Cell generate
	--function GETID (X,Y,8,16:integer) return integer
	Gen_1 : for X in 0 to COLS-1 generate
		Gen_2: for Y in 0 to ROWS-1 generate
					cell : entity WORK.cell(Behavioral) port map(CLK => CLK,
																				RESET => CELL_RESET, 
																				STATE => STATES(GETID(X,Y,ROWS,COLS)),
																				INIT_STATE => INIT_STATE_CELL(GETID(X,Y,ROWS,COLS)),
																				NEIGH_LEFT => STATES(GETID(X-1,Y,ROWS,COLS)),
																				NEIGH_RIGHT => STATES(GETID(X+1,Y,ROWS,COLS)),
																				DIRECTION => DIRECTION, 
																				EN => EN);
				end generate;
  end generate;

end Behavioral;