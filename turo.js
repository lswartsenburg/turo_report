var total = 0;
var bookings = [];
var allPromises = [];

jQuery(".js-tripDetails[data-reservation-id]").each(function(i,e){

    var res_id = $(e).attr('data-reservation-id');
    var p = jQuery.ajax({
      url: 'https://turo.com/api/reservation/detail?reservationId=' + res_id + '&oppTermsAware=true',
      dataType: 'json'
    });
    p.success(function(data){
      var cost = data['booking']['cost'];
      var start = new Date(data['booking']['start']['epochMillis']);
      var end = new Date(data['booking']['end']['epochMillis']);
      var renter = data['renter']['name'];

      bookings.push({
		renter: renter,
        start: start,
        end: end,
        cost: cost,
      });
    });
    allPromises.push(p);

});

$.when.apply($, allPromises).then(function() {
     allDone(bookings);
}, function(e) {
     console.log("My Ajax failed");
});


var allDone = function(data){
  bookings = bookings.sort(function(a,b){
     return a.start > b.start;
  });
  console.log("First rental date: " + bookings[0].start);
  var msSinceStart = new Date(Date.now()) - new Date(bookings[0].start);
  var monthsSinceStart = Math.round((msSinceStart / 2629746000) * 100) / 100.;
  console.log("Number of months: " + monthsSinceStart);

  var revenueToDate = 0;
  var revenueLater = 0;
  for(var i = 0 ; i < bookings.length; i++){
    var booking = bookings[i];
    if(booking.end < Date.now()){
      revenueToDate += booking.cost;
    } else {
      revenueLater += booking.cost;
    }
  }
  console.log("Average revenue per month: " + (revenueToDate / monthsSinceStart));
  console.log("Total in new bookings: " + revenueLater);
  console.log("Total revenue: " + (revenueLater + revenueToDate));
};
