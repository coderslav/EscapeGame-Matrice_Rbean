function createNthPlayer(n) {
    let htmlPlayer;
    if (n === 0) {
        htmlPlayer = `
        <h5 class="mt-5">Participant ${n + 1}</h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" id="defaultCheck1">
            <label class="form-check-label" for="defaultCheck1">
                Ajouter l'utilisateur actuel en tant que participant
            </label>
        </div>
        <div class="form-row mb-5"> 
            <div class="col-md-4">
                <label>Prénom</label>
                <input name="[players][${n}][firstName]" type="text" class="form-control inputVal" id="firstPlayerName">
            </div>
            <div class="col-md-4">
                <label>Nom</label>
                <input name="[players][${n}][lastName]" type="text" class="form-control inputVal" id="firstPlayerLastName">
            </div>
            <div class="offset-1 col-md-3">
                <label>Date de naissance</label>
                <input name="[players][${n}][dob]" type="date" class="form-control">
            </div>
        </div>
    `;
    } else {
        htmlPlayer = `
        <h5 class="mt-5">Participant ${n + 1}</h5>
        <div class="form-row mb-5" id="test"> 
            <div class="col-md-4">
                <label>Prénom</label>
                <input name="[players][${n}][firstName]" type="text" class="form-control firstInput" >
            </div>
            <div class="col-md-4">
                <label>Nom</label>
                <input name="[players][${n}][lastName]" type="text" class="form-control inputVal">
            </div>
            <div class="offset-1 col-md-3">
                <label>Date de naissance</label>
                <input name="[players][${n}][dob]" type="date" class="form-control">
            </div>
        </div>
    `;
    }

    return htmlPlayer;
}

async function getUser(firstName, lastName) {
    await fetch('/get-current-user', {
        method: 'POST',
    })
        .then((response) => response.json())
        .then((data) => {
            firstName.value = data.firstName;
            lastName.value = data.lastName;
        })
        .catch((e) => console.log(e));
}

document.addEventListener('DOMContentLoaded', function (event) {
    nbPlayers.addEventListener('change', (e) => {
        formPlayers.innerHTML = '';
        formElement.lastChild.remove();
        for (let i = 0; i < e.target.value; i += 1) {
            formPlayers.insertAdjacentHTML('beforeend', createNthPlayer(i));
            if (i === e.target.value - 1) {
                formElement.insertAdjacentHTML('beforeend', '<button type="submit" class="mt-5 btn btn-primary">Confirmer</button>');
            }
        }
        defaultCheck1.addEventListener('change', () => {
            if (!defaultCheck1.checked) {
                firstPlayerName.value = '';
                firstPlayerLastName.value = '';
            } else {
                getUser(firstPlayerName, firstPlayerLastName);
            }
        });

        const arr = [];
        var checkVal = document.querySelectorAll('input.firstInput, inputVal');
        checkVal.forEach((val) => {
            val.addEventListener('change', (e) => {
                let valueInput = e.target.value;
                if (valueInput !== '') {
                    arr.push({
                        firstName: valueInput,
                        lastName: valueInput,
                    });
                }
            });
        });
    });
});
