<?php
function authenticate() {
	header('WWW-Authenticate: Basic realm="Golden Sign Authentication"');
	header('HTTP/1.0 401 Unauthorized');
	header('charset="utf-8"');
	print '운영자 아이디로 로그인한 후 이용해주세요';
	exit;
}

if(!isset($_SERVER['PHP_AUTH_USER'])) {
	authenticate();
} else {
	$fp = fopen(dirname(__FILE__)."/.htpasswd","r");
	while($buf = trim(fgets($fp,1024))) {
		$data = explode("|",$buf);
		if($data[0] == $_SERVER['PHP_AUTH_USER'] && $data[1] == hash(sha256,$_SERVER['PHP_AUTH_PW'])) {
			$matched = 1;
			break;
		}
	}
	fclose($fp);
	if(!$matched) {
		authenticate();
	}
}
?>
