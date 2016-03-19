<?php
class CsvToJournal {
	private $inFile = 'journal.csv';
	private $outFile = 'output/journal.json';
	private $_fromEnc = 'euckr';
	private $_toEnc = 'utf-8';

	function __construct(){
		$array = $this->csvToArray($this->inFile);
		$array = $this->convEnc($array);
		$array = $this->makeArray($array);
		$json = json_encode($array, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
		$fp = fopen($this->outFile, 'w');
		fwrite($fp, $json);
		fclose($fp);
		echo '<pre>'.$json.'</pre>';
	}
	private function csvToArray($file_name){
		$fp = fopen($file_name, "r");
		$array = array();
		while($row = fgetcsv($fp)){
			$array[] = $row;
		}
		return $array;
	}
	private function makeArray($array){
		$items = array();
		for($i = 2, $leni = count($array); $i < $leni;){
			$section = array('section'=>$array[$i][0], 'data'=>array());
			while(true){
				$section['data'][] = array(
					'date' => $this->dateCov($array[$i][2]),
					'title' => $array[$i][3],
					'content' => $array[$i][4],
					'level' => ($array[$i][5] ? 1 : 0),
					'media' => array()
				);
				$i++;
				if($array[$i][0] || $i >= $leni) break;
			}
			$items[] = $section;
		}
		return $items;
	}
	private function dateCov($date){
		$date = preg_replace('/년\s+/', '.', $date);
		$date = preg_replace('/월\s+/', '.', $date);
		$date = preg_replace('/일/', '', $date);
		return $date;
	}
	private function convEnc($array){
		$new_array = array();
		foreach($array as $item){
			$new_item = array();
			foreach($item as $item_element){
				$new_item[] = mb_convert_encoding($item_element, $this->_toEnc, $this->_fromEnc);
			}
			$new_array[] = $new_item;
		}
		return $new_array;
	}
}
new CsvToJournal();
?>
