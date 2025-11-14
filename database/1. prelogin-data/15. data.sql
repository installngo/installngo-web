-- insert data: all continents
insert into public.continents (continent_code, continent_code_iso, continent_abbrevation, continent_name, continent_description, display_order, is_active)
values
('AF', 'AF', 'AF', 'Africa', 'Africa is the second largest continent.', 1, false),
('AN', 'AN', 'AN', 'Antarctica', 'Antarctica is the southernmost continent.', 2, false),
('AS', 'AS', 'AS', 'Asia', 'Asia is the largest continent by both area and population.', 3, true),
('EU', 'EU', 'EU', 'Europe', 'Europe is known for its rich history and diverse cultures.', 4, false),
('NA', 'NA', 'NA', 'North America', 'North America consists of Canada, USA, Mexico, and other countries.', 5, false),
('OC', 'OC', 'OC', 'Oceania', 'Oceania includes Australia, New Zealand, and Pacific islands.', 6, false),
('SA', 'SA', 'SA', 'South America', 'South America is home to the Amazon rainforest and Andes mountains.', 7, false)
on conflict (continent_code) do nothing;

-- insert data: subregions with all countries listed
-- insert data: subregions with all countries listed
insert into public.subregions (subregion_code, continent_code, subregion_name, subregion_description, display_order, is_active)
values
('NE', 'EU', 'Northern Europe', 'Includes: Norway, Sweden, Denmark, Finland, Iceland, Ireland, United Kingdom, Estonia, Latvia, Lithuania.', 1, false),
('WE', 'EU', 'Western Europe', 'Includes: France, Germany, Belgium, Netherlands, Switzerland, Austria, Luxembourg, Liechtenstein, Monaco.', 2, false),
('EE', 'EU', 'Eastern Europe', 'Includes: Poland, Hungary, Czech Republic, Slovakia, Romania, Bulgaria, Belarus, Ukraine, Moldova, Russia.', 3, false),
('SE', 'EU', 'Southern Europe', 'Includes: Italy, Spain, Greece, Portugal, Malta, Cyprus, Albania, Croatia, Slovenia, Montenegro, Bosnia and Herzegovina, North Macedonia, Serbia, Kosovo.', 4, false),
('NA', 'AF', 'Northern Africa', 'Includes: Egypt, Libya, Tunisia, Algeria, Morocco, Sudan, Western Sahara.', 1, false),
('WA', 'AF', 'Western Africa', 'Includes: Nigeria, Ghana, Senegal, Ivory Coast, Mali, Burkina Faso, Niger, Benin, Togo, Sierra Leone, Liberia, Guinea, Guinea-Bissau, Gambia, Cape Verde.', 2, false),
('EA', 'AF', 'Eastern Africa', 'Includes: Kenya, Ethiopia, Tanzania, Uganda, Rwanda, Burundi, Somalia, Djibouti, Eritrea, Seychelles, Comoros, Madagascar, Mauritius, Mayotte, Mozambique, Malawi, Zambia, Zimbabwe, South Sudan, Sudan.', 3, false),
('SA', 'AF', 'Southern Africa', 'Includes: South Africa, Botswana, Namibia, Zimbabwe, Lesotho, Swaziland.', 4, false),
('CE', 'AF', 'Central Africa', 'Includes: Democratic Republic of Congo, Republic of Congo, Cameroon, Gabon, Equatorial Guinea, Central African Republic, Chad, Sao Tome and Principe.', 5, false),
('SEAS', 'AS', 'Southeast Asia', 'Includes: Thailand, Vietnam, Indonesia, Malaysia, Philippines, Singapore, Myanmar, Cambodia, Laos, Brunei, Timor-Leste.', 1, true),
('EAAS', 'AS', 'East Asia', 'Includes: China, Japan, South Korea, North Korea, Taiwan, Mongolia, Hong Kong, Macau.', 2, false),
('SAAS', 'AS', 'South Asia', 'Includes: India, Pakistan, Bangladesh, Sri Lanka, Nepal, Bhutan, Maldives, Afghanistan.', 3, true),
('CA', 'AS', 'Central Asia', 'Includes: Kazakhstan, Uzbekistan, Turkmenistan, Kyrgyzstan, Tajikistan.', 4, false),
('NAAM', 'NA', 'North America', 'Includes: United States, Canada, Mexico, Greenland, Bermuda.', 1, false),
('CAAM', 'NA', 'Central America', 'Includes: Guatemala, Honduras, Costa Rica, Panama, Belize, El Salvador, Nicaragua.', 2, false),
('CAIB', 'NA', 'Caribbean', 'Includes: Cuba, Jamaica, Puerto Rico, Dominican Republic, Haiti, Bahamas, Barbados, Trinidad and Tobago, Saint Lucia, Grenada, Saint Vincent and the Grenadines, Antigua and Barbuda, Dominica, Saint Kitts and Nevis.', 3, false),
('SAAM', 'SA', 'South America', 'Includes: Brazil, Argentina, Chile, Colombia, Peru, Venezuela, Ecuador, Bolivia, Paraguay, Uruguay, Guyana, Suriname, French Guiana.', 1, false),
('OC', 'OC', 'Oceania', 'Includes: Australia, New Zealand, Fiji, Papua New Guinea, Solomon Islands, Vanuatu, Samoa, Tonga, Kiribati, Micronesia, Palau, Marshall Islands, Nauru, Tuvalu.', 1, false),
('AN', 'AN', 'Antarctica', 'The southernmost continent with no permanent countries.', 1, false)
on conflict (subregion_code) do nothing;

