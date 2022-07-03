const { ApolloServer, gql } = require('apollo-server');
const pg = require('pg');

const conString = "postgres://justfortests:rubbish@db:5432/suppy";

const log = message => doLog(message);

const error = message => doLog(message, true);

const doLog = (message, error = false) => {
    const dateString = new Date().toISOString().
        replace(/T/, ' ').      // replace T with a space
        replace(/\..+/, '')
    if (error) {
        console.error(dateString, message);
        return;
    }
    console.log(dateString, message);
}

const connect = async () => {
    const client = new pg.Client(conString);
    await client.connect();
    log('connnected to suppy database');
    return client
}


const allBooks = async (client) => {
    const { rows } = await client.query("SELECT * FROM books");
    return rows;
};

const createBook = async (client, book) => {
    const sql = 'INSERT into books("author","title") values ( \''+ book.author + '\', \'' + book.title + '\') returning id, author, title';
    log(sql);
    try {
        const result = await client.query(sql);
        const newBook = result.rows[0];
        return newBook;
    } catch (er) {
        error(er);
    }
};

const updateBook = async (client, book) => {
    const sql = 'UPDATE books set "author" = \''+ book.author + '\', "title" = \'' + book.title + '\' where id = '+book.id+' returning id, author, title';
    log(sql);
    try {
        const result = await client.query(sql);
        const newBook = result.rows[0];
        return newBook;
    } catch (er) {
        error(er);
    }
};

const deleteBook = async (client, book) => {
    const sql = 'DELETE FROM books where id = '+book.id+' returning id, author, title';
    log(sql);
    try {
        const result = await client.query(sql);
        const oldBook = result.rows[0];
        return oldBook;
    } catch (er) {
        error(er);
    }
};

const delay = (n) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, n * 1000);
    });
}

const tryConnect = async () => {
    try {
        return await connect();
    } catch (err) {
        error(err);
        const SECONDS = 3;
        await delay(SECONDS);
        error('Eak, cannot connect, gonna try in ' + SECONDS);
        return await tryConnect();
    }
}

const dbSetup = async () => {
    const client = await tryConnect();
    log('client in effect ');
    try {
        await allBooks(client);
    } catch (err) {
        error(err);
    }
    return client;
};

dbSetup().then(client => {

    // A schema is a collection of type definitions (hence "typeDefs")
    // that together define the "shape" of queries that are executed against
    // your data.
    const typeDefs = gql`
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: Int
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }

  type Mutation {
    createBook(author: String!, title: String!): Book!
  }

  type Mutation {
    updateBook(id: Int!,author: String!, title: String!): Book!
  }  

  type Mutation {
    deleteBook(id: Int!,author: String!, title: String!): Book!
  }

`;

    const resolvers = {
        Query: {
            books: async () => {
                log('getting books');
                const results = await allBooks(client);
                log(results)
                return results;
            },
        },
        Mutation: {
            createBook: async (_, book) => {
                log('creating book');
                log(book);
                const bookUpdate = await createBook(client, book);
                log(bookUpdate);
                return bookUpdate;
            },
            updateBook: async (_, book) => {
                log('updating book');
                log(book);
                const bookUpdate = await updateBook(client, book);
                log(bookUpdate);
                return bookUpdate;
            },
            deleteBook: async (_, book) => {
                log('deleteing book');
                log(book);
                const bookUpdate = await deleteBook(client, book);
                log(bookUpdate);
                return bookUpdate;
            }
        }
    };

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        csrfPrevention: true,
        cache: 'bounded',
    });

    server.listen().then(({ url }) => {
        log(`🚀  Server ready at....  ${url}`);
    });
});