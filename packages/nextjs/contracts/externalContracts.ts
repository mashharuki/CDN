import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  5555: {
    CDH: {
      address: "0xb2531b6730084CafE595d4579251b9983FADc717",
      abi: [
        {
          inputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "string",
              name: "symbol",
              type: "string",
            },
            {
              internalType: "address",
              name: "_erc6551Registry",
              type: "address",
            },
            {
              internalType: "address",
              name: "_erc6551Account",
              type: "address",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "AlreadyOwnsNFT",
          type: "error",
        },
        {
          inputs: [],
          name: "ERC721EnumerableForbiddenBatchMint",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC721IncorrectOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ERC721InsufficientApproval",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "approver",
              type: "address",
            },
          ],
          name: "ERC721InvalidApprover",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "ERC721InvalidOperator",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "ERC721InvalidOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "receiver",
              type: "address",
            },
          ],
          name: "ERC721InvalidReceiver",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "sender",
              type: "address",
            },
          ],
          name: "ERC721InvalidSender",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ERC721NonexistentToken",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "ERC721OutOfBoundsIndex",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
          ],
          name: "FieldNameAlreadyExists",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
          ],
          name: "FieldNameDoesNotExist",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "string",
              name: "fieldName",
              type: "string",
            },
          ],
          name: "InvalidFieldName",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
          ],
          name: "MetadataAlreadyExists",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
          ],
          name: "MetadataDoesNotExist",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "invalidOwner",
              type: "address",
            },
            {
              internalType: "address",
              name: "fieldOwner",
              type: "address",
            },
          ],
          name: "NotFieldOwner",
          type: "error",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "NotTokenOwnerOrPermitted",
          type: "error",
        },
        {
          inputs: [],
          name: "SoulboundToken",
          type: "error",
        },
        {
          inputs: [],
          name: "UnauthorizedCaller",
          type: "error",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "approved",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "ApprovalForAll",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              indexed: true,
              internalType: "address",
              name: "editor",
              type: "address",
            },
            {
              indexed: false,
              internalType: "bool",
              name: "permission",
              type: "bool",
            },
          ],
          name: "EditorPermissionChanged",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "fieldValue",
              type: "string",
            },
          ],
          name: "MetadataAdded",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              indexed: false,
              internalType: "string",
              name: "newValue",
              type: "string",
            },
          ],
          name: "MetadataUpdated",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              indexed: true,
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "fieldValue",
              type: "string",
            },
          ],
          name: "addMetadata",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          name: "balanceOf",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "burn",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "chainId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "eoaToTbaAccount",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "eoaToTokenId",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "erc6551Account",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "erc6551Registry",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "fieldNames",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "fieldOwners",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "fields",
          outputs: [
            {
              internalType: "string",
              name: "name",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "number",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "getApproved",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "from",
              type: "uint256",
            },
          ],
          name: "getFields",
          outputs: [
            {
              components: [
                {
                  internalType: "string",
                  name: "name",
                  type: "string",
                },
                {
                  internalType: "uint256",
                  name: "number",
                  type: "uint256",
                },
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
              ],
              internalType: "struct ICDH.Field[]",
              name: "",
              type: "tuple[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
          ],
          name: "getMetadata",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "from",
              type: "uint256",
            },
          ],
          name: "getOwners",
          outputs: [
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
            {
              internalType: "address[]",
              name: "",
              type: "address[]",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
          ],
          name: "isApprovedForAll",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "metadatas",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "ownerOf",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "permittedEditors",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "fieldName",
              type: "string",
            },
          ],
          name: "registerFieldName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "string",
              name: "uri",
              type: "string",
            },
          ],
          name: "safeMint",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "bytes",
              name: "_data",
              type: "bytes",
            },
          ],
          name: "safeTransferFrom",
          outputs: [],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "operator",
              type: "address",
            },
            {
              internalType: "bool",
              name: "approved",
              type: "bool",
            },
          ],
          name: "setApprovalForAll",
          outputs: [],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "address",
              name: "editor",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "permission",
              type: "bool",
            },
          ],
          name: "setPermittedEditor",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bytes4",
              name: "interfaceId",
              type: "bytes4",
            },
          ],
          name: "supportsInterface",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "tokenByIndex",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "tokenIdToTbaAccount",
          outputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          name: "tokenMetadatas",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "index",
              type: "uint256",
            },
          ],
          name: "tokenOfOwnerByIndex",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "tokenURI",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              internalType: "address",
              name: "to",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [],
          stateMutability: "pure",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newFieldName",
              type: "string",
            },
          ],
          name: "updateFieldName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "tokenId",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "fieldNumber",
              type: "uint256",
            },
            {
              internalType: "string",
              name: "newValue",
              type: "string",
            },
          ],
          name: "updateMetadata",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      inheritedFunctions: {
        addMetadata: "contracts/interfaces/ICDH.sol",
        eoaToTbaAccount: "contracts/interfaces/ICDH.sol",
        eoaToTokenId: "contracts/interfaces/ICDH.sol",
        fieldNames: "contracts/interfaces/ICDH.sol",
        fieldOwners: "contracts/interfaces/ICDH.sol",
        getMetadata: "contracts/interfaces/ICDH.sol",
        metadatas: "contracts/interfaces/ICDH.sol",
        permittedEditors: "contracts/interfaces/ICDH.sol",
        registerFieldName: "contracts/interfaces/ICDH.sol",
        safeMint: "contracts/interfaces/ICDH.sol",
        setPermittedEditor: "contracts/interfaces/ICDH.sol",
        tokenIdToTbaAccount: "contracts/interfaces/ICDH.sol",
        tokenMetadatas: "contracts/interfaces/ICDH.sol",
        tokenURI: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        updateFieldName: "contracts/interfaces/ICDH.sol",
        updateMetadata: "contracts/interfaces/ICDH.sol",
        approve: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        balanceOf: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        getApproved: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        isApprovedForAll: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        name: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        ownerOf: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        safeTransferFrom: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        setApprovalForAll: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        supportsInterface: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        symbol: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        transferFrom: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
        tokenByIndex: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol",
        tokenOfOwnerByIndex: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol",
        totalSupply: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol",
        burn: "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol",
      },
    },
  },
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
