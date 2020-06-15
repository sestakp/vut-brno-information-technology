-- Citac s volitelnou frekvenci
-- IVH projekt - ukol2
-- autor: xsesta07

library IEEE;
use IEEE.STD_LOGIC_1164.ALL;
-- v pripade nutnosti muzete nacist dalsi knihovny
use IEEE.STD_LOGIC_ARITH.ALL;
use IEEE.STD_LOGIC_UNSIGNED.ALL;
USE ieee.numeric_std.ALL;


entity counter is
	 Generic (
			CLK_FREQ : positive;
			OUT_FREQ : positive);			
    Port ( CLK : in  STD_LOGIC;
           RESET : in  STD_LOGIC;
           EN : out  STD_LOGIC);
end counter;

architecture Behavioral of counter is
-- zde je funkce log2 z prednasek, pravdepodobne se vam bude hodit.
	function log2(A: integer) return integer is
		variable bits : integer := 0;
		variable b : integer := 1;
	begin
		while (b <= a) loop
			b := b * 2;
			bits := bits + 1;
		end loop;

		return bits;
	end function;
	
	constant FREQ : integer := CLK_FREQ/OUT_FREQ;
	signal count: std_logic_vector(log2(FREQ) downto 0) := (others => '0');
begin
-- Èítaè bude mít 2 generické parametry: frekvenci hodinového signálu (CLK_FREQ) a výstupní
-- frekvekvenci (OUT_FREQ) (obì dvì zadané v Hz). Èítaè s frekvencí odpovídající OUT_FREQ
-- (t.j., napø 2x za sekundu) aktivuje na jeden hodinový cyklus signál EN
-- reset je aktivni v 1: tj kdyz je reset = 1, tak se vymaze vnitrni citac
-- pro zjednoduseni pocitejte, ze CLK_FREQ je delitelne OUT_FREQ beze zbytku

	process (CLK, RESET)
	variable cnt: integer := FREQ-1;
	begin
		if RESET = '1' then
			count <= (others => '0');
			EN <= '0';
		elsif rising_edge(CLK) then

			if conv_integer(count) = cnt then
				count <= (others => '0');
				EN <= '1';
			else
				EN <= '0';
				count <= count + '1';
			end if;
		
		end if;	
	end process;

end Behavioral;

