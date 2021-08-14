<?php

    ini_set('display_errors', 'stderr');
    require_once('./include/test/ErrorHandler.php');
    require_once('./include/test/HTMLrender.php');
    require_once('./include/test/CheckArguments.php');
    require_once('./include/test/Test.php');
    
    check_arguments();

    $testsArray = Array();

    $HTMLrender = new HTMLrender();

    $command = "find ".$directory;

    if(!$recursive){ $command .= " -maxdepth 1"; }

    $command .= " -regex '.*\.src$' ";

    $paths = shell_exec($command);

    $paths = preg_split("/\r\n|\n|\r/", $paths,-1,PREG_SPLIT_NO_EMPTY);
    
    $allTests = 0;
    $passed = 0;
    foreach ($paths as &$origPath){
        $allTests++;

        //explode by last /. reverse string, then reverse back
        list($name, $path) = explode("/",strrev($origPath),2);
        $path = strrev($path);
        $name = strrev($name);
        $name = explode(".",$name)[0];
        
        //Check if exist current files, else create
        $rc_filename = $path."/".$name.".rc";
        if(!is_file($rc_filename)){
            $rc_file = fopen($rc_filename, "w");
            fwrite($rc_file,"0");
            fclose($rc_file);
        }

        $rc_file = fopen($rc_filename, "r");          
        $expectedRetval = fgets($rc_file);
        fclose($rc_file);

        $in_filename = $path."/".$name.".in";
        if(!is_file($in_filename)){
            $in_file = fopen($in_filename, "w");
            fclose($in_file);
        }

        $in_file = fopen($in_filename, "r");    
        $input = "";
        while($line = fgets($in_file)){  
            $input .= $line;
        }      
        fclose($in_file);

        $out_filename = $path."/".$name.".out";
        if(!is_file($out_filename)){
            $out_file = fopen($out_filename, "w");
            fclose($out_file);
        }

        $out_file = fopen($out_filename, "r");          
        $expectedOutput = "";
        while($line = fgets($out_file)){
            $expectedOutput .= $line;
        } 
        fclose($out_file);
        
        //Create tmpFile
        $outputFile = tmpfile();
        
        $outputFilePath = stream_get_meta_data($outputFile)['uri'];

        //select command
        //make parse and interpreting
        if($testType == 0){
            $command = "php7.4 ".$parseFile." <".$origPath." | python3.8 ".$interpretFile." --input=".$in_filename." >". $outputFilePath;
        }
        //make parse
        elseif($testType == 1){
            $command = "php7.4 ".$parseFile." <".$origPath." >".$outputFilePath;
        }
        //make interpreting
        elseif($testType == 2){
            $command = "cat ".$origPath." | python3.8 ".$interpretFile." --input=".$in_filename." >".$outputFilePath;
        }
        
        //launch command
        exec($command, $output, $retval);
        
        //$output = implode("\n",$output);
        
        #$output = fread $outputFile
        $output = file_get_contents($outputFilePath, true);


        //make interpreting (with parse or not)
        if($testType == 0 || $testType == 2){
            $command = "diff ".$out_filename." ".$outputFilePath;
        }

        //make parse
        elseif($testType == 1){
            $command = "java -jar ".$jexamxml." ".$outputFilePath." ".$out_filename." delta.xml ".$jexamcfg;
        }

        exec($command, $outputDiff, $retvalDiff);

        fclose($outputFile);
        
        if($retvalDiff != 0 && $retval == 0){
            $retval = $retvalDiff;
        }

        if($expectedRetval == $retval){
            $passed++;
        }

        array_push($testsArray,new Test($name/*$origPath*/,$input,$expectedOutput,$output, $expectedRetval,$retval));
    }

    asort($testsArray);
    $HTMLrender->generateProgressBar($passed, $allTests);
    $HTMLrender->generateTableHeader();

    foreach($testsArray as $test){
        $HTMLrender->addTest($test);
    }

?>