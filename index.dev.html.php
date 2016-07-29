<?php
require_once "config/config.php";
if(preg_match("/edit$/i",$_SERVER['REQUEST_URI'])) {
	define("__EDIT_MODE__",true);
}
?>
<!DOCTYPE html>
<html lang="ko" class="no-js">
<head>
	<meta charset="UTF-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width,user-scalable=0,initial-scale=1">
	<title>세월호 청문회</title>
	<link rel="stylesheet" href="contrib/jquery-ui/1.11.4/themes/smoothness/jquery-ui.css">
	<link rel="stylesheet" href="contrib/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="css/PageStackNavigation-custom/demo.css" />
	<link rel="stylesheet" type="text/css" href="css/PageStackNavigation-custom/component.css" />
	<link rel="stylesheet" type="text/css" href="contrib/bareunbatang/style.css">
	<link rel="stylesheet" href="contrib/fancybox/2.1.5/source/jquery.fancybox.css">
	<link rel="shortcut icon" type="image/x-icon" href="./resources/favicon.ico">
	<link rel="stylesheet" href="contrib/pgwslideshow/pgwslideshow.min.css">
	<link rel="stylesheet" href="contrib/gray/css/gray.min.css">
	<link rel="stylesheet" href="contrib/WOW/css/libs/animate.css">
<?php if(defined("__EDIT_MODE__") && __EDIT_MODE__ == true) {?>
	<link rel="stylesheet" href="contrib/medium-editor/dist/css/medium-editor.min.css">
	<link rel="stylesheet" href="contrib/medium-editor/dist/css/themes/bootstrap.min.css">
	<link rel="stylesheet" href="contrib/spectrum/spectrum.css">
<?php }?>

	<script type="text/javascript">
		WebFontConfig = {
			// For google fonts
			google: {
				families: ['Montserrat:400,700']
			},
			// For early access or custom font
			custom: {
				families: ['Noto Sans KR'],
				urls: ['http://fonts.googleapis.com/earlyaccess/notosanskr.css']
			}
		};
	</script>
	<script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js" async></script>
	<script src="https://www.youtube.com/iframe_api" async></script>
	<script src="contrib/jquery/jquery-2.2.1.min.js"></script>
	<script src="contrib/jquery-ui/1.11.4/jquery-ui.min.js"></script>
	<script src="js/PageStackNavigation-custom/modernizr-custom.js"></script>
	<script src="contrib/fancybox/2.1.5/source/jquery.fancybox.pack.js"></script>
	<script src="contrib/pgwslideshow/pgwslideshow.min.js"></script>
	<script src="contrib/jquery-browser-plugin/dist/jquery.browser.min.js"></script>
	<script src="contrib/gray/js/jquery.gray.min.js"></script>
	<script src="contrib/lazyload/dist/lazyload.min.js"></script>
	<script src="contrib/WOW/dist/wow.min.js"></script>
	<script src="contrib/jquery-disablescroll/jquery.disablescroll.min.js"></script>
<?php if(defined("__EDIT_MODE__") && __EDIT_MODE__ == true) {?>
	<script src="contrib/medium-editor/dist/js/medium-editor.min.js"></script>
	<script src="//cdn.ckeditor.com/4.5.7/standard/ckeditor.js"></script>
<?php }?>
	<meta property="og:title" content="세월호, 끝나지 않은 진상규명"/>
	<meta property="og:type" content="website"/>
	<meta property="og:url" content="http://taogi.net/416hearing"/>
	<meta property="og:image" content="http://www.taogi.net/416hearing/data/images/og.jpg"/>
	<meta property="og:description" content="세월호 선수들기가 성공했습니다. 그러나 이제 시작입니다. 가장 확실한 증거인 세월호 인양후 정밀조사는 특조위에 의해 수행되어야 합니다.">
	<meta property="og:site_name" content="세월호, 끝나지 않은 진상규명"/>
	<meta property="og:section" content="사회"/>
	<meta name="twitter:card" content="summary">
	<meta name="twitter:site" content="@416family">
	<meta name="twitter:title" content="세월호, 끝나지 않은 진상규명">
	<meta name="twitter:description" content="세월호 선수들기가 성공했습니다. 그러나 이제 시작입니다. 가장 확실한 증거인 세월호 인양후 정밀조사는 특조위에 의해 수행되어야 합니다.">
	<meta name="twitter:creator" content="세월호 가족협의회, 진보네트워크센터">
	<meta name="twitter:image:src" content="http://www.taogi.net/416hearing/data/images/og.jpg">
	<meta name="twitter:domain" content="http://www.taogi.net/416hearing">
</head>

<body>
	<!-- navigation -->
	<nav class="pages-nav">
		<div class="pages-nav__item"><a class="link link--page" href="#page-truth-beyond">끝나지 않은 진상규명</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-2nd-hearing">2차 청문회</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-hearing">1차 청문회</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-journal">416가족의 발자취</a></div>
	</nav>
	<!-- /navigation-->
	<section class="introduction">
		<p class="content"><span>감추는 자가 범인이다.</span><br>끝까지 밝혀야 합니다!</p>
		<p class="credit">만든이들: <a href="https://www.facebook.com/416family">416가족협의회</a> &amp; <a href="http://lab.jinbo.net">진보넷 독립네트워크팀</a></p>
	</section>
	<!-- pages stack -->
	<div class="pages-stack">
		<div class="page" id="page-truth-beyond">
			<?php echo file_get_contents(dirname(__FILE__).'/truth_beyond/index.html'); ?>
		</div>
		<div class="page" id="page-2nd-hearing">
			<?php echo file_get_contents(dirname(__FILE__).'/2nd_hearing/index.html'); ?>
		</div>
		<div class="page" id="page-hearing">
			<?php echo file_get_contents(dirname(__FILE__).'/hearing/index.html'); ?>
		</div>
		<div class="page" id="page-journal">
			<?php echo file_get_contents(dirname(__FILE__).'/journal/index.html'); ?>
		</div>
	</div>
	<!-- /pages-stack -->
	<?php echo file_get_contents(dirname(__FILE__).'/witnesses/witnesses.html'); ?>
	<button class="menu-button"><span><i class="fa fa-bars"></i></span></button>

	<script src="contrib/PageStackNavigation/js/classie.js"></script>
	<script src="js/PageStackNavigation-custom/main.js"></script>
</body>

</html>
