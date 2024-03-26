import HomePage from '../components/HomePage.tsx';
import UploadPage from '../components/UploadPage.tsx';
import ListPage from '../components/ListPage.tsx';
import ViewPage from '../components/ViewPage.tsx';
import ErrorPage from '../components/ErrorPage';

export const routes = [
    {
        path: '/',
        element: <HomePage />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/upload",
                element: <UploadPage />,
            },
            {
                path: "/list",
                element: <ListPage />,
            },
            {
                path: "/view/:id",
                element: <ViewPage />,
            }
        ]
    }
];