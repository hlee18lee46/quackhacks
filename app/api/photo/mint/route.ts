import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import FormData from "form-data";
import bs58 from "bs58";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  generateSigner,
  keypairIdentity,
  percentAmount,
  publicKey,
} from "@metaplex-foundation/umi";
import {
  mplTokenMetadata,
  createNft,
} from "@metaplex-foundation/mpl-token-metadata";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    const recipientWallet = form.get("recipientWallet") as string | null;
    const photo = form.get("photo") as File | null;

    const petName = (form.get("petName") as string | null) || "Puppie";
    const walkDistanceMiles =
      (form.get("walkDistanceMiles") as string | null) || "0";
    const durationMinutes =
      (form.get("durationMinutes") as string | null) || "0";
    const locationName =
      (form.get("locationName") as string | null) || "Unknown location";

    if (!recipientWallet) {
      return NextResponse.json(
        { success: false, error: "recipientWallet is required" },
        { status: 400 }
      );
    }

    if (!photo) {
      return NextResponse.json(
        { success: false, error: "photo is required" },
        { status: 400 }
      );
    }

    const pinataJwt = process.env.PINATA_JWT;
    const solanaPrivateKey = process.env.SOLANA_PRIVATE_KEY_BASE58;

    if (!pinataJwt || !solanaPrivateKey) {
      return NextResponse.json(
        { success: false, error: "Missing Pinata or Solana environment keys" },
        { status: 500 }
      );
    }

    const pinataGateway =
      process.env.PINATA_GATEWAY || "https://gateway.pinata.cloud/ipfs";
    const rpcUrl =
      process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";

    const normalizedGateway = pinataGateway.replace(/\/+$/, "");

    // 1. Upload AR walk photo to Pinata/IPFS
    const buffer = Buffer.from(await photo.arrayBuffer());

    const uploadForm = new FormData();
    uploadForm.append("file", buffer, {
      filename: photo.name || "walkie-puppie-memory.png",
      contentType: photo.type || "image/png",
    });

    const pinataFileRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      uploadForm,
      {
        headers: {
          ...uploadForm.getHeaders(),
          Authorization: `Bearer ${pinataJwt}`,
        },
      }
    );

    const imageCID = pinataFileRes.data.IpfsHash;
    const imageUrl = `${normalizedGateway}/${imageCID}`;

    // 2. Create Walkie Puppie NFT metadata
    const nftName = `${petName}'s Walk Memory`;

    const metadata = {
      name: nftName,
      symbol: "WALKIE",
      description: `A Walkie Puppie AR memory NFT from a real walk with ${petName}.`,
      seller_fee_basis_points: 0,
      image: imageUrl,
      properties: {
        files: [
          {
            uri: imageUrl,
            type: photo.type || "image/png",
          },
        ],
        category: "image",
      },
      attributes: [
        { trait_type: "App", value: "Walkie Puppie" },
        { trait_type: "Pet Name", value: petName },
        { trait_type: "Walk Distance Miles", value: walkDistanceMiles },
        { trait_type: "Duration Minutes", value: durationMinutes },
        { trait_type: "Location", value: locationName },
        { trait_type: "Memory Type", value: "AR Pet Walk Photo" },
        { trait_type: "Created At", value: new Date().toISOString() },
      ],
    };

    const pinataJsonRes = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          Authorization: `Bearer ${pinataJwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    const metadataCID = pinataJsonRes.data.IpfsHash;
    const metadataUri = `${normalizedGateway}/${metadataCID}`;

    // 3. Mint Solana NFT
    const secretKey = bs58.decode(solanaPrivateKey);

    const umi = createUmi(rpcUrl).use(mplTokenMetadata());
    const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);

    umi.use(keypairIdentity(umiKeypair));

    const mint = generateSigner(umi);

    const result = await createNft(umi, {
      mint,
      name: nftName,
      symbol: "WALKIE",
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(0),
      tokenOwner: publicKey(recipientWallet),
    }).sendAndConfirm(umi);

    const mintAddress = mint.publicKey.toString();
    const signature = bs58.encode(result.signature);

    return NextResponse.json({
      success: true,
      nftName,
      petName,
      walkDistanceMiles,
      durationMinutes,
      locationName,
      mintAddress,
      signature,
      imageUrl,
      metadataUri,
      explorer: `https://explorer.solana.com/address/${mintAddress}?cluster=devnet`,
    });
  } catch (error: any) {
    console.error("Walkie Puppie mint photo NFT error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || String(error),
      },
      { status: 500 }
    );
  }
}