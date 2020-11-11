-- Table: public.Users

-- DROP TABLE public."Users";

CREATE TABLE public."Users"
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    auth_id text COLLATE pg_catalog."default" NOT NULL UNIQUE,
    type_id text COLLATE pg_catalog."default" NOT NULL,
    password text COLLATE pg_catalog."default" NOT NULL,
    token text,
    create_date timestamp with time zone NOT NULL,
    last_signin timestamp with time zone,
    CONSTRAINT "Users_pkey" PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE public."Users"
    OWNER to "Whale_User";