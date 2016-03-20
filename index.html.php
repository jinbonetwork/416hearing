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
	<!--meta name="description" content="Blueprint: A basic template for a page stack navigation effect" />
	<meta name="keywords" content="blueprint, template, html, css, page stack, 3d, perspective, navigation, menu" />
	<meta name="author" content="Codrops" /-->
	<!--link rel="shortcut icon" href="favicon.ico"-->
	<link rel="stylesheet" href="contrib/font-awesome/4.5.0/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="contrib/PageStackNavigation/css/demo.css" />
	<link rel="stylesheet" type="text/css" href="contrib/PageStackNavigation/css/component.css" />
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
		<div class="pages-nav__item"><a class="link link--page" href="#page-teaser">2차 청문회</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-manuals">Manuals</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-software">Software</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-custom">Customization &amp; Settings</a></div>
		<div class="pages-nav__item"><a class="link link--page" href="#page-training">Training</a></div>
		<div class="pages-nav__item pages-nav__item--small"><a class="link link--page link--faded" href="#page-buy">Where to buy</a></div>
		<div class="pages-nav__item pages-nav__item--small"><a class="link link--page link--faded" href="#page-blog">Blog &amp; News</a></div>
		<div class="pages-nav__item pages-nav__item--small"><a class="link link--page link--faded" href="#page-contact">Contact</a></div>
		<div class="pages-nav__item pages-nav__item--social">
			<a class="link link--social link--faded" href="#"><i class="fa fa-twitter"></i><span class="text-hidden">Twitter</span></a>
			<a class="link link--social link--faded" href="#"><i class="fa fa-linkedin"></i><span class="text-hidden">LinkedIn</span></a>
			<a class="link link--social link--faded" href="#"><i class="fa fa-facebook"></i><span class="text-hidden">Facebook</span></a>
			<a class="link link--social link--faded" href="#"><i class="fa fa-youtube-play"></i><span class="text-hidden">YouTube</span></a>
		</div>
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
			<!--img class="poster" src="images/2.jpg" alt="img02" /-->
		</div>
		<div class="page" id="page-software">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Software &amp; Downloads</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"I decided to pick the diet that I thought would maximize my chances of long-term survival." &mdash; Al Gore
				</p>
			</header>
			<!--img class="poster" src="images/3.jpg" alt="img03" /-->
		</div>
		<div class="page" id="page-custom">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Customization &amp; Settings</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"You have to make a conscious decision to change for your own well-being, that of your family and your country." &mdash;Bill Clinton
				</p>
			</header>
			<!--img class="poster" src="images/4.jpg" alt="img04" /-->
		</div>
		<div class="page" id="page-training">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Training &amp; Learning Center</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"The moment I began to understand what was going on with the treatment of animals, it led me more and more in the way of the path I am [on] now, which is a complete vegan." &mdash; Bryan Adams
				</p>
			</header>
			<!--img class="poster" src="images/5.jpg" alt="img05" /-->
		</div>
		<div class="page" id="page-buy">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Where to buy</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"When people ask me why I don't eat meat or any other animal products, I say, 'Because they are unhealthy and they are the product of a violent and inhumane industry.'" &mdash;
				</p>
			</header>
			<!--img class="poster" src="images/6.jpg" alt="img06" /-->
		</div>
		<div class="page" id="page-blog">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Blog &amp; News</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"The question is not, 'Can they reason?' nor, 'Can they talk?' but rather, 'Can they suffer?" &mdash; Jeremy Bentham
				</p>
			</header>
			<!--img class="poster" src="images/1.jpg" alt="img01" /-->
		</div>
		<div class="page" id="page-contact">
			<header class="bp-header cf">
				<h1 class="bp-header__title">Contact</h1>
				<p class="bp-header__desc">Based on Ilya Kostin's Dribbble shot <a href="https://dribbble.com/shots/2286042-Stacked-navigation">Stacked navigation</a></p>
				<p class="info">
					"Man is the only animal that can remain on friendly terms with the victims he intends to eat until he eats them." &mdash; Samuel Butler
				</p>
			</header>
			<!--img class="poster" src="images/4.jpg" alt="img04" /-->
		</div>
	</div>
	<!-- /pages-stack -->
	<button class="menu-button"><span>Menu</span></button>
	<script src="contrib/PageStackNavigation/js/classie.js"></script>
	<script src="contrib/PageStackNavigation/js/main.js"></script>
	<script src="journal/script.js"></script>
	<script src="teaser/script.js"></script>
	<script src="resources/scroll-effect/script.js"></script>
</body>

</html>
