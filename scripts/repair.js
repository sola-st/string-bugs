var fs = require('fs');
var acorn = require('acorn');
var difflib = require('difflib');

var dirName = process.argv[2]; //directory containing each commit in a separate file
const regexDiffJS = /^diff\s\-\-.+\.js\n?$/;
const regexDiff = /^diff\s\-\-.+\.[a-z]+\n?$/;
const regexAdded = /^\+.+/;
const regexRemoved = /^\-.+/;
const regexCodeStart = /^@@\s.*\s@@/;
const vicinity = 100;

function extractTokens(removedLines, addedLines, filename) {
	//console.log(removedLines);
	//console.log(addedLines);
	if(addedLines.length == 0)
		return [];
	var removedTokens = [];
	var addedTokens = [];
	res = difflib.ndiff(removedLines, addedLines);
	//console.log(res);
	for(var i = 0; i < res.length; i++) {
		if(res[i].match(regexAdded)) {
			try{
				for(let t of acorn.tokenizer(res[i].slice(1))) {
					if(t.value !== undefined)
						addedTokens.push(t.value);
				}
			} catch (error) {
				console.error(error);
			}
			if(i > 0 && res[i-1].match(regexRemoved)) {
				try{
					for(let t of acorn.tokenizer(res[i-1].slice(1))) {
						if(t.value !== undefined)
							removedTokens.push(t.value);
					}
				} catch (error) {
					console.error(error);
				}	
			}
		}
	}
	var tokens = [];
	addedTokens.forEach(function(x) {
		if(/*!x.pattern && */!removedTokens.includes(x))
			tokens.push(x);
	});
	return tokens;
}

function findTokens(lines, i, tokens) {
	var tokensFound = new Set();
	for(var j = 1; j < lines.length; j++) {
		if(i-j > vicinity)
			continue;
		else if(j-i > vicinity)
			break;
		if(lines[j].match(regexAdded) || lines[j].match(regexRemoved))
			continue;
		if(lines[j].match(regexDiff))
			break;
		tokens.forEach(function(t) {
			if(t.pattern && lines[j].includes(t.pattern)) {
				tokensFound.add(t.pattern);
			}
			else if(lines[j].includes(t)) {
				tokensFound.add(t);
			}
		});
	}
	return tokensFound;
};

files = fs.readdirSync(dirName);
files.forEach(filename => {
	contents = fs.readFileSync(dirName + filename, 'utf8');
	var foundPlus = false;
	//console.log(filename);
	var lines = contents.split('\n');
	var found = 0;
	var all = 0;
	//console.log(lines);
	while(lines.length > 0) {
		jsStart = lines.findIndex(x => x.match(regexDiffJS));
		if(jsStart == -1)
			break;
		lines = lines.slice(jsStart);
		lines = lines.slice(lines.findIndex(x => x.match(regexCodeStart)))
		var removedLines = [];
		var addedLines = [];
		for(var i = 1; i < lines.length; i++) {
			if(lines[i].match(regexDiff)) {
				if(removedLines.length > 0 || addedLines.length > 0) {
					tokens = extractTokens(removedLines, addedLines, filename);
					if(tokens.length == 0) {
						console.error("No tokens");
					}
					else {
						result = findTokens(lines, i, tokens);
						found += result.size;
						all += (new Set(tokens)).size;
					}
				}
				lines = lines.slice(i);
				break;
			}
			if(lines[i].match(regexRemoved) && lines[i-1].match(regexRemoved)) {
				removedLines.push(lines[i-1].slice(1));
			}
			else if((!lines[i].match(regexRemoved) && !lines[i].match(regexAdded)) && lines[i-1].match(regexRemoved)) {
				if(removedLines.length > 0)
					console.error("No tokens");
				removedLines = [];
			}
			if(lines[i-1].match(regexRemoved) && lines[i].match(regexAdded)) {
				removedLines.push(lines[i-1].slice(1));
			}
			else if(lines[i].match(regexAdded) && lines[i-1].match(regexAdded)) {
				foundPlus = true;
				addedLines.push(lines[i-1].slice(1));
			}
			else if(lines[i-1].match(regexAdded)) {
				foundPlus = true;
				addedLines.push(lines[i-1].slice(1));
				tokens = extractTokens(removedLines, addedLines, filename);
				if(tokens.length == 0) {
					console.error("No tokens");
				}
				else {
					result = findTokens(lines, i-1, tokens);
					console.log(filename, result);
					found += result.size;
					all += (new Set(tokens)).size;
				}
				addedLines = [];
				removedLines = [];
			}
			if(i == lines.length-1)
				lines = [];
		}
	}
	if(all == 0)
		console.error("No tokens");
	else
		console.log(found/all);
	//if(!foundPlus)
		//console.log("No tokens");
});
