function clearPlayers() {
    const formPlayers = document.getElementById('formPlayers');
    formPlayers.innerHTML = '';

    return formPlayers;
}

function createNthPlayer(n) {
    let htmlPlayer;
    if (n === 0) {
        htmlPlayer = `
        <h5 class="mt-5">Participant ${n + 1}</h5>
        <div class="form-check">
            <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
            <label class="form-check-label" for="defaultCheck1">
                Ajouter l'utilisateur actuel en tant que participant
            </label>
        </div>
        <div class="form-row mb-5"> 
            <div class="col-md-4">
                <label>Prénom</label>
                <input name="[players][${n}][firstName]" type="text" class="form-control" id="firstPlayerName">
            </div>
            <div class="col-md-4">
                <label>Nom</label>
                <input name="[players][${n}][lastName]" type="text" class="form-control" id="firstPlayerLastName">
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
        <div class="form-row mb-5"> 
            <div class="col-md-4">
                <label>Prénom</label>
                <input name="[players][${n}][firstName]" type="text" class="form-control">
            </div>
            <div class="col-md-4">
                <label>Nom</label>
                <input name="[players][${n}][lastName]" type="text" class="form-control">
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
        method: 'POST'
    })
        .then((response) => response.json())
        .then((data) => {
            firstName.value = data.firstName;
            lastName.value = data.lastName;
        })
        .catch((e) => console.log(e));
}

document.addEventListener('DOMContentLoaded', function (event) {
    const selectPlayers = document.getElementById('nbPlayers');
    selectPlayers.addEventListener('change', (e) => {
        const formPlayers = clearPlayers();
        for (let i = 0; i < e.target.value; i += 1) {
            formPlayers.insertAdjacentHTML('beforeend', createNthPlayer(i));
        }
        const currentUserCheckBox = document.getElementById('defaultCheck1');
        const firstPlayerName = document.getElementById('firstPlayerName');
        const firstPlayerLastName = document.getElementById('firstPlayerLastName');
        currentUserCheckBox.addEventListener('change', () => {
            if (!currentUserCheckBox.checked) {
                firstPlayerName.value = '';
                firstPlayerLastName.value = '';
            } else {
                getUser(firstPlayerName, firstPlayerLastName);
            }
        });
    });
});
