<?php
class TxtToJson {
	private $suspDir = 'txts/suspicion';

	function __construct(){
		$suspFiles = $this->filesInDir($this->suspDir);
		foreach($suspFiles as $file){
			echo '<xmp>';
			echo $this->convert(file_get_contents($this->suspDir.'/'.$file));
			echo '</xmp>';
		}
	}
	private function filesInDir ($tdir) {
		if($dh = opendir ($tdir)) {
			$files = Array();
			while($a_file = readdir ($dh)) {
				if($a_file != '.' && $a_file != '..') array_push ($files , $a_file);
			}
			closedir ($dh);
			return $files;
		}
	}
	private function convert($txt){
		$txt = preg_replace('/“/', '"', $txt);
		$txt = preg_replace('/”/', '"', $txt);

		/*
		$txt = preg_replace('/#\s+(.+)\r\n/', '"title": "$1",', $txt, 1);

		$txt = preg_replace('/##\s(.+)\r\n/', '"background": {'."\n\t", $txt, 1);
		$txt = preg_replace('/\]\r\n(.+)\r\n/', ']'."\r\n".'"content": "$1"'."\r\n".'}', $txt, 1);
		$txt = preg_replace('/\[(.+)\|(.+)\|(.+)\]/', 'media: {'."\n\t".'"url": "$1",'."\n\t".'"size": "$2",'."\n\t".'"caption": "$3"'."\n".'}', $txt);
		*/

		/*
		$txt = preg_replace('/#{5}\s/', "⑤", $txt);
		$txt = preg_replace('/#{4}\s/', "④", $txt);
		$txt = preg_replace('/#{3}\s/', "③", $txt);
		$txt = preg_replace('/#{2}\s/', '②', $txt);
		$txt = preg_replace('/#{1}\s/', '①', $txt);
		*/
		$txt = preg_replace('/\r/', '', $txt);
		$txt = preg_replace('/\s*(\s)/', '$1', $txt);
		$txt = preg_replace('/\n$/', "\n[END]", $txt);

		foreach


		return $txt;
	}
}
new TxtToJson();
?>
