-- cpu.vhd: Simple 8-bit CPU (BrainF*ck interpreter)
-- Copyright (C) 2020 Brno University of Technology,
--                    Faculty of Information Technology
-- Author(s): Pavel Sestak <xsesta07@vutbr.cz>
--

library ieee;
use ieee.std_logic_1164.all;
use ieee.std_logic_arith.all;
use ieee.std_logic_unsigned.all;
use ieee.numeric_std.all;

-- ----------------------------------------------------------------------------
--                        Entity declaration
-- ----------------------------------------------------------------------------
entity cpu is
 port (
   CLK   : in std_logic;  -- hodinovy signal
   RESET : in std_logic;  -- asynchronni reset procesoru
   EN    : in std_logic;  -- povoleni cinnosti procesoru
 
   -- synchronni pamet ROM
   CODE_ADDR : out std_logic_vector(11 downto 0); -- adresa do pameti
   CODE_DATA : in std_logic_vector(7 downto 0);   -- CODE_DATA <- rom[CODE_ADDR] pokud CODE_EN='1'
   CODE_EN   : out std_logic;                     -- povoleni cinnosti
   
   -- synchronni pamet RAM
   DATA_ADDR  : out std_logic_vector(9 downto 0); -- adresa do pameti
   DATA_WDATA : out std_logic_vector(7 downto 0); -- ram[DATA_ADDR] <- DATA_WDATA pokud DATA_EN='1'
   DATA_RDATA : in std_logic_vector(7 downto 0);  -- DATA_RDATA <- ram[DATA_ADDR] pokud DATA_EN='1'
   DATA_WE    : out std_logic;                    -- cteni (0) / zapis (1)
   DATA_EN    : out std_logic;                    -- povoleni cinnosti 
   
   -- vstupni port
   IN_DATA   : in std_logic_vector(7 downto 0);   -- IN_DATA <- stav klavesnice pokud IN_VLD='1' a IN_REQ='1'
   IN_VLD    : in std_logic;                      -- data platna
   IN_REQ    : out std_logic;                     -- pozadavek na vstup data
   
   -- vystupni port
   OUT_DATA : out  std_logic_vector(7 downto 0);  -- zapisovana data
   OUT_BUSY : in std_logic;                       -- LCD je zaneprazdnen (1), nelze zapisovat
   OUT_WE   : out std_logic                       -- LCD <- OUT_DATA pokud OUT_WE='1' a OUT_BUSY='0'
 );
end cpu;


-- ----------------------------------------------------------------------------
--                      Architecture declaration
-- ----------------------------------------------------------------------------
architecture behavioral of cpu is

 -- zde dopiste potrebne deklarace signalu
  
  type   state_t is (S_INIT, S_FETCH, S_DECODE, S_INC_P, S_DEC_P, S_INC_V, S_DEC_V, S_WHILE_S, S_WHILE_S_1, S_WHILE_S_2, S_WHILE_S_3, S_WHILE_E, S_WHILE_E_2, S_PRINT, S_PRINT_2, S_LOAD, S_HALT);
  signal state      : state_t;
  
  signal RAS        : std_logic_vector(191 downto 0);  -- 16x 12 bits
  signal PC         : std_logic_vector(11 downto 0); --Output of program counter
  signal PTR        : std_logic_vector(9  downto 0); --pointer to ram memory
  signal CNT        : std_logic_vector(3 downto 0);  --maximal 16 addresses in RAS
  signal CNT_zero   : std_logic; --represent if CNT == 0

  signal RDATA_zero : std_logic; --represent if current mem in RAM is zero

  signal MX_sel     : std_logic_vector(1  downto 0); -- select signal for multiplexor MX
begin

 -- zde dopiste vlastni VHDL kod


 -- pri tvorbe kodu reflektujte rady ze cviceni INP, zejmena mejte na pameti, ze 
 --   - nelze z vice procesu ovladat stejny signal,
 --   - je vhodne mit jeden proces pro popis jedne hardwarove komponenty, protoze pak
 --   - u synchronnich komponent obsahuje sensitivity list pouze CLK a RESET a 
 --   - u kombinacnich komponent obsahuje sensitivity list vsechny ctene signaly.

  CODE_ADDR <= PC; -- set code address to program counter

  CNT_zero <= '1' when CNT = "0000" else -- check if CNT is zero
              '0';

  RDATA_zero <= '1' when DATA_RDATA = "00000000" else --check if current mem in RAM is zero
                '0';

  DATA_ADDR <= PTR; -- set data address in RAM to ptr

  OUT_DATA <= DATA_RDATA;

  --MX
  with MX_sel select
  DATA_WDATA <= IN_DATA        when "11",
                DATA_RDATA + 1 when "01",
                DATA_RDATA - 1 when "10",
                "00000000"     when others;

