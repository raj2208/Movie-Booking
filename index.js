const form = document.getElementById("movieForm");
const findSlotBtn = document.getElementById("findSlotBtn");
const totalBookingsEl = document.getElementById("totalBookings");
let totalBookings = 0;

form.addEventListener("submit", handleFormSubmit);
findSlotBtn.addEventListener("click", handleFindSlot);

function updateTotalBookings() {
  totalBookingsEl.textContent = totalBookings;
}

function handleFormSubmit(event) {
  event.preventDefault();
  const userName = event.target.userName.value;
  const seatNumber = event.target.seatNumber.value;

  axios
    .get(
      `https://crudcrud.com/api/8acff4110e4b4a71b8d585b13df70516/Appointments?seatNumber=${seatNumber}`
    )
    .then((result) => {
      const existingBooking = result.data.find(
        (obj) => obj.seatNumber === seatNumber
      );
      if (existingBooking) {
        alert(`Seat ${seatNumber} is already booked.`);
      } else {
        const obj = { userName, seatNumber };

        axios
          .post(
            "https://crudcrud.com/api/8acff4110e4b4a71b8d585b13df70516/Appointments",
            obj
          )
          .then((result) => {
            showRecordsOnScreen(result.data);
            totalBookings++;
            updateTotalBookings();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  document.getElementById("userName").value = "";
  document.getElementById("seatNumber").value = "";
}

window.addEventListener("DOMContentLoaded", function () {
  axios
    .get(
      "https://crudcrud.com/api/8acff4110e4b4a71b8d585b13df70516/Appointments"
    )
    .then((result) => {
      const arrayOfObj = result.data;
      totalBookings = arrayOfObj.length;
      arrayOfObj.forEach(showRecordsOnScreen);
      updateTotalBookings();
    })
    .catch((err) => {
      console.log(err);
    });
});

function showRecordsOnScreen(obj) {
  const records = document.getElementById("records");

  const list = document.createElement("li");
  list.innerHTML = `${obj.userName} - Seat: ${obj.seatNumber}`;

  const delBtn = document.createElement("button");
  delBtn.innerHTML = "Delete";
  delBtn.addEventListener("click", () => {
    axios
      .delete(
        `https://crudcrud.com/api/8acff4110e4b4a71b8d585b13df70516/Appointments/${obj._id}`
      )
      .then(() => {
        records.removeChild(list);
        totalBookings--;
        updateTotalBookings();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  list.appendChild(delBtn);

  const editBtn = document.createElement("button");
  editBtn.innerHTML = "Edit";
  editBtn.addEventListener("click", () => {
    document.getElementById("userName").value = obj.userName;
    document.getElementById("seatNumber").value = obj.seatNumber;

    axios
      .delete(
        `https://crudcrud.com/api/8acff4110e4b4a71b8d585b13df70516/Appointments/${obj._id}`
      )
      .then(() => {
        records.removeChild(list);
        totalBookings--;
        updateTotalBookings();
      })
      .catch((err) => {
        console.log(err);
      });
  });
  list.appendChild(editBtn);

  records.appendChild(list);
}

function handleFindSlot(event) {
  event.preventDefault();
  const seatNumber = document.getElementById("findSlot").value;

  axios
    .get(
      "https://crudcrud.com/api/8acff4110e4b4a71b8d585b13df70516/Appointments"
    )
    .then((result) => {
      const arrayOfObj = result.data;
      const filteredResults = arrayOfObj.filter(
        (obj) => obj.seatNumber === seatNumber
      );
      document.getElementById("records").innerHTML = "";
      filteredResults.forEach(showRecordsOnScreen);
    })
    .catch((err) => {
      console.log(err);
    });
}
