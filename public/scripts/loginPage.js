const form = document.getElementById('form');
const username = document.getElementById('username');

const password = document.getElementById('password');

form.addEventListener('submit', e => {
	e.preventDefault();
	
	checkInputs();
});

const checkInputs= () => {
	// trim to remove the whitespaces
	const usernameValue = username.value.trim();
	
	const passwordValue = password.value.trim();
	
	
	if(usernameValue === '') {
		setErrorFor(username, 'Username cannot be blank');
	} else {
		setSuccessFor(username);
	}
	
	
	if(passwordValue === '') {
		setErrorFor(password, 'Password cannot be blank');
	} else {
		setSuccessFor(password);
	}
	
	
}

const setErrorFor = (input, message) => {
	const formControl = input.parentElement;
	const small = formControl.querySelector('small');
	formControl.className = 'form-input error';
    console.log(small);
	small.innerText = message;
    
    console.log(message);
}

const setSuccessFor = (input) => {
	const formControl = input.parentElement;
	formControl.className = 'form-input success';
}