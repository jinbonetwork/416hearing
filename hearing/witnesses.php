<?php
require_once dirname(__FILE__)."/../config/config.php";
require_once LIBPATH."/result.lib.php";

$witnesses_file = dirname(__FILE__)."/../data/1st_hearing/witnesses.json";
$witnesses = json_decode(file_get_contents($witnesses_file),true);

$suspicions_file = dirname(__FILE__)."/../data/1st_hearing/suspicions.json";
$suspicions_data = json_decode(file_get_contents($suspicions_file),true);

if($_GET['name'] && $witnesses[$_GET['name']]) {
	$name = $_GET['name'];
	if(is_array($witnesses[$name]['suspicions']) && count($witnesses[$name]['suspicions']) > 0) {
		$suspicions = array();
		foreach($witnesses[$name]['suspicions'] as $sus) {
			$suspicions[] = array(
				'id' => $sus,
				'title'=> $suspicions_data[($sus-1)]['title']
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
			$suspicions[] = array(
				'id' => $sus,
				'title'=> $suspicions_data[($sus-1)]['title']
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
