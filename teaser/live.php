<?php
require_once dirname(__FILE__)."/../admin/auth.php";

$datapath = dirname(__FILE__)."/../data/live/live.html";

extract($_GET);
extract($_POST);

switch($mode) {
	case "save":
		$fp = fopen($datapath,"w");
		fwrite($fp,$_POST['content']);
		fclose($fp);

		$result = array('error'=>0,'status'=>'ok');
		break;
	case "list":
	default:
		$fp = fopen($datapath,"r");
		$content = fread($fp,filesize($datapath));
		fclose($fp);

		$result = array('error'=>0,'content'=>$content);
		break;
}
header('Content-Type: application/json; charset=utf-8');
print json_encode($result);
?>
