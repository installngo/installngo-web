-- Clear existing data (optional)
delete from subcode_master;
delete from code_master;

-- Insert sample code_master rows
insert into code_master (code_type, code_code, display_name, is_default, display_sequence, is_active)
values
('COURSEVALIDITY', 'SINGLEVALIDITY', 'Single Validity', true, 1, true),
('COURSEVALIDITY', 'LIFETIMEVALIDITY', 'Lifetime Validity', false, 2, true),
('COURSEVALIDITY', 'COURSEEXPIRY', 'Course Expiry Date', false, 3, true);

-- Insert sample subcode_master rows
insert into subcode_master (code_master_id, subcode_code, display_name, is_default, display_sequence, is_active)
values
-- Subcodes for SINGLEVALIDITY
((select code_master_id from code_master where code_code='SINGLEVALIDITY'), '1WEEK', '1 Week', true, 1, true),
((select code_master_id from code_master where code_code='SINGLEVALIDITY'), '1MONTH', '1 Month', false, 2, true),
((select code_master_id from code_master where code_code='SINGLEVALIDITY'), '3MONTHS', '3 Months', false, 3, true),
((select code_master_id from code_master where code_code='SINGLEVALIDITY'), '6MONTHS', '6 Months', false, 4, true),
((select code_master_id from code_master where code_code='SINGLEVALIDITY'), '1YEAR', '1 Year', false, 5, true);

-- Insert sample code_master rows
insert into code_master (code_type, code_code, display_name, is_default, display_sequence, is_active)
values
('DISCOUNTTYPE', 'PERCENTAGE', 'Percentage Discount', true, 1, true),
('DISCOUNTTYPE', 'FIXED', 'Fixed Discount', false, 2, true);