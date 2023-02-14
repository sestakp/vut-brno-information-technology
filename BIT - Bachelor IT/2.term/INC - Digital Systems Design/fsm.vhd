-- fsm.vhd: Finite State Machine
-- Author(s): 
--
library ieee;
use ieee.std_logic_1164.all;
-- ----------------------------------------------------------------------------
--                        Entity declaration
-- ----------------------------------------------------------------------------
entity fsm is
port(
   CLK         : in  std_logic;
   RESET       : in  std_logic;

   -- Input signals
   KEY         : in  std_logic_vector(15 downto 0);
   CNT_OF      : in  std_logic;

   -- Output signals
   FSM_CNT_CE  : out std_logic;
   FSM_MX_MEM  : out std_logic;
   FSM_MX_LCD  : out std_logic;
   FSM_LCD_WR  : out std_logic;
   FSM_LCD_CLR : out std_logic
);
end entity fsm;

-- ----------------------------------------------------------------------------
--                      Architecture declaration
-- ----------------------------------------------------------------------------
architecture behavioral of fsm is
   type t_state is (INIT_STATE , TEST_1, TEST_2, TEST_3, TEST_4, TEST_5, TEST_6, TEST_7, TEST_8, TEST_9, STATE_ERROR, PRINT_DENIED,PRINT_ALLOWED, FINISH, IDLE);
   signal present_state, next_state : t_state;
