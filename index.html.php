<?php
require_once "config/config.php";
require_once dirname(__FILE__).'/contrib/lessphp/lessc-0.4.0.inc.php';
function less($hrefs){
	$root = dirname(__FILE__).'/';
	$lessCode = '';
	foreach($hrefs as $href) $lessCode .= file_get_contents($root.$href);
	$less = new lessc;
	echo "<style>\n";
	echo $less->compile($lessCode);
	echo "</style>\n";
}
?>

<!DOCTYPE html>
<html lang="ko" class="no-js">

<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>세월호 청문회</title>
	<link rel="stylesheet" href="contrib/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="css/PageStackNavigation-custom/demo.css" />
	<link rel="stylesheet" type="text/css" href="css/PageStackNavigation-custom/component.css" />
	<link rel="stylesheet" type="text/css" href="contrib/notosans/2015.06.15/css/style.css">
	<link rel="stylesheet" type="text/css" href="contrib/bareunbatang/style.css">
	<link rel="stylesheet" type="text/css" href="contrib/montserrat-master/css/montserrat.css">
	<link rel="stylesheet" href="contrib/fancybox/2.1.5/source/jquery.fancybox.css">
	<?php
	less(array(
		'css/style.less',
		'journal/style.less',
		'teaser/style.less',
		'resources/scroll-effect/style.less'
	));
	?>
	<script src="contrib/jquery/jquery-2.2.1.min.js"></script>
	<script src="contrib/underscore/underscore-min.js"></script>
	<script src="contrib/PageStackNavigation/js/modernizr-custom.js"></script>
	<script src="contrib/fancybox/2.1.5/source/jquery.fancybox.pack.js"></script>
</head>

<body>
	<!-- navigation -->
	<nav class="pages-nav">
		<div class="pages-nav__item"><a class="link link--page" href="#page-journal">416가족의 발자취</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-hearing">1차 청문회(준비중)</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-teaser">2차 청문회</a></div>
	</nav>
	<!-- /navigation-->
	<section class="introduction">
		<p class="content"><span>감추는 자가 범인이다.</span><br>끝까지 밝혀야 합니다!</p>
		<p class="credit">만든이들: <a href="https://www.facebook.com/416family">416가족협의회</a> &amp; <a href="http://lab.jinbo.net">진보넷 독립네트워크팀</a></p>
	</section>
	<!-- pages stack -->
	<div class="pages-stack">
		<div class="page se-container" id="page-journal">
			<?php echo file_get_contents(dirname(__FILE__).'/journal/index.html'); ?>
		</div>
		<div class="page" id="page-hearing">
			<h1 style="padding: 20%;">준비중</h1>
		</div>
		<div class="page se-container" id="page-teaser">
			<?php echo file_get_contents(dirname(__FILE__).'/teaser/index.html'); ?>
		</div>
		<div class="page" id="page-dummy1"></div>
		<div class="page" id="page-dummy2"></div>
		<div class="page" id="page-dummy3"></div>
	</div>
	<!-- /pages-stack -->
	<button class="menu-button"><span><i class="fa fa-bars out-se-color"></i></span></button>

	<script src="contrib/PageStackNavigation/js/classie.js"></script>
	<script src="contrib/PageStackNavigation/js/main.js"></script>
	<script src="js/script.js"></script>
	<script src="journal/script.js"></script>
	<script src="teaser/script.js"></script>
	<script src="resources/scroll-effect/script.js"></script>
</body>

</html>
