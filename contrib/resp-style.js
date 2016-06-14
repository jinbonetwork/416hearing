(function($){
	var _bp = [320, 768, 1024, 1280];
	var setScrollbarEvent = false;

	$(window).on('es-setScrollbarEvent', function(){
		if(setScrollbarEvent !== false) return;
		setScrollbarEvent = true;

		var scrollbar = (window.innerWidth != $(window).outerWidth());
		setInterval(function(){
			if(scrollbar && window.innerWidth == $(window).outerWidth()){
				$(window).trigger('es-changeScrollbar'); scrollbar = false;
			} else if(!scrollbar && window.innerWidth != $(window).outerWidth()){
				$(window).trigger('es-changeScrollbar'); scrollbar = true;
			}
		}, 100);
	});
	$.respStyle = function(arg){if(arg){
		var array = arg.split(' ');
		if(array.length < 2){ console.error('Error: the length of break points'); return false; }
		_bp = [];
		for(var i = 0, len = array.length; i < len; i++){
			if($.isNumeric(array[i])) _bp.push(parseFloat(array[i]));
		}
	}}
	$.fn.respStyle = function(arg){
		var target = this.selector;
		if($(target).length) respStyle(target, arg);
		else $(document).ready(function(){ respStyle(target, arg); });
	}
	function respStyle(target, arg){if(target && arg){
		$(target).each(function(){
			var $target = $(this);
			var style = new Style(arg);
			$target.css(style.css());
			$(window).resize(function(){
				$target.css(style.css());
			});
		});
	}}
	$.fn.respGrid = function(arg, getDimOption){
		var target = this.selector;
		if($(target).length) respGrid(target, arg, getDimOption);
		else $(document).ready(function(){ respGrid(target, arg, getDimOption); });
	}
	function respGrid(target, arg, getDimOption){if(target && arg){
		$(target).each(function(){
			$(this).css('overflow', 'hidden');
			$(this).children('div').addClass('es').addClass('es-cell').css({float: 'left', overflow: 'hidden'});
			if($(this).is('.es.es-cell')) $(this).addClass('es-nested');
			var $target = $(this);
			var grid = new Grid(arg, $target.children('.es.es-cell').length, getDimOption);
			grid.adjust($target);
			$(window).resize(function(){
				grid.adjust($target);
			});
			$(window).on('es-changeScrollbar', function(){
				grid.adjust($target, false);
			});
		});
	}}

	// style ////
	function Style(arg){
		var this_data = {};
		var this_bp = { bp: undefined, bpi: 0, ww: 0 };
		var this_style = {};
		this.css = function(calc){
			if(calc === undefined || calc) this.calcStyle(this_data, this_bp, this_style);
			return this_style;
		}
		//initialize ////
		if(arg){
			this.convToObj(arg, this_data, this_bp);
			this.postConv(this_data, this_bp);
		}
	}
	Style.prototype.convToObj = function(arg, data, bp){
		for(var prop in arg){
			if(prop !== 'breakpoint'){
				data[prop] = { series: [], max: false, unit: 'px', func: 'linear'};
				this.convToObjEach(arg[prop], data[prop]);
			} else {
				bp.bp = [];
				this.convToObjEach(arg[prop], bp.bp);
			}
		}
		if(bp.bp === undefined) bp.bp = _bp;
	}
	Style.prototype.convToObjEach = function(propOfArg, propOfData){
		var array = propOfArg.split(' ');
		if(array.length < 1){ console.error('Error: the length of argument'); return false; }
		if($.type(propOfData) === 'object'){
			for(var i = 0, len = array.length; i < len; i++){
				if($.isNumeric(array[i])) propOfData.series.push(parseFloat(array[i]));
				else if(array[i] === '-' || array[i] === '=') propOfData.series.push(array[i]);
				else if(this.isNotNumVal(array[i])) propOfData.series.push(array[i]);
				else if(this.isUnit(array[i])) propOfData.unit = array[i];
				else if(array[i] === 'max') propOfData.max = true;
				else if(array[i] === 'linear' || array[i] === 'step' || array[i] === 'saw') propOfData.func = array[i];
			}
		} else if($.type(propOfData) === 'array'){
			for(var i = 0, len = array.length; i < len; i++){
				if($.isNumeric(array[i])) propOfData.push(parseFloat(array[i]));
				else if(array[i] === '-' || array[i] === '=') propOfData.push(array[i]);
				else if(this.isNotNumVal(array[i])) propOfData.push(array[i]);
			}
		}
	}
	Style.prototype.postConv = function(data, bp){
		for(var prop in data){
			this.validateEach(data[prop], bp.bp.length);
			this.calcMiddleEach(data[prop], bp.bp);
			this.calcEqualEach(data[prop]);
		}
	}
	Style.prototype.validateEach = function(propOfData, bpLength){
		if($.type(propOfData) === 'object'){
			if(propOfData.func !== 'saw' && propOfData.series.length < bpLength){
				for(var i = propOfData.series.length, len = bpLength; i < len; i++){
					propOfData.series[i] = propOfData.series[i-1];
				}
			}
			else if(propOfData.func === 'saw' && propOfData.series.length <bpLength*2){
				for(var i = propOfData.series.length, len = bpLength*2; i < len; i++){
					propOfData.series[i] = propOfData.series[i-1];
				}
			}
		} else if($.type(propOfData) === 'array'){
			if(propOfData.length < bpLength){
				for(var i = propOfData.length, len = bpLength; i < len; i++){
					propOfData[i] = propOfData[i-1];
				}
			}
		}
	}
	Style.prototype.calcMiddleEach = function(propOfData, bp){
		var series;
		if($.type(propOfData) === 'object') series = propOfData.series;
		else if($.type(propOfData) === 'array') series = propOfData;
		var pni = 0, nni = 0;
		if(series[0] === '-'){ console.error('Wrong usage of "-"'); return; }
		for(var i = 0, len = series.length; i < len-1; i++){
			if($.isNumeric(series[i])) pni = i;
			if(series[i] === '-'){
				if(nni === 0 || nni < i){
					for(var j = i+1; j < len; j++){
						if($.isNumeric(series[j])){ nni = j; break; }
					}
					if(nni === 0 || nni < i) {
						console.error('Wrong usage of "-"'); return;
					}
				}
				series[i] = (series[nni] - series[pni]) * (bp[i] - bp[pni]) / (bp[nni] - bp[pni]) + series[pni];
			}
		}

	}
	Style.prototype.calcEqualEach = function(propOfData){
		var series;
		if($.type(propOfData) === 'object') series = propOfData.series;
		else if($.type(propOfData) === 'array') series = propOfData;
		if(series[0] === '='){ console.error('Wrong usage of "="'); return; }
		for(var i = 1, len = series.length; i < len; i++){
			if(series[i] === '=') series[i] = series[i-1];
		}
	}
	Style.prototype.calcStyle = function(data, bp, style){
		this.findBp(bp);
		for(var prop in data){
			if(!this.isNotNumProp(prop)){
				style[prop] = this.calc(data[prop], bp) + data[prop].unit;
			} else {
				style[prop] = this.pick(data[prop].series, bp);
			}
		}
	}
	Style.prototype.findBp = function(bp){
		bp.ww = window.innerWidth;
		if(bp.ww < bp.bp[0]) bp.bpi = -1;
		else if(bp.ww >=  bp.bp[bp.bp.length-1]) bp.bpi = -2;
		else { for(var i = 0; i < bp.bp.length-1; i++){
			if(bp.bp[i] <= bp.ww && bp.ww < bp.bp[i+1]){ bp.bpi = i; break; }
		}}
	}
	Style.prototype.pick = function(series, bp){
		if(bp.bpi >= 0) return series[bp.bpi];
		else if(bp.bpi == -1) return series[0];
		else if(bp.bpi == -2) return series[bp.bp.length-1];
	}
	Style.prototype.calc = function(propOfData, this_bp){
		var series = propOfData.series, max = propOfData.max, func = propOfData.func;
		var bp = this_bp.bp, bpi = this_bp.bpi, len = this_bp.bp.length, ww = this_bp.ww;
		var i;
		if(bpi >= 0){
			i = bpi;
		} else if(bpi === -1){
			return series[0];
		} else if(bpi === -2){
			if(max){
				if(func !== 'saw') return series[len-1];
				else if(func === 'saw') return series[2*(len-1)+1];
			} else {
				if(func === 'linear' || func === 'saw'){ i = len-2; }
				else if(func === 'step') i = len - 1;
			}
		}

		if(func === 'step'){
			return series[i];
		} else if(func === 'linear'){
			if(bpi >= 0)
				return (series[i+1] - series[i]) * (ww - bp[i]) / (bp[i+1] - bp[i]) + series[i];
			else
				return (series[i+1] - series[i]) * (ww - bp[i+1]) / (bp[i+1] - bp[i]) + series[i+1];
		} else if(func === 'saw'){
			if(bpi >= 0)
				return (series[i*2+1] - series[i*2]) * (ww - bp[i]) / (bp[i+1] - bp[i]) + series[i*2];
			else
				return (series[i*2+3] - series[i*2+2]) * (ww - bp[i]) / (bp[i+1] - bp[i]) + series[i*2+2];
		}
	}
	Style.prototype.isUnit = function(unit){
		var units = ['em', 'ex', '%', 'px', 'cm', 'mm', 'in', 'pt', 'pc', 'ch', 'rem', 'vh', 'vw', 'vmin', 'vmax'];
		if($.inArray(unit, units) > -1) return true; else return false;
	}
	Style.prototype.isNotNumVal = function(value){
		var values = ['left', 'right', 'none', 'absolute', 'fixed', 'static', 'hidden', 'scroll', 'auto',
			'block', 'inline', 'inline-block'];
		if($.inArray(value, values) > -1) return true; else return false;
	}
	Style.prototype.isNotNumProp = function(prop){
		var props = ['float', 'position', 'overflow', 'overflow-x', 'overflow-y', 'display'];
		if($.inArray(prop, props) > -1) return true; else return false;
	}

	// grid ////
	function Grid(arg, numCell, getDimOption){
		var this_data = {
			columns: [], ratio: [],
			gutter: {series: [], max: false, func: 'linear'}, //gutter의 unit은 px.
			cells: new Array(numCell)
		};
		var this_bp = { bp: undefined, bpi: 0, ww: 0 };
		var this_current = { columns: 0, ratio: 0, gutter: 0 , cells: new Array(numCell) };
		this.getDim = undefined;
		this.adjust = function($target, cell){
			if(cell === undefined || cell){
				this.calcCurrent(this_data, this_bp, this_current);
				this.adjustCell(this_current, $target);
			} else {
				this.adjustCellWidth(this_current, $target);
			}
		}
		//initialize ////
		if(arg){
			if(getDimOption === undefined) getDimOption = 'clientrect';
			this.getDim = this.getDimFuncs[getDimOption];
			this.convToObj(arg, this_data, this_bp);
			this.postConv(this_data, this_bp);
		}
	}
	Grid.prototype = new Style();
	Grid.prototype.convToObj = function(arg, data, bp){
		if(arg.breakpoint){
			bp.bp = []; this.convToObjEach(arg.breakpoint, bp.bp);
		} else {
			bp.bp = _bp;
		}
		for(var prop in arg){
			if(data[prop]) this.convToObjEach(arg[prop], data[prop]);
			else if(prop.match(/^cell/)){
				var index = parseInt(prop.replace(/^cell/, ''));
				data.cells[index] = [];
				this.convToObjEach(arg[prop], data.cells[index]);
			}
		}
	}
	Grid.prototype.postConv = function(data, bp){
		for(var prop in data){
			if(prop !== 'cells'){
				this.validateEach(data[prop], bp.bp.length);
				this.calcMiddleEach(data[prop], bp.bp);
				this.calcEqualEach(data[prop]);
			} else {
				for(var i = 0, len = data[prop].length; i < len; i++){
					if(data[prop][i]){
						this.validateEach(data[prop][i], bp.bp.length);
						this.calcMiddleEach(data[prop][i], bp);
						this.calcEqualEach(data[prop][i]);
					}
				}
			}
		}
	}
	Grid.prototype.calcCurrent = function(data, this_bp, current){
		this.findBp(this_bp);
		current.gutter = this.calc(data.gutter, this_bp);
		var bpi;
		if(this_bp.bpi >= 0) bpi = this_bp.bpi;
		else if(this_bp.bpi === -2) bpi = this_bp.bp.length-1;
		else if(this_bp.bpi === -1) bpi = 0;
		current.columns = data.columns[bpi];
		current.ratio = data.ratio[bpi];
		for(var i = 0, len = data.cells.length; i < len; i++){
			 if(data.cells[i]) current.cells[i] = data.cells[i][bpi];
			 else current.cells[i] = 1;
		}
	}
	Grid.prototype.adjustCell = function(current, $target){
		var preW = $target.outerWidth();
		var gut = current.gutter;
		var cols = current.columns;
		var cells = current.cells;
		var $cells = $target.children('.es.es-cell');
		var length = $cells.length;
		var cw = (this.getDim($target).width - gut*(cols-1))/cols;
		var maxCh = 0;
		$cells.css({'margin-right': 0, 'margin-top': 0});
		if(current.ratio !== 'auto') $cells.css({width: 0, height: 0});
		else $cells.css({width: 0, height: 0});
		$cells.each(function(index){
			$(this).outerWidth(cw*cells[index] + gut*(cells[index]-1));
			if((index+1) % cols !== 0 && index < length-1) $(this).css({'margin-right': gut});
			if(index >= cols) $(this).css({'margin-top': gut});
			if(current.ratio === 'auto'){
				$(this).css({height: ''});
				if(maxCh < this.getDim($(this)).height) maxCh = this.getDim($(this)).height;
				if(cols !== 1 && (index+1) % cols === 0){
					for(var i = index - cols + 1; i <= index; i++) $cells.eq(i).outerHeight(maxCh);
					maxCh = 0;
				} else if(cols !== 1 && index === length-1) {
					for(var i = Math.floor((index+1)/cols) * cols; i <= index; i++) $cells.eq(i).outerHeight(maxCh);
				}
			} else {
				var height = cw * current.ratio;
				if($target.is('.es.es-nested')) height -= (gut - gut/Math.ceil(length/cols));
				$(this).outerHeight(height);
			}
		});
		if(preW != $target.outerWidth()){
			cw = (this.getDim($target).width - gut*(cols-1))/cols;
			$cells.each(function(index){ $(this).outerWidth(cw*cells[index] + gut*(cells[index]-1)); });
		}
	}
	Grid.prototype.adjustCellWidth = function(current, $target){
		var gut = current.gutter;
		var cols = current.columns;
		var cells = current.cells;
		var $cells = $target.children('.es.es-cell');
		var cw = (this.getDim($target).width - gut*(cols-1))/cols;
		$cells.each(function(index){
			$(this).outerWidth(cw*cells[index] + gut*(cells[index]-1));
		});
	}
	Grid.prototype.getDimFuncs = {
		clientrect: function($obj){
			return $obj[0].getBoundingClientRect();
		},
		outerrect: function($obj){
			return { width: $obj.outerWidth(), height: $obj.outerHeight() }
		},
		computed: function($obj){
			var computedStyle = window.getComputedStyle($obj[0]);
			return { width: parseFloat(computedStyle.width), height: parseFloat(computedStyle.height) };
		}
	}
})(jQuery);
