(function($){
	$.fn.extraStyle = function(arg, option, getDimOption){
		var target = this.selector;
		if($(target).length) extraStyle(target, arg, option, getDimOption);
		else $(document).ready(function(){ extraStyle(target, arg, option, getDimOption); });
	}
	function extraStyle(target, arg, option, getDimOption){if(target && arg){
		if(getDimOption === undefined) getDimOption = 'clientrect';
		$(target).each(function(){
			var $target = $(this);
			for(var prop in arg){
				if(prop === 'ratio') ratio($target, arg[prop], option, getDimFuncs[getDimOption]);
				else if(prop === 'fitted') fitted($target, arg[prop], option, getDimFuncs[getDimOption]);
				else $target.css(prop, arg[prop]);
			}
		});
	}}
	function ratio($target, value, option, getDim){
		setResize($target, $target, 'width', option, getDim);
		if(option !== 'wait') setHeight();
		$target.on('resize', setHeight);
		$target.on('refresh-set-ratio', setHeight);
		if(option !== 'resize') $(window).resize(setHeight);

		function setHeight(){
			$target.outerHeight(getDim($target).width * value);
		}
	}
	function fitted($target, value, option, getDim){ if($target.is('img') && value === 'yes'){
		$target.parent().css('overflow', 'hidden');
		$target.css('width', '100%');
		setResize($target.parent(), $target, 'all', option, getDim);

		if(option !== 'wait') $target.on('load', fitAndCrop);
		$target.on('resize', fitAndCrop);
		$target.on('refresh-fitting-image', fitAndCrop);
		if(option !== 'resize') $(window).resize(fitAndCrop);

		function fitAndCrop(){
			$target.css({ 'width': '', 'height': '', 'margin-left': '', 'margin-top': '' });
			var dim = getDim($target), parDim = getDim($target.parent());
			var width = dim.width, height = dim.height;
			var wrapWidth = parDim.width, wrapHeight = parDim.height;
			var ratio = wrapWidth / width;
			if(height * ratio < wrapHeight){
				ratio = wrapHeight / height;
				var nH = height * ratio;
				var nW = width * ratio;
				$target.css({ width: nW, height: nH });
				$target.css({ 'margin-left': (wrapWidth-nW)/2, 'margin-top': 0 });
			} else {
				var nH = height * ratio;
				var nW = width * ratio;
				$target.css({ width: nW, height: nH });
				$target.css({ 'margin-top': (wrapHeight-nH)/2, 'margin-left': 0 });
			}
		}
	}}
	var getDimFuncs = {
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
	function setResize($wrap, $target, mode, option, getDim){
		if(option === 'resize' || option === "resize-once"){
			var oldDim = getDim($wrap);
			var intv = setInterval(function(){
				var newDim = getDim($wrap);
				if(compareDim(oldDim, newDim, mode) === false){
					$target.trigger('resize');
					if(option === 'resize-once') clearInterval(intv);
					oldDim = newDim;
				}
			}, 100);
		}
	}
	function compareDim(one, other, mode){
		if(mode === 'width'){
			if(one.width == other.width) return true; else return false;
		}
		else if(mode === 'height'){
			if(one.height == other.height) return true; else return false;
		}
		else {
			if(one.width == other.height && one.height == other.height) return true; else return false;
		}
	}
})(jQuery);
