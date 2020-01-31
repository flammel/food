import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { SnackbarContext } from "./Snackbar";
import { IconPlus } from "./Icons";

export default function FloatingActionButton(props: { target: string }): React.ReactElement {
    const snackbar = useContext(SnackbarContext);
    snackbar.setFab();
    return (
        <Link className="fab" to={props.target}>
            <IconPlus className="fab__icon" />
        </Link>
    );
}
