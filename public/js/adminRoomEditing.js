let submitButton = document.getElementById('adminRoomSubmitBtn');
let inputSet = document.querySelectorAll('.input-set');
let inputFrom = document.getElementById('inputFrom');
let inputTo = document.getElementById('inputTo');
let form = document.getElementById('inputForm');

form.addEventListener('submit', () => {
    if (inputFrom.value || inputTo.value) {
        if (!inputFrom.value) inputFrom.value = inputFrom.placeholder;
        if (!inputTo.value) inputTo.value = inputTo.placeholder;
    }
});

for (let index = 0; index < inputSet.length; index++) {
    inputSet[index].addEventListener('input', function () {
        if (this.placeholder !== this.value && this.value) {
            submitButton.disabled = false;
        } else {
            submitButton.disabled = true;
        }
    });
}
