/**
 * Angled Windows
 *
 * Angular directive to create floating "application type" windows.
 *
 * @author: Michael E Conroy (michael.e.conroy@gmail.com)
 *		- http://codepen.io/m-e-conroy/pen/ymiwz
 * @date: 21 Mar 2014
 *
 * @require
 * 		* AngularJS 1.2.x
 * 		* AngularJS ngAnimate 1.2.x
 * 		* AngularJS ngSanitize 1.2.x
 * 		* jQuery UI 1.10.x  -- customizedf
 * 			* Angled library: jQueryUI/angled-dragndrop.js
 * 			* Angled library: jQueryUI/angled-resizeit.js  -- not required in customized version
 * 		* Angular UI Boostrap 0.10.x
 * 		* Bootstrap 3.1.x
 * 			* Angled library: Modules/css/angled-windows.css
 *		* Angled library:
 *			* /angled-filters.js
 *			* /Services/angled-helper-services.js
 */

angular.module('angled-windows.directives',['ngSanitize','ngAnimate','angled-dragndrop', 'angled-filters', 'angled-helper.services'])

	.directive('angledWindow',['$animate','angledHelperSrv',function($animate,helperSrv){
		return {
			restrict : 'E',
			transclude : true,
			replace : true,
			templateUrl : 'common/directives/angled/angled-window.html',
			scope : {
				id : '@id',
				title : '@title',
				grouping : '@grouping', // windows group for organizing z-index
				status : '=status', // status bar messages bi-directional
        closeFunction: '&closeFunction'
			},
			compile : function(tEl,tAttrs,transFn){
				return {
					pre : function(scope,el,attrs){ // ~object setup

						//== Variables ==//

						// id check and generation
						if(angular.isUndefined(scope.id)){
							var loop = true;
							while(loop){
								var id = helperSrv.randomStr(10);
								if(angular.element('#' + id).length == 0){
									el.attr('id',id); // set attribute element id
									scope.id = id; // set scope id
									loop = false; // end while loop
								}
							} // end while
						}

						// group check
						if(angular.isUndefined(scope.grouping)){
							el.attr('grouping','default');
							scope.grouping = 'default';
						}

						// fix for template not rendering with {{id}} filled in
						scope.$evalAsync(function(){
							scope.id = el.attr('id');
							scope.grouping = el.attr('grouping');
						});

						scope.rolledUp = false;
						scope.dragOpts = {
							handle: 'div.panel-heading',
							opacity: 0.75
						}; // end dragOpts
						scope.resizeOpts = {
							handles: 'se',
							alsoResize: '#windowBodyContent_' + scope.id
						}; // end resizeOpts
					}, // end pre
					post : function(scope,el,attrs){ // ~link function

						//=== Methods ===//

						/**
						 * Roll Up
						 * Hides the content/body portion of the window, but leaves the window title bar visible.
						 */
						scope.rollUp = function(){
							scope.rolledUp = !scope.rolledUp;

							if(angular.equals(scope.rolledUp,true)){
								$animate.addClass(el,'rolled-up');
							}else{
								$animate.removeClass(el,'rolled-up');
							}
						}; // end rollUp
					} // end post
				}; // end return
			} // end compile
		}; // end return
	}]); // end angledWindow


// declare main module
angular.module('angled-windows',['angled-windows.directives']);
