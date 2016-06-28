<?php
	class Word 
	{
		public $start;
		public $end;
		public $character;
		public $pinyin;
		public $score;
		
		public function __construct($start,$end,$character,$pinyin,$score){
			$this->start = $start;
			$this->end = $end;
			$this->character = $character;
			$this->pinyin = $pinyin;
			$this->score = $score;
		}
		
		public function show_details(){
			return "start: " . $this->start . "<br>end: " . $this->end . "<br>character: " . $this->character . "<br>pinyin: " . $this->pinyin . "<br>score: " . $this->score . "<br>"; 
			//return "character: <strong>" . $this->character . "</strong><br>pinyin: " . $this->pinyin . "<br>score: " . $this->score . "<br>";
		}
	}
?>