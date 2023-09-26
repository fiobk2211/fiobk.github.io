
function moneyFormat(amount, decimal) {
var value = amount.toFixed(decimal);
var x = value.split('.');
var celaCast = x[0];
var desetinnaCast = x.length > 1 ? ',' + x[1] : '';
return celaCast.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ") + desetinnaCast;
};



$(function() {
$('input.numberSeparator').on("focusout", function() {
var value = numberSeparator($(this).val(), ",", " ", ",");
$(this).val(value);
});
});
