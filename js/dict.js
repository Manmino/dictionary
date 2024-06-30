var dictionary, re;
var tables = ["#results_manmino", "#results_english"];

$(document).ready(function() {
	$("#searchfield").focus();
	$("#searchfield").on("keypress", function(event) {
		if(event.key === "Enter") {
			event.preventDefault;
			$("#searchbutton").click();
		}
	});

	$("body").on("keydown", function() {
		$("#searchfield").focus();
	});

	Papa.parse('data/dictionary2021-9-WIP.csv', {
		download: true,
		header: false,
		delimiter: ',',
		skipEmptyLines: true,
		complete: function(results) {
			dictionary = results.data;
		}
	});
});

function searchEnglish(entry) {
	return re.test(entry[2].toLowerCase());
}

function searchManmino(entry) {
	return re.test(entry[0].toLowerCase());
}

function doSearch() {
	$("#searchfield").focus();
	$("#searchfield").select();

	var query = $("#searchfield").val().trim().toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\*/g, ".*?");

	if(query.length > 0) {
		$(".results_table").hide();
		re = new RegExp("(?<!\\p{L})" + query + "(?!\\p{L})", "u");

		var results = [[], []]
		if($("#search_english").is(":checked"))
			results[0] = dictionary.filter(searchEnglish);
		if($("#search_manmino").is(":checked"))
			results[1] = dictionary.filter(searchManmino);

		if(results[0].length > 0 || results[1].length > 0) {
			$("#noresults").hide();
			$(".results_table tr:has(td)").remove();
			$(document).prop("title", $("#searchfield").val() + " - ManminoDict");

			var re_start = new RegExp("^\\b" + query + "\\b");
			results.forEach(function(ra, i) {
				if(ra.length > 0) {
					var entries = [[], []];
					ra.sort(function(a, b){return a[i] < b[i] ? -1 : 1});
					ra.forEach(function(r) {
						if(re_start.test(r[i].toLowerCase()))
							entries[0].push(r);
						else
							entries[1].push(r);
					});
					entries.forEach(function(e) {
						e.forEach(function(r) {
							$(tables[i]).append("<tr><td>" + r[i] + "</td><td>" + r[2-i] + "</td><td>" + r[1] + "</td><td>" + r[3] + "</td></tr>");
						});
					});
					$(tables[i]).show();
				}
			});
		}
		else {
			$("#noresults").show();
			$(document).prop("title", "ManminoDict");
		}
	}
}
