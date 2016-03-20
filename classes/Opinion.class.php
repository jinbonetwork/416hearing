<?php
class Opinion {
	public static function instance() {
		return self::_instance(__CLASS__);
	}

	public static function totalCnt($conn,$publish=1) {
		$que = "SELECT count(*) AS cnt FROM `416hearing_opinion`".($publish >= 0 ? " WHERE `published` = '1'" : "");
		$result = mysql_query($que,$conn);
		$row = mysql_fetch_assoc($result);
		mysql_free_result($result);

		return ($row['cnt'] ? $row['cnt'] : 0);
	}

	public static function getList($conn,$publish=1,$page=1,$limit=20) {
		$que = "SELECT * FROM `416hearing_opinion`".($publish >= 0 ? " WHERE `published` = '".$publish."'" : "")." ORDER BY id DESC LIMIT ".( ($page-1) * $limit ).",".$limit;
		$result = mysql_query($que,$conn);
		$total_cnt = mysql_num_rows($result);
		$opinions = array();
		for($i=0; $i<$total_cnt; $i++) {
			$row = mysql_fetch_assoc($result);
			$row['memo'] = stripslashes($row['memo']);
			$opinions[] = $row;
		}

		return $opinions;
	}

	public static function add($conn,$args) {
		$que = "INSERT INTO `416hearing_opinion` (`memo`,`published`,`regdate`) VALUES ('".addslashes($args['memo'])."','1',".time().")";
		if(!($result = mysql_query($que,$conn))) {
			return -1;
		}
		$insert_id = mysql_insert_id($conn);

		return $insert_id;
	}
}
?>
