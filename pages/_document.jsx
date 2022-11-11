import { Head, Html, Main, NextScript } from 'next/document'
import React from 'react';

export default function Document() {
    return (
        <Html lang='en'>
            <Head />
            <body className='ml-8 mr-8'>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
