export interface MasterRecord {
  code_master_id: string;
  code_type: string;
  code_code: string;
  display_name: string;
  is_default: boolean;
  display_sequence: number;
  sub_codes: {
    subcode_master_id: string;
    subcode_code: string;
    display_name: string;
    is_default: boolean;
    display_sequence: number;
  }[];
}