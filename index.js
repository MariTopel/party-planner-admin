// === Constants ===
const BASE = "https://fsa-crud-2aa9294fe819.herokuapp.com/api";
const COHORT = "/2504-FTB-ET-WEB-PT";
const API = BASE + COHORT;

// === State ===
let parties = [];
let selectedParty;
let rsvps = [];
let guests = [];

/** Updates state with all parties from the API */
async function getParties() {
  try {
    const response = await fetch(API + "/events");
    const result = await response.json();
    parties = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with a single party from the API */
async function getParty(id) {
  try {
    const response = await fetch(API + "/events/" + id);
    const result = await response.json();
    selectedParty = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all RSVPs from the API */
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const result = await response.json();
    rsvps = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

/** Updates state with all guests from the API */
async function getGuests() {
  try {
    const response = await fetch(API + "/guests");
    const result = await response.json();
    guests = result.data;
    render();
  } catch (e) {
    console.error(e);
  }
}

// === Components ===

/** Party name that shows more details about the party when clicked */
function PartyListItem(party) {
  const $li = document.createElement("li");

  if (party.id === selectedParty?.id) {
    $li.classList.add("selected");
  }

  $li.innerHTML = `
    <a href="#selected">${party.name}</a>
  `;
  $li.addEventListener("click", () => getParty(party.id));
  return $li;
}

/** A list of names of all parties */
function PartyList() {
  const $ul = document.createElement("ul");
  $ul.classList.add("parties");

  const $parties = parties.map(PartyListItem);
  $ul.replaceChildren(...$parties);

  return $ul;
}

/** Detailed information about the selected party */
function SelectedParty() {
  if (!selectedParty) {
    const $p = document.createElement("p");
    $p.textContent = "Please select a party to learn more.";
    return $p;
  }

  const $party = document.createElement("section");
  $party.innerHTML = `
    <h3>${selectedParty.name} #${selectedParty.id}</h3>
    <time datetime="${selectedParty.date}">
      ${selectedParty.date.slice(0, 10)}
    </time>
    <address>${selectedParty.location}</address>
    <p>${selectedParty.description}</p>
    <GuestList></GuestList>
  `;
  $party.querySelector("GuestList").replaceWith(GuestList());

  // adds delete button
  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete Party";
  $party.appendChild(deleteButton);

  deleteButton.addEventListener("click", async (deletBut) => {
    try {
      // sends the delete to the API. the api is where the data is stored
      await fetch(API + "/events/" + selectedParty.id, {
        method: "DELETE",
      });

      // clears the selectedParty function and re fetches the api list?
      selectedParty = null;
      await getParties();
    } catch (error) {
      console.error("not able to delete party", error);
    }
  });

  return $party;
}

/** List of guests attending the selected party */
function GuestList() {
  const $ul = document.createElement("ul");
  const guestsAtParty = guests.filter((guest) =>
    rsvps.find(
      (rsvp) => rsvp.guestId === guest.id && rsvp.eventId === selectedParty.id
    )
  );

  // Simple components can also be created anonymously:
  const $guests = guestsAtParty.map((guest) => {
    const $guest = document.createElement("li");
    $guest.textContent = guest.name;
    return $guest;
  });
  $ul.replaceChildren(...$guests);

  return $ul;
}

//function for making the party form
function partyForm() {
  //makes container for the form
  const form = document.createElement("form");

  // NAME
  //this makes a wrapper for the name feild
  const nameForm = document.createElement("div");
  // makes the label and set text to label
  const nameLabel = document.createElement("label"); //remember that javascript is matching what I put in quotes to what it already knows to html. So like it doesn't have a premade thing for this. It just is inputting <label> and html just so happens to also have a meaning for <label>
  nameLabel.textContent = "Name";
  //makes <input> for the name form
  const nameInput = document.createElement("input"); // i am typing in input and HTML just so happens to have a thing for <input> but if i just put "blarp" it woud not work
  nameInput.name = "name"; // for late use when fetching data
  nameInput.required = true; // this checks to make sure the user has to put something there

  // this appends the input to inside the label section
  nameLabel.appendChild(nameInput);
  // this appends the form into the div that holds the label. if i am imagining this correctly
  nameForm.appendChild(nameLabel);
  // this appends the div that holds the label into the form??
  form.appendChild(nameForm);

  //DESCRIPTION
  // make a wrapper and so forth for the description feild
  const descForm = document.createElement("div");
  const descLabel = document.createElement("label");
  descLabel.textContent = "Description";
  const descInput = document.createElement("input"); // can also use <textarea> to have a multi line description but I don't want to go outside my comfort zone.
  descInput.name = "description"; //this is for later use when i need to fetch this data
  descInput.required = true; //forces user to fill out

  descLabel.appendChild(descInput);
  descForm.appendChild(descLabel);
  form.appendChild(descForm); // this process of inside of an inside is hard for me. need to practice more. maybe use neopets idea.

  // DATE
  // create date part of the form
  const dateForm = document.createElement("div");
  const dateLabel = document.createElement("label");
  dateLabel.textContent = "Date";
  const dateInput = document.createElement("input");
  dateInput.type = "date"; //makes it so you use a date picker in the browser.
  dateInput.name = "date"; //for later use when fetching data
  dateInput.required = true; // forces user to fill out date

  // appends the different parts into each other for the form. nest input into label. label into wrapper. wrapper into form.
  //  form(wrapper(label(input)))
  dateLabel.appendChild(dateInput);
  dateForm.appendChild(dateLabel);
  form.appendChild(dateForm);

  // LOCATION
  // create location part of the form
  const locationForm = document.createElement("div");
  const locationLabel = document.createElement("label");
  locationLabel.textContent = "Location";

  const locationInput = document.createElement("input");
  locationInput.name = "location";
  locationInput.required = true;

  locationLabel.appendChild(locationInput);
  locationForm.appendChild(locationLabel);
  form.appendChild(locationForm);

  // create button that will capture the data when clicked. a submit button
  const submitButton = document.createElement("Button");
  submitButton.type = "submit"; //pre known javascript thing that makes the button submit
  submitButton.textContent = "Add Party!";
  form.appendChild(submitButton);

  //adding event listener and the ability to get the information from the form
  form.addEventListener("submit", async (f) => {
    f.preventDefault(); //apparently stops the page from reloading

    // gets info from form and makes them values
    const formData = new FormData(form);
    const name = formData.get("name");
    const description = formData.get("description");
    const dateValue = formData.get("date");
    const location = formData.get("location");

    // makes data into a string that can be used. ISO?
    const isoDate = new Date(dateValue).toISOString();

    try {
      // post request???
      const response = await fetch(API + "/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          date: isoDate,
          location,
        }),
      });
      const { data } = await response.json();

      // clears the form
      form.reset();
      await getParties();
    } catch (error) {
      console.error("couldn't create party", error);
    }
  });

  return form;
}

const form = partyForm();

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Party Planner</h1>
    <main>
      <section>
        <h2>Upcoming Parties</h2>
        <PartyList></PartyList>
      </section>
      <section id="selected">
        <h2>Party Details</h2>
        <SelectedParty></SelectedParty>
      </section>
    </main>
  `;

  $app.querySelector("PartyList").replaceWith(PartyList());
  $app.querySelector("SelectedParty").replaceWith(SelectedParty());
  // this adds the form to the rendering of the page.
  $app.appendChild(form);
}

async function init() {
  await getParties();
  await getRsvps();
  await getGuests();
  render();
}

init();