begin
-- -------------------------------------------------------
sync_logic : process(RESET, CLK)
begin
   if (RESET = '1') then
      present_state <= INIT_STATE;
   elsif (CLK'event AND CLK = '1') then
      present_state <= next_state;
   end if;
end process sync_logic;

-- xsesta07 : kod1 = 7839534616 	 kod2 = 7852568339

-- -------------------------------------------------------
next_state_logic : process(present_state, KEY, CNT_OF)

variable CODE_TYPE : natural range 0 to 1; --define code type, (0) == code 1, (1) == code 2

begin
   case (present_state) is
   
	-- - - - - - - - - - - - - - - - - - - - - - -
   when INIT_STATE =>
      next_state <= INIT_STATE;
		
		if (KEY(7) = '1') then   --CODE: 7
			next_state <= TEST_1;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;

	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_1 =>
      next_state <= TEST_1;
		
		if (KEY(8) = '1') then   --CODE: 78
			next_state <= TEST_2;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;
	
	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_2 =>
      next_state <= TEST_2;
		
		if (KEY(3) = '1') then   --CODE: 783
			CODE_TYPE := 0;
			next_state <= TEST_3;
			
		elsif(KEY(5) = '1') then  --CODE: 785
			CODE_TYPE := 1;
			next_state <= TEST_3;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;
	
	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_3 =>
      next_state <= TEST_3;
		
		if ((KEY(9) = '1') and (CODE_TYPE = 0)) then   --CODE: 7839
			next_state <= TEST_4;
			
		elsif((KEY(2) = '1') and (CODE_TYPE = 1)) then  --CODE: 7852
			next_state <= TEST_4;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;
	

	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_4 =>
      next_state <= TEST_4;
		
		if (KEY(5) = '1')then   --CODE: 78395
			next_state <= TEST_5;--CODE: 78525
				
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;
		
	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_5 =>
      next_state <= TEST_5;
		
		if ((KEY(3) = '1') and (CODE_TYPE = 0)) then   --CODE: 783953
			next_state <= TEST_6;
			
		elsif((KEY(6) = '1') and (CODE_TYPE = 1)) then  --CODE: 785256
			next_state <= TEST_6;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;

	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_6 =>
      next_state <= TEST_6;
		
		if ((KEY(4) = '1') and (CODE_TYPE = 0)) then   --CODE: 7839534
			next_state <= TEST_7;
			
		elsif((KEY(8) = '1') and (CODE_TYPE = 1)) then  --CODE: 7852568
			next_state <= TEST_7;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;

	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_7 =>
      next_state <= TEST_7;
		
		if ((KEY(6) = '1') and (CODE_TYPE = 0)) then   --CODE: 78395346
			next_state <= TEST_8;
			
		elsif((KEY(3) = '1') and (CODE_TYPE = 1)) then  --CODE: 78525683
			next_state <= TEST_8;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;
		
	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_8 =>
      next_state <= TEST_8;
		
		if ((KEY(1) = '1') and (CODE_TYPE = 0)) then   --CODE: 783953461
			next_state <= TEST_9;
			
		elsif((KEY(3) = '1') and (CODE_TYPE = 1)) then  --CODE: 785256833
			next_state <= TEST_9;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;

	-- - - - - - - - - - - - - - - - - - - - - - -
   when TEST_9 =>
      next_state <= TEST_9;
		
		if ((KEY(6) = '1') and (CODE_TYPE = 0)) then   --CODE: 7839534616
			next_state <= IDLE;
			
		elsif((KEY(9) = '1') and (CODE_TYPE = 1)) then  --CODE: 7852568339
			next_state <= IDLE;
			
      elsif (KEY(15) = '1') then
         next_state <= PRINT_DENIED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
      end if;				
	
	-- - - - - - - - - - - - - - - - - - - - - - -
   when STATE_ERROR =>
      next_state <= STATE_ERROR;
		
      if (KEY(15) = '1') then
         next_state <= PRINT_DENIED; 
      end if;

	-- - - - - - - - - - - - - - - - - - - - - - -
	when IDLE =>
		next_state <= IDLE;
		if (KEY(15) = '1') then
			next_state <= PRINT_ALLOWED;
		
		elsif (KEY(14 downto 0) /= "000000000000000") then
			next_state <= STATE_ERROR;
		
		end if;
	-- - - - - - - - - - - - - - - - - - - - - - -
   when PRINT_DENIED =>
      next_state <= PRINT_DENIED;
      
      if (CNT_OF = '1') then
         next_state <= FINISH;
      end if;
   
	-- - - - - - - - - - - - - - - - - - - - - - -
   when PRINT_ALLOWED =>
      next_state <= PRINT_ALLOWED;
      if (CNT_OF = '1') then
         next_state <= FINISH;
      end if;
   
	-- - - - - - - - - - - - - - - - - - - - - - -
   when FINISH =>
      next_state <= FINISH;
      if (KEY(15) = '1') then
         next_state <= INIT_STATE; 
      end if;
   
	-- - - - - - - - - - - - - - - - - - - - - - -
   when others =>
      next_state <= INIT_STATE;
   
	end case;
end process next_state_logic;

-- -------------------------------------------------------
output_logic : process(present_state, KEY)
begin
   FSM_CNT_CE     <= '0';
   FSM_MX_MEM     <= '0'; --urcuje zda se vypise pristup odepren (0) nebo pristup povolen (1)
   FSM_MX_LCD     <= '0'; --urcuje zda jsou znaky nahrazeny * (0) nebo se zobrazuji normalni znaky (1)
   FSM_LCD_WR     <= '0'; 
   FSM_LCD_CLR    <= '0';

   case (present_state) is
   -- - - - - - - - - - - - - - - - - - - - - - -
   when INIT_STATE | TEST_1 | TEST_2 | TEST_3 | TEST_4 | TEST_5 | TEST_6 | TEST_7 | TEST_8 | TEST_9 | STATE_ERROR | IDLE  =>
      if (KEY(14 downto 0) /= "000000000000000") then
         FSM_LCD_WR     <= '1';
      end if;
      if (KEY(15) = '1') then
         FSM_LCD_CLR    <= '1';
      end if;
   -- - - - - - - - - - - - - - - - - - - - - - -
   when PRINT_DENIED =>
      FSM_CNT_CE     <= '1';
      FSM_MX_LCD     <= '1';
      FSM_LCD_WR     <= '1';
   -- - - - - - - - - - - - - - - - - - - - - - -
   when PRINT_ALLOWED =>
      FSM_CNT_CE     <= '1';
      FSM_MX_LCD     <= '1';
      FSM_LCD_WR     <= '1';
      FSM_MX_MEM		<= '1';
   -- - - - - - - - - - - - - - - - - - - - - - -
   when FINISH =>
      if (KEY(15) = '1') then
         FSM_LCD_CLR    <= '1';
      end if;
   -- - - - - - - - - - - - - - - - - - - - - - -
   when others =>
   end case;
end process output_logic;

end architecture behavioral;

