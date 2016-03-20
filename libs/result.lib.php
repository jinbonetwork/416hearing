<?php
function PrintResult($result) {
	global $conn;

	if($conn)
		db_close();

	header('Content-Type: application/json; charset=utf-8');
	print json_encode($result);
	exit;
}

function PrintError($code,$message) {
	global $conn;

	$result = array('error'=>$code,'message'=>$message);

	PrintResult($result);
}

function Error($message) {
	global $conn;

	echo $message;
	exit;
}
