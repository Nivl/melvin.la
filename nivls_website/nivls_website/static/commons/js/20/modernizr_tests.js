Modernizr.load({
    test: Modernizr.csstransforms3d && Modernizr.csstransitions,
    nope: STATIC_URL + 'commons/css/fixes/3d.css',
});
