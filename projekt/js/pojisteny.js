"use strict";

export class Pojisteny {
  constructor(_jmeno, _prijmeni, _vek, _telefon, _id) {
    this._jmeno = _jmeno;
    this._prijmeni = _prijmeni;
    this._vek = _vek;
    this._telefon = _telefon;
    this._id = Math.trunc(Math.random() * 1000000);
  }

  toString() {
    return `${this.celeJmeno} Věk:${this._vek} Telefon:${this._telefon} id:${this._id}`;
  }
}
