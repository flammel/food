import React from "react";
import TopBar, { MenuButton } from "./TopBar/TopBar";

export default function AboutPage(): React.ReactElement {
    return (
        <>
            <TopBar>
                <MenuButton />
                About
            </TopBar>
            <div className="container">
                <p>
                    Source on{" "}
                    <a target="_blank" rel="noopener noreferrer" href="https://github.com/flammel/food">
                        GitHub
                    </a>
                    .
                </p>
            </div>
        </>
    );
}
