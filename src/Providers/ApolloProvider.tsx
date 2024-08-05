import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";


type ApolloProviderProps = {
    children: React.ReactNode;
}

const albumAPI = 'https://graphqlzero.almansi.me/api'

const client = new ApolloClient({
    uri: albumAPI,
    cache: new InMemoryCache(),
});

const MyApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    )
}

export default MyApolloProvider;