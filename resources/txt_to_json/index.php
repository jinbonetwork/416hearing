<?php
class TxtToJson {
	function __construct(){
		$suspicions = array();
		for($i = 1; $i <= 18; $i++){
			$txt = @file_get_contents('txts/suspicion/'.$i.'.txt');
			if($txt) array_push($suspicions, $this->convert($txt));
			else array_push($suspicions, array());
		}
		$json = json_encode($suspicions, JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT);
		$fp = fopen('jsons/suspicions.json', 'w');
		fwrite($fp, $json);
		fclose($fp);
		echo "<xmp>$json</xmp>";
	}
	private function convert($txt){
		$txt = preg_replace('/“/', '"', $txt);
		$txt = preg_replace('/”/', '"', $txt);
		$txt = preg_replace('/‘/', '\'', $txt);
		$txt = preg_replace('/’/', '\'', $txt);
		$txt = preg_replace('/　/', ' ', $txt);
		$txt = preg_replace('/＃/', '#', $txt);
		$txt = preg_replace('/\r/', "\n", $txt);
		$txt = preg_replace('/\s+(\s)/', '$1', $txt); //연속된 두 개이상의 공백은 하나로
		$txt = preg_replace('/(<[a-z]+.*>[^<>\n]*)\n([^<>\n]*<\/[a-z]+>)/', '$1$2', $txt); //태그로 감싸진 부분 내에 줄바꿈이 있으면 삭제.
		$txt = preg_replace('/"([^"]*)"/', '&ldquo;$1&rdquo;', $txt); //쌍따옴표 대신에 엔티티 사용
		$txt = preg_replace('/(<[^<>\n]*)&ldquo;([^<>\n]*)&rdquo;([^<>\n]*>)/', '$1"$2"$3', $txt); //태그 내의 엔티티를 다시 쌍따옴표로 바꾼다.
		$txt = preg_replace('/\'([^\']*)\'/', '&lsquo;$1&rsquo;', $txt); //외따옴표 대신에 엔티티 사용
		$txt = preg_replace('/(<[^<>\n]*)&lsquo;([^<>\n]*)&rsquo;([^<>\n]*>)/', '$1"$2"$3', $txt); //태그 내의 엔티티를 다시 외따옴표로 바꾼다.
		preg_match_all('/.+\n/', $txt, $lines);

		//echo '<xmp>'; print_r($lines[0]); echo '</xmp>'; return;
		//echo '<xmp>'.$txt.'</xmp>'; return;

		$lines = $lines[0];
		$array = array(
			'title' => '',
			'background' => array('media'=>array(), 'content'=>array()),
			'witnesses'=> array(),
			'abstract' => array('media'=>array(), 'content'=>array()),
			'dialogue' => array(),
			'conclusion' => array('media'=>array(), 'content'=>array()),
			'etc' =>array('media'=>array(), 'content'=>array())
		);
		$curIndex = -1;
		$curLevel;
		$dialIdx_i = -1;
		$dialIdx_j = -1;
		$dialogueStart = false;
		foreach($lines as $line){
			$line = trim($line);
			if(preg_match('/(#+)\s*/', $line, $match)){ // #이 있는 줄의 경우
				$line = preg_replace('/#+\s*/', '', $line);
				$curIndex++;
				$curLevel = strlen($match[1]) - 1;
				if($curLevel == 0 && $curIndex == 0){ // 타이틀
					$array['title'] = preg_replace('/.+[0-9]+\.\s*/', '', $line);
				} else if($curLevel == 1 && $curIndex == 4){
					$dialogueStart = true;
				} else if($curLevel == 1 && $curIndex > 4){
					$dialogueStart = false;
				} else if($curLevel == 2 && $dialogueStart){
					$dialIdx_i++; $dialIdx_j = -1;
					$array['dialogue'][$dialIdx_i] = array(
						'qName'=>'', 'qContent'=>array(), 'qMedia'=>array(),
						'aName'=>'', 'aContent'=>array(), 'aMedia'=>array()
					);
				} else if($curLevel == 2 && !$dialogueStart && $curIndex > 1) { //함께 보기
					$array['etc'] = $this->put($array['etc'], $line);
				} else if($curLevel == 3 && $dialogueStart){
					$dialIdx_j++;
					if($dialIdx_j == 0){
						$array['dialogue'][$dialIdx_i]['qName'] = $line;
					} else if($dialIdx_j == 1){
						$array['dialogue'][$dialIdx_i]['aName'] = $line;
					}
				} else if($curLevel == 4 & $dialogueStart){
					if($dialIdx_j == 0){
						array_push($array['dialogue'][$dialIdx_i]['qContent'], $line);
					} else if($dialIdx_j == 1){
						array_push($array['dialogue'][$dialIdx_i]['aContent'], $line);
					}
				}
			} else { // #이 없는 줄의 경우
				if($curLevel == 1 && $curIndex == 1){ // 의혹 배경
					$array['background'] = $this->put($array['background'], $line);
				} else if($curLevel == 1 && $curIndex == 2){ //관련 증인
					$witnesses = explode(',', $line);
					foreach($witnesses as $witness) array_push($array['witnesses'], trim($witness));
				} else if($curLevel == 1 && $curIndex == 3){ //청문회 주요내용
					$array['abstract'] = $this->put($array['abstract'], $line);
				} else if($curLevel == 1 && $curIndex > 4) { // 청문회를 마치고
					$array['conclusion'] = $this->put($array['conclusion'], $line);
				} else if($curLevel == 4 && $dialogueStart){
					$key;
					$value;
					if(preg_match('/\[(.+)\|(.+)\|(.+)\]/', $line, $match)){
						$medium = array('url'=>$this->url(trim($match[1])), 'size'=>trim($match[2]), 'caption'=>trim($match[3]));
						if($dialIdx_j == 0) $key = 'qMedia';
						else if($dialIdx_j == 1) $key = 'aMedia';
						$value = $medium;
					} else {
						if($dialIdx_j == 0) $key = 'qContent';
						else if($dialIdx_j == 1) $key = 'aContent';
						$value = $line;
					}
					array_push($array['dialogue'][$dialIdx_i][$key], $value);
				}
			}
		}// foreach
		return $array;
	}// convert()
	private function put($array, $data){
		if(preg_match('/\[(.+)\|(.+)\|(.+)\]/', $data, $match)){
			$medium = array('url'=>$this->url(trim($match[1])), 'size'=>trim($match[2]), 'caption'=>trim($match[3]));
			array_push($array['media'], $medium);
		} else {
			array_push($array['content'], $data);
		}
		return $array;
	}
	private function url($url){
		if(!preg_match('/\.(jpg|png|svg|gif|hwp|pdf|docx)$/', $url)){
			$url = preg_replace('/.*\//', '', $url);
			$url = preg_replace('/(.*\?v=|\?t=.*)/', '', $url);
		}
		return $url;
	}
}
new TxtToJson();
?>
