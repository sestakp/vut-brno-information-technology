<?php
    /*! \brief Check argumets for test script and setup global variables
    */
    function check_arguments(){
            
        $long_options= array(
            "help",
            "directory:",
            "recursive",
            "parse-script:",
            "int-script:",
            "parse-only",
            "int-only",
            "jexamxml:",
            "jexamcfg:"
        );

        $getOpt_args = getopt("", $long_options);

        if (array_key_exists("help", $getOpt_args)){
            if(count($getOpt_args) != 1){
                printError(ERROR_PARAM,"Argument --help cannot be combined with other arguments\n");
                exit(ERROR_PARAM);
            }
            echo "Script test.php help\n";
            echo "--help                Print help\n";
            echo "--directory=path      specifies directory with tests, default value is current dir\n";
            echo "--recursive           Searching for a tests even in subdirectories\n";
            echo "--parse-script=file   Specifies parse script, default value is ./parse.php\n";
            echo "--int-parse=file      Specifies interpret script, default value is ./interpret.py\n";
            echo "--parse-only          Test only parser, cannot be combined with --int-only and --int-script\n";
            echo "--int-only            Test only interpret, cannot be combined with --parse-only and --parse-script\n";
            echo "--jexamxml=file       Specifies pack with A7Soft JExamXML, default value is /pub/courses/ipp/jexamxml/jexamxml.jar\n";
            echo "--jexamcfg=file       Specifies JExamXML configuration, default value is /pub/courses/ipp/jexamxml/options\n";
            exit(SUCCESS);
        }

        #set default values, else edit by arguments
        global $directory, $recursive, $testType, $parseFile, $interpretFile, $jexamxml, $jexamcfg;
        $directory = "./";
        $recursive = False;
        $testType = 0; //binary 11 to OR with both
        $parseFile = "./parse.php";
        $interpretFile = "./interpret.py";
        $jexamxml = "/pub/courses/ipp/jexamxml/jexamxml.jar";
        $jexamcfg = "/pub/courses/ipp/jexamxml/options";

        if(array_key_exists("directory",$getOpt_args)){ $directory = $getOpt_args["directory"]; }
        
        if(!is_dir($directory)){
            fwrite(STDERR, "Specified directory by --directory doesn't exist\n");  
            exit(ERROR_DIR_FILE_NOEXIST);
        }

        if(array_key_exists("recursive",$getOpt_args)) { $recursive = True; }

        if(array_key_exists("parse-script",$getOpt_args)) { $parseFile = $getOpt_args["parse-script"]; }

        if(!is_file($parseFile)){
            fwrite(STDERR, "Specified file by --parse-script doesn't exist\n");  
            exit(ERROR_DIR_FILE_NOEXIST);
        }

        if(array_key_exists("int-script",$getOpt_args)) { $interpretFile = $getOpt_args["int-script"]; }

        if(!is_file($interpretFile)){
            fwrite(STDERR, "Specified file by --int-script doesn't exist\n");  
            exit(ERROR_DIR_FILE_NOEXIST);
        }

        if(array_key_exists("parse-only",$getOpt_args)){
            $testType = 1; //binary 01
            if(array_key_exists("int-only",$getOpt_args) || array_key_exists("int-script",$getOpt_args)){
                printError(ERROR_PARAM, "Argument parse-only cannot be combined with int-only and int-script");
            }
        }

        if(array_key_exists("int-only",$getOpt_args)){
            $testType = 2; //bonary 10
            if(array_key_exists("parse-only",$getOpt_args) || array_key_exists("parse-script",$getOpt_args)){
                printError(ERROR_PARAM, "Argument int-only cannot be combined with parse-only and parse-script");
            }
        }

        if(array_key_exists("jexamxml",$getOpt_args)) { $jexamxml = $getOpt_args["jexamxml"]; }
  
        if(!is_file($jexamxml)){
            fwrite(STDERR, "Specified file by --jexamxml doesn't exist\n");  
            exit(ERROR_DIR_FILE_NOEXIST);
        }

        if(array_key_exists("jexamcfg",$getOpt_args)) { $jexamcfg = $getOpt_args["jexamcfg"]; }

        if(!is_file($jexamcfg)){
            fwrite(STDERR, "Specified file by --jexamcfg doesn't exist\n");  
            exit(ERROR_DIR_FILE_NOEXIST);
        }
    }
?>