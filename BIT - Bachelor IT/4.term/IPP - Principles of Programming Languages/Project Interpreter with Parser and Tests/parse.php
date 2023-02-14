<?php
	
	ini_set('display_errors', 'stderr');
	
	require_once('./include/parser/Parser.php');

	$parser = new Parser();
	$parser->CheckArguments($argc,$argv);
	$parser->AnalyzeInputFile();		

	exit(SUCCESS);
?>
