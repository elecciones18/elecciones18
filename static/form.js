const statements = fetch("statements.json").then(response => {
	return response.json();
}).then(data => {
	stmtForm([], data);
});

function stmtForm(responseVector, categories) {
	if(categories.length > 0) {
		showForm(categories[0], 
			newResponses => stmtForm(
				responseVector.concat(newResponses),
				categories.slice(1)
			)
		);
	} else {
		console.log("Finished form.", responseVector);
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
					step="0.1"
				></input>
			</td>
		</tr>`;
	const html =
		`<div>
			<h3>${category.title}</h3>
			<table>
				${category.statements.map(stmtFormField).join('\n')}
			</table>
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
	return Array.from(formInputs).map(n => parseFloat(n.value));
}
