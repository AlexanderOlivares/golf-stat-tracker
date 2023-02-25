import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apolloClient from "../apollo-client";
import Head from "next/head";
import { NetworkContextProvider } from "../context/NetworkContext";
import { AuthContextProvider } from "../context/AuthContext";
import Nav from "../components/Nav";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthPersist from "../components/AuthPersist";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/makeStyles";
import { CssBaseline } from "@mui/material";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Golf Logs</title>
        <meta name="description" content="Golf Stat Tracking. Logs Golf Scores." />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <ApolloProvider client={apolloClient}>
        <AuthContextProvider>
          <NetworkContextProvider>
            <ThemeProvider theme={theme}>
              <CssBaseline>
                <Nav />
                <Component {...pageProps} />
                <ToastContainer
                  position="top-right"
                  autoClose={3000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss
                  draggable={false}
                  pauseOnHover={false}
                  theme="light"
                />
                <AuthPersist />
              </CssBaseline>
            </ThemeProvider>
          </NetworkContextProvider>
        </AuthContextProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
