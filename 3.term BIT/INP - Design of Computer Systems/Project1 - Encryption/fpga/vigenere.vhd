library IEEE;
use IEEE.std_logic_1164.all;
--use IEEE.std_logic_arith.all;
use IEEE.std_logic_unsigned.all;
use IEEE.NUMERIC_STD.ALL;

-- rozhrani Vigenerovy sifry
entity vigenere is
   port(
         CLK : in std_logic;
         RST : in std_logic;
         DATA : in std_logic_vector(7 downto 0);
         KEY : in std_logic_vector(7 downto 0);
         CODE : out std_logic_vector(7 downto 0)
    );
end vigenere;

-- V souboru fpga/sim/tb.vhd naleznete testbench, do ktereho si doplnte
-- znaky vaseho loginu (velkymi pismeny) a znaky klice dle vaseho prijmeni.

architecture behavioral of vigenere is

    -- Sem doplnte definice vnitrnich signalu, prip. typu, pro vase reseni,
    -- jejich nazvy doplnte tez pod nadpis Vigenere Inner Signals v souboru
    -- fpga/sim/isim.tcl. Nezasahujte do souboru, ktere nejsou explicitne
    -- v zadani urceny k modifikaci.

    signal SHIFT_COUNT : std_logic_vector(7 downto 0) := (others => '0'); --out signal from shift counter
    signal SHIFT_LEFT  : std_logic_vector(7 downto 0) := (others => '0'); --out signal of SHIFT_LEFT module
    signal SHIFT_RIGHT : std_logic_vector(7 downto 0) := (others => '0'); --out signal of SHIFT_RIGHT module
    signal CNT     : std_logic := '0'; --Value for switching between shift left and right

begin

    -- Sem doplnte popis obvodu. Doporuceni: pouzivejte zakladni obvodove prvky
    -- (multiplexory, registry, dekodery,...), jejich funkce popisujte pomoci
    -- procesu VHDL a propojeni techto prvku, tj. komunikaci mezi procesy,
    -- realizujte pomoci vnitrnich signalu deklarovanych vyse.

    -- DODRZUJTE ZASADY PSANI SYNTETIZOVATELNEHO VHDL KODU OBVODOVYCH PRVKU,
    -- JEZ JSOU PROBIRANY ZEJMENA NA UVODNICH CVICENI INP A SHRNUTY NA WEBU:
    -- http://merlin.fit.vutbr.cz/FITkit/docs/navody/synth_templates.html.

    CNT_P: process(CLK) --process to manage switching counter
    begin
        if (rising_edge(CLK)) then
            CNT <= not CNT;
        end if;
    end process;

    --SHIFT COUNT

    SHIFT_COUNT <= KEY - "01000000" when (to_integer(unsigned(KEY)) >= 65 and to_integer(unsigned(KEY)) <= 90) else
                   "00000000";

    --SHIFT LEFT

    SHIFT_LEFT <= DATA - SHIFT_COUNT when (to_integer(unsigned(DATA - SHIFT_COUNT)) >= 65) else
                  DATA - SHIFT_COUNT + "00011010";

    --SHIFT RIGHT

    SHIFT_RIGHT <= DATA + SHIFT_COUNT when (to_integer(unsigned(DATA + SHIFT_COUNT)) <= 90) else
                   DATA + SHIFT_COUNT - "00011010";

    --FINAL MUX
    CODE <= "00100011"  when (RST = '1' or (DATA >= 48 and DATA <= 57)) else
            SHIFT_RIGHT when (CNT = '1') else
            SHIFT_LEFT  when (CNT = '0');

end behavioral;
