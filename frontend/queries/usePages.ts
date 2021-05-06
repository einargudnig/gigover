import {useQuery} from 'react-query';
import {gql} from 'graphql-request';
// import request from 'graphql-request';

export const PagesQuery = gql`
    query Pages {
        pages {
            id
            name
            slug
            inNavigation
            pageId
        }
    }
`;

export const usePages = () => {
    return useQuery(PagesQuery);
};