// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Domains.sol";

contract NFTMarketplace is ReentrancyGuard, Ownable {
  // リスティング情報
  struct Listing {
    uint256 tokenId;
    address seller;
  }

  address public domainsContractAddress;
  mapping(uint256 => Listing) public listings;

  event Listed(uint256 indexed tokenId, address indexed seller);
  event Canceled(uint256 indexed tokenId, address indexed seller);
  event Sold(uint256 indexed tokenId, address indexed buyer, uint256 price);

  constructor() {}

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
      Domains(domainsContractAddress).ownerOf(tokenId) == msg.sender,
      "You are not the owner"
    );
    require(
      Domains(domainsContractAddress).getApproved(tokenId) == address(this),
      "Marketplace not approved"
    );

    listings[tokenId] = Listing({tokenId: tokenId, seller: msg.sender});

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
    require(listing.seller != address(0), "Item not listed");

    uint256 totalPrice = Domains(domainsContractAddress).price(name, duration);
    require(msg.value >= totalPrice, "Not enough Ether sent");

    address seller = listing.seller;

    // ドメインを登録する
    Domains(domainsContractAddress).register{value: totalPrice}(name, duration);

    // NFTの所有権を新しい所有者に移動
    Domains(domainsContractAddress).safeTransferFrom(
      seller,
      msg.sender,
      tokenId
    );

    // 販売者に支払いを送信
    payable(seller).transfer(totalPrice);

    // リストから削除
    delete listings[tokenId];

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
}
