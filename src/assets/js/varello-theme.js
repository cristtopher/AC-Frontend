$(document).ready(function()
{
    var $contentWrapper = $('.content-wrapper');
    var $sidebars = $('.left-sidebar');
    var $window = $(window);
    var onWindowResize = function()
    {
        var navbarIsCollapsed = $(window).outerWidth() < 769;
        calculatedMinHeight = $(window).height() - 56;
        calculatedSidebarMinHeight = $contentWrapper.height() + (navbarIsCollapsed ? 112 : 56);
        $contentWrapper.css({minHeight: calculatedMinHeight + 'px'});
        $sidebars.css({minHeight: calculatedSidebarMinHeight + 'px'});
    };
    onWindowResize();

    $('.faqs-question-text').click(function()
    {
        $(this).siblings('.faqs-question-answer').fadeToggle(350);
        $(this).parent('.faqs-question').toggleClass('open');
    });

    $('#login-hidden').fadeIn(1150);

    $(window).resize(onWindowResize);

/*    $('[data-subnav-toggle]').click(function()
    {
        $(this).parent().toggleClass('open');
    });*/

    Chart.defaults.global.defaultColor = 'rgba(255, 255, 255, 1)';
    Chart.defaults.global.defaultFontColor = 'rgba(255, 255, 255, 1)';
//    Chart.defaults.global.legend.display = false;

    Chart.defaults.global.title.fontColor = '#FFFFFF';

    $(".piety-pie").peity("pie", {
        fill: ["#1f7491", "#363a3c"]
    });

    $('[data-toggle="tooltip"]').tooltip();

    $('[data-close-widget]').click(function()
    {
        $widget = $(this).parents('.widget');

        if ($widget.length) {
            $widget.fadeOut(500, function()
            {
                $(this).remove();
            });
        }
    });

    $('#trigger-demo-notify').click(function()
    {
        $('.top-right').notify({
            message: { html: 'Great looking notification at the top right of the page!<br><br>These can be configured to display at any corner...' },
            type: 'success'
          }).show(); 
        $('.top-right').notify({
            message: { html: 'Great looking notification at the top right of the page!<br><br>These can be configured to display at any corner...' },
            type: 'info'
          }).show(); 
        $('.top-right').notify({
            message: { html: 'Great looking notification at the top right of the page!<br><br>These can be configured to display at any corner...' },
            type: 'warning'
          }).show(); 
        $('.top-right').notify({
            message: { html: 'Great looking notification at the top right of the page!<br><br>These can be configured to display at any corner...' },
            type: 'danger'
          }).show(); 
    });
    $('.fixed-skinner-toggle').click(function()
    {
        $(this).parent().toggleClass('open');
    });
    $('[data-toggle-skin-colour]').click(function()
    {
        var skinColour = $(this).data('toggleSkinColour');

        $('body').removeClass(function (index, css) {
            return (css.match (/(^|\s)skin-\S+/g) || []).join(' ');
        });

        if (skinColour.length) {
            $('body').addClass('skin-' + skinColour);
            var toggleSkinIdentifier = skinColour;
        } else {
            var toggleSkinIdentifier = 'default';
        }

        // Commit the colour to the session through Laravel
        $.get('/toggle-skin-colour/' + toggleSkinIdentifier);
    });
});