/**
 * main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */
;(function(window) {

	'use strict';

	function PageStackNavigation(element,options) {
		this.Root = $( element );

		var self = this;
		
		this.support = { transitions: ModernizrPsn.csstransitions };
			// transition end event name
		var transEndEventNames = { 'WebkitTransition': 'webkitTransitionEnd', 'MozTransition': 'transitionend', 'OTransition': 'oTransitionEnd', 'msTransition': 'MSTransitionEnd', 'transition': 'transitionend' };
		this.transEndEventName = transEndEventNames[ ModernizrPsn.prefixed( 'transition' ) ];
		// the pages wrapper
		this.stack = document.querySelector('.pages-stack'),
		// the page elements
		this.pages = [].slice.call(this.stack.children);
		// total number of page elements
		this.pagesTotal = this.pages.length;
		// index of current page
		this.current = 0;
		// menu button
		this.menuCtrl = document.querySelector('button.menu-button');
		// the navigation wrapper
		this.nav = document.querySelector('.pages-nav');
		// the menu nav items
		this.navItems = [].slice.call(this.nav.querySelectorAll('.link--page'));
		// check if menu is open
		this.isMenuOpen = false;
		this.isChangePaging = false;

		this.history = {};

		this.init();
	}

	PageStackNavigation.prototype = {
		onEndTransition: function( el, callback ) {
			var self = this;
			var onEndCallbackFn = function( ev ) {
				if( self.support.transitions ) {
					if( ev.target != this ) return;
					this.removeEventListener( self.transEndEventName, onEndCallbackFn );
				}
				if( callback && typeof callback === 'function' ) { callback.call(this); }
			};
			if( self.support.transitions ) {
				el.addEventListener( self.transEndEventName, onEndCallbackFn );
			}
			else {
				onEndCallbackFn();
			}
		},

		init: function() {
			var self = this;

			this.history['page'] = [];
			for(var i = 0; i < this.pagesTotal; i++) {
				this.history[this.pages[i].getAttribute('id')] = [];
			}

			this.buildStack();
			this.initEvents();

			this.controller = this.parseUrlHash();
			if(this.controller.page) {
				this.toggleMenu();
				switch(this.controller.page) {
					case 'hearing1':
						this.openPage('page-hearing',false);
						break;
					case 'hearing2':
						this.openPage('page-2nd-hearing',false);
						break;
					case 'journal':
						this.openPage('page-journal',false);
						break;
					case 'truthbeyond':
						this.openPage('page-truth-beyond',false);
						break;
				}
			} else {
				var intv = setInterval(function(){
					if($(self.stack).hasClass('pages-stack')){
						clearInterval(intv);
						$(self.pages[self.current]).data('handler').activate();
					}
				}, 200);
			}

			$(document).on('move-to-page', function(event, page){
				self.toggleMenu();
				//openPage('page-hearing');
			});
		},

		buildStack: function() {
			var stackPagesIdxs = this.getStackPagesIdxs();

			// set z-index, opacity, initial transforms to pages and add class page--inactive to all except the current one
			for(var i = 0; i < this.pagesTotal; ++i) {
				var page = this.pages[i],
					posIdx = stackPagesIdxs.indexOf(i);

				if( this.current !== i ) {
					classie.add(page, 'page--inactive');

					if( posIdx !== -1 ) {
						// visible pages in the stack
						page.style.WebkitTransform = 'translate3d(0,100%,0)';
						page.style.transform = 'translate3d(0,100%,0)';
					}
					else {
						// invisible pages in the stack
						page.style.WebkitTransform = 'translate3d(0,75%,-300px)';
						page.style.transform = 'translate3d(0,75%,-300px)';
					}
				}
				else {
					classie.remove(page, 'page--inactive');
				}

				page.style.zIndex = i < this.current ? parseInt(this.current - i) : parseInt(this.pagesTotal + this.current - i);

				if( posIdx !== -1 ) {
					page.style.opacity = parseFloat(1 - 0.1 * posIdx);
				}
				else {
					page.style.opacity = 0;
				}
			}
		},

		// event binding
		initEvents: function() {
			// menu button click
			var self = this;

			this.menuCtrl.addEventListener('click', function(e) {
				self.toggleMenu();
			});

			// navigation menu clicks
			this.navItems.forEach(function(item) {
				// which page to open?
				var pageid = item.getAttribute('href').slice(1);
				item.addEventListener('click', function(ev) {
					ev.preventDefault();
					self.openPage(pageid,true);
				});
			});

			// clicking on a page when the menu is open triggers the menu to close again and open the clicked page
			this.pages.forEach(function(page) {
				var pageid = page.getAttribute('id');
				page.addEventListener('click', function(ev) {
					if( self.isMenuOpen && !self.isChangePaging ) {
						ev.preventDefault();
						self.openPage(pageid,true);
					}
				});
			});

			// keyboard navigation events
			document.addEventListener( 'keydown', function( ev ) {
				if( !self.isMenuOpen ) return;
				var keyCode = ev.keyCode || ev.which;
				if( keyCode === 27 ) {
					self.closeMenu();
				}
			});

			this.popstateHandler();
		},

		// toggle menu fn
		toggleMenu: function() {
			if( this.isMenuOpen ) {
				this.closeMenu();
			}
			else {
				this.openMenu();
				this.isMenuOpen = true;
			}
		},

		// opens the menu
		openMenu: function() {
			var self = this;
			// toggle the menu button
			classie.add(self.menuCtrl, 'menu-button--open');
			// stack gets the class "pages-stack--open" to add the transitions
			classie.add(self.stack, 'pages-stack--open');
			// reveal the menu
			classie.add(self.nav, 'pages-nav--open');
			// now set the page transforms
			var stackPagesIdxs = self.getStackPagesIdxs();

			for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
				var page = self.pages[stackPagesIdxs[i]];
				page.style.WebkitTransform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)'; // -200px, -230px, -260px
				page.style.transform = 'translate3d(0, 75%, ' + parseInt(-1 * 200 - 50*i) + 'px)';
			}

			if($(self.pages[self.current]).data('handler')) $(self.pages[self.current]).data('handler').deactivate();
		},

		// closes the menu
		closeMenu: function() {
			// same as opening the current page again
			this.openPage('',false);
		},

		// opens a page
		openPage: function(id, history) {
			var self = this;
			var futurePage = id ? document.getElementById(id) : this.pages[this.current],
				futureCurrent = this.pages.indexOf(futurePage),
				stackPagesIdxs = this.getStackPagesIdxs(futureCurrent);

			// set transforms for the new current page
			futurePage.style.WebkitTransform = 'translate3d(0, 0, 0)';
			futurePage.style.transform = 'translate3d(0, 0, 0)';
			futurePage.style.opacity = 1;

			// set transforms for the other items in the stack
			for(var i = 0, len = stackPagesIdxs.length; i < len; ++i) {
				var page = this.pages[stackPagesIdxs[i]];
				page.style.WebkitTransform = 'translate3d(0,100%,0)';
				page.style.transform = 'translate3d(0,100%,0)';
			}

			// set current
			if( id ) {
				if( this.current != futureCurrent ) {
					if(history === true) {
						this.pushHistory('page', this.current, futureCurrent);
						this.cleanHistory(this.pages[this.current].getAttribute('id'));
					}
				}
				this.current = futureCurrent;
			}

			// close menu..
			classie.remove(this.menuCtrl, 'menu-button--open');
			classie.remove(this.nav, 'pages-nav--open');
			this.onEndTransition(futurePage, function() {
				classie.remove(self.stack, 'pages-stack--open');
				// reorganize stack
				self.buildStack();
				self.isMenuOpen = false;
				var $openPage = id ? jQuery('#'+id) : jQuery(self.pages[self.current]);
				if($openPage.data('handler')) $openPage.data('handler').activate();
			});
			this.isChangePaging = false;
		},

		changePage: function(id) {
			var self = this;
			this.isChangePaging = true;
			this.toggleMenu();
			var stackPagesIdxs = this.getStackPagesIdxs();
			var page = this.pages[(stackPagesIdxs.length-1)];
			this.onEndTransition(page, function() {
				self.openPage(id, true);
			});
		},

		// gets the current stack pages indexes. If any of them is the excludePage then this one is not part of the returned array
		getStackPagesIdxs: function(excludePageIdx) {

			var nextStackPageIdx = this.current + 1 < this.pagesTotal ? this.current + 1 : 0,
				nextStackPageIdx_2 = this.current + 2 < this.pagesTotal ? this.current + 2 : 1,
				idxs = [],

				excludeIdx = excludePageIdx || -1;

			if( excludePageIdx != this.current ) {
				idxs.push(this.current);
			}
			if( excludePageIdx != nextStackPageIdx ) {
				idxs.push(nextStackPageIdx);
			}
			if( excludePageIdx != nextStackPageIdx_2 ) {
				idxs.push(nextStackPageIdx_2);
			}

			//if(idxs[0] == 1 && idxs[1] == 2 && idxs[2] == 1) idxs = [1, 2, 0];

			return idxs;

		},

		parseUrlHash: function() {
			var obj = {};
			if(window.location.hash) {
				var hash = window.location.hash.substr(1).split('-');
				obj.page = (hash.length > 0 ? hash[0] : '');
				obj.section = (hash.length > 1 ? hash[1] : 0);
			} else {
				obj.page = '';
				obj.section = 0;
			}

			return obj;
		},

		pushHistory: function(page,from,to) {
			var hash = '#';
			switch(page) {
				case 'page':
					switch(to) {
						case 0:
							hash += 'truth_beyond';
							break;
						case 1:
							hash += 'hearing2';
							break;
						case 2:
							hash += 'hearing';
							break;
						case 4:
							hash += 'journal';
							break;
					}
					break;
				case 'page-truth-beyond':
					hash += 'truth_beyond';
					if(to) hash += '-'+to;
					break;
				case 'page-hearing':
					hash += 'hearing';
					if(to) hash += '-'+to;
					break;
				case 'page-2nd-hearing':
					hash += 'hearing2';
					if(to) hash += '-'+to;
					break;
				case 'page-journal':
					hash += 'journal';
					if(to) hash += '-'+to;
					break;
				default:
					break;
			}
			window.history.pushState({},'',window.location.href+hash);
			this.history[page].push(from);
		},

		popHistory: function(page) {
			console.log('history page : '+page);
			var hist = -1;
			if(this.history[page].length > 0)
				hist = this.history[page].pop();
			console.log('history hist : '+hist);
			return hist;
		},

		cleanHistory: function(page) {
			this.history[page] = [];
		},

		popstateHandler: function() {
			var self = this;
			jQuery(window).on('popstate',function(e) {
				console.log('popstate');
				var hist = self.popHistory(self.pages[self.current].getAttribute('id'));
				if(hist >= 0) {
					var handler = $(self.pages[self.current]).data('handler')
					var f = handler.getCurrent();
					handler.movePage(f, parseInt(sl[1]),false);
				} else {
					var hist = self.popHistory('page');
					if(hist >= 0) {
						self.changePage(self.pages[hist].getAttribute('id'), false);
					}
				}
			});
		}
	};

	$.fn.pagestacknavigation = function(options) {
		return this.each(function() {
			var pagestacknavigation = new PageStackNavigation($(this), options);
			$.data(this,'handler',pagestacknavigation);
		});
	};

	$(document).ready(function() {
		var snavigation = $('body').pagestacknavigation();
	});

})(window);
