import "dotenv/config";
import {task} from "hardhat/config";
import {createShares} from "../lib/sss";

task("createShares", "createShares").setAction(async () => {
  // generate secret
  createShares();
});
