"use strict";

import { Databaze } from "./databaze.js";
import { Pojisteny } from "./pojisteny.js";

const form = document.querySelector(".form");
export class SpravaPojistencu extends Databaze {
  constructor(_jmeno, _prijmeni, _vek, _telefon, _id) {
    super(_jmeno, _prijmeni, _vek, _telefon, _id);
    this._getLocalStorage();
    // Událost  uložení a vypsání dat přes formulář
    form.addEventListener("submit", this._novyPojistenyVypis.bind(this));
  }

  _novyPojistenyVypis(e) {
    // zabrání obnově stránky po zadání dat do formuláře
    e.preventDefault();
    // Vybere elementy se kterými budeme pracovat
    const jmeno = document.querySelector("#jmeno");
    let inputJmeno = document.querySelector("#jmeno").value;
    let inputPrijmeni = document.querySelector("#prijmeni").value;
    const inputTelefon = document.querySelector("#telefon").value;
    const inputVek = document.querySelector("#vek").value;
    const submitError = document.querySelector(".submitError");

    submitError.classList.remove("hidden");
    // Pomocné regex funkce na validaci
    function _regexCZznak(string) {
      const inputRegex = /^[ěščřžýáíéóúůďťňĎŇŤŠČŘŽÝÁÍÉÚŮĚÓA-Za-z]+$/;
      return inputRegex.test(string);
    }
    function _regexCislo(num) {
      const inputRegex = /^[0-9]+$/;
      return inputRegex.test(num);
    }
    // Validace inputu
    if (
      inputJmeno === "" ||
      inputPrijmeni === "" ||
      inputVek === "" ||
      inputTelefon === ""
    ) {
      return (submitError.textContent = "Žádné pole nesmí být prázdné!");
    } else if (!_regexCZznak(inputJmeno) || !_regexCZznak(inputPrijmeni)) {
      return (submitError.textContent = "Zkontrolujte své jméno a příjmení!");
    } else if (!_regexCislo(inputTelefon) || inputTelefon.length !== 9) {
      return (submitError.textContent = "Zadejte správně svůj telefon!");
    } else if (inputVek > 100 || inputVek <= 0 || !_regexCislo(inputVek)) {
      return (submitError.textContent = "Zadejte správně svůj věk!");
    } else {
      // Korekce jména a příjmení pokud uživatel např. zadá vše malým
      inputJmeno =
        inputJmeno[0].toUpperCase() + inputJmeno.slice(1).toLowerCase().trim();
      inputPrijmeni =
        inputPrijmeni[0].toUpperCase() +
        inputPrijmeni.slice(1).toLowerCase().trim();
      // Přidání nového pojištěného do proměnné
      const pojisteny = new Pojisteny(
        inputJmeno,
        inputPrijmeni,
        inputVek,
        inputTelefon,
        this._id
      );
      pojisteny._celeJmeno = inputJmeno + " " + inputPrijmeni;
      console.log(`Děkujeme za vytvoření účtu ${pojisteny._celeJmeno} :)`);
      this._vytvorRadek(pojisteny);
      this._pridaniDoEvidence(pojisteny);
      this._vypisEvidenceKonzole();
      submitError.classList.add("hidden");
      submitError.textContent = "";
      form.reset();
      jmeno.focus();
      this._setLocalStorage();
    }
  }
  _vytvorRadek(osoba) {
    const tbody = document.querySelector("#table1 tbody");
    const html = `
      <tr data-id="${osoba._id}">
        <td class="td1">${osoba._celeJmeno}</td>
        <td class="td2">+420 ${osoba._telefon.trim()}</td>
        <td class="td3">${osoba._vek.trim()}</td>
        <td class="td-btn"><button type="button" class="btn-delete" data-id="${
          osoba._id
        }">Smazat</button></td>
      </tr>
    `;
    tbody.insertAdjacentHTML("beforeend", html);
    // Událost smazání řádku po kliknutí na delete button určitého řádku
    const btnDelete = document.querySelectorAll(".btn-delete");
    btnDelete.forEach((btn) => {
      btn.addEventListener("click", this._vymazRadek.bind(this));
    });
  }

  _vymazRadek(e) {
    // Získání dataset id z vytvořeného html
    const targetId = parseInt(e.target.dataset.id);

    // Vyhledání shody s id řádku a následné vymazání
    for (let index in this._evidence) {
      if (this._evidence[index]._id === targetId) {
        this._evidence.splice(index, 1);
        break;
      }
    }
    this._vypisEvidenceKonzole();
    this._setLocalStorage();
    e.target.parentElement.parentElement.remove();
  }
  // Napojení Event listenerů
  _napojeniEventListeneru() {
    const btnDelete = document.querySelectorAll(".btn-delete");
    btnDelete.forEach((btn) => {
      btn.addEventListener("click", this._vymazRadek.bind(this));
    });
  }
  // Doplněk - aktuální čas
  _getTime() {
    setInterval(function () {
      const time = document.querySelector(".time");
      const now = new Date();
      const hour = `${now.getHours()}`.padStart(2, 0);
      const minute = `${now.getMinutes()}`.padStart(2, 0);
      const second = `${now.getSeconds()}`.padStart(2, 0);
      const output = hour + ":" + minute + ":" + second;
      time.textContent = output;
    }, 1000);
  }
}
