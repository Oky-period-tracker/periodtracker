CREATE SEQUENCE periodtracker.category_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE category
ADD "sortingKey" integer DEFAULT nextval('periodtracker.category_sorting_key') NOT NULL;


-- 

CREATE SEQUENCE periodtracker.subcategory_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE subcategory
ADD "sortingKey" integer DEFAULT nextval('periodtracker.subcategory_sorting_key') NOT NULL;

-- 

CREATE SEQUENCE periodtracker.article_sorting_key INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775806 START 1 CACHE 1;

ALTER TABLE article
ADD "sortingKey" integer DEFAULT nextval('periodtracker.article_sorting_key') NOT NULL;