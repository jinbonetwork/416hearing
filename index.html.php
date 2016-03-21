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
		<div class="pages-nav__item"><a class="link link--page" href="#page-journal">가족협의회 활동일지</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-manuals">Manuals</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-teaser">2차 청문회</a></div>
	</nav>
	<!-- /navigation-->
	<!-- pages stack -->
	<div class="pages-stack">
		<div class="page se-container" id="page-journal">
			<?php echo file_get_contents(dirname(__FILE__).'/journal/index.html'); ?>
		</div>
		<div class="page" id="page-teaser">
			<?php echo file_get_contents(dirname(__FILE__).'/teaser/index.html'); ?>
		</div>
		<div class="page" id="page-manuals">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Manuals</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"When you adopt a vegan diet we make a connection, you don't go back, it is not a diet, it is a lifestyle." &mdash; Freelee Frugivore
				</p>
			</header>
		</div>
	</div>
	<!-- /pages-stack -->
	<button class="menu-button"><span><i class="fa fa-th-large se-color"></i></span></button>

	<script src="contrib/PageStackNavigation/js/classie.js"></script>
	<script src="contrib/PageStackNavigation/js/main.js"></script>
	<script src="js/script.js"></script>
	<script src="journal/script.js"></script>
	<script src="teaser/script.js"></script>
	<script src="resources/scroll-effect/script.js"></script>
</body>

</html>
