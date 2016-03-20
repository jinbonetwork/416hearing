<?php
require_once "../config/config.php";
require_once dirname(__FILE__)."/auth.php";
require_once LIBPATH."/db.lib.php";
require_once LIBPATH."/result.lib.php";
require_once CLASSPATH."/Opinion.class.php";

@extract($_GET);
$page = ($_GET['page'] ? $_GET['page'] : 1);
$limit = 25;
$page_num = 10;

$page_uri = strtok($_SERVER['REQUEST_URI'],"?")."?";

$conn = db_connect();

$total_cnt = Opinion::totalCnt($conn,1);
if($total_cnt) {
	$total_page = (int)( ( $total_cnt - 1 ) / $limit ) + 1;
	if($page > $total_page) {
        Error('더 이상 없습니다.');
	}

	$s_page = ( (int)( ( $page - 1 ) / $page_num ) * $page_num ) + 1;
	$e_page = min( $total_page, ( $s_page + $page_num - 1 ) );
	if($s_page > 1) $p_page = $s_page - 1;
	if($e_page < $total_page) $n_page = $e_page + 1;

	$opinions = Opinion::getList($conn,1,$page,$limit);
}

db_close();

$title = "2차 청문회 네티즌 질문지 관리";
require_once dirname(__FILE__)."/header.html.php";
?>
		<div class="opinion-page">
			<h1>2차 청문회 네티즌 질문지 관리</h1>
			<section id="opinion-list">
				<form id="opinion-list-form" name="opinion_list_form" action="./opinion_delete.php">
				<input type="hidden" name="page" value="<?php print $page; ?>" />
				<table border="0" cellpadding="2" cellspacing="0" width="100%">
					<thead>
						<col class="id" />
						<col class="memo" />
						<col class="regdate" />
						<col class="button" />
					</thead>
					<tbody>
						<tr>
							<th><a href="javascript://" onclick="selectAll('opinion-list-form');">선택</th>
							<th class="memo">질문내용</th>
							<th class="regdate">작성시간</th>
							<th class="button">삭제</th>
						</tr>
<?php				foreach($opinions as $opinion) {?>
						<tr>
							<td><input type="checkbox" name="ids[]" value="<?php print $opinion['id']; ?>" /> <?php print $opinion['id']; ?></td>
							<td class="memo"><?php print $opinion['memo']; ?></td>
							<td class="regdate"><?php print date("Y-m-d H:i:s", $opinion['regdate']); ?></td>
							<td class="button"><button type="button" onclick="deleteOpinion(<?php print $opinion['id']; ?>)">삭제</button></td>
						</tr>
<?php				}?>
					</tbody>
				</table>
				<div class="buttons">
					<input type="button" value="전체선택" onclick="selectAll('opinion-list-form');" />
					<input type="button" value="선택해제" onclick="unselectAll('opinion-list-form');" />
					<input type="button" value="선택삭제" onclick="deleteSelected('opinion-list-form');" />
				</div>
				</form>
				<div class="navi">
					<ul>
<?php				if($p_page) {?>
						<li class="prev"><a href="<?php print $page_uri."page=".$p_page; ?>">&lt;&lt;</a></li>
<?php				}
					for($p=$s_page; $p<=$e_page; $p++) {?>
						<li>
<?php					if($p == $page) {?>
							<span class="current"><?php print $page; ?></span>
<?php					} else {?>
							<a href="<?php print $page_uri."page=".$p; ?>"><?php print $p; ?></a>
<?php					}?>
						</li>
<?php				}
					if($n_page) {?>
						<li class="next"><a href="<?php print $page_uri."page=".$n_page; ?>">&gt;&gt;</a></li>
<?php				}?>
					</ul>
				</div>
			</section>
		</div>
<?php
require_once dirname(__FILE__)."/footer.html.php";
?>
