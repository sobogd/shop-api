import log4js from "log4js";

const initLoger = log4js.getLogger();
initLoger.level = "debug";

export const logger = initLoger;
