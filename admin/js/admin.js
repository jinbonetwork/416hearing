function selectAll(formID) {
	jQuery('#'+formID).find('input[type="checkbox"]').attr('checked',true);
}
function unselectAll(formID) {
	jQuery('#'+formID).find('input[type="checkbox"]').attr('checked',false);
}

function deleteSelected(formID) {
	var n = jQuery('#'+formID+' input:checked').length;
	if(n < 1) {
		alert("삭제할 글을 지정하세요");
		return false;
	}
	jQuery('#'+formID).submit();
}

function deleteOpinion(id) {
	var url = "./opinion_delete.php?ids[]="+id;
	if(jQuery('#opinion-list-form input[name="page"]').val())
		url += '&page='+jQuery('#opinion-list-form input[name="page"]').val();

	jQuery(location).attr('href',url);
}
