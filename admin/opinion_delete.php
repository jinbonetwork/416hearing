<?php                   
require_once "../config/config.php";
require_once dirname(__FILE__)."/auth.php";
require_once LIBPATH."/db.lib.php";
require_once LIBPATH."/result.lib.php";
require_once CLASSPATH."/Opinion.class.php";

@extract($_GET);
@extract($_POST);

$conn = db_connect();

if(count($ids) > 0) {
	Opinion::del($conn,$ids);
}

db_close();

$return_url = "./opinion.php?";
if($page) $return_url .= "page=".$page;
header("Location: ".$return_url);
?>
