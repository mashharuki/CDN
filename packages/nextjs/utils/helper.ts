/**
 * タイプスタンプをyyyy/mm/dd形式に変換するメソッド
 */
export const formatUnixTimestampBigInt = (timestamp: bigint): string => {
  // Unix タイムスタンプをミリ秒に変換
  const milliseconds = Number(timestamp) * 1000;
  const date = new Date(milliseconds);

  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // 月は0から始まるので +1
  const day = ("0" + date.getDate()).slice(-2);

  return `${year}/${month}/${day}`;
};

export const getUint48 = () => {
  // get deadline
  const currentTime = Math.floor(Date.now() / 1000);
  const futureTime = currentTime + 600;
  const uint48Time = BigInt(futureTime) % BigInt(4 ** 48);

  return uint48Time;
};
