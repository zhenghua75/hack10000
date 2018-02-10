"use strict";

var React = require('react-native');

var {
  	ListView,
}=React;

module.exports = {
    listViewPagingSource: function(data) {
    	if(!data){
    		data = [{id:0}];
    	}
    	if(!data.length){
    		data = [{id:0}];
    	}
    	if(data.length === 0){
    		data = [{id:0}];
    	}
    	var length = data.length;
    	
		var mode = length % 10;
		var NUM_SECTIONS = Math.floor(length/10) + (mode>0?1:0);

		var NUM_ROWS_PER_SECTION = 10;
		if(length<10){
			NUM_ROWS_PER_SECTION = length;
		}
	    var getSectionData = (dataBlob, sectionID) => {
	      return dataBlob[sectionID];
	    };
	    var getRowData = (dataBlob, sectionID, rowID) => {
	      return dataBlob[sectionID*10+rowID];
	    };

	    var dataSource = new ListView.DataSource({
	      getRowData: getRowData,
	      getSectionHeaderData: getSectionData,
	      rowHasChanged: (row1, row2) => row1 !== row2,
	      sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
	    });

	    var sectionIDs = [];
	    var rowIDs = [];
	    for (var ii = 0; ii < NUM_SECTIONS; ii++) {
	      sectionIDs.push(ii);
	      rowIDs[ii] = [];
	      if(ii === NUM_SECTIONS-1 && mode>0){
	      	NUM_ROWS_PER_SECTION = mode;
	      }
	      for (var jj = 0; jj < NUM_ROWS_PER_SECTION; jj++) {
	        rowIDs[ii].push((jj));
	      }
	    }
	    return dataSource.cloneWithRowsAndSections(data, sectionIDs, rowIDs);
	},
};