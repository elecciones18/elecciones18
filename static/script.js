window.onload = function () {
	const candidateProfiles = 
		fetch("presidentCandidateProfiles.json")
			.then(resp => resp.json());
	const statements = 
		fetch("statements.json")
			.then(response => response.json())
			.then(data => stmtForm([], data, candidateProfiles));
}


function stmtForm(responseVector, categories, candidateProfiles) {
	if(categories.length > 0) {
		showForm(categories[0], 
			newResponses => stmtForm(
				responseVector.concat(newResponses),
				categories.slice(1),
				candidateProfiles
			)
		);
	} else {
		candidateProfiles.then(profiles =>
			showProfileResult(responseVector, profiles["candidates"])
		);
	}
}

function showForm(category, cont) {
	const stmtFormField = stmt => `
		<tr>
			<td><label>${stmt}</label></td>
			<td>
				<input 
					class="stmt-input"
					type="range"
					min="1"
					max="5"
					step="1"
				></input>
			</td>
		</tr>`;
	const html =
		`<div>
			<h3>${category.title}</h3>
			<table> ${category.statements.map(stmtFormField).join('\n')} </table>
			<button id="nextStmtCategory">Next!</button>
		 </div>`

	document.getElementById("statementsForm").innerHTML = html;
	document.getElementById("nextStmtCategory")
		.addEventListener('click', function() { 
			cont(getStmtFormFields()); 
		});
}

function getStmtFormFields() {
	const formInputs = document.getElementsByClassName("stmt-input");
	return Array.from(formInputs).map(n => parseInt(n.value));
}

function showProfileResult(userAnswers, partyAnswer) {
	var parties=[
		{
			answers:partyAnswer[partyAnswer.length-1]["candidate_1"],
			logo:'logos_presidencia/1.jpg',
			name:'Andr\u00e9s Manuel L\u00f3pez Obrador'
		},
		{
			answers:partyAnswer[partyAnswer.length-1]["candidate_2"],
			logo:'logos_presidencia/2.jpg',
			name:'Jos\u00e9 Antonio Meade Kuribre\u00f1a'
		},
		{
			answers:partyAnswer[partyAnswer.length-1]["candidate_3"],
			logo:'logos_presidencia/3.jpg',
			name:'Margarita Zavala'
		},
		{
			answers:partyAnswer[partyAnswer.length-1]["candidate_4"],
			logo:'logos_presidencia/4.jpg',
			name:'Miguel \u00c1ngel Mancera'
		},
		{
			answers:partyAnswer[partyAnswer.length-1]["candidate_5"],
			logo:'logos_presidencia/5.jpg',
			name:'Ricardo Anaya'
		},
		{
			answers:partyAnswer[partyAnswer.length-1]["candidate_6"],
			logo:'logos_presidencia/6.jpg',
			name:'Jaime Rodr\u00edguez'
		}
	];

	// Why are there 50 answers from the candidates?! Padding with ones for now.
	userAnswers = userAnswers.concat(Array.apply(null, Array(50)).map(i => 1));
	console.log(userAnswers,parties);
	var weightageArray=[];
	for(i=0; i<userAnswers.length; i++){
		weightageArray[i]=1;
	}
	var hybrid=[];
	for(i=0; i<parties.length; i++){
		parties[i].hybrid = vaaCalcs.hybrid(parties[i].answers, userAnswers, weightageArray, 99);
	}

	parties.sort(function(a,b) {
		return b.hybrid-a.hybrid;
	});
	console.log(parties);

	chart('#barChart', parties);
}
