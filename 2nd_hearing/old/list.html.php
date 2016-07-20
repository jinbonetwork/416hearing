<?php
if($total_cnt) {?>
	<div id="opinion-items-wrap">
<?php if(@count($opinions) > 0) {?>
		<ul id="opinion-items">
<?php	foreach($opinions as $opinion) {?>
			<li>
				<div class="memo"><?php print $opinion['memo']; ?></div>
				<div class="regdate"><?php print date("Y-m-d H:i:s", $opinion['regdate'] ); ?></div>
			</li>
<?php	}?>
		</ul>
<?php }?>
		<ul id="opinion-nav">
			<li class="prev">
<?php		if($p_page) {?>
				<a href="javascript://" onclick="get_opinion(<?php print $p_page; ?>); ?>"><span class="prev active">이전</span></a>
<?php		} else { ?>
				<span class="prev">이전</span>
<?php		}?>
			</li>
<?php	for($p=$s_page; $p<=$e_page; $p++( {?>
			<li class="page<?php print ($p == $page ? ' current' : ''); ?>">
<?php		if($p == $page) {?>
				<span class="current"><?php print $p; ?></span>
<?php		} else {?>
				<a href="javascript://" onclick="get_opinion(<?php print $p; ?>); ?>"><span class="page"><?php print $p; ?></span></a>
<?php		}?>
			</li>
<?php	}?>
			<li class="next">
<?php		if($n_page) {?>
				<a href="javascript://" onclick="get_opinion(<?php print $n_page; ?>); ?>"><span class="prev active">이전</span></a>
<?php		} else { ?>
				<span class="next">다음</span>
<?php		}?>
			</li>
		</ul>
	</div>
<?php }
?>
