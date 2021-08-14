<?php
    
	ini_set('display_errors', 'stderr');
	require_once('./include/parser/error_codes.php');
	require_once('./include/parser/Instruction.php');
	require_once('./include/parser/XMLGenerator.php');
	require_once('./include/parser/Argument.php');

    define("LOC", 0);
    define("COMMENTS", 1);
    define("LABELS", 2);
    define("JUMPS", 3);
    define("FWJUMPS", 4);
    define("BACKJUMPS", 5);
    define("BADJUMPS", 6);

	class Parser{
        //Counter variables
        private $statfiles = array();
        private $statfilecount = 0;
        private $statFlags = array();
        private $statFlag = array();

        private $labels = array();
        private $jumps = array();

        private $COUNTERS = array(0,0,0,0,0,0,0);

        private $FLAGS = array("--loc" => 0, 
                       "--comments" =>1, 
                       "--labels" =>2, 
                       "--jumps"=>3, 
                       "--fwjumps"=>4, 
                       "--backjumps"=>5, 
                       "--badjumps"=>6);

        private function statJumps($labelName = ""){ 
            $this->COUNTERS[JUMPS] += 1;

            if($labelName == ""){
                return;
            }
            
            if(in_array( $labelName, $this->labels )){
                $this->COUNTERS[BACKJUMPS] += 1;
            }
            else{
                $this->COUNTERS[FWJUMPS] += 1;
            }
            array_push($this->jumps,$labelName);
        }

        /*! \brief Print error message on stderr
        *   \param error_code Expected non negative number, this number is exit code of program
        *   \param error_message Detail message to inform user about error
        */
        private function Error($error_code, $error_message = ""){
            $string = "\nERROR[line".$this->InstructionCounter."]>>".$error_message."\n";
            fwrite(STDERR, $string);   
            exit($error_code);
		}

        /*! \brief Get instruction from stdin and remove comments from source code
        *   If current Argument is not variable exit parser with error
        *   Until stdin isn't readed return instance of Instruction, else return "EOF" in string format
        */
		private function Getinstruction(){
			while($line = fgets(STDIN)) {
				
                //pattern for string in line with first char # to end of line
                $comment_pattern = "/#.*$/";
                if(preg_match($comment_pattern,$line)){
                    $this->COUNTERS[COMMENTS] +=1;
                }

                $line = preg_replace($comment_pattern,'',$line);

                //Split tokens with whitespaces on line. 
                //-1 represent no limit to length. 
                //flag PREG_SPLIT_NO_EMPTY => split will return only non empty parts
				$tokens = preg_split('/\s+/', $line,-1,PREG_SPLIT_NO_EMPTY);	
                
                if(count($tokens) > 0){
                    $this->COUNTERS[LOC] += 1;
                    return new instruction($tokens[0],$tokens[1],$tokens[2], $tokens[3], count($tokens));
				}
			}
			return "EOF";
		}

        /*! \brief Main function of parser, analyze input file
        *   If source code on stdin has lexical or syntactic error exit parser with error
        */
		public function AnalyzeInputFile(){
			
			$xml = new XMLGenerator();
            $this->LACheckHeader();
			$xml->generateHeader();
            $this->InstructionCounter = 0;
			while(($instruction = $this->Getinstruction()) != "EOF"){
                $this->InstructionCounter +=1;
                switch($instruction->Opcode){
                    // OPCODE <var> <symb>
                    case "MOVE":
                    case "INT2CHAR":
                    case "TYPE":
                    case "STRLEN":
                    case "NOT":
                        $this->LexemCountChecker($instruction,3);
                        $this->isVar($instruction->Arg1, $instruction->Opcode);
                        $this->isSymb($instruction->Arg2, $instruction->Opcode);
                        break; 

                    // OPCODE
                    case "RETURN":
                        $this->statJumps();
                    case "CREATEFRAME":
                    case "PUSHFRAME":
                    case "POPFRAME":
                    case "BREAK":

                        $this->LexemCountChecker($instruction,1);
                        break;
                    
                    // OPCODE <var>
                    case "DEFVAR":
                        $this->LexemCountChecker($instruction,2);
                        $this->isVar($instruction->Arg1, $instruction->Opcode);
                        break;
                    
                    // OPCODE <label>
                    case "LABEL":
                    case "CALL":
                    case "JUMP":
                        
                        if($instruction->Opcode == "LABEL"){
                            $this->COUNTERS[LABELS] += 1;
                            array_push($this->labels,$instruction->Arg1->Value);
                        }   
                        else{
                            $this->statJumps($instruction->Arg1->Value);
                        }

                        $this->LexemCountChecker($instruction,2);
                        $this->isLabel($instruction->Arg1, $instruction->Opcode);
                        break;
                        

                    // OPCODE <symb>
                    case "PUSHS":
                    case "EXIT":
                    case "DPRINT":
                    case "WRITE":
                        $this->LexemCountChecker($instruction,2);
                        $this->isSymb($instruction->Arg1, $instruction->Opcode);
                        break;
                    
                    // OPCODE <var>
                    case "POPS":
                        $this->LexemCountChecker($instruction,2);
                        $this->isVar($instruction->Arg1, $instruction->Opcode);
                        break;
                    
                    // OPCODE <label> <symb> <symb>
                    case "JUMPIFNEQ":
                    case "JUMPIFEQ":
                        $this->statJumps($instruction->Arg1->Value);
                        $this->LexemCountChecker($instruction,4);
                        $this->isLabel($instruction->Arg1,$instruction->Opcode);
                        $this->isSymb($instruction->Arg2, $instruction->Opcode);
                        $this->isSymb($instruction->Arg3, $instruction->Opcode);
                        break;

                    // OPCODE <var> <type>
                    case "READ":
                        $this->LexemCountChecker($instruction,3);
                        $this->isVar($instruction->Arg1, $instruction->Opcode);
                        $instruction->Arg2 = $this->isType($instruction->Arg2, $instruction->Opcode);
                        break;
                    
                    // OPCODE <var> <symb> <symb>
                    case "ADD":
                    case "SUB":
                    case "MUL":
                    case "IDIV":
                    case "STRI2INT":
                    case "CONCAT":
                    case "GETCHAR":
                    case "SETCHAR":
                    case "LT":
                    case "GT":
                    case "EQ":
                    case "AND":
                    case "OR":
                        $this->LexemCountChecker($instruction,4);
                        $this->isVar($instruction->Arg1, $instruction->Opcode);
                        $this->isSymb($instruction->Arg2, $instruction->Opcode);
                        $this->isSymb($instruction->Arg3, $instruction->Opcode);
                        break;

                    default:
                        $this->Error(ERROR_WRONG_OPCODE,"Used unknown instruction ".$instruction->Opcode."\n");
                }
                $xml->Generateinstruction($instruction);
			}
			$xml->SendToSTDOUT();
            $this->PrintStats();
		}

        /*! \brief Check if argument is variable
        *   \param argument Instance of class Argument defined in ./includes/Classes/Argument.php
        *   \param opcode represent opcode of current instruction
        *   \param soft if false, error exit parser, else function return false
        *   If current Argument is not variable exit parser with error
        */
        private function isVar($argument, $opcode, $soft = false){
            
            $type = $argument->Type;
            $value = $argument->Value;

            $retval = ($type == "GF") || ($type == "LF") || ($type == "TF");
            
            //Check if value start with letter,number, or some of special chars:  _, -, $, &, %, *, !, ?
            $pattern = '/^[a-zA-Z\_\-\$\&\%\*\!\?][\w\_\-\$\&\%\*\!\?]*$/';

            if(!preg_match($pattern,$value)){
                if($soft){
                    return false;
                }
                else{
                    $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." with wrong argument, invalid name ".$value."\n");
                }
            }
            
            if((!$retval)){
                if($soft){
                    return false;
                }
                else{
                    $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." with wrong argument, expected variable\n");
                } 
            }

            $argument->Value = $type."@".$value;
            $argument->Type = "var";
            return $argument;
        }

        /*! \brief Check if argument is symbol
        *   \param argument Instance of class Argument defined in ./includes/Classes/Argument.php
        *   \param opcode represent opcode of current instruction
        *   If current Argument is not symbol exit parser with error
        */
        private function isSymb(&$argument, $opcode){
            $type = $argument->Type;
            $value = $argument->Value;

            $retval = $this->isVar($argument,$opcode,true);
            
            if($retval == true)
            {
                return $retval; //retval contains argument object
            }

            switch($type){
                case "nil":
                    if($value != "nil"){
                        $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." has unknown value of nil\n");
                    }
                    $retval = true;
                    break;

                case "bool":
                    if(!preg_match("/false|true/", $value)){
                        $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." has unknown value of bool\n");
                    }
                    $retval = true;
                    break;

                case "int":
                    if(!is_numeric($value)){
                        $this->Error(ERROR_LEX_SYN_ERR, "Integer with non numeric value\n");
                    }
                    //DONT CHECK NUMBERS
                    /*
                    //regex to match numbers, + and - can be first char
                    if(!preg_match("/^[+-]?[\d]+$/", $value)){
                        $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." has unknown value of int\n");
                    }
                    */
                    $retval = true;
                    break;

                case "string":
                    if(preg_match("/\\\\[^0-9]/",$value) || preg_match("/\\\\\d[^0-9]/",$value) || preg_match("/\\\\\d{2}[^0-9]/",$value) || preg_match("/\\\\$/",$value)){
                        $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." argument have \"\\\" symbol in string\n");
                    }
                    $retval = true;
                    
                    break;

                default:
                    $retval = false;
            }

            if(!$retval){
                $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." with wrong argument, expected symbol\n");
            }
        }

        /*! \brief Check if current token can be label
        *   \param argument Instance of class Argument defined in ./includes/Classes/Argument.php
        *   If argument value didnt match label rules exit parser with error
        */
        private function isLabel($argument, $opcode){
            
            if($argument->Type != "Unknown"){
                $this->Error(ERROR_LEX_SYN_ERR, "Wrong label name\n");
            }
            
            $argument->Type = "label";

            //Check if value start with letter,number, or some of special chars:  _, -, $, &, %, *, !, ?
            $pattern = '/^[a-zA-Z\_\-\$\&\%\*\!\?][\w\_\-\$\&\%\*\!\?]*$/';
            if(!preg_match($pattern,$argument->Value)){
                $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." with wrong argument, invalid name ".$argument->Value."\n");
            }
        }

        /*! \brief Check if current token can be Type
        *   \param argument Instance of class Argument defined in ./includes/Classes/Argument.php
        *   If argument value didnt match label rules exit parser with error
        */
        private function isType($argument, $opcode){
            #⟨type⟩ ∈ {int, string, bool}
            $argument->Type = "type";
            $pattern = '/int|string|bool/';

            if(!preg_match($pattern,$argument->Value)){
                $this->Error(ERROR_LEX_SYN_ERR,"Instruction ".$opcode." with wrong argument, invalid name ".$opcode."\n");
            }
            return $argument;
        }

        /*! \brief Check number of lexems in instruction
        *   \param instruction Instance of class Instruction defined in ./includes/Classes/Instruction.php
        *   \param count represent expected number of lexems
        *   If number of lexems is not equal to count exit parser with error
        */
        private function LexemCountChecker($instruction, $count){
            if($instruction->LexemCount != $count){
                echo $instruction->LexemCount;
                $this->Error(ERROR_LEX_SYN_ERR, "Wrong lexem count for instruction ".$instruction->Opcode);
            }
        }

        /*! \brief Check if source code header is in file
        *  Source code must be introduced by header '.IPPcode21' else exit parsing
        *  If header is not included program is exited.
        */
        private function LACheckHeader(){
            $instruction = $this->Getinstruction();
            $this->COUNTERS[LOC] -= 1;
            if($instruction->Opcode != ".IPPCODE21"){
                $this->Error(ERROR_MISSING_HEAD,"Missing header .IPPcode21");
            }
        }

		/* 
		Function to print help, used for argument --help
		*/	
		private function PrintHelp(){
			echo "Script parser.php\n";
            echo "Launch: php7.4 parse.php <file.src >out.xml\n";
			echo "Only supported argument is --help\n";
            exit;
		}

        /*! \brief handle program arguments
        *   \param argc standard argument count
        *   \param argv standard arguments value
        *   If unknown argument passed exit parser with error
        */
		public function CheckArguments($argc,$argv){
			
            for($i = 1; $i < $argc; $i++){
                
                $arg = $argv[$i];
                if($arg == '--help'){
                    if($argc > 2){
                        $this->Error(ERROR_PARAM,"Combnation --help with another arguments");
                    }

                    $this->PrintHelp();
                }
                else if(preg_match('/^--stats=[.]*/', $arg)){
                    
                    $filename = preg_split("/[=]/", $arg, -1)[1];
                    array_push($this->statfiles,$filename);
                    
                    if(count($this->statfiles) > 1){
                        array_push($this->statFlags,$this->statFlag);
                        $this->statFlag = array();
                    }
                }
                else if(isset($this->FLAGS[$arg])){
                    array_push($this->statFlag,$arg);
                }
                else{
                    $this->Error(ERROR_PARAM, "Unknown parameter");
                }

            }
            array_push($this->statFlags,$this->statFlag);

            if(count($this->statfiles) !== count(array_unique($this->statfiles))){
                $this->Error(ERROR_PARAM, "Duplicities in filenames for statistics");
            }

		}
        
        /*
         * Function to print statistics
         */
        public function PrintStats(){

            ##Check for bad jumps
            for($i = 0; $i < count($this->jumps); $i++){
                if(!in_array( $this->jumps[$i], $this->labels)){
                    $this->COUNTERS[BADJUMPS] += 1;
                    $this->COUNTERS[FWJUMPS] -= 1;
                }
            }

            for($i = 0; $i < count($this->statfiles); $i++){

                $filename =  $this->statfiles[$i];
                $filehandler = fopen($filename, "w");
                if(false){
                    $this->Error(ERROR_OUTPUT_FILES, "Unable to open file {$filename}");
                }
              
                $statFlag = $this->statFlags[$i];

                for($j = 0; $j < count($statFlag); $j++){
                    fwrite($filehandler,$this->COUNTERS[$this->FLAGS[$statFlag[$j]]]."\n");
                    #fwrite($filehandler,"\n");                    
                }
                fclose($filehandler);
            }
        }      
	}
?>