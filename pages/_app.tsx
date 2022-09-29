import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { client } from '../apollo';
import { Header } from '../components/Header';
import { Loading } from '../components/Loading';
import { TopButton } from '../components/TopButton';
import '../styles/global.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ApolloProvider client={client}>
        {router.isFallback ? (
          <Loading />
        ) : (
          <>
            <Header />
            <TopButton />
            <Component {...pageProps} />
          </>
        )}
      </ApolloProvider>
    </>
  );
}

export default MyApp;
