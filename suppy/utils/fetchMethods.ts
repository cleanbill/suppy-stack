import { Book } from "../pages/api/books";

export const fetchInsert = async (book: Book) => {
  console.log('insert book ', book);
  const body = JSON.stringify({ "query": "mutation {createBook(author:\"" + book.author + "\",title:\"" + book.title + "\"){ author,title}}" });
  const rawResponse = await fetch('http://localhost:4000/graphiql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  });
  const content = await rawResponse.json();
  console.log('raw list is ', content);
  return content;
}

export const fetchUpdate = async (book: Book) => {
  console.log('update book to ', book);
  const query = { "query": "mutation {updateBook(id:" + book.id + ",author:\"" + book.author + "\",title:\"" + book.title + "\"){ id, author,title}}" };
  console.log('query is ', query);
  const body = JSON.stringify(query);
  const rawResponse = await fetch('http://localhost:4000/graphiql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  });
  const content = await rawResponse.json();
  console.log('update results are ', content);
  return content;

}

export const fetchDelete = async (book: Book) => {
  console.log('delete book to ', book);
  const query = { "query": "mutation {deleteBook(id:" + book.id + ",author:\"" + book.author + "\",title:\"" + book.title + "\"){ id,author,title}}" };
  console.log('query is ', query);
  const body = JSON.stringify(query);
  const rawResponse = await fetch('http://localhost:4000/graphiql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body
  });
  const content = await rawResponse.json();
  console.log('Delete results are ', content);
  return content;
}

