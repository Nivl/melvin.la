BOOTSTRAP_LESS = ./less/bootstrap.less
BOOTSTRAP_RESPONSIVE_LESS = ./less/responsive.less

#
# BUILD DOCS
#

bootstrap:
	cp img/* ../img/
	recess --compress ${BOOTSTRAP_LESS} > ../css/0/bootstrap.min.css
	recess --compress ${BOOTSTRAP_RESPONSIVE_LESS} > ../css/30/bootstrap-responsive.min.css
	cat js/bootstrap-transition.js js/bootstrap-alert.js js/bootstrap-button.js js/bootstrap-carousel.js js/bootstrap-collapse.js js/bootstrap-dropdown.js js/bootstrap-modal.js js/bootstrap-tooltip.js js/bootstrap-popover.js js/bootstrap-scrollspy.js js/bootstrap-tab.js js/bootstrap-typeahead.js js/bootstrap-affix.js > ../js/0/bootstrap.js
