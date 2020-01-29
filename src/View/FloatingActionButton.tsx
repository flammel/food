import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SnackbarContext } from "./Snackbar";

export default function FloatingActionButton(props: {target: string}): React.ReactElement {
    const snackbar = useContext(SnackbarContext);
    snackbar.setFab();
    return (
        <Link className="fab" to={props.target}>
            <svg className="fab__icon" viewBox="0 0 12 16" version="1.1" aria-hidden="true">
                <path fillRule="evenodd" d="M12 9H7v5H5V9H0V7h5V2h2v5h5v2z"></path>
            </svg>
        </Link>
    );
}
