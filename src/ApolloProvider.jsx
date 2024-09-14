import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider as ApolloProviderBase, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'https://ap-northeast-1.cdn.hygraph.com/content/cm0y47x0z01p807wak2aqq4vi/master',
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6ImdjbXMtbWFpbi1wcm9kdWN0aW9uIn0.eyJ2ZXJzaW9uIjozLCJpYXQiOjE3MjYyODE0MDUsImF1ZCI6WyJodHRwczovL2FwaS1hcC1ub3J0aGVhc3QtMS5oeWdyYXBoLmNvbS92Mi9jbTB5NDd4MHowMXA4MDd3YWsyYXFxNHZpL21hc3RlciIsIm1hbmFnZW1lbnQtbmV4dC5ncmFwaGNtcy5jb20iXSwiaXNzIjoiaHR0cHM6Ly9tYW5hZ2VtZW50LWFwLW5vcnRoZWFzdC0xLmh5Z3JhcGguY29tLyIsInN1YiI6IjBlODBjMDc2LWE1YTUtNGFhNy1hMjMwLTI2OGM4ZjZiYmIwMyIsImp0aSI6ImNtMTFqZGw1cjAyMjYwNzE4OGd5azhuankifQ.3z3D9b0nZh79GfAM4qn6Br0yFspKKjf851jaTOw4vb-PLqYL2Jd4mDqGUrAvzy2hyevW2B5cxpOba0NYC57t9oCNCFSoP4cqvhfXhTVR4SOND6CAnTzvMyi9px_z8YsNIryydmeRjrJCoRHs_JDlH5bpc46P3DOX4sMrXYmPWEhl-EbAs9BRKeRkLkm_eq_2XVqMXwWn7OkXY5rFfBHOBKs786aIhMttbmRbX55ayNZemNQLy5ZDiDeq22Q0Gcywmx6wq5xoewsSETNxEKdUD5Vo9-XpAoLmcLRQMqgYaT5OJ2nlX8YDHVng5rnpGk0Uiy4Sw4Fz6VtSCRafZdMc6gXRfqI5LUm86Xz3ruufPJNf4t5jQk_GI2nxCVie-EDx5Y-JI2L5ho6Bt6CHJK7GktWZMU3OG63dfKDoR-5TIbGarcm81j77lhxsbb6JvSRSUV2874Q2ClChfJ_RcR-V3_tIrv-PqANkOTBmCXVlqIgrAz4hkA5b9iucifQPuVjAXdjlv7Z1UpCW3kCX8XBv9ogA5C34jDl9oNrppiYfDHffY1vQFEMGjG4h49tYBcM6Noi4-0j9DqauupIzyVFx6c8oEsaCqIZmfuy-dNwJomgD1mOFppk7vOyzKpgctmeRDfKebWYU_pd66FQq2gO_1uaYUE5hJW3noFKq7yQ_JTI`, // Replace with your actual access token
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const ApolloProvider = ({ children }) => (
  <ApolloProviderBase client={client}>
    {children}
  </ApolloProviderBase>
);

export default ApolloProvider;
