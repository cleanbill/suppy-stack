import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import { Book } from './api/books';

import { request, RequestDocument } from 'graphql-request'
import useSWR, { mutate } from 'swr'
import { useState } from 'react';
import { time } from 'console';
import { title } from 'process';

const fetcher = (query: any) => request('http://localhost:4000/graphiql', query)

// export async function getServerSideProps() {
//   // Fetch data from external API
//   const res = await fetch('http://localhost:3000/api/books');
//   const rawData = await res.json()
//   // Pass data to the page via props
//   const books = rawData.data.books;
//   return { props: { books } }
// }

const updateKeyPress = (book: Book, e: any, mutate:Function, author = false) => {
  if (e.key != 'Enter') {
    return;
  }
  const valueEntered: string = e.target.value;
  if (author) {
    book.author = valueEntered;
  } else {
    book.title = valueEntered;
  }
  swrAction(mutate,UPDATE_BOOK,book);
}

const fetchInsert = async (book: Book) => {
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

const fetchUpdate = async (book: Book) => {
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

const fetchDelete = async (book: Book) => {
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

const insertKeyPress = (e: any, mutate:Function) => {
  if (e.key != 'Enter') {
    return;
  }
  const newBook: Book = newBookFromInput();
  swrAction(mutate,SET_BOOK,newBook);
}

const newBookFromInput = ():Book =>{
  const newAuthEl = document.getElementById('newAuthor') as HTMLInputElement;
  const author = newAuthEl.value;
  const newTitleEl = document.getElementById('newTitle') as HTMLInputElement;
  const title = newTitleEl.value;
  const newBook: Book = { title, author }
  console.log(newBook);
  newAuthEl.value = '';
  newTitleEl.value = '';
  newTitleEl.focus();
  return newBook;
}

const insertSWR = (mutate:any, books: Array<Book>) =>{
  const newBook: Book = newBookFromInput();
  swrInsertMutate(mutate,null, newBook, books);
}

const GET_BOOKS = 'query{books {id author title}}';
const SET_BOOK =  `
mutation createBook($title: String!, $author: String!) {
  createBook(title:$title, author: $author) {
    id
    title
    author
  }
}
`;
const RM_BOOK =  `
mutation deleteBook($id: Int!, $title: String!, $author: String!) {
  deleteBook(id:$id, title:$title, author: $author) {
    id
    title
    author
  }
}
`;
const UPDATE_BOOK =  `
mutation updateBook($id: Int!, $title: String!, $author: String!) {
  updateBook(id:$id, title:$title, author: $author) {
    id
    title
    author
  }
}
`;



const swrUpdate = async  (mutate:any, trigger: any, book:Book, books: Array<Book>) => {
  const updatedBooks = books.map(oldBook => {
    if (oldBook.id == book.id){
      return book;
    }
    return oldBook;
  })
  mutate(GET_BOOKS, {books: updatedBooks}, false)
  // send text to the API
  const mutation = {
    'query': 'mutation books($id: Int, $title: String!, $author: String!) { updateBook(objects: [{id: $id, title:$title, name: $name}]) { affected_rows } }',
    'variables': { id: book.id, title: book.title, author: book.author}
  };
  await fetcher(mutation);
  // revalidate
//  trigger(mutation);
}

const swrInsertMutate = async  (mutate:any, trigger:any, book:Book, books: Array<Book>) => {
  mutate(GET_BOOKS, {books: [...books, book]}, false)
  // send text to the API
  const mutation = {
    'query': 'mutation books($id: Int, $title: String!, $author: String!) { insertBook(objects: [{id: $id, title:$title, name: $name}]) { affected_rows } }',
    'variables': { id: book.id, title: book.title, author: book.author}
  };
  //await fetcher(mutation);
  // revalidate
  //trigger(mutation);
}

const swrInsert =async (mutate: Function) =>{
  const book = newBookFromInput();
  swrAction(mutate,SET_BOOK,book);
}

const swrAction = async (mutate: Function, action: RequestDocument, book:Book) => {
  const rest = await request('http://localhost:4000/graphiql', action, {id:book.id, title:book.title, author:book.author});
  mutate();
};


const Home: NextPage = (props: any) => {
  const emptyBook = {id:-1,author:'empty',title:'empty'} as any;
  const [deleteBook, setDeleteBook] = useState(emptyBook);
  const triggerDelete = (book:Book) =>{
    setDeleteBook(book);
    //book.id = -1;
    //setDeleteBook(book);
  }
    const { data: deleted } = useSWR(
    deleteBook.id > 0 ? `"mutation {deleteBook(<id:${deleteBook.id},author:\"${deleteBook.author}\",title:\"${deleteBook.title}\"){ id,author,title}}"` : null,
    fetcher
  );
  const { data, error, mutate } = useSWR(
    GET_BOOKS,
    fetcher
  );
  console.log('fetched ', data);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>
        Books, books and books.
      </h1>
      <main >
        <div className="grid grid gap-1 grid-cols-3 py-6">
          <h1 className='text-4xl'>Title</h1>
          <h1 className='text-4xl'>Author</h1>
          <h1 className='text-1xl'>Delete</h1>
        </div>
        {data?.books?.map(
          (book: Book, index: number) =>
            <>
              <div key={index + '' + book.id} className="grid grid gap-1 grid-cols-3">
                <input
                  id={'title' + book.id}
                  className='w-5/6 max-w-100 p-1 rounded border-1'
                  onKeyPress={(e) => updateKeyPress(book, e, mutate)}
                  placeholder={'Title #' + (book.id)}
                  defaultValue={book.title}
                ></input>
                <input
                  id={'author' + book.id}
                  className='w-5/6 max-w-100 p-1 rounded border-1'
                  onKeyPress={(e) => updateKeyPress(book, e, mutate, true)}
                  placeholder={'Author #' + (book.id)}
                  defaultValue={book.author}
                ></input>
                <button className='mr-auto' onClick={e => swrAction(mutate,RM_BOOK,book)}>X</button>
              </div>
            </>
        )}
        <div className="grid grid gap-1 pt-5 grid-cols-2">
          <input
            id={'newTitle'}
            className='w-5/6 max-w-100 p-1 rounded border-1'
            onKeyPress={(e) => insertKeyPress(e, mutate)}
            placeholder={'New Title'}
          ></input>
          <input
            id='newAuthor'
            className='w-5/6 max-w-100 p-1 rounded border-1'
            onKeyPress={(e) => insertKeyPress(e, mutate)}
            placeholder='New Author '
          ></input>
        </div>

      </main>

      <footer className='absolute bottom-0 right-1/2'>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
