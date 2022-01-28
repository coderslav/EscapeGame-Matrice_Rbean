const pageURL = window.location.href.toString().split(window.location.host)[1];
let inputSet = document.querySelectorAll('.input-set');
let editableSlots = document.querySelectorAll('.editable');

function slotToStr(data) {
    return `${new Date(data[0].value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(data[1].value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}
function getDate(data) {
    return `${new Date(data[0].value).toLocaleDateString('fr-FR')}`;
}
function addDropDown(id) {
    return `
    <form id='changeSlotForm${id}' method='POST'>
                <div class='d-inline-block style="width: max-content;"'>
                    <div class='form-group'>
                        <label for='de' style="width: max-content;" class='col-sm-2 control-label pt-2'>De</label>
                        <div class='col-md-2 d-inline'>
                            <input name='timeFrom' id='inputTimeFrom' style="width: max-content;" type='datetime-local' required="required" class='form-control input-set d-inline' />
                        </div>
                        <label for='a' style="width: max-content;" class='col-sm-1 control-label text-center pt-2'>à</label>
                        <div class='col-md-2 d-inline'>
                            <input name='timeTo' id='inputTimeTo' style="width: max-content;" type='datetime-local' required="required" class='form-control input-set d-inline' />
                        </div>
                             <input name='slotId' value='${id}' style="width: max-content;" type='number' class='form-control input-set d-none' />
                    </div>
                </div>
                <button type='submit' id='submitChangeSlot${id}' class='btn btn-info'>Modifier</button>
                <button type='button' id='changeSlotCancel${id}' class='btn btn-secondary'>Retour</button>
            </form>
    `;
}

async function updateSlot(formData) {
    await fetch(pageURL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            let displaySlotElem = document.getElementById(`displaySlot${data.id}`);
            displaySlotElem.textContent = `${getDate(data.during)} ${slotToStr(data.during)}`;
            document.getElementById(`changeSlotForm${data.id}`).remove();
            document.getElementById(`editButton${data.id}`).classList.remove('d-none');
            document.getElementById(`deleteButton${data.id}`).classList.remove('d-none');
            document.getElementById(`slotWrap_${data.id}`).insertAdjacentHTML('beforeend', '<span class="ml-4" style="color: green;" id="donePopUp">Done!</span>');
            setTimeout(() => {
                document.getElementById('donePopUp').remove();
            }, 3000);
        })
        .catch((e) => console.log(e));
}

async function deleteSlot(slotId) {
    await fetch(pageURL, {
        method: 'POST',

        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ deleteSlot: parseInt(slotId) }),
    })
        .then((response) => {
            if (response.ok) {
                document.getElementById(`slotWrap_${slotId}`).remove();
            } else {
                console.log('Response not ok');
            }
        })
        .catch((e) => console.log(e));
}
async function addSlot(formData) {
    await fetch(pageURL, {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    })
        .then((response) => response.json())
        .then((data) => {
            document.getElementById('editableSlots').insertAdjacentHTML(
                'beforeend',
                `
            <div id='slotWrap_${data.id}' class='editable'>
                <div class='border border-success mt-1 mb-1 mr-4 p-1 rounded' style='display:inline-block;' id='displaySlot${data.id}'>${getDate(data.during)} ${slotToStr(data.during)}</div>
                <button type='button' value='${data.id}' class='btn btn-warning' id='editButton${data.id}'>Éditer</button>
                <button type='button' value='${data.id}' class='btn btn-danger' id='deleteButton${data.id}'>Supprimer</button>
            </div>
            `
            );
            document.getElementById(`editButton${data.id}`).addEventListener('click', function () {
                this.classList.add('d-none');
                document.getElementById(`deleteButton${data.id}`).classList.add('d-none');
                document.getElementById(`slotWrap_${data.id}`).insertAdjacentHTML('beforeend', addDropDown(data.id));
                document.getElementById(`changeSlotCancel${data.id}`).addEventListener('click', function () {
                    document.getElementById(`changeSlotForm${data.id}`).remove();
                    document.getElementById(`editButton${data.id}`).classList.remove('d-none');
                    document.getElementById(`deleteButton${data.id}`).classList.remove('d-none');
                });
                document.getElementById(`changeSlotForm${data.id}`).addEventListener('submit', function (event) {
                    event.preventDefault();
                    const formData = Object.fromEntries(new FormData(this).entries());
                    updateSlot(formData);
                });
            });
            document.getElementById(`deleteButton${data.id}`).addEventListener('click', function () {
                deleteSlot(data.id);
            });
        })
        .catch((e) => console.log(e));
}
inputFrom.addEventListener('submit', () => {
    if (inputFrom.value || inputTo.value) {
        if (!inputFrom.value) inputFrom.value = inputFrom.placeholder;
        if (!inputTo.value) inputTo.value = inputTo.placeholder;
    }
});

for (let index = 0; index < inputSet.length; index++) {
    inputSet[index].addEventListener('input', function () {
        if (this.placeholder !== this.value && this.value) {
            adminRoomSubmitBtn.disabled = false;
        } else {
            adminRoomSubmitBtn.disabled = true;
        }
    });
}

for (let index = 0; index < editableSlots.length; index++) {
    let id = editableSlots[index].id.split('_')[1];
    document.getElementById(`editButton${id}`).addEventListener('click', function () {
        this.classList.add('d-none');
        document.getElementById(`deleteButton${id}`).classList.add('d-none');
        editableSlots[index].insertAdjacentHTML('beforeend', addDropDown(id));
        document.getElementById(`changeSlotCancel${id}`).addEventListener('click', function () {
            document.getElementById(`changeSlotForm${id}`).remove();
            document.getElementById(`editButton${id}`).classList.remove('d-none');
            document.getElementById(`deleteButton${id}`).classList.remove('d-none');
        });
        document.getElementById(`changeSlotForm${id}`).addEventListener('submit', function (event) {
            event.preventDefault();
            const formData = Object.fromEntries(new FormData(this).entries());
            updateSlot(formData);
        });
    });
    document.getElementById(`deleteButton${id}`).addEventListener('click', function () {
        deleteSlot(id);
    });
}
document.getElementById('addSlotForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = Object.fromEntries(new FormData(this).entries());
    addSlot(formData);
});
