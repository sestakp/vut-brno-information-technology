<?php
    class Instruction{
        public $Opcode;
        public $Arg1;
        public $Arg2;
        public $Arg3;
        public $LexemCount;

        public function __construct($Opcode,$Arg1,$Arg2,$Arg3,$Count){
            $this->Opcode = strtoupper($Opcode);
            $this->Arg1 = new Argument($Arg1);
            $this->Arg2 = new Argument($Arg2);
            $this->Arg3 = new Argument($Arg3); 
            $this->LexemCount = $Count;
        }
    }
?>