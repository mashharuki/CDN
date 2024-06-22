//SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

import "hardhat/console.sol";
import {StringUtils} from "./lib/StringUtils.sol";
import {Base64} from "./lib/Base64.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/metatx/ERC2771Context.sol";
import "./interfaces/INFTMarketplace.sol";

/**
 * Domains Cotract
 */
contract Domains is ERC721URIStorage, ERC2771Context {
  // トークンID用の変数を用意する。
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  // NFT用のイメージデータ
  string svgPartOne =
    '<svg xmlns="http://www.w3.org/2000/svg" width="270" height="270" fill="none"><path fill="url(#B)" d="M0 0h270v270H0z"/><defs><filter id="A" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse" height="270" width="270"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity=".225" width="200%" height="200%"/></filter></defs><path d="M72.863 42.949c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-10.081 6.032-6.85 3.934-10.081 6.032c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-8.013-4.721a4.52 4.52 0 0 1-1.589-1.616c-.384-.665-.594-1.418-.608-2.187v-9.31c-.013-.775.185-1.538.572-2.208a4.25 4.25 0 0 1 1.625-1.595l7.884-4.59c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v6.032l6.85-4.065v-6.032c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595L41.456 24.59c-.668-.387-1.426-.59-2.197-.59s-1.529.204-2.197.59l-14.864 8.655a4.25 4.25 0 0 0-1.625 1.595c-.387.67-.585 1.434-.572 2.208v17.441c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l10.081-5.901 6.85-4.065 10.081-5.901c.668-.387 1.426-.59 2.197-.59s1.529.204 2.197.59l7.884 4.59a4.52 4.52 0 0 1 1.589 1.616c.384.665.594 1.418.608 2.187v9.311c.013.775-.185 1.538-.572 2.208a4.25 4.25 0 0 1-1.625 1.595l-7.884 4.721c-.668.387-1.426.59-2.197.59s-1.529-.204-2.197-.59l-7.884-4.59a4.52 4.52 0 0 1-1.589-1.616c-.385-.665-.594-1.418-.608-2.187v-6.032l-6.85 4.065v6.032c-.013.775.185 1.538.572 2.208a4.25 4.25 0 0 0 1.625 1.595l14.864 8.655c.668.387 1.426.59 2.197.59s1.529-.204 2.197-.59l14.864-8.655c.657-.394 1.204-.95 1.589-1.616s.594-1.418.609-2.187V55.538c.013-.775-.185-1.538-.572-2.208a4.25 4.25 0 0 0-1.625-1.595l-14.993-8.786z" fill="#fff"/><defs><linearGradient id="B" x1="0" y1="0" x2="270" y2="270" gradientUnits="userSpaceOnUse"><stop stop-color="#cb5eee"/><stop offset="1" stop-color="#0cd7e4" stop-opacity=".99"/></linearGradient></defs><text x="32.5" y="231" font-size="27" fill="#fff" filter="url(#A)" font-family="Plus Jakarta Sans,DejaVu Sans,Noto Color Emoji,Apple Color Emoji,sans-serif" font-weight="bold">';
  string svgPartTwo = "</text></svg>";
  // NFTマーケットプレイス用のアドレス
  address public marketplaceAddress;

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
  // ドメイン所有者ごとの所有ドメインを保持するマップ
  mapping(address => string[]) public ownerDomains;
  // ドメインの有効期限を管理するマップ
  mapping(uint256 => uint256) public expirationDates;

  // event
  event Register(address owner, string name);
  event SetRecord(address owner, string name, string record);
  event DomainExpired(uint256 tokenId);
  event DomainTransferred(uint256 tokenId, address newOwner);
  event Received(address indexed sender, uint256 amount);
  event FallbackReceived(address indexed sender, uint256 amount);

  // カスタムエラー用の変数
  error Unauthorized();
  error AlreadyRegistered();
  error InvalidName(string name);

  // ownerであることを確認する修飾子
  modifier onlyOwner() {
    require(isOwner());
    _;
  }

  // 有効期限が切れているかを確認する修飾子
  modifier onlyValidToken(uint256 tokenId) {
    require(expirationDates[tokenId] > block.timestamp, "Token expired");
    _;
  }

  /**
   * コンストラクター
   * @param _tld トップレベルドメイン
   */
  constructor(
    string memory _tld,
    address _trustedForwarder,
    address _marketplaceAddress
  )
    payable
    ERC721("CrossValueChain Domain Name Service", "CDN")
    ERC2771Context(_trustedForwarder)
  {
    // owner addressを設定する。
    owner = payable(msg.sender);
    tld = _tld;
    marketplaceAddress = _marketplaceAddress;
    console.log("%s name service deployed", _tld);
  }

  /**
   * ドメインの長さによって価格を算出するメソッド
   * @param name ドメイン名
   * @param _years 所有期間(年単位)
   */
  function price(
    string calldata name,
    uint256 _years
  ) public pure returns (uint) {
    // ドメインの長さを算出する。
    uint len = StringUtils.strlen(name);
    // 長さによって値が変更する。
    require(len > 0);
    if (len == 3) {
      // 3文字のドメインの場合
      return (0.001 * 10 ** 18) * _years; // 0.005 MATIC = 5 000 000 000 000 000 000 (18ケタ).
    } else if (len == 4) {
      //4文字のドメインの場合
      return (0.003 * 10 ** 18) * _years; // 0.003MATIC
    } else {
      // 4文字以上
      return (0.005 * 10 ** 18) * _years; // 0.001MATIC
    }
  }

  /**
   * ドメインを登録するためのメソッド
   * @param name ドメイン名
   * @param _years 所有期間(年単位)
   */
  function register(string calldata name, uint256 _years) public payable {
    // そのドメインがまだ登録されていないか確認します。
    if (domains[name] != address(0)) revert AlreadyRegistered();
    // 適切な長さであるかチェックする。
    if (!valid(name)) revert InvalidName(name);

    // ドメイン名のミントに必要な金額を算出する。
    uint _price = price(name, _years);
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

    // NFTとして発行する。
    _safeMint(msg.sender, newRecordId);
    // トークンURI情報を登録する。
    _setTokenURI(newRecordId, finalTokenUri);

    // 登録する。
    domains[name] = msg.sender;
    // namesにも登録する。
    names[newRecordId] = name;
    // 所有者のドメインリストに追加する。
    ownerDomains[msg.sender].push(name);
    // 有効期限を設定する。
    expirationDates[newRecordId] = block.timestamp + (_years * 365 days);

    _tokenIds.increment();
    emit Register(msg.sender, name);
  }

  /**
   * アドレスとドメインの紐付けを更新するメソッド
   * ※ ミントではなく移動させるだけの場合のメソッド
   */
  function updateAddress(
    string calldata name,
    address _address,
    uint256 _tokenId,
    uint256 _years
  ) public {
    // 登録する。
    domains[name] = _address;
    // 有効期限を設定する。
    expirationDates[_tokenId] = block.timestamp + (_years * 365 days);
    emit Register(_address, name);
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
    emit SetRecord(msg.sender, name, record);
  }

  /**
   * checkRegistered メソッド
   */
  function checkRegistered(string memory _name) public view returns (bool) {
    if (domains[_name] == address(0)) {
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
   * 所有者ごとのドメインを取得するメソッド
   */
  function getDomainsByOwner(
    address _owner
  ) public view returns (string[] memory) {
    return ownerDomains[_owner];
  }

  /**
   * 有効期限をチェックして、期限切れのドメインをburnするメソッド
   */
  function checkExpiration(uint256 tokenId) public {
    // 有効期限を過ぎていた場合はburnする。
    if (block.timestamp > expirationDates[tokenId]) {
      // NFTマーケットプレイスにdetachする。
      detach(tokenId);
      string memory expiredDomain = names[tokenId];
      delete domains[expiredDomain];
      delete names[tokenId];
      delete expirationDates[tokenId];

      emit DomainExpired(tokenId);
    }
  }

  /**
   * ドメイン所有権を別のアドレスに移行するメソッド
   * @param tokenId トークンID
   */
  function detach(uint256 tokenId) internal {
    // トランザクションの送信者が所有者であることを確認する。
    require(
      msg.sender == ownerOf(tokenId),
      "Only the owner can detach the domain"
    );

    // ドメイン名を取得する。
    string memory domainName = names[tokenId];

    // マーケットプレイスコントラクトに権限を移譲する。
    approve(marketplaceAddress, tokenId);

    // マーケットプレイスコントラクトのlistItemメソッドを呼び出す
    INFTMarketplace(marketplaceAddress).listItem(tokenId);

    // 新しい所有者にNFTを転送する。
    _transfer(msg.sender, marketplaceAddress, tokenId);

    // ドメインの所有者を更新する。
    domains[domainName] = marketplaceAddress;

    // 現在の所有者のドメインリストからドメインを削除する。
    string[] storage ownerDomainList = ownerDomains[msg.sender];
    for (uint i = 0; i < ownerDomainList.length; i++) {
      if (
        keccak256(bytes(ownerDomainList[i])) == keccak256(bytes(domainName))
      ) {
        ownerDomainList[i] = ownerDomainList[ownerDomainList.length - 1];
        ownerDomainList.pop();
        break;
      }
    }

    // 新しい所有者のドメインリストにドメインを追加する。
    ownerDomains[marketplaceAddress].push(domainName);

    emit DomainTransferred(tokenId, marketplaceAddress);
  }

  /**
   * ドメインの長さが適切かチェックするためのメソッド
   */
  function valid(string calldata name) private pure returns (bool) {
    return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 10;
  }

  ///////////////////////////////// ERC2771 method /////////////////////////////////

  function _msgSender()
    internal
    view
    virtual
    override(Context, ERC2771Context)
    returns (address sender)
  {
    if (isTrustedForwarder(msg.sender)) {
      // The assembly code is more direct than the Solidity version using `abi.decode`.
      /// @solidity memory-safe-assembly
      assembly {
        sender := shr(96, calldataload(sub(calldatasize(), 20)))
      }
    } else {
      return super._msgSender();
    }
  }

  function _msgData()
    internal
    view
    virtual
    override(Context, ERC2771Context)
    returns (bytes calldata)
  {
    if (isTrustedForwarder(msg.sender)) {
      return msg.data[:msg.data.length - 20];
    } else {
      return super._msgData();
    }
  }

  receive() external payable {
    // ETHの受け取りと処理
    emit Received(msg.sender, msg.value);
  }

  fallback() external payable {
    // ETHの受け取りと処理
    emit FallbackReceived(msg.sender, msg.value);
  }
}
