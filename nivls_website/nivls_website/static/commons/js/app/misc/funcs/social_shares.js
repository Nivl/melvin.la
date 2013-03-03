function reloadShareButtons() {
    if (typeof gapi !== 'undefined') {
        gapi.plusone.go();
    }
}