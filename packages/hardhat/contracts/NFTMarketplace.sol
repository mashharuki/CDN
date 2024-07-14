// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDomains.sol";
import "hardhat/console.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
  // リスティング情報
  struct Listing {
    uint256 tokenId;
    address seller;
  }

  address public domainsContractAddress;
  uint256[] public listedTokenIds;

  mapping(uint256 => Listing) public listings;

  event Listed(uint256 indexed tokenId, address indexed seller);
  event Canceled(uint256 indexed tokenId, address indexed seller);
  event Sold(uint256 indexed tokenId, address indexed buyer, uint256 price);
  event Received(address indexed sender, uint256 amount);
  event FallbackReceived(address indexed sender, uint256 amount);

  /**
   * コンストラクター
   */
  constructor() Ownable(msg.sender) {}

  /**
   * Domainsコントラクトのアドレスを設定するためのメソッド
   * @param _domainsContractAddress ドメインコントラクトのアドレス
   */
  function setDomainsContract(
    address _domainsContractAddress
  ) external onlyOwner {
    domainsContractAddress = _domainsContractAddress;
  }

  /**
   * NFTをリストするためのメソッド
   * @param tokenId リストするトークンID
   */
  function listItem(uint256 tokenId) external nonReentrant {
    require(
      IDomains(domainsContractAddress).getApproved(tokenId) == address(this),
      "Marketplace not approved"
    );

    listings[tokenId] = Listing({tokenId: tokenId, seller: msg.sender});
    listedTokenIds.push(tokenId);

    emit Listed(tokenId, msg.sender);
  }

  /**
   * NFTを購入するためのメソッド
   * @param tokenId 購入するトークンID
   * @param name ドメイン名
   * @param duration 有効期間（年単位）
   */
  function buyItem(
    uint256 tokenId,
    string calldata name,
    uint256 duration
  ) external payable nonReentrant {
    Listing memory listing = listings[tokenId];
    console.log("listing.seller: %s", listing.seller);
    require(listing.seller != address(0), "Item not listed");

    uint256 totalPrice = IDomains(domainsContractAddress).price(name, duration);
    require(msg.value >= totalPrice, "Not enough Ether sent");

    address seller = listing.seller;

    // アドレスとドメインの紐付けを更新
    IDomains(domainsContractAddress).updateAddress(
      name,
      msg.sender,
      tokenId,
      duration
    );

    // NFTの所有権を新しい所有者に移動
    IDomains(domainsContractAddress).safeTransferFrom(
      address(this),
      msg.sender,
      tokenId
    );

    // 販売者に支払いを送信
    payable(seller).transfer(totalPrice);

    // リストから削除
    delete listings[tokenId];
    removeTokenId(tokenId);

    emit Sold(tokenId, msg.sender, totalPrice);
  }

  /**
   * NFTのリストをキャンセルするためのメソッド
   * @param tokenId キャンセルするトークンID
   */
  function cancelListing(uint256 tokenId) external nonReentrant {
    Listing memory listing = listings[tokenId];
    require(listing.seller == msg.sender, "You are not the seller");

    // リストから削除
    delete listings[tokenId];
    removeTokenId(tokenId);

    emit Canceled(tokenId, msg.sender);
  }

  /**
   * マーケットプレイスの収益を引き出すためのメソッド
   */
  function withdraw() external onlyOwner {
    uint256 amount = address(this).balance;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success, "Failed to withdraw Ether");
  }

  /**
   * NFTのリスト情報を取得するためのメソッド
   * @param tokenId リスト情報を取得するトークンID
   */
  function getListing(uint256 tokenId) external view returns (Listing memory) {
    return listings[tokenId];
  }

  /**
   * 全てのリスト情報を取得するためのメソッド
   */
  function getAllListings() external view returns (Listing[] memory) {
    Listing[] memory allListings = new Listing[](listedTokenIds.length);
    for (uint256 i = 0; i < listedTokenIds.length; i++) {
      allListings[i] = listings[listedTokenIds[i]];
    }
    return allListings;
  }

  /**
   * listings 一覧から指定したトークンIDのデータを削除するメソッド
   */
  function removeTokenId(uint256 tokenId) internal {
    for (uint256 i = 0; i < listedTokenIds.length; i++) {
      if (listedTokenIds[i] == tokenId) {
        listedTokenIds[i] = listedTokenIds[listedTokenIds.length - 1];
        listedTokenIds.pop();
        break;
      }
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
