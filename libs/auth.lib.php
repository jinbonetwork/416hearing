<?php
function isAdmin() {
	if(isset($_SERVER['PHP_AUTH_USER'])) {
		$fp = fopen(dirname(__FILE__)."/../.htpasswd","r");
		while($buf = trim(fgets($fp,1024))) {
			$data = explode("|",$buf);
			if($data[0] == $_SERVER['PHP_AUTH_USER'] && $data[1] == hash(sha256,$_SERVER['PHP_AUTH_PW'])) {
				$matched = 1;
				break;
			}
		}
		fclose($fp); 
		if($matched) {
			return true;
		}
	}
	return false;
}
?>
