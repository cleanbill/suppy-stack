import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import { Book } from './api/books';

import { request } from 'graphql-request'
import useSWR from 'swr'

const fetcher = (query: any) => request('http://localhost:4000/graphiql', query)
const query = JSON.stringify({ "query": "query{books {id author title}}" });

// export async function getServerSideProps() {
//   // Fetch data from external API
//   const res = await fetch('http://localhost:3000/api/books');
//   const rawData = await res.json()
//   // Pass data to the page via props
//   const books = rawData.data.books;
//   return { props: { books } }
// }

const updateKeyPress = (book: Book, e: any, author = false) => {
  if (e.key != 'Enter') {
    return;
  }
  const valueEntered: string = e.target.value;
  if (author) {
    book.author = valueEntered;
  } else {
    book.title = valueEntered;
  }
  fetchUpdate(book);
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

const insertKeyPress = (index: number, e: any) => {
  if (e.key != 'Enter') {
    return;
  }
  const newAuthEl = document.getElementById('newAuthor') as HTMLInputElement;
  const author = newAuthEl.value;
  const newTitleEl = document.getElementById('newTitle') as HTMLInputElement;
  const title = newTitleEl.value;
  const newBook: Book = { title, author }
  console.log(newBook);
  fetchInsert(newBook);
  newAuthEl.value = '';
  newTitleEl.value = '';
  newTitleEl.focus();
}

const Home: NextPage = (props: any) => {
  const { data, error, mutate } = useSWR(
    'query{books {id author title}}',
    fetcher
  );
  console.log('fetched ', data, error, mutate);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className={styles.title}>
        Books, books, books.
      </h1>
      <main >
        <div className="grid grid gap-1 grid-cols-2 py-6">
          <h1 className='text-4xl'>Title</h1>
          <h1 className='text-4xl'>Author</h1>
        </div>
        {data?.books?.map(
          (book: Book, index: number) =>
            <>
              <div key={index + '' + book.id} className="grid grid gap-1 grid-cols-3">
                <input
                  id={'title' + book.id}
                  className='w-5/6 max-w-100 p-1 rounded border-1'
                  onKeyPress={(e) => updateKeyPress(book, e)}
                  placeholder={'Title #' + (book.id)}
                  defaultValue={book.title}
                ></input>
                <input
                  id={'author' + book.id}
                  className='w-5/6 max-w-100 p-1 rounded border-1'
                  onKeyPress={(e) => updateKeyPress(book, e, true)}
                  placeholder={'Author #' + (book.id)}
                  defaultValue={book.author}
                ></input>
                <button onClick={e => fetchDelete(book)}>X</button>
              </div>
            </>
        )}
        <div className="grid grid gap-1 grid-cols-2">
          <input
            id={'newTitle'}
            className='w-5/6 max-w-100 p-1 rounded border-1'
            onKeyPress={(e) => insertKeyPress(-1, e)}
            placeholder={'New Title'}
          ></input>
          <input
            id='newAuthor'
            className='w-5/6 max-w-100 p-1 rounded border-1'
            onKeyPress={(e) => insertKeyPress(-1, e)}
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