jQuery(document).ready(function($) {
	$("[name=vecoForm]").submit(function(e) {
    	var acct = $("[name=acct]").val();
    	//$("#vecoFeedersResults").html(acct);

    	//Di ba date, time, duration and reason? Calculate duration based on start and end time.

    	var api_url = "getinfo.php";


    	if ( acct === "" ) {
			var output = "Please enter your VECO account number."
			$("#vecoFeedersResults").html(output);
			$('.big-link').click();
    	} else if ( isNaN(acct) ) {
    		var output = "You have entry invalid VECO account number. Please try again."
			$("#vecoFeedersResults").html(output);
			$('.big-link').click();
    	}else {
    		$(".vecoFeederHeading").html("Advisory for Account No.: " + acct);
    		$('.big-link').click();
    		$.ajax({
    		type: 'GET',
    		url: api_url,
    		data: "acct=" + acct,
    		success: function(data) {
    			//console.log(data);

    				

    			
    				
    			if (typeof(data.SQL_CFG_1) === "object") {
					var reportCount = data.SQL_CFG_1.outageScheduleByAccountNo.CURSOR_OUT.length - 1;
    			
	    			var report = data.SQL_CFG_1.outageScheduleByAccountNo.CURSOR_OUT[reportCount];
	    			var output = "";
	    			var count = 0;

	    			var data = report;
    			
    				count++;
					//console.log(data.OUTAGE_ID);
					var dateStart = data.DATE_START;
					var dateEnd = data.DATE_END;

					function getMonth(getMonth) {
						var months = ["January", "February", "March", "April", "May", "June", "July", "August", "Septemer", "October", "November", "December"];
						var numMonth = parseInt(getMonth);

						return months[numMonth - 1];
					}
					//console.log(startDate);

					//readable date format
					function vecoFeederGetDate(splitedDate) {
						var a = splitedDate.split("-");
						return a;
					}

					function vecoFeederGetReadableTime(splitedTime) {
						var time = splitedTime.split("+");
						var readableTime = time[0].split(":");
						var hour = readableTime[0];
						var minute = readableTime[1];
						var secondss = readableTime[2];
						var sign;

						var output = "";

						if ( hour < 12 ) {
							sign = "AM";
						} else {
							sign = "PM";
						}

						twelvehours = (hour > 12) ? hour - 12 : hour; 
						output = parseInt(twelvehours) + ":" + minute + " " + sign;
						return output;
					}

					function vecoSetNewDate(dates) {
						//default format is 2013-12-18T17:45:00.000+08:00
						//new Date(year, month, day, hours, minutes, seconds, milliseconds)
						var a = dates.split("T"); // [0] = date, [1] = time
						var date = a[0].split("-"); // [0] = year, [1] = month, [2] = day
						var time = a[1].split("+"); // [0] = time, [1] = timezone
						var time = time[0].split(":"); // [0] = hour, [1] = minute, [2] =seconds/miliseconds
						var miliseconds = time[2].split("."); // [0] = seconds, [1] = miliseconds

						 
						//return new Date(date[0] date[1], date[2], time[0], time[1], miliseconds[0], miliseconds[1]);
						//new Date("October 13, 1975 11:13:00") 

						$output = getMonth(date[1]) + " " + date[2] + ", " + date[0] + " " + time[0] + ":" + time[1] + ":" + miliseconds[0];
						return $output;
					}

					//console.log(vecoSetNewDate(dateStart));

					// return readable date format Month day, year / January 01, 1900
					function readableDateFormat(fullDate) {
						var date = fullDate.split("T");
						var vecoFeederDate = vecoFeederGetDate(date[0]);

						var readableDate = getMonth(vecoFeederDate[1]) + " " + vecoFeederDate[2] + ", " + vecoFeederDate[0];
						return readableDate;
					}

					// return readable time format 12:30 PM
					function readableTimeFormat(fullDate) {
						var date = fullDate.split("T");

						var readableTime = vecoFeederGetReadableTime(date[1]);
						return readableTime;
					}

					// var date1 = new Date('7/11/2010');
					// var date2 = new Date('12/12/2010');
					// var diffDays = date2.getDate() - date1.getDate(); 
					// alert(diffDays)

					function computeDayDiff(started, ended) {
						var date1 = new Date(vecoSetNewDate(started));
						var date2 = new Date(vecoSetNewDate(ended));
						var diffday = date2.getDate() - date1.getDate();

						return Math.abs(diffday);
					}

					function vecoGetHourDiff(date1, date2) {
						var a = new Date(vecoSetNewDate(date1));
						var b = new Date(vecoSetNewDate(date2));

						var c = a.getHours() - b.getHours();

						return Math.abs(c);
					}

					function vecoGetMinuteDiff(date1, date2) {
						var a = new Date(vecoSetNewDate(date1));
						var b = new Date(vecoSetNewDate(date2));

						var c = a.getMinutes() - b.getMinutes();
						return Math.abs(c);
					}

					function vecoGetDiff(day, hour, minute) {
						var a = day;
						var b = hour;
						var c = minute;
						var output = "";

						if ( a != 0 ) {
							output += a + " days ";
						} 

						if ( b != 0 ) {
							output += b + ", hours "; 
						} 

						if ( c != 0 ) {
							output += c + ", minutes";
						}

						return output;
					}

					var startingDate = vecoSetNewDate(dateStart);
					var endingDate = vecoSetNewDate(dateEnd);
					//var dateDiff = vecoGetDiff(computeDayDiff(startingDate, endingDate), vecoGetHourDiff(startingDate, endingDate), vecoGetMinuteDiff(startingDate, endingDate));
					var dateDiff = vecoGetDiff(computeDayDiff(dateStart, dateEnd), vecoGetHourDiff(dateStart, dateEnd), vecoGetMinuteDiff(dateStart, dateEnd));

					output += '<div class="vecoFeederReport">';
					output += '<div class="vecoFeederItem">';
					output += '<p><strong>From:</strong> ' + readableDateFormat(dateStart) + " - " + readableTimeFormat(dateStart) + '</p>';
					output += '<p><strong>To:</strong> ' + readableDateFormat(dateEnd)  + " - " + readableTimeFormat(dateEnd) + '</p>';
					output += '<p><strong>Duration:</strong> ' + dateDiff + '</p>';
					output += '<p>' + data.REASON + "</p>";
					output += "</div>";
					output += "</div>";
				
	    			//console.log(report);
	    			
	    			$("#vecoFeedersResults").html(output);
	    			//$('.big-link').click();

	    		} else {
	    			var output = "<p>Error</p>"
	    			$("#vecoFeedersResults").html(output);
	    		}
    			
    		},
			error: function(jqXHR, textStatus, errorThrown) {
			    //console.log('Error: ' + textStatus + ' ' + errorThrown);
			    var output = "Can't process now. Please try again."
			    $("#vecoFeedersResults").html(output);
    			$('.big-link').click();
			}
	    	});

    	}


    	$(".close-reveal-modal").click(function() {
    		$('#vecoFeedersResults').empty();
    	});


    	
    	e.preventDefault();
    });
});