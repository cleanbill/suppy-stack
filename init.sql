CREATE TABLE books (
    id INT GENERATED ALWAYS AS IDENTITY,
    title character varying(150) NOT NULL,
    author character varying(100) NOT NULL
);

INSERT INTO books(title,author) VALUES ('Ask the Dust', 'John Fante');
INSERT INTO books(title,author) VALUES ('Wind-Up Bird Chronicle', 'Haruki Murakami');
INSERT INTO books(title,author) VALUES ('The Wasp Factory', 'Iain Banks');
