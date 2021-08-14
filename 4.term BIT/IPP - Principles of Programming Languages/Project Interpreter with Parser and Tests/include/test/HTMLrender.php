<?php
    define("DIFF",0);
    define("JEXAMXML",1);

    /*! \brief Encapsulation of work with stdin and rendering HTML file
    */
    class HTMLrender{

        /*! \brief Generate HTML Header with styles
        */
        public function __construct(){
            echo "<!DOCTYPE html>\n";
            echo "<html>\n";
                echo "\t<head>\n";
                    echo "\t\t<meta charset=\"UTF-8\">";
                    echo "\t\t<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css\" rel=\"stylesheet\" integrity=\"sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6\" crossorigin=\"anonymous\">";
                    echo "\t\t<style>\n";
                    echo "\t\th1 { text-align:center; font-size: 3em; padding: 1em; font-weight:bold; }\n";
                    echo "\t\ttr { height: 40px; }\n";
                    echo "\t\ttd { word-wrap:break-word; font-size: 1em; }";
                    echo "\t\thtml { background-color: #4E4E4E;}\n";
                    echo "\t\tbody { color: #FAFAFA; background-color: #4E4E4E; }\n";
                    echo "\t\ttable {table-layout: fixed; color: #FAFAFA !important; text-align: center; max-width: 80%; margin: auto; font-size:1.6em; font-weight:bold;}\n";
                    echo "\t\t.success{ background-color: #28AB00; }\n";
                    echo "\t\t.failed{ background-color: #E31111; }\n";
                    echo "\t\t</style>\n";
                echo "\t</head>\n";
                echo "\t<body>\n";
                echo "\t\t<h1>IPP automatic tests summary</h1>\n";
        }

        /*! \brief Generate status bar of percent success of current tests and timestamp of report
        *   \param passed number of passed tests
        *   \param allTests number of all tests
        */
        public function generateProgressBar($passed, $allTests){
            echo 
            '
            <div style="width: 50%; display: flex; font-size:2em; margin: auto; padding 1em;">
                <h2  class="w-25" style="display: inline-flex;" >Passed tests: </h2>
                <div class="progress w-75" style="height:auto;" >
                  <div style="background-color: #28AB00; font-size:2em; height:auto; width: '.($passed/$allTests*100).'%" class="progress-bar" role="progressbar" aria-valuenow="'.$passed.'" aria-valuemin="0" aria-valuemax="'.$allTests.'">'.round($passed/$allTests*100,0).'% ('.$passed.' of '.$allTests.')</div>
                </div>
            </div>
            
            <div style="font-size:2em; text-align:center; padding:1em;">Report generated: '.date("l, d.m.Y h:i:sa").' </div>
            ';
        }

        /*! \brief Generate header for table
        */
        public function generateTableHeader(){
            echo "\t\t<table style=\"width:100%\" class=\"table table-bordered table-hover\" >\n";
            echo "\t\t\t<tr>\n";
                echo "\t\t\t\t<th>TEST NAME</th>\n";
                echo "\t\t\t\t<th>INPUT</th>\n";
                echo "\t\t\t\t<th>EXPECTED OUTPUT</th>\n";
                echo "\t\t\t\t<th>OUTPUT</th>\n";
                echo "\t\t\t\t<th>EXPECTED EXIT CODE</th>\n";
                echo "\t\t\t\t<th>EXIT CODE</th>\n";
            echo "\t\t\t</tr>\n";
        }

        /*! \brief Add test into report table
        */
        public function addTest($test){
            
            if ($test->ExpectedExitCode == $test->ExitCode) { $className = "success"; }
            else { $className = "failed"; }

            echo "\t\t\t<tr class=\"".$className."\">\n";
            echo "\t\t\t\t<td>".$test->Name."</td>\n";
            echo "\t\t\t\t<td>".$test->Input."</td>\n";
            echo "\t\t\t\t<td>".$test->ExpectedOutput."</td>\n";
            echo "\t\t\t\t<td>".$test->Output."</td>\n";
            echo "\t\t\t\t<td>".$test->ExpectedExitCode."</td>\n";
            echo "\t\t\t\t<td>".$test->ExitCode."</td>\n";
            echo "\t\t\t</tr>\n";
        }

        /*! \brief Close HTML tags
        */
        public function __destruct(){
                    echo "\t\t</table>\n";
                echo "\t</body>\n";
            echo "</html>\n";
        }

    }
?>