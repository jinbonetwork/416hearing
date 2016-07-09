<?php
require_once dirname(__FILE__)."/config/config.php";
require_once LIBPATH."/result.lib.php";

switch($_GET['data']) {
	case "2nd_hearing":
		$suspicions_file = "data/2nd_hearing/suspicions.json";
		$parts_file = "data/2nd_hearing/parts.json";
		break;
	case "hearing":
	default:
		$suspicions_file = "data/1st_hearing/suspicions.json";
		$parts_file = "data/1st_hearing/parts.json";
		break;
}
$witnesses_file = "data/witnesses.json";

$json = array(
	'suspicions' => json_decode(file_get_contents($suspicions_file), true),
	'parts' => json_decode(file_get_contents($parts_file), true),
	'witnesses' => json_decode(file_get_contents($witnesses_file), true)
);

printResult($json);
?>
