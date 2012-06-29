BOOTSTRAP_LESS = ./less/bootstrap.less
BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less

#
# BUILD SIMPLE BOOTSTRAP DIRECTORY
# recess & uglifyjs are required
#

bootstrap:
	cp img/* ../img/
	recess --compress ${BOOTSTRAP_LESS} > ../css/bootstrap.min.css
	recess --compress ${BOOTSTRAP_RESPONSIVE_LESS} > ../css/bootstrap-responsive.min.css
	cat js/bootstrap-transition.js js/bootstrap-alert.js js/bootstrap-button.js js/bootstrap-carousel.js js/bootstrap-collapse.js js/bootstrap-dropdown.js js/bootstrap-modal.js js/bootstrap-tooltip.js js/bootstrap-popover.js js/bootstrap-scrollspy.js js/bootstrap-tab.js js/bootstrap-typeahead.js > ../js/bootstrap.js
	uglifyjs -nc ../js/bootstrap.js > ../js/bootstrap.min.tmp.js
	echo "/*!\n* Bootstrap.js by @fat & @mdo\n* Copyright 2012 Twitter, Inc.\n* http://www.apache.org/licenses/LICENSE-2.0.txt\n*/" > ../js/copyright.js
	cat ../js/copyright.js ../js/bootstrap.min.tmp.js > ../js/bootstrap.min.js
	rm ../js/copyright.js ../js/bootstrap.min.tmp.js
