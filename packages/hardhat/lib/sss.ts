import fs from "fs";
import * as sss from "shamirs-secret-sharing";

/**
 * create shares
 * @return shares Array of Buffer
 */
export function createShares() {
  console.log(
    `========================== [START: createshare] ==========================`
  );
  // get Secret Key from file
  const secret = process.env.RELAYER_PRIVATE_KEY;
  // create shares(3つに分割)
  // 閾値は2に設定
  const shares = sss.split(secret, {shares: 3, threshold: 2});
  //console.log("shares:", shares);

  // output
  for (let i = 0; i < shares.length; i++) {
    fs.writeFileSync(`./data/shares${i + 1}.txt`, shares[i], "utf-8");
  }
  console.log(
    `========================== [END: createshare] ==========================`
  );
}

/**
 * recovered relayer's private key
 */
export function recover(): string {
  console.log(
    `========================== [START: recover] ==========================`
  );

  const shareDatas = [];

  // get shares
  const share1 = fs.readFileSync("./data/shares1.txt");
  const share2 = fs.readFileSync("./data/shares2.txt");
  const share3 = fs.readFileSync("./data/shares3.txt");

  shareDatas.push(share1);
  shareDatas.push(share2);
  shareDatas.push(share3);

  // recovered by shares
  const recovered = sss.combine(shareDatas.slice(1, 3));

  console.log(
    `========================== [END: recover] ==========================`
  );

  return recovered.toString();
}
