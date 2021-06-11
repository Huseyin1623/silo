function login() {
    const email = $('#email').val()
    const password = $('#password').val()
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            window.location.href = "index.html"
        })
        .catch((error) => {
            const errorMessage = error.message
            alert(errorMessage)
        })
}