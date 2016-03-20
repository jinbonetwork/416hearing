<?php
require_once dirname(__FILE__)."/../config/config.php";
require_once LIBPATH."/db.lib.php";
require_once LIBPATH."/result.lib.php";
require_once CLASSPATH."/Opinion.class.php";

$conn = db_connect();

if($mode == 'add') {
	if(!trim($memo)) {
		PrintError(1,'질문을 입력하세요');
	}
	$insert_id = Opinion::add($conn,$_POST);
	if($insert_id < 0) {
		PrintError(2,"데이터베이스에 입력하는 도중 장애가 발생했습니다. 잠시후에 다시 해주세요");
	}
}
if(!$page) $page = 1;
if(!$limit) $limit = 10;
$page_num = 5;
$total_cnt = Opinion::totalCnt($conn,1);
if($total_cnt) {
	$total_page = (int)( ( $total_cnt - 1 ) / $limit ) + 1;
	if($page > $total_page) {
		PrintError(-1,'더 이상 없습니다.');
	}

	$s_page = ( (int)( ( $page - 1 ) / $page_num ) * $page_num ) + 1;
	$e_page = min( $total_page, ( $s_page + $page_num - 1 ) );
	if($s_page > 1) $p_page = $s_page - 1;
	if($e_page < $total_page) $n_page = $e_page + 1;

	$opinions = Opinion::getList($conn,1,$page,$limit);
	if($output == 'json') {
		ob_start();
		include_once dirname(__FILE__)."/list.html.php";
		$content = ob_get_contents();
		ob_end_clean();

		$result = array('error'=>0,'message'=>$content);
		printResult($result);
	} else {
		include_once dirname(__FILE__)."/list.html.php";
	}
}

db_close();
?>
