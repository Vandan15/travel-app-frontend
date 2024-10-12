import React from 'react';
import Footer from '../../components/common/Footer/Footer';
import Header from '../../components/common/Header/Header';

export default function AppLayout({children}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
