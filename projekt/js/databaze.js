"use strict";

import { Pojisteny } from "./pojisteny.js";

export class Databaze extends Pojisteny {
  constructor(_jmeno, _prijmeni, _vek, _telefon, _id) {
    super(_jmeno, _prijmeni, _vek, _telefon, _id);
    this._evidence = [];
  }
  _pridaniDoEvidence(pojisteny) {
    return this._evidence.push(pojisteny);
  }
  // Uložení dat do local storage
  _setLocalStorage() {
    localStorage.setItem("_evidence", JSON.stringify(this._evidence));
  }
  // Získání dat z local storage
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("_evidence"));
    if (!data) return;
    this._evidence = data;
    // Udržení řádku s daty po obnově stránky
    function _vytvorRadek(osoba) {
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
        btn.addEventListener("click", function _vymazRadek(e) {
          // Získání dataset id z vytvořeného html
          const targetId = parseInt(e.target.dataset.id);
          // Vyhledání shody s id řádku a následné vymazání
          for (let index in this._evidence) {
            console.log(this._evidence[index]._id, targetId);
            if (this._evidence[index]._id === targetId) {
              this._evidence.splice(index, 1);
              break;
            }
          }
        });
      });
    }
    this._evidence.forEach((pojisteny) => _vytvorRadek(pojisteny));
  }
  _vypisEvidenceKonzole() {
    let vystup = "";
    let i = 0;
    for (const pojisteny of this._evidence) {
      i++;
      vystup += `Pojištěný ${i}: ${pojisteny._celeJmeno} Tel: +420 ${pojisteny._telefon}, Věk: ${pojisteny._vek} id: ${pojisteny._id} \n`;
    }
    if (vystup === "") vystup += "V evidenci není žádný pojištěný!";
    console.log(vystup);
  }
}
