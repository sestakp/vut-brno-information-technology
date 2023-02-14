<?php
    
    define("ERROR_DIR_FILE_NOEXIST", 41);
    define("ERROR_PARAM",10);
    define("SUCCESS",0);
    define("FAIL",1);

    /*! \brief Print error message on stderr
    *   \param error_code Expected non negative number, this number is exit code of program
    *   \param error_message Detail message to inform user about error
    */
    function printError($error_code, $error_message = ""){
        $string = "\nERROR>>".$error_message."\n";
        fwrite(STDERR, $string);          
        exit($error_code);
    }

?>