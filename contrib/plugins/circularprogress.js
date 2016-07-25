/*
    JQUERY CIRCULAR PROGRESS PLUGIN
    Usage:
        $('.element').circles();

    Markup:
        See example

    Options:
        See https://github.com/andysellick/circular-progress
*/
(function (window,$) {
	var Plugin = function(elem,options){
		this.elem = elem;
		this.$elem = $(elem);
		this.options = options;
		this.init(); //FIXME have to manually call the init function
	}

	Plugin.prototype = {
		init: function(){
			this.settings = $.extend({
				rotateBy: 1, //amount to change progress by in each animation frame
				initialPos: 0, //initial position on plugin load
				targetPos: 0, //target position to animate to on plugin load
				scale: 360, //sets the scale of the circle. Common uses would be to have a progress meter to show percentage progress (set this to 100) or a much smaller number of steps
				speed: 5, //speed of animation
				includeInner: 0, //if true, make the progress a 'ring' instead of a solid circle
				innerHTML:'', //html to put inside the circle
				showProgress: 0, //add an additional element into the inner to show the current position
				progPreText:'', //text to show prior to the progress output
				progPostText:'', //text to show after the progress output
                delayAnimation: 0, //how long to delay the initial animation on plugin load
                onFinishMoving: function() {}, //callback function
				container: null,
			}, this.defaults, this.options);

			this.rpanel; //right
			this.rrpanel; //right counterclockwise
			this.lpanel; //left
			this.lrpanel; //left counterclockwise
			this.overallpos = 0;
			this.inner;
			this.innerhtml;
			this.innerprogress;
			this.timer;
			if(this.settings.container != null && !this.settings.container.is('body')) {
				this.$container = this.settings.container;
			} else {
				this.$container = $(window);
			}

            //create required variables and normalise settings
            this.settings.rotateBy = Math.min(this.settings.rotateBy,360);
            this.settings.initialPos = Math.min(this.settings.initialPos,this.settings.scale);
            this.settings.targetPos = Math.min(this.settings.targetPos,this.settings.scale);
            this.settings.rtargetPos = Math.min( ( this.settings.scale - this.settings.targetPos ), this.settings.scale);
            
            //this.settings.rotateBy = this.calculateScale(this.settings.rotateBy);
            this.settings.initialPos = this.calculateScale(this.settings.initialPos);
            this.settings.targetPos = this.calculateScale(this.settings.targetPos);
            this.settings.rtargetPos = this.calculateScale(this.settings.rtargetPos);
            this.rotateBy = this.settings.rotateBy; //fixme this is currently used but probably isn't needed

            //create required elements
            var prog = $('<div/>').addClass('progressinner').appendTo(this.$elem);
            var prog2 = $('<div/>').addClass('progressinner').addClass('counter').appendTo(this.$elem);
            var lpane = $('<div/>').addClass('lpane').appendTo(prog);
            var rpane = $('<div/>').addClass('rpane').appendTo(prog);
            var lrpane = $('<div/>').addClass('lpane').appendTo(prog2);
            var rrpane = $('<div/>').addClass('rpane').appendTo(prog2);
            this.rpanel = $('<div/>').addClass('cover').appendTo(rpane);
            this.lpanel = $('<div/>').addClass('cover').appendTo(lpane);
            this.rrpanel = $('<div/>').addClass('cover').appendTo(rrpane);
            this.lrpanel = $('<div/>').addClass('cover').appendTo(lrpane);

            if(this.settings.innerHTML.length || this.settings.showProgress || this.settings.includeInner){
                this.inner = $('<div/>').addClass('display').appendTo(prog);
            }
            if(this.settings.innerHTML.length){
                this.innerhtml = $('<div/>').addClass('extrahtml').html(this.settings.innerHTML).appendTo(this.inner);
            }
            if(this.settings.showProgress){
                this.innerprogress = $('<div/>').addClass('displayprogress').appendTo(this.inner);
				$('<div class="counterclockwise"></div>').appendTo(this.innerprogress);
				$('<div class="divider"><span></span></div>').appendTo(this.innerprogress);
				$('<div class="clockwise"></div>').appendTo(this.innerprogress);
            }

			this.activate = false;
			this.containerHeight = this.$container.height();

            var self = this;
			this.$container.on('scroll', function() {
				var t = self.$elem.offset().top;
				if(self.containerHeight > t) {
					if(self.activate == false)
						self.run();
				}
			});

			if(this.containerHeight > this.$elem.offset().top && this.activate == false)
				self.run();
		},

		run: function() {
            //now get the plugin started
            var me = this;

			this.activate = true;

            //option 1 - progress animates from initial to target
            if(this.settings.initialPos && this.settings.initialPos != this.settings.targetPos){
                if(this.settings.initialPos > this.settings.targetPos){ //if target is less than initial, we need to rotate backwards
                    this.rotateBy = -this.rotateBy;
                }
                this.setTargetPos(this.settings.initialPos);
                this.timer = setTimeout(function(){
                    me.animateCircle(me.settings.initialPos,me.settings.targetPos,'clockwise');
                    me.animateCircle(me.settings.initialPos,me.settings.rtargetPos,'counterclockwise');
                },this.settings.speed + this.settings.delayAnimation);
            	if(this.settings.showProgress){
					this.innerprogress.addClass('activate');
				}
            }
            //option 2 - progress animates from 0 to target (no initial value)
            else if(this.settings.initialPos != this.settings.targetPos){
                this.timer = setTimeout(function(){
                    me.animateCircle(me.settings.initialPos,me.settings.targetPos,'clockwise');
                    me.animateCircle(me.settings.initialPos,me.settings.rtargetPos,'counterclockwise');
                },this.settings.speed + this.settings.delayAnimation);
            	if(this.settings.showProgress){
					this.innerprogress.addClass('activate');
				}
            }
            //option 3 - progress appears immediately at target (no initial value, no animate)
            else {
                this.setTargetPos(this.settings.initialPos);
            }
        },
        
        //given a scale and a position, work out actual degrees
        calculateScale: function(position){
            var multiplier = 360 / this.settings.scale;
            return(Math.ceil(position * multiplier));
        },
        convertScale: function(degrees){
            var divider = 360 / this.settings.scale;
            return(Math.floor(degrees / divider));
        },

        //set the position of the circle, no animation
        setTargetPos: function(targ){
            this.overallpos = targ;
            this.renderCircle();
        },

        //given a starting point and an end point, animate the progress
        //self calls itself until complete
        animateCircle: function(orig,targ,direct){
            var rotateby = this.settings.rotateBy;
            if(targ < orig){
                rotateby = -rotateby;
            }
            var newpos = orig + rotateby;
            if(orig < targ){
                newpos = Math.min(newpos,targ);
            }
            else {
                newpos = Math.max(newpos,targ);
            }
            var me = this;
			if(direct == 'counterclockwise') {
            	this.overallrpos = newpos;
			} else {
            	this.overallpos = newpos;
			}
            if(newpos != targ){
                this.timer = setTimeout(function(){
                    me.animateCircle(newpos,targ,direct);
                },this.settings.speed);
            }
            else {
				if(direct == 'counterclockwise') {
	                var output = this.convertScale(this.overallrpos);
				} else {
	                var output = this.convertScale(this.overallpos);
					this.settings.onFinishMoving.call(this,output); //call callback
				}
            }
			if(direct == 'counterclockwise') {
				this.renderRCircle();
			} else {
	            this.renderCircle();
			}
        },

        //draws the circular progress using the current position
        renderCircle: function(){
            if(this.overallpos < 180){
                this.rotateElement(this.rpanel,this.overallpos);
                this.rotateElement(this.lpanel,0);
            }
            else {
                this.rotateElement(this.rpanel,180);
                this.rotateElement(this.lpanel,this.overallpos - 180);
            }
            if(this.settings.showProgress){
                var output = this.settings.progPreText + this.convertScale(this.overallpos) + this.settings.progPostText;
                this.innerprogress.find('.clockwise').html(output);
            }
        },

        renderRCircle: function(){
            if(this.overallrpos < 180){
                this.rotateElement(this.rrpanel,0 );
                this.rotateElement(this.lrpanel,( this.overallrpos * -1 ) );
            }
            else {
                this.rotateElement(this.lrpanel,180);
                this.rotateElement(this.rrpanel,(180 - this.overallrpos ));
            }
            if(this.settings.showProgress){
                var output = this.convertScale(this.overallrpos);
                this.innerprogress.find('.counterclockwise').html(output);
            }
        },

        //given an element, apply a css transform to rotate it
        rotateElement: function(elem,deg){
            elem.css({
                'transform': 'rotate('+deg+'deg)',
                '-ms-transform': 'rotate('+deg+'deg)',
                '-moz-tranform': 'rotate('+deg+'deg)',
                '-webkit-transform': 'rotate('+deg+'deg)',
                '-o-transform': 'rotate('+deg+'deg)'
            });
        },

        //intended as a public function, pass through the position you want
		moveProgress: function(targ){
            clearTimeout(this.timer);
            targ = this.calculateScale(targ);
			rtarg = this.calculateScale(this.settings.scale - targ);
            targ = Math.max(Math.min(360,targ),0);
            rtarg = Math.max(Math.min(360,rtarg),0);
			console.log(rtarg);
            if(targ != this.overallpos){
                this.animateCircle(this.overallpos,targ,'clockwise');
                this.animateCircle(this.overallrpos,rtarg,'counterclockwise');
            }
        },

	}
	$.fn.circles = function(options){
		/* syntax to use outside the plugin - http://acuriousanimal.com/blog/2013/02/25/things-i-learned-creating-a-jquery-plugin-part-ii/
            var circle = $('.element').data('circles');
            circle.publicMethod();
		*/
        if (options === undefined || typeof options === 'object') {
            //create plugin instance for each element and store reference to the plugin within the data attr
            return this.each(function() {
                if (!$.data(this, 'circles')) {
                    $.data(this, 'circles', new Plugin(this, options));
                }
            });
        }
	}
	window.Plugin = Plugin;
})(window,jQuery);
