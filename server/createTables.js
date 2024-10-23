import { pool } from "./db.js";

export const createTables = async () => {
  try {
    await pool.query(`
    CREATE TABLE IF NOT EXISTS public.users
    (
        email character varying(255) COLLATE pg_catalog."default" NOT NULL,
        password character varying(255) COLLATE pg_catalog."default" NOT NULL,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        firstname character varying(50) COLLATE pg_catalog."default" NOT NULL,
        lastname character varying(50) COLLATE pg_catalog."default" NOT NULL,
        id uuid NOT NULL DEFAULT uuid_generate_v4(),
        CONSTRAINT users_pkey PRIMARY KEY (id)
    )
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS public.exercise_types
    (
        exercise_id integer NOT NULL DEFAULT nextval('exercise_types_exercise_id_seq'::regclass),
        exercise_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT exercise_types_pkey PRIMARY KEY (exercise_id)
    )
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS public.exercise_log
    (
        id integer NOT NULL DEFAULT nextval('exercise_log_id_seq'::regclass),
        date date NOT NULL,
        exercise_count integer NOT NULL,
        exercise_id integer NOT NULL,
        user_id uuid,
        CONSTRAINT exercise_log_pkey PRIMARY KEY (id),
        CONSTRAINT fk_exercise_id FOREIGN KEY (exercise_id)
            REFERENCES public.exercise_types (exercise_id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION,
        CONSTRAINT fk_user_uuid FOREIGN KEY (user_id)
            REFERENCES public.users (id) MATCH SIMPLE
            ON UPDATE NO ACTION
            ON DELETE NO ACTION
            NOT VALID
    )
    `);

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};
