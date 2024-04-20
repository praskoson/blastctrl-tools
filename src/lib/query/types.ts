export type HeliusResponse<TResult> = {
  id: string;
  jsonrpc: string;
  result: TResult;
};

export type TokenInfo = {
  balance: number;
  supply: number;
  decimals: number;
  token_program: string;
  associated_token_address: string;
  mint_authority: string;
  freeze_authority?: string;
};

export type SearchAssetsByOwnerResponse = {
  total: number;
  limit: number;
  page: number;
  items: {
    interface: string;
    id: string;
    authorities: string[];
    creators: string[];
    mutable: boolean;
    burnt: boolean;
    content: {
      metadata: any;
      links: any;
    };
    token_info: TokenInfo;
    mint_extensions: {
      confidential_transfer_mint: {
        authority: string;
        auto_approve_new_accounts: boolean;
        auditor_elgamal_pubkey: string;
      };
      confidential_transfer_fee_config: {
        authority: string;
        withdraw_withheld_authority_elgamal_pubkey: string;
        harvest_to_mint_enabled: boolean;
        withheld_amount: string;
      };
      transfer_fee_config: {
        transfer_fee_config_authority: string;
        withdraw_withheld_authority: string;
      };
      metadata_pointer: {
        authority: string;
        metadata_address: string;
      };
      mint_close_authority: {
        close_authority: string;
      };
      permanent_delegate: {
        delegate: string;
      };
      transfer_hook: {
        authority: string;
        program_id: string;
      };
      interest_bearing_config: {
        rate_authority: string;
      };
      default_account_state: string;
    };
    inscription: {
      contentType: string;
      encoding: string;
      validationHash: string;
      inscriptionDataAccount: string;
      authority: string;
    };
  }[];
};
