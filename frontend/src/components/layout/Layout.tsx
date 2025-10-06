import { type ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

interface LayoutProps {
    children: ReactNode;
    currentUser?: {
        id: number;
        username: string;
        avatar: string;
    } | null;
}

const Layout = ({ children, currentUser }: LayoutProps) => {
    return (
        <div className="layout">
            <Header currentUser={currentUser} />
            <main className="main-content">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
