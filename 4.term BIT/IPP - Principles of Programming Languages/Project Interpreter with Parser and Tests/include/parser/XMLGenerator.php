<?php
    class XMLGenerator{		
        private $xmlWriter;
        private $xmlInstructionOrder = 1;

        public function __construct() {
            //Initialize xml file
            $this->xmlWriter = xmlwriter_open_memory();
            xmlwriter_set_indent($this->xmlWriter, 1);
            $res = xmlwriter_set_indent_string($this->xmlWriter, ' ');
        }
        
        public function generateHeader($version = '1.0', $format = 'UTF-8'){
            //Genereta xml header
            xmlwriter_start_document($this->xmlWriter, $version, $format);

            // A first element
            xmlwriter_start_element($this->xmlWriter, 'program');
                xmlwriter_start_attribute($this->xmlWriter, 'language');
                    xmlwriter_text($this->xmlWriter, 'IPPcode21');
                xmlwriter_end_attribute($this->xmlWriter);

        }

        public function GetInstructionOrder(){
            return $this->xmlInstructionOrder++;
        }

        public function GenerateInstruction($Instruction){
            xmlwriter_start_element($this->xmlWriter, 'instruction');
                xmlwriter_start_attribute($this->xmlWriter, 'order');
                    xmlwriter_text($this->xmlWriter,$this->GetInstructionOrder());
                xmlwriter_end_attribute($this->xmlWriter);
                xmlwriter_start_attribute($this->xmlWriter, 'opcode');
                    xmlwriter_text($this->xmlWriter,$Instruction->Opcode);
                xmlwriter_end_attribute($this->xmlWriter);
                
                if(empty($Instruction->Arg1->Type) == false){
                    xmlwriter_start_element($this->xmlWriter, 'arg1');
                        xmlwriter_start_attribute($this->xmlWriter, 'type');
                            xmlwriter_text($this->xmlWriter,$Instruction->Arg1->Type);
                        xmlwriter_end_attribute($this->xmlWriter);
                        xmlwriter_text($this->xmlWriter,$Instruction->Arg1->Value);
                    xmlwriter_end_element($this->xmlWriter);
                }

                if(empty($Instruction->Arg2->Type) == false){
                    xmlwriter_start_element($this->xmlWriter, 'arg2');
                        xmlwriter_start_attribute($this->xmlWriter, 'type');
                            xmlwriter_text($this->xmlWriter,$Instruction->Arg2->Type);
                        xmlwriter_end_attribute($this->xmlWriter);
                        xmlwriter_text($this->xmlWriter,$Instruction->Arg2->Value);
                    xmlwriter_end_element($this->xmlWriter);
                }

                if(empty($Instruction->Arg3->Type) == false){
                    xmlwriter_start_element($this->xmlWriter, 'arg3');
                        xmlwriter_start_attribute($this->xmlWriter, 'type');
                            xmlwriter_text($this->xmlWriter,$Instruction->Arg3->Type);
                        xmlwriter_end_attribute($this->xmlWriter);
                        xmlwriter_text($this->xmlWriter,$Instruction->Arg3->Value);
                    xmlwriter_end_element($this->xmlWriter);
                }
                
            xmlwriter_end_element($this->xmlWriter);
        }

        public function SendToSTDOUT(){
            xmlwriter_end_element($this->xmlWriter); //end of element program
            echo xmlwriter_output_memory($this->xmlWriter);
        }
        
        function __destruct() {	
            xmlwriter_end_document($this->xmlWriter);
        }
    }
?>