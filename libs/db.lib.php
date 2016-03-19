<?php
function db_connect() {
	if(!file_exists(CONFPATH."/db.config.php")) return null;
	require_once CONFPATH."/dbconfig.php";
	$conn = mysql_connect($dbinfo['host'],$dbinfo['user'],$dbinfo['pass']);
	if(!$conn) return null;
	mysql_query("set names ".$dbinfo['charset'],$conn);
	mysql_select_db($dbinfo['db'],$conn);

	return $conn;
}

function db_close() {
	global $conn;

	mysql_close($conn);
}
?>
