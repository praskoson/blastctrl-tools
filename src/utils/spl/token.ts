import { struct, u8 } from "@solana/buffer-layout";
import {
  AccountMeta,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionInstruction,
} from "@solana/web3.js";
// import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "../constants";
import { AssociatedTokenInstruction } from "../types";

export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

/** Address of the SPL Token 2022 program */
export const TOKEN_2022_PROGRAM_ID = new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb");

/** Address of the SPL Associated Token Account program */
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
);

/** TODO: docs */
export interface CreateInstructionData {
  instruction: AssociatedTokenInstruction.Create;
}

export interface CreateIdempotentInstructionData {
  instruction: AssociatedTokenInstruction.CreateIdempotent;
}
export interface RecoverNestedInstructionData {
  instruction: AssociatedTokenInstruction.RecoverNested;
}

export const createInstructionData = struct<CreateInstructionData>([u8("instruction")]);
export const createIdempotentInstructionData = struct<CreateIdempotentInstructionData>([
  u8("instruction"),
]);
export const recoverNestedInstructionData = struct<RecoverNestedInstructionData>([
  u8("instruction"),
]);

/**
 * Construct an AssociatedTokenAccount instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data: Buffer.alloc(0),
  });
}

/**
 * Constructs a CreateIdempotent instruction
 *
 * @param payer                    Payer of the initialization fees
 * @param associatedToken          New associated token account
 * @param owner                    Owner of the new account
 * @param mint                     Token mint account
 * @param programId                SPL Token program account
 * @param associatedTokenProgramId SPL Associated Token program account
 *
 * @returns Instruction to add to a transaction
 */
export function createIdempotentAssociatedTokenAccountInstruction(
  payer: PublicKey,
  associatedToken: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys: Array<AccountMeta> = [
    { pubkey: payer, isSigner: true, isWritable: true },
    { pubkey: associatedToken, isSigner: false, isWritable: true },
    { pubkey: owner, isSigner: false, isWritable: false },
    { pubkey: mint, isSigner: false, isWritable: false },
    { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    { pubkey: programId, isSigner: false, isWritable: false },
    { pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(createIdempotentInstructionData.span);
  createIdempotentInstructionData.encode(
    { instruction: AssociatedTokenInstruction.CreateIdempotent },
    data
  );

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data,
  });
}

/**
 * Constructs a RecoverNested instruction
 *
 * @param owner                      Owner of the associated token account
 * @param nestedAssociatedToken      Nested ATA, owned by the ownerAssociatedToken
 * @param nestedTokenMintAddress     Token mint for the nested ATA
 * @param destinationAssociatedToken The wallet's ATA, where the nested funds will be transferred
 * @param ownerAssociatedToken       ATA that owns the nested account, and is owned by the owner
 * @param ownerTokenMintAddress      Token mint for the owner ATA
 * @param programId                  SPL Token program account
 * @param associatedTokenProgramId   SPL Associated Token program account
 */
export function createRecoverNestedTokenAccountInstruction(
  owner: PublicKey,
  nestedAssociatedToken: PublicKey,
  nestedTokenMintAddress: PublicKey,
  destinationAssociatedToken: PublicKey,
  ownerAssociatedToken: PublicKey,
  ownerTokenMintAddress: PublicKey,
  programId = TOKEN_PROGRAM_ID,
  associatedTokenProgramId = ASSOCIATED_TOKEN_PROGRAM_ID
): TransactionInstruction {
  const keys: Array<AccountMeta> = [
    { pubkey: nestedAssociatedToken, isSigner: false, isWritable: true },
    { pubkey: nestedTokenMintAddress, isSigner: false, isWritable: false },
    { pubkey: destinationAssociatedToken, isSigner: false, isWritable: true },
    { pubkey: ownerAssociatedToken, isSigner: false, isWritable: false },
    { pubkey: ownerTokenMintAddress, isSigner: false, isWritable: false },
    { pubkey: owner, isSigner: true, isWritable: true },
    { pubkey: programId, isSigner: false, isWritable: false },
  ];

  const data = Buffer.alloc(recoverNestedInstructionData.span);
  recoverNestedInstructionData.encode(
    { instruction: AssociatedTokenInstruction.RecoverNested },
    data
  );

  return new TransactionInstruction({
    keys,
    programId: associatedTokenProgramId,
    data,
  });
}
