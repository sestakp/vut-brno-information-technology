<?php
  class Argument{
      public $Type;
      public $Value;

      public function __construct($param1){

        if($param1 == ''){
          return null;
        }
        
        $this->Value = $param1;
        $this->Type = "Unknown";

        $substrings = preg_split("/[@]/", $param1, -1);

        //Its argument without value for example string@
        if(count($substrings) == 1){
          $this->Value = $param1;
        }
        //regular argument with type and value
        else if(count($substrings) > 1){
          $this->Type = $substrings[0];
          $this->Value = $substrings[1];
        }
        
        //If value was separed by @ to more pieces, make it back together
        if(count($substrings) > 2){
          for ($i = 2; $i <= count($substrings); $i++){
            if($substrings[$i] != ""){
              $this->Value .= "@".$substrings[$i];
            }
          }
        }
      }
  }  
?>