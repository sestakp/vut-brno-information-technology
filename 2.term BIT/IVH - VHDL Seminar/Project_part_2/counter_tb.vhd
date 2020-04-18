LIBRARY ieee;
USE ieee.std_logic_1164.ALL;
 
-- Uncomment the following library declaration if using
-- arithmetic functions with Signed or Unsigned values
--USE ieee.numeric_std.ALL;
 
ENTITY counter_tb IS
END counter_tb;
 
ARCHITECTURE behavior OF counter_tb IS 
 
    -- Component Declaration for the Unit Under Test (UUT)
 
    COMPONENT counter
	 Generic (
			CLK_FREQ : positive := 100000;
			OUT_FREQ : positive := 10000);	
    PORT(
         CLK : IN  std_logic;
         RESET : IN  std_logic;
         EN : OUT  std_logic
        );
    END COMPONENT;
    

   --Inputs
   signal CLK : std_logic := '0';
   signal RESET : std_logic := '0';

 	--Outputs
   signal EN : std_logic;

   -- Clock period definitions
   constant CLK_period : time := 1 ns;
 
BEGIN
 
	-- Instantiate the Unit Under Test (UUT)
	UUT: counter
	generic map (
	CLK_FREQ => 100000,
	OUT_FREQ => 10000)
	
	PORT MAP ( 
    CLK => CLK,
    RESET => RESET,
	 EN => EN);
	
	-- vas ukol !!!!!!!!! vcetne nastaveni generickych parametru
	
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
      wait for 100 ns;	
		-- vas ukol !!!!!!!!! nastavte spravne reset, spuste pocitani
		
		RESET <= '1';
      wait for CLK_period*10;
      RESET <= '0';
		wait for CLK_period*10;
		
		assert EN = '1' report "Enable in 1 new" severity error;
		wait for CLK_period*10;
		assert EN = '1' report "Enable in 1 new" severity error;
		wait for CLK_period*10;
		assert EN = '1' report "Enable in 1 new" severity error;
		wait for CLK_period*15;
		
		assert EN = '0' report "Enable in 0 new" severity error;
		
		wait for CLK_period*10;
		
		assert EN = '0' report "Enable in 0 new" severity error;
		
		wait for CLK_period*5;
		RESET <= '1';
		
		wait for CLK_period*5;
		assert EN = '0' report "Enable in reset in 0" severity error;
		
		wait for CLK_period*5;
		assert EN = '0' report "Enable in reset in 0" severity error;
		RESET <= '0';
		
		wait for CLK_period*10;
		assert EN = '1' report "Enable in 1" severity error;
		
		wait for CLK_period*5;
		assert EN = '0' report "Enable in 0" severity error;
		
		wait for CLK_period*5;
		assert EN = '1' report "Enable in 1" severity error;
		
		wait for CLK_period*5;
		assert EN = '0' report "Enable in 0" severity error;
		
		wait for CLK_period*5;
		assert EN = '1' report "Enable in 1" severity error;
		
		wait for CLK_period*5;
		assert EN = '0' report "Enable in 0" severity error;
      wait;
   end process;

END;
