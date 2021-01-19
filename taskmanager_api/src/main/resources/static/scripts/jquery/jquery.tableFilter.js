if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, 'includes', {
        value: function(searchElement, fromIndex) {

            if (this == null) {
                throw new TypeError('"this" is null or not defined');
            }

            // 1. Let O be ? ToObject(this value).
            var o = Object(this);

            // 2. Let len be ? ToLength(? Get(O, "length")).
            var len = o.length >>> 0;

            // 3. If len is 0, return false.
            if (len === 0) {
                return false;
            }

            // 4. Let n be ? ToInteger(fromIndex).
            //    (If fromIndex is undefined, this step produces the value 0.)
            var n = fromIndex | 0;

            // 5. If n ≥ 0, then
            //  a. Let k be n.
            // 6. Else n < 0,
            //  a. Let k be len + n.
            //  b. If k < 0, let k be 0.
            var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

            function sameValueZero(x, y) {
                return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
            }

            // 7. Repeat, while k < len
            while (k < len) {
                // a. Let elementK be the result of ? Get(O, ! ToString(k)).
                // b. If SameValueZero(searchElement, elementK) is true, return true.
                if (sameValueZero(o[k], searchElement)) {
                    return true;
                }
                // c. Increase k by 1. 
                k++;
            }

            // 8. Return false
            return false;
        }
    });
}

