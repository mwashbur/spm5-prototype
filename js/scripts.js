$(document).ready(function () {

    // NAV CONTROL AND ICON TOGGLE
    $('.btn-expand-collapse').click(function(e) {
        $('.navbar-primary').toggleClass('collapsed');
        $('#slidebtn').toggleClass("glyphicon-menu-right");
    });

    // TOGGLE OVERLAY ON/OFF ICON
    $('.funMiddle').click(function() {
        $('.inactiveFun, .activeFun').toggle();
    });
    $('.middle').click(function() {
        $('.inactive, .active').toggle();
    });
    $('.evacMiddle').click(function() {
        $('.inactiveEvac, .activeEvac').toggle();
    });

    // TOGGLE LEGEND ARROW ICON
    $('#fcBtn').click(function() {
        $(this).toggleClass('glyphicon-menu-up')
    });
    $('#lwBtn').click(function() {
        $(this).toggleClass('glyphicon-menu-up')
    });
    $('#erBtn').click(function() {
        $(this).toggleClass('glyphicon-menu-up')
    });

});
