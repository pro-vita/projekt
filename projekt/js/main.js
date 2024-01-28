"use strict";

import { Databaze } from "./databaze.js";
import { SpravaPojistencu } from "./spravaPojistencu.js";

const databaze = new Databaze();
const spravaPojistencu = new SpravaPojistencu();
spravaPojistencu._napojeniEventListeneru();
spravaPojistencu._getTime();



