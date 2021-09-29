// alert('help');
const password = 'password';
const elPassword = document.querySelector('#arabic');
document.querySelector('#not-arabic').addEventListener('click', function (event) {
    if (password === elPassword.value) {
        
        open('beginners luck.html'); 
    }

});