import React from 'react';
import Nav from "../NavComponent/Nav";

export default function Layout({children}) {
    return (
        <div>
            <Nav />
            <main>{children}</main>
        </div>
    )
}
