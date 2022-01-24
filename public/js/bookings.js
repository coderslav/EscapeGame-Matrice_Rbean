const annulationButtons = document.querySelectorAll('.annulationButton');

async function annulateBooking(index, bookingId) {
    await fetch('/bookings', {
        method: 'POST',

        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ bookingId: parseInt(bookingId) }),
    })
        .then((response) => {
            if (response.ok) {
                console.log(annulationButtons[index].parentElement.parentElement.remove());
            } else {
                console.log('Response not ok');
            }
        })
        .catch((e) => console.log(e));
}

for (let index = 0; index < annulationButtons.length; index++) {
    annulationButtons[index].addEventListener('click', () => {
        annulateBooking(index, annulationButtons[index].value);
    });
}
