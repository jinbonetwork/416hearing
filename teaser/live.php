<?php
require_once dirname(__FILE__)."/../admin/auth.php";

$datapath = dirname(__FILE__)."/../data/live/live.html";

$fp = fopen($datapath,"w");
fwrite($fp,$_POST['content']);
fclose($fp);
?>
