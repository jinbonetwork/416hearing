<?php
ini_set("display_errors","on");
ini_set("error_reporting","E_ALL");

$dbinfo = array(
	'host' => 'localhost',
	'db' => 'HWANGKM',
	'user' => 'hwangkm',
	'password' => '73041252',
	'charset' => 'utf8'
);

define( "ROOT", rtrim( dirname(__FILE__), "config" ) );
define( "CONFPATH", dirname(__FILE__) );
define( "LIBPATH", ROOT."libs" );
?>
