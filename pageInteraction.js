// handles the elements from the page itself

var hashtable = {};

hashtable.title = $(".editable.headerPencilEdit").text();

hashtable.contentTypeName = $(".contentTypeDisplay").text();

hashtable.sectionPath = $(".editable.pencilEdit.sectionChooserLink.sectionFolderSearch").text();

hashtable.contentIdAndDraft = $(".contentIdDisplay").text();

hashtable
