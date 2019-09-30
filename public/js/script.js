$(document).ready(function(){
		var date_input=$('input[name="startDate"]'); //our date input has the name "startDate"
		date_input.datepicker({
			format: 'dd/mm/yyyy',
			todayHighlight: true,
			autoclose: true,
		})
        
    var date_input=$('input[name="endDate"]'); //our date input has the name "endDate"
		date_input.datepicker({
			format: 'dd/mm/yyyy',
			todayHighlight: true,
			autoclose: true,
		})
		
		var date_input=$('input[name="date"]'); //our date input has the name "date"
		date_input.datepicker({
			format: 'dd/mm/yyyy',
			todayHighlight: true,
			autoclose: true,
		})
	})

$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});
