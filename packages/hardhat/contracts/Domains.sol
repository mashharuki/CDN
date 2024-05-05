//SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "hardhat/console.sol";
import {StringUtils} from "./lib/StringUtils.sol";
import {Base64} from "./lib/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * Domains Cotract
 */
contract Domains is ERC721URIStorage {
  // トークンID用の変数を用意する。
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  // NFT用のイメージデータ
  string svgPartOne =
    '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = "</text></svg>";

  // トップレベルドメイン(TLD)
  string public tld;
  // owner address
  address payable public owner;

  // ドメインとアドレスを紐づけるmap
  mapping(string => address) public domains;
  // ENSとURL等のデータを紐づけるmap
  mapping(string => string) public records;
  // IDとドメイン名を紐づけるマmap
  mapping(uint => string) public names;

  // event
  event Register(address owner, string name);
  event SetRecord(address owner, string name ,string record);

  // カスタムエラー用の変数
  error Unauthorized();
  error AlreadyRegistered();
  error InvalidName(string name);

  // ownerであることを確認する修飾子
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  /**
   * コンストラクター
   * @param _tld トップレベルドメイン
   */
  constructor(
    string memory _tld
  ) payable ERC721("CrossValueChain Domain Name Service", "CDN") {
    // owner addressを設定する。
    owner = payable(msg.sender);
    tld = _tld;
    console.log("%s name service deployed", _tld);
  }

  /**
   * ドメインの長さによって価格を算出するメソッド
   * @param name ドメイン名
   */
  function price(string calldata name) public pure returns (uint) {
    // ドメインの長さを算出する。
    uint len = StringUtils.strlen(name);
    // 長さによって値が変更する。
    require(len > 0);
    if (len == 3) {
      // 3文字のドメインの場合
      return 0.001 * 10 ** 18; // 0.005 MATIC = 5 000 000 000 000 000 000 (18ケタ).
    } else if (len == 4) {
      //4文字のドメインの場合
      return 0.003 * 10 ** 18; // 0.003MATIC
    } else {
      // 4文字以上
      return 0.005 * 10 ** 18; // 0.001MATIC
    }
  }

  /**
   * ドメインを登録するためのメソッド
   * @param name ドメイン名
   */
  function register(string calldata name) public payable {
    // そのドメインがまだ登録されていないか確認します。
    if (domains[name] != address(0)) revert AlreadyRegistered();
    // 適切な長さであるかチェックする。
    if (!valid(name)) revert InvalidName(name);

    // ドメイン名のミントに必要な金額を算出する。
    uint _price = price(name);
    // 十分な残高を保有しているかどうかチェックする。
    require(msg.value >= _price, "Not enough XCR paid");

    // ネームとTLD(トップレベルドメイン)を結合する。
    string memory _name = string(abi.encodePacked(name, ".", tld));
    // NFT用にSVGイメージを作成します。
    string memory finalSvg = string(
      abi.encodePacked(svgPartOne, _name, svgPartTwo)
    );
    //　トークンIDを取得する。
    uint256 newRecordId = _tokenIds.current();
    // 長さを取得する。
    uint256 length = StringUtils.strlen(name);
    string memory strLen = Strings.toString(length);

    console.log(
      "Registering %s.%s on the contract with tokenID %d",
      name,
      tld,
      newRecordId
    );

    // SVGのデータをBase64の形式でエンコードする。
    string memory json = Base64.encode(
      abi.encodePacked(
        '{"name": "',
        _name,
        '", "description": "A domain on the CrossValueChain Domain name service", "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(finalSvg)),
        '","length":"',
        strLen,
        '"}'
      )
    );
    // トークンURI用のデータを生成する。
    string memory finalTokenUri = string(
      abi.encodePacked("data:application/json;base64,", json)
    );

    console.log("\n--------------------------------------------------------");
    console.log("Final tokenURI", finalTokenUri);
    console.log("--------------------------------------------------------\n");

    // NFTとして発行する。
    _safeMint(msg.sender, newRecordId);
    // トークンURI情報を登録する。
    _setTokenURI(newRecordId, finalTokenUri);

    // 登録する。
    domains[name] = msg.sender;
    // namesにも登録する。
    names[newRecordId] = name;
    _tokenIds.increment();
    emit Register(msg.sender, name);
  }

  /**
   * ドメイン名をキーとしてアドレスを取得するメソッド
   * @param name ドメイン名
   */
  function getAddress(string calldata name) public view returns (address) {
    return domains[name];
  }

  /**
   * レコードを登録する
   * @param name ドメイン名
   * @param record ENSと紐づけるデータ
   */
  function setRecord(string calldata name, string calldata record) public {
    // トランザクションの送信者であることを確認しています。
    if (msg.sender != domains[name]) revert Unauthorized();
    // 登録する。
    records[name] = record;
    emit SetRecord(msg.sender, name , record);
  }

  /**
   * checkRegistered メソッド
   */
  function checkRegistered(string memory _name) public view returns (bool) {
    if(domains[_name] == address(0)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * ENSを元にデータを返すメソッド
   * @param name ドメイン名
   */
  function getRecord(string calldata name) public view returns (string memory) {
    return records[name];
  }

  /**
   * owner addressであることを確認するメソッド
   */
  function isOwner() public view returns (bool) {
    return msg.sender == owner;
  }

  /**
   * 資金を引き出すためのメソッド
   */
  function withdraw() public onlyOwner {
    // コントラクトの残高を取得する。
    uint amount = address(this).balance;
    // 呼び出し元のアドレスに送金する。
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to withdraw Matic");
  }

  /**
   * 全てのドメイン名のデータを取得するメソッド
   */
  function getAllNames() public view returns (string[] memory) {
    console.log("Getting all names from contract");
    // ドメイン名を格納するための配列を定義する。
    string[] memory allNames = new string[](_tokenIds.current());
    // ループ文により配列を作成してドメイン情報を詰めていく。
    for (uint i = 0; i < _tokenIds.current(); i++) {
      allNames[i] = names[i];
      console.log("Name for token %d is %s", i, allNames[i]);
    }
    // 返却する。
    return allNames;
  }

  /**
   * ドメインの長さが適切かチェックするためのメソッド
   */
  function valid(string calldata name) private pure returns (bool) {
    return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 10;
  }
}
