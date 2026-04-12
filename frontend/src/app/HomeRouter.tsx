import React from 'react';
import { useAuth } from '../features/auth/hooks/useAuth';
import BookListPageContent from '../features/books/layout';
import MyReservationsPage from '../features/books/pages/MyReservationsPage';

const HomeRouter: React.FC = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <MyReservationsPage />;
    }

    return <BookListPageContent />;
};

export default HomeRouter;
