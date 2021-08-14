<?php

/*! \brief Encapsulate work with one test
*/
class Test {
    public $Name;
    public $Input;
    public $ExpectedOutput;
    public $Output;
    public $ExpectedExitCode;
    public $ExitCode;

    /*! \brief Fill test properties
    */
    public function __construct($testname,$input,$expectedOutput,$output,$expectedExitCode,$exitCode){
        $this->Name = $testname;
        $this->input = $input;
        $this->ExpectedOutput = $expectedOutput;
        $this->Output = $output;
        $this->ExpectedExitCode = $expectedExitCode;
        $this->ExitCode = $exitCode;    
    }
}
?>