--FSM
  FSM: process(CLK,RESET)
  begin
    if RESET = '1' then
      --Reset there
      state <= S_INIT;
      PC <= (others => '0');
      CNT <= (others => '0');
      PTR <= (others => '0');
      RAS <= (others => '0');
    elsif rising_edge(CLK) then

      MX_sel   <= "00";

      DATA_EN  <= '0';
      DATA_WE  <= '0';

      CODE_EN  <= '0';
      IN_REQ   <= '0';
      OUT_WE   <= '0';

      if(EN = '1') then
        --change states
        case (state) is
            when S_INIT =>
              CODE_EN <= '1'; --enable work with ROM mem  
              state <= S_FETCH;

            when S_FETCH =>         
              PC <= PC + '1'; --increment program counter
              state <= S_DECODE; -- next state is decode
            
            ----------------------------------------------------
            when S_DECODE =>
              --decode instruction
              case (CODE_DATA) is
                when x"3E" => -- > increment pointer
                  state <= S_INC_P; --body of S_INC_P can be passed there, but bad debugging in simulation

                when x"3C" => -- < decrement pointer
                  state <= S_DEC_P; --same problem like with increment pointer

                when x"2B" => -- + increment value on actual pointer
                  
                  DATA_EN <= '1'; --enable memory RAM
                  state <= S_INC_V;

                when x"2D" => -- - decrement value on actual pointer
                  DATA_EN <= '1';
                  state <= S_DEC_V;

                when x"5B" => -- [ start cycle if actual mem is 0 then skip cycle
                  DATA_EN <= '1'; --enable access to RAM
                  state <= S_WHILE_S;

                when x"5D" =>  -- ] if is actual mem non zero jumo on start of cycle else continue in code
                  DATA_EN <= '1'; --enable access to RAM
                  state <= S_WHILE_E;

                when x"2E" => -- . print actual mem to display
                  state <= S_PRINT;

                when x"2C" => -- , load value and store in actual memory
                  state <= S_LOAD;

                when x"00" => -- null == halt
                  state <= S_HALT;
                
                when others =>
                  CODE_EN <= '1'; --enable work with ROM mem
                  state <= S_FETCH; --error load next instruction
                  
              end case;
            ----------------------------------------------------
            when S_INC_P =>
              PTR <= PTR + '1';

              CODE_EN <= '1'; --enable work with ROM mem
              state <= S_FETCH;
            
            ----------------------------------------------------
            when S_DEC_P =>
              PTR <= PTR - '1';
              
              CODE_EN <= '1'; --enable work with ROM mem
              state <= S_FETCH;
            
            ----------------------------------------------------
            when S_INC_V =>
                DATA_EN <= '1'; --enable memory RAM
                DATA_WE <= '1'; --enable write into memory
                MX_sel <= "01"; --select increment memory value on multiplexor
                
                CODE_EN <= '1'; --enable work with ROM mem  
                state <= S_FETCH;
            
            ----------------------------------------------------
            when S_DEC_V =>
                DATA_EN <= '1'; --enable memory RAM
                DATA_WE <= '1'; --enable write into memory
                MX_sel <= "10"; --select decrement memory value on multiplexor
              
                CODE_EN <= '1'; --enable work with ROM mem
                state <= S_FETCH;

            ----------------------------------------------------
            when S_WHILE_S =>
              CODE_EN <= '1';

              state <= S_WHILE_S_1;
            ----------------------------------------------------
            when S_WHILE_S_1 =>
              if(RDATA_zero = '1') then      
                CNT <= CNT + '1';      
                PC <= PC + '1';
                CODE_EN <= '1';

                state <= S_WHILE_S_2; --change there
              else
                RAS <= RAS(179 downto 0) & PC; -- push RAS
                CODE_EN <= '1';
                state <= S_FETCH;
              end if;
            
            
            --state <= S_WHILE_S_2;
                  --TODO debug code address 55-57
            ----------------------------------------------------
            when S_WHILE_S_2 => --this part didnt work. cannot skip cycle
                state <= S_WHILE_S_3;

            ----------------------------------------------------
            when S_WHILE_S_3 =>
              CODE_EN <= '1';
              if (CNT_zero = '0') then
                if (CODE_DATA = x"5B") then
                  CNT <= CNT + '1';
                elsif (CODE_DATA = x"5D") then
                  CNT <= CNT - '1';
                end if;
                PC <= PC + '1';
                state <= S_WHILE_S_2;
              else
                state <= S_FETCH;
              end if;  
            ----------------------------------------------------
            when S_WHILE_E =>
                  state <= S_WHILE_E_2;
            
            ----------------------------------------------------
            when S_WHILE_E_2 =>
              if(RDATA_zero = '1') then
                RAS <= "000000000000" & RAS(191 downto 12); -- pop value from RAS
              else
                PC <= RAS(11 downto 0); ----load RAS top to PC
              end if;

              CODE_EN <= '1';
              state <= S_FETCH;
          
            ----------------------------------------------------
            when S_PRINT =>
              if(OUT_BUSY = '0') then
                DATA_EN <= '1'; --enable memory and actualize RDATA in RAM memory
                state <= S_PRINT_2;
              end if;
            
            ----------------------------------------------------
            when S_PRINT_2 =>
              OUT_WE <= '1'; --signal for display

              CODE_EN <= '1'; --enable work with ROM mem 
              state <= S_FETCH;

            ----------------------------------------------------
            when S_LOAD =>
              IN_REQ <= '1'; -- set IN_REQ to 1
              if(IN_VLD = '1') then --wait until
                MX_sel <= "11";
                DATA_EN <= '1'; --enable memory RAM
                DATA_WE <= '1'; --enable write into memory

                CODE_EN <= '1'; --enable work with ROM mem
                state <= S_FETCH;
              end if;  
            
            when others =>
            
        end case;
      end if; 
    end if;
  end process;
end behavioral;