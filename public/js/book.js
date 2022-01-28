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
    // const myForm = document.getElementById('myForm');
    // const fName= document.getElementById('firstPlayerName')
    const selectPlayers = document.getElementById('nbPlayers');
    selectPlayers.addEventListener('change', (e) => {
        // let formData = new FormData(myForm);
        // formData.append(fName, 'Chris');
        // console.log(formData, 'formdata')
        const formPlayers = clearPlayers();
        for (let i = 0; i < e.target.value; i += 1) {
            formPlayers.insertAdjacentHTML('beforeend', createNthPlayer(i));
        }

        //Checkbox value
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
        //end checkbox

        //get input value
        // const arr = [];
        // const checkVal = document.querySelector('.inputVal');
        // checkVal.addEventListener("change", myEvent);
        // function myEvent(e){
        //     console.log(e.target.value, 'value myevent')
        //     let valueInput = e.target.value;
        //     if (valueInput !== ''){
        //         arr.push({name1 : e.target.value})
        //     }
        //     console.log(arr, 'arr')
        // }

        const arr = [];
        // var container = document.querySelector("#test");
        var checkVal = document.querySelectorAll("input.firstInput, inputVal");
        console.log(checkVal, 'check')
        // const checkVal = document.querySelector('.inputVal');
        checkVal.forEach(val =>{
            console.log(val, 'valllll')
            // console.log(createNthPlayer())
            val.addEventListener("change", (e)=>{
                console.log(e.target.value, 'value myevent')
                let valueInput = e.target.value;
                if (valueInput !== ''){
                    arr.push({
                        firstName : valueInput,
                        lastName: valueInput
                    })
                }
                console.log(arr, 'arr')
            });
        })
            // console.log(checkVal[i], "iiiii")
            // addEventListener("change", myEvent);
        //     function myEvent(e){
        //         console.log(e.target.value, 'value myevent')
        //         let valueInput = e.target.value;
        //         if (valueInput !== ''){
        //             arr.push({
        //                 firstName : valueInput,
        //                 lastName: valueInput
        //             })
        //         }
        //         console.log(arr, 'arr')
        // }

        //end get input value
    });
});


