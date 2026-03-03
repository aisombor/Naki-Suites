
jQuery(document).ready(function() {


    jQuery.fn.datepicker.dates['custom'] = {
        days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        months: [calendar['January'],calendar['February'],calendar['March'],calendar['April'],calendar['May'],calendar['June'],calendar['July'],calendar['August'],calendar['September'],calendar['October'],calendar['November'],calendar['December']],
        monthsShort: [calendar['Jan'],calendar['Feb'],calendar['Mar'],calendar['Apr'],calendar['May'],calendar['Jun'],calendar['Jul'],calendar['Aug'],calendar['Sep'],calendar['Oct'],calendar['Nov'],calendar['Dec']],
        today: "Today",
        monthsTitle: "Months",
        clear: "Clear",
        weekStart: 1,
        format: "d/MM/yyyy"
    };



    jQuery('.js-datepicker').datepicker({
        weekStart: 1,
        orientation: "auto bottom",
        autoclose: true,
        todayHighlight: false,
        inputs: [jQuery("#checkin-date"), jQuery("#checkout-date")],
        format: 'd/MM/yyyy',
        language: 'custom',
        startDate: "+0d"
    });

    jQuery('.js-datepicker').datepicker().on('changeDate', function(e) {
        var checkin_date = jQuery('#checkin-date').val().split("/");
        var checkout_date = jQuery('#checkout-date').val().split("/");
        jQuery('#checkin-day').html(checkin_date[0]);
        jQuery('#checkin-month').html(calendar[checkin_date[1]]);

        jQuery('#checkout-day').html(checkout_date[0]);

        jQuery('#checkout-month').html(calendar[checkout_date[1]]);
        jQuery('#checkout-date').focus().blur();
    });

    jQuery('.js-datepicker').on('click', function(e){
        e.preventDefault();
    });

    jQuery('#guest-picker li a').on('click', function(e){
        e.preventDefault();
        var guest_count = jQuery(this).attr('data-guests');
        jQuery('#guest-count').html(guest_count);
        jQuery('#guests').val(guest_count);
        if (guest_count == "1"){
            jQuery('#guest-value').html(calendar['Person']);
        } else {
            jQuery('#guest-value').html(calendar['Persons']);
        }
    });



});