(function($) {
    "use strict";
    $.fn.tableFilter = function(options) {

        //default settings
        var settings = $.extend({
            tableID: '#filter-table',
            filterID: '#filter',
            // for global search: searchable for dynamic columns of table, keep empty for column search
            searchableRowClassNames: [],
            // for global search: searchable row className is function to row filter
            searchableColumns: [],
            // for global search: searchable child row className is function to child row filter
            searchableChildRowClassNames: [],
            // for global search on child table: searchable for dynamic columns of table, keep empty for column search
            childTableSearchableColumns: [],
            // for global search filterCell should be null, for column search filterCell should not be null
            filterCell: '.filter-cell',
            // auto focus on load
            autoFocus: false,
            // is case sensitive?
            caseSensitive: false,
            // text for no results
            noResults: 'no results found',
            // The plugin will determine the # of columns based on first row.
            // If your first row has less columns than rest of table you can set column count here
            columns: null
        }, options);

        //auto focus on filter element if autofocus set to true
        if (settings.autoFocus) {
            $(settings.filterID).focus();
        }


        // redraw table and empty filter input in case of filtering options update
        function init(settings) {
            var tableId = settings.tableID;
            var elements = $(tableId);

            if (elements != undefined && elements.length > 0) {
                var searchableHiddenRowClasses = [];
                // hidden is allowed when backspace is pressed then hidden rows also will be filtered
                var searchableRowClasses = settings.searchableRowClassNames;
                for (var j = 0; j < searchableRowClasses.length; j++) {
                    var searchableRowClass = searchableRowClasses[j];
                    searchableRowClass = searchableRowClass + ' filter-hidden';
                    searchableHiddenRowClasses.push(searchableRowClass);
                }

                var table = document.getElementById(elements[0].id);
                var trs = table.getElementsByTagName("tr");
                // for global search if filter input is empty then make visible all allowed rows and remove 'no result' text
                for (var i = 1; i < trs.length; i++) {
                    var tr = trs[i];

                    if (searchableHiddenRowClasses.includes(tr.className)) {
                        tr.style.display = "table-row";
                        tr.className = tr.className.replace(/\bfilter-hidden\b/g, "");
                        tr.className = tr.className.replace(" ", "");
                    }
                }

                if ($('#noResults').is(':visible')) {
                    $('#noResults').remove();
                }
            }
            $(settings.filterID).val('');
        }

        init(settings);

        // get table rows
        var rowCount = $(settings.filterCell).parent().length;

        //get tablecolumns by counting td's in forst row unless passed as option
        if (settings.columns === null) {
            settings.columns = $(settings.tableID + ' > tbody > tr:first >td').length;
        }

        //use case-sensitive matching unless changed by settings (default)
        var contains = ':contains';

        if (!settings.caseSensitive) {
            //create custom "icontains" selector for case insensitive search
            $.expr[':'].icontains = $.expr.createPseudo(function(text) {
                return function(e) {
                    return $(e).text().toUpperCase().indexOf(text.toUpperCase()) >= 0;
                };
            });
            contains = ':icontains';
        }

        //bind eventListener to filter element
        return $(settings.filterID).on("change paste keyup", function() {
            //get value of input
            var filterString = $(this).val();
            // console.log("Typed: " + filterString);
            // for global search
            if (settings.filterCell == null) {
                var filter, tr, td, txtValue;
                filter = filterString;
                var tableId = settings.tableID;
                var elements = $(tableId);

                var table = document.getElementById(elements[0].id);
                var trs = table.getElementsByTagName("tr");

                // searchable row is feature to search only to allowed rows defined by class name

                var searchableHiddenRowClasses = [];
                // hidden is allowed when backspace is pressed then hidden rows also will be filtered
                var searchableRowClasses = settings.searchableRowClassNames;
                for (var j = 0; j < searchableRowClasses.length; j++) {
                    var searchableRowClass = searchableRowClasses[j];
                    searchableRowClass = searchableRowClass + ' filter-hidden';
                    searchableHiddenRowClasses.push(searchableRowClass);
                }

                // check if user types words
                if (filter != "") {
                    var totalRows = 0;
                    for (var i = 1; i < trs.length; i++) {
                        var tr = trs[i];
                        // ensure correct allowed rows will be filtered
                        if (searchableRowClasses.includes(tr.className) || searchableHiddenRowClasses.includes(tr.className)) {
                            totalRows++;
                            var tds = tr.getElementsByTagName("td");
                            var rowVisible = false;
                            for (var j = 0; j < tds.length; j++) {
                                var td = tds[j];
                                var indexFound = settings.searchableColumns.includes(j);

                                // make sure correct table column will be filtered
                                if (indexFound && td) {
                                    tr.style.cssText = "";
                                    // if any td has child rows
                                    if (td.innerHTML.indexOf("<tr") > -1) {
                                        var childTableTrs = td.getElementsByTagName('tr');
                                        for (var k = 0; k < childTableTrs.length; k++) {
                                            var childTableTr = childTableTrs[k];

                                            // make sure correct allowed child rows will be filtered
                                            if (settings.searchableChildRowClassNames.includes(childTableTr.className)) {
                                                var childTableTds = childTableTr.getElementsByTagName("td");

                                                for (var l = 0; l < childTableTds.length; l++) {
                                                    var childTableTd = childTableTds[l];
                                                    var childTableIndexFound = settings.childTableSearchableColumns.includes(l);

                                                    // make sure that the td is not hidden
                                                    if (childTableIndexFound && childTableTd && childTableTd.style.display == "") {

                                                        tr.style.cssText = "";
                                                        var childTableTdInnerHtml = childTableTd.innerHTML;
                                                        var childTableTxtValue = "";

                                                        // if any input fields is found concat input field values otherwise get text content
                                                        if (childTableTdInnerHtml.indexOf('<input') > -1) {
                                                            var div = document.createElement('div');
                                                            div.innerHTML = childTableTdInnerHtml;
                                                            var inputs = div.getElementsByTagName('input');
                                                            for (var index = 0; index < inputs.length; index++) {
                                                                var input = inputs[index];
                                                                childTableTxtValue = childTableTxtValue + " " + input.value;
                                                            }
                                                        } else {
                                                            childTableTxtValue = childTableTd.textContent || childTableTd.innerText;
                                                        }

                                                        // for case sensitive is allowed or not
                                                        if (!settings.caseSensitive) {
                                                            childTableTxtValue = childTableTxtValue.toUpperCase();
                                                            filter = filter.toUpperCase();
                                                        }

                                                        if (childTableTxtValue.indexOf(filter) > -1) {
                                                            console.log("From Child Table: " + childTableTxtValue);
                                                            rowVisible = true;
                                                            break;
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    } // check if parent table row td has input field then consider 'value' attribute
                                    else if (td.innerHTML.indexOf("<input") > -1) {
                                        var div = document.createElement('div');
                                        div.innerHTML = td.innerHTML;

                                        var inputs = div.getElementsByTagName('input');

                                        for (var index = 0; index < inputs.length; index++) {
                                            var input = inputs[index];
                                            txtValue = txtValue + " " + input.value;
                                        }

                                        if (!settings.caseSensitive) {
                                            txtValue = txtValue.toUpperCase();
                                            filter = filter.toUpperCase();
                                        }

                                        if (txtValue.indexOf(filter) > -1) {
                                            // console.log("From Parent Table: " + td.innerHTML);
                                            rowVisible = true;
                                            break;
                                        }
                                    } // otherwise consider textContent or innertext, if filter found break loop
                                    else {
                                        // Filter is done
                                        txtValue = td.textContent || td.innerText;
                                        if (!settings.caseSensitive) {
                                            txtValue = txtValue.toUpperCase();
                                            filter = filter.toUpperCase();
                                        }

                                        if (txtValue.indexOf(filter) > -1) {
                                            // console.log("From Parent Table: " + td.innerHTML);
                                            rowVisible = true;
                                            break;
                                        }
                                    }

                                }
                            }
                            // for filter success make row visible otherwise make row hidden
                            if (rowVisible) {
                                // console.log("Row visible.");
                                tr.style.display = "table-row";

                                tr.className = tr.className.replace(/\bfilter-hidden\b/g, "");
                                tr.className = tr.className.replace(" ", "");
                            } else {
                                // console.log("Row hidden.");
                                tr.style.display = "none";

                                var currentClass = tr.className;
                                if (currentClass.indexOf('filter-hidden') == -1) {
                                    tr.className = currentClass + " filter-hidden";
                                }
                            }
                        }
                    }
                    rowCount = totalRows;

                    var hidden = $(settings.tableID).find('.filter-hidden').length;
                    // console.log("Total Rows: " + rowCount);
                    // console.log("Total Hidden Rows: " + hidden);

                    // for filter input in case of no result found show 'no result' text as table row
                    if (hidden === rowCount) {
                        if ($('#noResults').is(':visible')) {
                            return; //do not display multiple "no results" messages
                        }
                        var newRow = $('<tr id="noResults"><td colspan="' + settings.columns + '"><em>' + settings.noResults + '</em></td></tr>').hide(); //row can be styled with CSS
                        $(settings.tableID).append(newRow);
                        newRow.show();
                    } else if ($('#noResults').is(':visible')) {
                        $('#noResults').remove();
                    }
                } else {
                    // for global search if filter input is empty then make visible all allowed rows and remove 'no result' text
                    for (var i = 1; i < trs.length; i++) {
                        var tr = trs[i];

                        if (searchableHiddenRowClasses.includes(tr.className)) {
                            tr.style.display = "table-row";
                            tr.className = tr.className.replace(/\bfilter-hidden\b/g, "");
                            tr.className = tr.className.replace(" ", "");
                        }
                    }
                    if ($('#noResults').is(':visible')) {
                        $('#noResults').remove();
                    }
                }
            } else {
                // for each column values compare with filter input
                $(settings.filterCell).each(function(i) { //pass i as iterator
                    if ($(this).is(contains + '(' + filterString + ')')) {
                        //check hidden rows for backspace operation
                        if ($(this).is(':hidden')) {
                            $(this).parent().removeClass('filter-hidden').show();
                        }
                    } else {
                        $(this).parent().addClass('filter-hidden').hide();
                    }
                    //check if .each() iterations complete
                    if (rowCount === (i + 1)) {
                        //find rows with 'hidden' class and compare to row count if equal then display 'no results found' message
                        var hidden = $(settings.tableID).find('.filter-hidden').length;
                        if (hidden === rowCount) {
                            if ($('#noResults').is(':visible')) {
                                return; //do not display multiple "no results" messages
                            }
                            var newRow = $('<tr id="noResults"><td colspan="' + settings.columns + '"><em>' + settings.noResults + '</em></td></tr>').hide(); //row can be styled with CSS
                            $(settings.tableID).append(newRow);
                            newRow.show();
                        } else if ($('#noResults').is(':visible')) {
                            $('#noResults').remove();
                        }
                    }
                });
            }
        });
    };
}(jQuery));