-- insert data: main countries
insert into public.countries (country_code, continent_code, subregion_code, country_name, native_name, iso_alpha_3, numeric_code, time_zone, phone_code, phone_regex, phone_format, currency_name, currency_symbol, flag_url, flag_emoji, display_order, is_active)
values
('MY', 'AS', 'SEAS', 'Malaysia', 'Malaysia', 'MYS', '458', 'UTC+08:00', '+60', '^(\+?60)[0-9]{7,9}$', '+60 ##-### ####', 'Malaysian Ringgit', 'RM', 'https://flagcdn.com/w320/my.png', '🇲🇾', 1, true),
('IN', 'AS', 'SAAS', 'India', 'भारत', 'IND', '356', 'UTC+05:30', '+91', '^(\+?91)[0-9]{10}$', '+91 #####-#####', 'Indian Rupee', '₹', 'https://flagcdn.com/w320/in.png', '🇮🇳', 2, true)
on conflict (country_code) do nothing;

-- insert data: languages
insert into public.languages (language_code, language_name, native_name, display_order, is_active)
values
('en', 'English', 'English', 1, true),
('ms', 'Malay', 'Bahasa Melayu', 2, true),
('ta', 'Tamil', 'தமிழ்', 3, true),
('hi', 'Hindi', 'हिन्दी', 4, true)
on conflict (language_code) do nothing;

-- insert data: country_languages
insert into public.country_languages (country_code, language_code, is_official, display_order, is_active)
values
('MY', 'ms', true, 1, true),
('MY', 'en', false, 2, true),
('IN', 'en', true, 1, true),
('IN', 'hi', true, 2, true),
('IN', 'ta', false, 6, true)
on conflict (country_code, language_code) do nothing;

-- insert data: currencies
insert into public.currencies (currency_code, currency_symbol, currency_name, display_order, is_active)
values
('INR', '₹', 'Indian Rupee', 1, true),
('MYR', 'RM', 'Malaysian Ringgit', 2, true)
on conflict (currency_code) do nothing;

-- insert data: country_currencies
insert into public.country_currencies (country_code, currency_code, is_default, display_order, is_active)
values
('IN', 'INR', true, 1, true),
('MY', 'MYR', true, 2, true)
on conflict (country_code, currency_code) do nothing;

-- insert data: organization_types
insert into public.organization_types (organization_type_code, country_code, type_name, type_description, display_order, is_active) 
values ('ACADEMY', 'IN', 'Academy', 'Educational Academy offering courses', 1, true);

-- insert data: organization_categories
insert into public.organization_categories (organization_category_code, organization_type_code, category_name, category_description, display_order, is_active) 
values
('COURSES', 'ACADEMY', 'Fashion Courses', 'Courses related to fashion', 1, true)