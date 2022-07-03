// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { request } from 'graphql-request'
import useSWR from 'swr'
const fetcher = (query: any) => request('http://localhost:4000/graphiql', query)
const query = JSON.stringify({ "query": "query{books {id author title}}" });


export type Book = {
  id?: number
  author: string;
  title: string;
}

export type BookData = {
  list: Array<Book>
}



const rawFetch = async () => {
  const rawResponse = await fetch('http://localhost:4000/graphiql', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ "query": "query{books {id author title}}" })
  });
  const content = await rawResponse.json();
  console.log('raw list is ', content);
  return content;
}

const swrFetch = async () => {

  console.log('About to SWR Fetch');
  const { data, error } = useSWR(
    query,
    fetcher
  );

  console.log('SWR Fetch');
  console.log(data, error);
  console.log('=========');

  return data;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BookData>
) {

  const content = await rawFetch();
  console.log();
  console.log("---------------------------------");


  res.status(200).json(content)
}
