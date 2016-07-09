<?php
require_once dirname(__FILE__)."/../config/config.php";
require_once LIBPATH."/result.lib.php";

$witnesses_file = dirname(__FILE__)."/../data/witnesses.json";
$witnesses = json_decode(file_get_contents($witnesses_file),true);

$suspicions1_file = dirname(__FILE__)."/../data/1st_hearing/suspicions.json";
$suspicions_data[1] = json_decode(file_get_contents($suspicions1_file),true);
$suspicions2_file = dirname(__FILE__)."/../data/2nd_hearing/suspicions.json";
$suspicions_data[2] = json_decode(file_get_contents($suspicions2_file),true);

if($_GET['name'] && $witnesses[$_GET['name']]) {
	$name = $_GET['name'];
	if(is_array($witnesses[$name]['suspicions']) && count($witnesses[$name]['suspicions']) > 0) {
		$suspicions = array();
		foreach($witnesses[$name]['suspicions'] as $sus) {
			$susp = explode("-",$sus);
			$suspicions[] = array(
				'page' => (int)$susp[0],
				'id' => (int)$susp[1],
				'title' => $suspicions_data[(int)$susp[0]][( (int)$susp[1] - 1 )]['title']
			);
		}
		$witnesses[$name]['suspicions'] = $suspicions;
		$witnesses[$name]['descript'] = nl2br($witnesses[$name]['descript']);
		for($i=0; $i<@count($witnesses[$name]['timeline']); $i++) {
			$witnesses[$name]['timeline'][$i]['content'] = nl2br($witnesses[$name]['timeline'][$i]['content']);
		}
	}
	printResult($witnesses[$name]);
} else {
	foreach($witnesses as $name => $wit) {
		$suspicions = array();
		foreach($wit['suspicions'] as $sus) {
			$susp = explode("-",$sus);
			$suspicions[] = array(
				'page' => (int)$susp[0],
				'id' => (int)$susp[1],
				'title' => $suspicions_data[(int)$susp[0]][((int)$susp[1]-1)]['title']
			);
		}
		$witnesses[$name]['suspicions'] = $suspicions;
		$witnesses[$name]['descript'] = nl2br($witnesses[$name]['descript']);
		for($i=0; $i<@count($witnesses[$name]['timeline']); $i++) {
			$witnesses[$name]['timeline'][$i]['content'] = nl2br($witnesses[$name]['timeline'][$i]['content']);
		}
	}
	printResult($witnesses);
}
?>
